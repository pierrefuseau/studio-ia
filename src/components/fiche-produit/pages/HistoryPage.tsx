import { Clock, Trash2, Eye, FileText } from 'lucide-react';
import { useFiche } from '../FicheProduitContext';

export function HistoryPage() {
  const { state, dispatch } = useFiche();
  const { history } = state;

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mb-4">
          <FileText className="w-7 h-7 text-slate-500" />
        </div>
        <h3 className="text-base font-semibold text-slate-300">Aucune fiche generee</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm">
          Les fiches produit que vous genererez apparaitront ici
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Historique</h2>
        <p className="text-sm text-slate-400 mt-0.5">{history.length} fiche(s) generee(s)</p>
      </div>

      <div className="grid gap-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/40 hover:border-slate-600/60 transition-colors group"
          >
            {item.photoPreview ? (
              <img
                src={item.photoPreview}
                alt={item.formData.nomProduit}
                className="w-14 h-14 object-contain rounded-lg bg-white/5 flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-slate-700/50 flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-slate-500" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-200 truncate">
                {item.formData.nomProduit}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{item.formData.marque}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Clock className="w-3 h-3 text-slate-600" />
                <span className="text-[11px] text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => dispatch({ type: 'LOAD_FROM_HISTORY', payload: item })}
                className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 flex items-center justify-center transition-colors"
                title="Voir"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => dispatch({ type: 'DELETE_HISTORY_ITEM', payload: item.id })}
                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors"
                title="Supprimer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
