import { UtensilsCrossed } from 'lucide-react';
import { useFiche } from '../FicheProduitContext';
import { FPSelect } from '../ui/FPSelect';
import { FPInput } from '../ui/FPInput';
import { FPTextarea } from '../ui/FPTextarea';
import { DifficultySelector } from '../ui/DifficultySelector';
import type { RecipeStyle, Difficulte } from '../../../types/product';

const RECIPE_STYLES = [
  { value: 'auto', label: 'Automatique selon le produit' },
  { value: 'patisserie', label: 'Patisserie' },
  { value: 'boulangerie', label: 'Boulangerie' },
  { value: 'restauration', label: 'Restauration / Cuisine' },
  { value: 'snacking', label: 'Snacking' },
  { value: 'glacerie', label: 'Glacerie' },
  { value: 'confiserie', label: 'Confiserie' },
  { value: 'chocolaterie', label: 'Chocolaterie' },
];

export function StepRecipe() {
  const { state, setField } = useFiche();
  const { formData } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Recette associee</h2>
        <div className="flex items-start gap-3 mt-3 p-4 rounded-lg bg-slate-700/30 border border-slate-600/30">
          <UtensilsCrossed className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-slate-300">
            Une recette sera automatiquement generee par l'IA pour mettre en valeur votre produit
          </p>
        </div>
      </div>

      <FPSelect
        label="Style de recette"
        value={formData.styleRecette}
        onChange={(v) => setField('styleRecette', v as RecipeStyle)}
        options={RECIPE_STYLES}
      />

      <DifficultySelector
        value={formData.difficulte}
        onChange={(v) => setField('difficulte', v as Difficulte)}
      />

      <FPInput
        label="Nombre de portions"
        type="number"
        min={1}
        max={100}
        value={String(formData.portions)}
        onChange={(e) => setField('portions', parseInt(e.target.value) || 8)}
        placeholder="8"
      />

      <FPTextarea
        label="Notes pour la recette"
        value={formData.notesRecette}
        onChange={(e) => setField('notesRecette', e.target.value)}
        placeholder="Ex: Preferer une recette avec peu d'ingredients"
        rows={3}
        helperText="Optionnel : instructions specifiques pour l'IA"
      />

      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative">
          <input
            type="checkbox"
            checked={formData.formatProfessionnel}
            onChange={(e) => setField('formatProfessionnel', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-10 h-5 rounded-full bg-slate-600 peer-checked:bg-amber-500 transition-colors duration-150" />
          <div className="absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-150 peer-checked:translate-x-5" />
        </div>
        <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
          Adapter les quantites au format professionnel (production artisanale)
        </span>
      </label>
    </div>
  );
}
