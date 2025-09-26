// src/services/errorHandler.ts

export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  timeout: number;
}

export interface ErrorLog {
  timestamp: string;
  sessionId: string;
  error: Error;
  context: any;
  retryAttempt: number;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLogs: ErrorLog[] = [];
  private listeners: ((error: ErrorLog) => void)[] = [];

  private defaultRetryConfig: RetryConfig = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffMultiplier: 2,
    timeout: 60000
  };

  private constructor() {
    // Singleton pattern
    this.setupGlobalErrorHandlers();
  }

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Configuration des handlers globaux
  private setupGlobalErrorHandlers() {
    // Capture des erreurs non gérées
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Promesse rejetée non gérée:', event.reason);
      this.logError({
        timestamp: new Date().toISOString(),
        sessionId: 'global',
        error: new Error(event.reason),
        context: { type: 'unhandledRejection' },
        retryAttempt: 0
      });
    });

    // Capture des erreurs JavaScript
    window.addEventListener('error', (event) => {
      console.error('Erreur JavaScript:', event.error);
      this.logError({
        timestamp: new Date().toISOString(),
        sessionId: 'global',
        error: event.error || new Error(event.message),
        context: { 
          type: 'globalError',
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        },
        retryAttempt: 0
      });
    });
  }

  // Fonction principale de retry avec backoff exponentiel
  async retryWithBackoff<T>(
    fn: () => Promise<T>,
    sessionId: string,
    config: Partial<RetryConfig> = {},
    onRetry?: (attempt: number, delay: number) => void
  ): Promise<T> {
    const finalConfig = { ...this.defaultRetryConfig, ...config };
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      try {
        // Créer une promesse avec timeout
        const result = await this.withTimeout(
          fn(),
          finalConfig.timeout,
          `Timeout après ${finalConfig.timeout}ms`
        );
        
        // Succès - retourner le résultat
        return result;
        
      } catch (error) {
        lastError = error as Error;
        
        // Logger l'erreur
        this.logError({
          timestamp: new Date().toISOString(),
          sessionId,
          error: lastError,
          context: { 
            attempt,
            maxAttempts: finalConfig.maxAttempts,
            willRetry: attempt < finalConfig.maxAttempts
          },
          retryAttempt: attempt
        });

        // Si c'est la dernière tentative, lancer l'erreur
        if (attempt === finalConfig.maxAttempts) {
          throw new Error(
            `Échec après ${finalConfig.maxAttempts} tentatives: ${lastError.message}`
          );
        }

        // Calculer le délai avec backoff exponentiel
        const delay = Math.min(
          finalConfig.initialDelay * Math.pow(finalConfig.backoffMultiplier, attempt - 1),
          finalConfig.maxDelay
        );

        // Notifier du retry
        if (onRetry) {
          onRetry(attempt, delay);
        }

        // Attendre avant de réessayer
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  // Wrapper pour ajouter un timeout à une promesse
  private withTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    timeoutMessage: string
  ): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
      )
    ]);
  }

  // Fonction sleep
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Logger une erreur
  logError(errorLog: ErrorLog) {
    this.errorLogs.push(errorLog);
    
    // Garder seulement les 100 dernières erreurs en mémoire
    if (this.errorLogs.length > 100) {
      this.errorLogs.shift();
    }

    // Notifier les listeners
    this.listeners.forEach(listener => listener(errorLog));

    // Sauvegarder dans localStorage pour persistance
    try {
      const existingLogs = JSON.parse(
        localStorage.getItem('studio_ia_errors') || '[]'
      );
      existingLogs.push(errorLog);
      
      // Garder seulement les erreurs des dernières 24h
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentLogs = existingLogs.filter(
        (log: ErrorLog) => new Date(log.timestamp) > oneDayAgo
      );
      
      localStorage.setItem('studio_ia_errors', JSON.stringify(recentLogs));
    } catch (e) {
      console.error('Impossible de sauvegarder les logs d\'erreur:', e);
    }
  }

  // S'abonner aux erreurs
  subscribe(listener: (error: ErrorLog) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Récupérer les erreurs
  getErrors(sessionId?: string): ErrorLog[] {
    if (sessionId) {
      return this.errorLogs.filter(log => log.sessionId === sessionId);
    }
    return [...this.errorLogs];
  }

  // Nettoyer les erreurs
  clearErrors(sessionId?: string) {
    if (sessionId) {
      this.errorLogs = this.errorLogs.filter(log => log.sessionId !== sessionId);
    } else {
      this.errorLogs = [];
    }
  }

  // Analyser les patterns d'erreurs
  getErrorStats() {
    const stats = {
      total: this.errorLogs.length,
      bySession: {} as Record<string, number>,
      byType: {} as Record<string, number>,
      recentErrors: this.errorLogs.slice(-10),
      failureRate: 0
    };

    this.errorLogs.forEach(log => {
      // Par session
      stats.bySession[log.sessionId] = (stats.bySession[log.sessionId] || 0) + 1;
      
      // Par type d'erreur
      const errorType = log.error.name || 'Unknown';
      stats.byType[errorType] = (stats.byType[errorType] || 0) + 1;
    });

    return stats;
  }
}

// Export d'une instance unique
export const errorHandler = ErrorHandler.getInstance();