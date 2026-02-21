import type { NutritionValues } from '../../../types/product';

interface NutritionFormProps {
  values: NutritionValues;
  onChange: (partial: Partial<NutritionValues>) => void;
}

const fields: { key: keyof NutritionValues; label: string; unit: string; indent?: boolean }[] = [
  { key: 'energieKJ', label: 'Energie', unit: 'kJ' },
  { key: 'energieKcal', label: 'Energie', unit: 'kcal' },
  { key: 'matieresGrasses', label: 'Matieres grasses', unit: 'g' },
  { key: 'acidesGrasSatures', label: 'dont acides gras satures', unit: 'g', indent: true },
  { key: 'glucides', label: 'Glucides', unit: 'g' },
  { key: 'sucres', label: 'dont sucres', unit: 'g', indent: true },
  { key: 'proteines', label: 'Proteines', unit: 'g' },
  { key: 'sel', label: 'Sel', unit: 'g' },
  { key: 'fibres', label: 'Fibres (optionnel)', unit: 'g' },
];

export function NutritionForm({ values, onChange }: NutritionFormProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
        Valeurs nutritionnelles pour 100g
      </label>
      <div className="bg-slate-800/50 rounded-lg border border-slate-600/30 overflow-hidden">
        {fields.map((f, i) => (
          <div
            key={f.key}
            className={`flex items-center gap-3 px-3 py-2 ${
              i < fields.length - 1 ? 'border-b border-slate-700/40' : ''
            }`}
          >
            <span
              className={`text-xs text-slate-300 flex-1 ${f.indent ? 'pl-4 text-slate-400 italic' : 'font-medium'}`}
            >
              {f.label}
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                inputMode="decimal"
                value={values[f.key]}
                onChange={(e) => onChange({ [f.key]: e.target.value })}
                placeholder="0"
                className="w-20 bg-slate-700/50 border border-slate-600/40 rounded px-2 py-1 text-xs text-slate-100 text-right focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/50"
              />
              <span className="text-[10px] text-slate-500 w-6">{f.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
