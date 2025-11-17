import React from 'react';
import { Menu, Wifi, WifiOff, History, Home } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { webhookService } from '../services/webhookService';
import { useToast } from './ui/Toast';
import { Button } from './ui/Button';

export function Header() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();

  const goToGallery = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'gallery' });
  };

  const goToHome = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'hero' });
  };

  const testWebhook = async () => {
    const success = await webhookService.testConnection();
    
    if (success) {
      addToast({
        type: 'success',
        title: 'Connexion réussie',
        description: 'Le webhook n8n fonctionne correctement'
      });
    } else {
      addToast({
        type: 'error',
        title: 'Connexion échouée',
        description: 'Impossible de joindre le webhook n8n'
      });
    }
  };

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-sm font-bold">SP</span>
          </div>
          <span className="text-gray-900 font-medium text-sm">Studio Produit</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={goToHome}
              className="flex items-center gap-2 px-3 py-1.5 text-xs"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Accueil</span>
            </Button>

            <Button
              variant="outline"
              onClick={goToGallery}
              className="flex items-center gap-2 px-3 py-1.5 text-xs"
            >
              <History className="w-3.5 h-3.5" />
              <span>Historique</span>
              {state.history.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  {state.history.length}
                </span>
              )}
            </Button>
          </div>

          {/* Indicateur de statut webhook */}
          <button
            onClick={testWebhook}
            className="flex items-center gap-2 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            title="Tester la connexion n8n"
          >
            <Wifi className="w-3 h-3" />
            <span>n8n</span>
          </button>

          <button className="text-gray-400 hover:text-gray-600 transition-colors p-2">
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}