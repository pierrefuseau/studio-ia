import { cn } from '../../../utils/cn';
import { ChefHat } from 'lucide-react';
import type { Difficulte } from '../../../types/product';

interface DifficultySelectorProps {
  value: Difficulte;
  onChange: (value: Difficulte) => void;
}

const levels: { value: Difficulte; label: string; toques: number }[] = [
  { value: 1, label: 'Accessible', toques: 1 },
  { value: 2, label: 'Intermediaire', toques: 2 },
  { value: 3, label: 'Expert', toques: 3 },
];

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        Difficulte cible
      </label>
      <div className="grid grid-cols-3 gap-3">
        {levels.map((level) => (
          <button
            key={level.value}
            type="button"
            onClick={() => onChange(level.value)}
            className={cn(
              'flex flex-col items-center gap-2 py-3 px-2 rounded-lg border transition-all duration-150',
              value === level.value
                ? 'border-amber-500/60 bg-amber-500/10 text-amber-400'
                : 'border-slate-600/40 bg-slate-700/30 text-slate-400 hover:border-slate-500 hover:text-slate-300'
            )}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: level.toques }).map((_, i) => (
                <ChefHat
                  key={i}
                  className={cn('w-5 h-5', value === level.value ? 'text-amber-400' : 'text-slate-500')}
                />
              ))}
            </div>
            <span className="text-xs font-medium">{level.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
