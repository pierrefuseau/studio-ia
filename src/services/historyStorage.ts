import { HistoryItem } from '../types';

const HISTORY_STORAGE_KEY = 'studio-ia-history';
const MAX_HISTORY_ITEMS = 100;

/**
 * Service de gestion de l'historique des traitements
 * Utilise localStorage pour persister les données
 */
export class HistoryStorageService {
  private static instance: HistoryStorageService;

  private constructor() {}

  static getInstance(): HistoryStorageService {
    if (!HistoryStorageService.instance) {
      HistoryStorageService.instance = new HistoryStorageService();
    }
    return HistoryStorageService.instance;
  }

  /**
   * Récupère tout l'historique
   */
  getHistory(): HistoryItem[] {
    try {
      const data = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (!data) return [];

      const items: HistoryItem[] = JSON.parse(data);
      // Trier par date de création (plus récent en premier)
      return items.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('❌ Erreur lecture historique:', error);
      return [];
    }
  }

  /**
   * Ajoute un nouvel item à l'historique
   */
  addHistoryItem(item: HistoryItem): void {
    try {
      const history = this.getHistory();

      // Ajouter le nouvel item
      history.unshift(item);

      // Limiter le nombre d'items
      const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);

      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limitedHistory));
      console.log('✅ Item ajouté à l\'historique:', item.id);
    } catch (error) {
      console.error('❌ Erreur ajout historique:', error);
    }
  }

  /**
   * Met à jour un item existant
   */
  updateHistoryItem(id: string, updates: Partial<HistoryItem>): void {
    try {
      const history = this.getHistory();
      const index = history.findIndex(item => item.id === id);

      if (index === -1) {
        console.warn('⚠️ Item non trouvé dans l\'historique:', id);
        return;
      }

      history[index] = { ...history[index], ...updates };
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
      console.log('✅ Item mis à jour:', id);
    } catch (error) {
      console.error('❌ Erreur mise à jour historique:', error);
    }
  }

  /**
   * Supprime un item de l'historique
   */
  deleteHistoryItem(id: string): void {
    try {
      const history = this.getHistory();
      const filtered = history.filter(item => item.id !== id);

      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
      console.log('✅ Item supprimé de l\'historique:', id);
    } catch (error) {
      console.error('❌ Erreur suppression historique:', error);
    }
  }

  /**
   * Récupère un item spécifique
   */
  getHistoryItem(id: string): HistoryItem | null {
    const history = this.getHistory();
    return history.find(item => item.id === id) || null;
  }

  /**
   * Filtre l'historique par statut
   */
  getHistoryByStatus(status: HistoryItem['status']): HistoryItem[] {
    return this.getHistory().filter(item => item.status === status);
  }

  /**
   * Filtre l'historique par type de traitement
   */
  getHistoryByTreatment(treatmentType: string): HistoryItem[] {
    return this.getHistory().filter(item => item.treatmentType === treatmentType);
  }

  /**
   * Efface tout l'historique
   */
  clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      console.log('✅ Historique effacé');
    } catch (error) {
      console.error('❌ Erreur effacement historique:', error);
    }
  }

  /**
   * Exporte l'historique en JSON
   */
  exportHistory(): string {
    const history = this.getHistory();
    return JSON.stringify(history, null, 2);
  }

  /**
   * Importe l'historique depuis JSON
   */
  importHistory(jsonData: string): boolean {
    try {
      const items: HistoryItem[] = JSON.parse(jsonData);

      // Validation basique
      if (!Array.isArray(items)) {
        throw new Error('Format invalide');
      }

      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
      console.log('✅ Historique importé:', items.length, 'items');
      return true;
    } catch (error) {
      console.error('❌ Erreur import historique:', error);
      return false;
    }
  }

  /**
   * Obtient les statistiques de l'historique
   */
  getStatistics() {
    const history = this.getHistory();

    return {
      total: history.length,
      completed: history.filter(item => item.status === 'completed').length,
      processing: history.filter(item => item.status === 'processing').length,
      failed: history.filter(item => item.status === 'failed').length,
      pending: history.filter(item => item.status === 'pending').length,
      byTreatment: history.reduce((acc, item) => {
        acc[item.treatmentType] = (acc[item.treatmentType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }
}

export const historyStorage = HistoryStorageService.getInstance();
