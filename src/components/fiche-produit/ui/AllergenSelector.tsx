import { cn } from '../../../utils/cn';
import { ALLERGENS } from '../../../utils/allergenData';
import type { AllergenSelection } from '../../../types/product';

interface AllergenSelectorProps {
  allergenes: AllergenSelection[];
  onToggle: (id: string, selected: boolean, traces: boolean) => void;
}

export function AllergenSelector({ allergenes, onToggle }: AllergenSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        Allergenes
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {ALLERGENS.map((allergen) => {
          const sel = allergenes.find((a) => a.id === allergen.id);
          const isSelected = sel?.selected || false;
          const isTraces = sel?.traces || false;

          return (
            <div
              key={allergen.id}
              className={cn(
                'border rounded-lg p-2.5 cursor-pointer transition-all duration-150',
                isSelected
                  ? 'border-amber-500/60 bg-amber-500/10'
                  : 'border-slate-600/40 bg-slate-700/30 hover:border-slate-500'
              )}
              onClick={() => {
                if (!isSelected) {
                  onToggle(allergen.id, true, false);
                } else if (!isTraces) {
                  onToggle(allergen.id, true, true);
                } else {
                  onToggle(allergen.id, false, false);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: allergen.color }}
                >
                  {allergen.symbol}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">{allergen.label}</p>
                  {isSelected && (
                    <p className="text-[10px] text-amber-400">
                      {isTraces ? 'Traces' : 'Contient'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-slate-500">
        Cliquer une fois = contient, deux fois = traces, trois fois = retirer
      </p>
    </div>
  );
}
