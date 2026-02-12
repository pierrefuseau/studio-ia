import React from 'react';
import { Wifi } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { webhookService } from '../services/webhookService';
import { useToast } from './ui/Toast';

export function Header() {
  const { state } = useApp();
  const { addToast } = useToast();

  const testWebhook = async () => {
    const success = await webhookService.testConnection();

    if (success) {
      addToast({
        type: 'success',
        title: 'Connexion reussie',
        description: 'Le webhook n8n fonctionne correctement'
      });
    } else {
      addToast({
        type: 'error',
        title: 'Connexion echouee',
        description: 'Impossible de joindre le webhook n8n'
      });
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-sm">
      <div className="container-fuseau">
        <div className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/GROUPE_FUSEAU_V2.png"
              alt="Fuseau"
              className="h-10 object-contain"
            />
            <div className="hidden sm:block h-6 w-px bg-gray-200" />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-fuseau-secondary leading-tight">
                Studio Produit
              </p>
              <p className="text-[10px] text-gray-400 font-medium">
                IA Generatrice d'images
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="badge-heritage">
              Maison Familiale depuis 1973
            </div>

            <button
              onClick={testWebhook}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-500 hover:text-fuseau-primary transition-colors rounded-lg hover:bg-gray-50"
              title="Tester la connexion n8n"
            >
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">n8n</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
