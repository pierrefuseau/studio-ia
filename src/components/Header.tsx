import React from 'react';
import { Sparkles, Wifi } from 'lucide-react';
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
    <header className="border-b-2 border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container-fuseau">
        <div className="h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-fuseau-primary to-fuseau-accent rounded-xl blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
              <div className="relative w-12 h-12 bg-gradient-to-br from-fuseau-primary to-fuseau-primary-dark rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-gray-900 leading-tight">
                Studio Produit
              </h1>
              <p className="text-xs text-gray-500 font-medium">
                IA Génératrice d'images
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="badge-heritage">
              Maison Familiale depuis 1973
            </div>

            <button
              onClick={testWebhook}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-fuseau-primary transition-colors rounded-lg hover:bg-fuseau-cream"
              title="Tester la connexion n8n"
            >
              <Wifi className="w-4 h-4" />
              <span className="hidden sm:inline">n8n</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
