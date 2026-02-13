import React, { useState, useEffect, useMemo } from 'react';
import { AlertCircle, X, RefreshCw, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const MOBILE_MAX = 2;
const DESKTOP_MAX = 5;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 639px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

const ErrorNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [retryStatus, setRetryStatus] = useState({});
  const isMobile = useIsMobile();

  // Simulation de l'errorHandler (à remplacer par votre vrai service)
  useEffect(() => {
    // Simulation de nouvelles notifications
    const demoNotifications = [
      {
        id: '1',
        type: 'error',
        title: 'Erreur de traitement',
        message: 'Échec du détourage de l\'image',
        timestamp: new Date(),
        canRetry: true,
        retryCount: 0,
        maxRetries: 3
      }
    ];
    
    // Pour la démo, afficher après 2 secondes
    setTimeout(() => {
      setNotifications(demoNotifications);
    }, 2000);
  }, []);

  // Fonction pour supprimer une notification
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Fonction de retry avec animation
  const handleRetry = async (notification) => {
    const { id } = notification;
    
    // Mettre à jour le statut de retry
    setRetryStatus(prev => ({ ...prev, [id]: 'retrying' }));
    
    // Simuler un retry avec backoff
    const delays = [1000, 2000, 4000]; // Délais progressifs
    const delay = delays[notification.retryCount] || 5000;
    
    // Afficher le compte à rebours
    for (let i = delay / 1000; i > 0; i--) {
      setRetryStatus(prev => ({ 
        ...prev, 
        [id]: `retry_${i}` 
      }));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Simuler le résultat (50% de succès pour la démo)
    const success = Math.random() > 0.5;
    
    if (success) {
      setRetryStatus(prev => ({ ...prev, [id]: 'success' }));
      setTimeout(() => removeNotification(id), 2000);
    } else {
      setRetryStatus(prev => ({ ...prev, [id]: 'failed' }));
      setNotifications(prev => prev.map(n => 
        n.id === id 
          ? { ...n, retryCount: n.retryCount + 1 }
          : n
      ));
    }
  };

  // Auto-suppression des notifications de succès
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => prev.filter(n => {
        const age = Date.now() - n.timestamp;
        return !(n.type === 'success' && age > 5000);
      }));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Obtenir l'icône selon le type
  const getIcon = (type) => {
    switch (type) {
      case 'error': return <AlertCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'success': return <CheckCircle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  // Obtenir les couleurs selon le type
  const getColors = (type) => {
    switch (type) {
      case 'error': return 'bg-red-50 border-red-200 text-red-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'success': return 'bg-green-50 border-green-200 text-green-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const maxVisible = isMobile ? MOBILE_MAX : DESKTOP_MAX;
  const visibleNotifications = notifications.slice(0, maxVisible);
  const hiddenCount = notifications.length - visibleNotifications.length;

  return (
    <div className="fixed bottom-0 inset-x-0 p-3 sm:bottom-4 sm:right-4 sm:left-auto sm:p-0 z-50 space-y-2 sm:max-w-md">
      {visibleNotifications.map(notification => {
        const status = retryStatus[notification.id];
        const isRetrying = status && status.startsWith('retry');
        const retryCountdown = isRetrying ? status.split('_')[1] : null;

        return (
          <div
            key={notification.id}
            className={`
              p-3 sm:p-4 rounded-lg border-2 shadow-lg transform transition-all duration-300
              ${getColors(notification.type)}
              ${status === 'success' ? 'scale-95 opacity-75' : 'scale-100 opacity-100'}
            `}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {status === 'retrying' ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : status === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  getIcon(notification.type)
                )}
                <h4 className="font-semibold text-sm">{notification.title}</h4>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-sm mb-3">{notification.message}</p>

            {isRetrying && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Nouvelle tentative dans {retryCountdown}s...</span>
                  <span>Tentative {notification.retryCount + 1}/{notification.maxRetries}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000"
                    style={{
                      width: `${((notification.maxRetries - retryCountdown) / notification.maxRetries) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}

            {notification.canRetry && notification.retryCount < notification.maxRetries && !isRetrying && status !== 'success' && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {notification.retryCount > 0 && `${notification.retryCount} tentatives échouées`}
                </span>
                <button
                  onClick={() => handleRetry(notification)}
                  className="flex items-center space-x-1 text-xs font-medium bg-white min-h-[44px] px-4 py-2 sm:min-h-0 sm:px-3 sm:py-1 rounded border hover:bg-gray-50 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Réessayer</span>
                </button>
              </div>
            )}

            {notification.retryCount >= notification.maxRetries && (
              <div className="text-xs text-red-600 font-medium">
                Maximum de tentatives atteint. Veuillez contacter le support.
              </div>
            )}

            {status === 'success' && (
              <div className="text-xs text-green-600 font-medium">
                Traitement réussi après {notification.retryCount + 1} tentative(s)
              </div>
            )}
          </div>
        );
      })}

      {hiddenCount > 0 && (
        <div className="text-center text-xs text-gray-500 bg-white/80 backdrop-blur-sm rounded-lg py-2 border border-gray-200">
          +{hiddenCount} autre{hiddenCount > 1 ? 's' : ''} notification{hiddenCount > 1 ? 's' : ''}
        </div>
      )}

      <div className="hidden sm:block mt-4 p-2 bg-gray-800 text-white rounded-lg text-xs">
        <div className="flex items-center justify-between">
          <span>État du système</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400">Opérationnel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorNotification;