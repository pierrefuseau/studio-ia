import { useState } from 'react';
import { Settings, Globe, Save, CheckCircle } from 'lucide-react';
import { useFiche } from '../FicheProduitContext';
import { FPInput } from '../ui/FPInput';

export function SettingsPage() {
  const { state, dispatch } = useFiche();
  const [url, setUrl] = useState(state.webhookUrl);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    dispatch({ type: 'SET_WEBHOOK_URL', payload: url });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Parametres</h2>
        <p className="text-sm text-slate-400 mt-0.5">Configuration du module Fiche Produit IA</p>
      </div>

      <div className="rounded-xl bg-slate-800/50 border border-slate-700/40 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Globe className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Webhook n8n</h3>
            <p className="text-xs text-slate-500">URL du webhook pour la generation des fiches</p>
          </div>
        </div>

        <FPInput
          label="URL du webhook"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setSaved(false); }}
          placeholder="https://votre-instance-n8n.com/webhook/fiche-produit"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-amber-500 text-slate-900 hover:bg-amber-400 transition-colors"
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Sauvegarde !' : 'Sauvegarder'}
          </button>
          {saved && (
            <span className="text-xs text-green-400">Configuration enregistree</span>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Settings className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-400">Informations</span>
        </div>
        <div className="space-y-1.5 text-xs text-slate-500">
          <p>Les fiches generees sont stockees dans le navigateur (localStorage).</p>
          <p>Le webhook doit accepter les requetes POST avec un payload JSON.</p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-700/30">
          <p className="text-[11px] text-slate-600">Fiche Produit IA v1.0</p>
        </div>
      </div>
    </div>
  );
}
