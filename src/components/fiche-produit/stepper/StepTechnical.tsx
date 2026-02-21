import { Sparkles } from 'lucide-react';
import { useFiche } from '../FicheProduitContext';
import { FPInput } from '../ui/FPInput';
import { FPTextarea } from '../ui/FPTextarea';
import { AllergenSelector } from '../ui/AllergenSelector';
import { NutritionForm } from '../ui/NutritionForm';
import { CertificationSelector } from '../ui/CertificationSelector';
import { PDFUpload } from '../ui/PDFUpload';

function AIBadge({ hasPdf, hasValue }: { hasPdf: boolean; hasValue: boolean }) {
  if (!hasPdf) return null;
  if (hasValue) {
    return (
      <span className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-600/40 text-slate-400 uppercase">
        Manuel
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/15 text-amber-400 uppercase" title="Peut etre extrait automatiquement de la fiche technique PDF">
      <Sparkles className="w-2.5 h-2.5" />
      IA
    </span>
  );
}

export function StepTechnical() {
  const { state, setField, dispatch } = useFiche();
  const { formData } = state;
  const hasPdf = !!formData.pdfBase64;

  const hasIngredients = !!formData.ingredients.trim();
  const hasAllergens = formData.allergenes.some((a) => a.selected);
  const hasNutrition = Object.values(formData.nutritionValues).some((v) => v !== '');
  const hasDlc = !!formData.dlcDluo.trim();
  const hasConservation = !!formData.conservation.trim();
  const hasCerts = formData.certifications.length > 0;
  const hasOrigine = !!formData.origine.trim();

  const pdfPlaceholder = hasPdf ? 'Sera extrait du PDF par l\'IA...' : undefined;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Details techniques</h2>
        <p className="text-sm text-slate-400 mt-1">Composition, allergenes et valeurs nutritionnelles</p>
      </div>

      <PDFUpload />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FPInput
          label="Poids net"
          value={formData.poidsNet}
          onChange={(e) => setField('poidsNet', e.target.value)}
          placeholder="Ex: 1 kg"
          required
        />
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            DLC / DLUO
            <AIBadge hasPdf={hasPdf} hasValue={hasDlc} />
          </label>
          <input
            className="w-full bg-slate-700/50 border border-slate-600/50 hover:border-slate-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-colors duration-150"
            value={formData.dlcDluo}
            onChange={(e) => setField('dlcDluo', e.target.value)}
            placeholder={pdfPlaceholder || 'Ex: 18 mois a partir de la date de fabrication'}
          />
        </div>
      </div>

      <FPInput
        label="Conditionnement"
        value={formData.conditionnement}
        onChange={(e) => setField('conditionnement', e.target.value)}
        placeholder="Ex: Sac de 1kg - Carton de 8 sacs - Palette de 60 cartons"
        required
      />

      <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Ingredients
          <AIBadge hasPdf={hasPdf} hasValue={hasIngredients} />
          {!hasPdf && <span className="text-amber-400 ml-0.5">*</span>}
        </label>
        <textarea
          className="w-full bg-slate-700/50 border border-slate-600/50 hover:border-slate-500 rounded-lg px-3.5 py-2.5 resize-none text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-colors duration-150"
          value={formData.ingredients}
          onChange={(e) => setField('ingredients', e.target.value)}
          placeholder={pdfPlaceholder || 'Ex: Pate de cacao Ghana (65%), sucre de canne, beurre de cacao...'}
          rows={3}
        />
      </div>

      <div>
        <div className="flex items-center mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Allergenes</span>
          <AIBadge hasPdf={hasPdf} hasValue={hasAllergens} />
        </div>
        <AllergenSelector
          allergenes={formData.allergenes}
          onToggle={(id, selected, traces) =>
            dispatch({ type: 'SET_ALLERGEN', payload: { id, selected, traces } })
          }
        />
      </div>

      <div>
        <div className="flex items-center mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Valeurs nutritionnelles</span>
          <AIBadge hasPdf={hasPdf} hasValue={hasNutrition} />
        </div>
        <NutritionForm
          values={formData.nutritionValues}
          onChange={(partial) => dispatch({ type: 'SET_NUTRITION', payload: partial })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Conditions de conservation
            <AIBadge hasPdf={hasPdf} hasValue={hasConservation} />
          </label>
          <input
            className="w-full bg-slate-700/50 border border-slate-600/50 hover:border-slate-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-colors duration-150"
            value={formData.conservation}
            onChange={(e) => setField('conservation', e.target.value)}
            placeholder={pdfPlaceholder || "Ex: A conserver au sec, entre 15 et 18 degres C"}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Origine
            <AIBadge hasPdf={hasPdf} hasValue={hasOrigine} />
          </label>
          <input
            className="w-full bg-slate-700/50 border border-slate-600/50 hover:border-slate-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 transition-colors duration-150"
            value={formData.origine}
            onChange={(e) => setField('origine', e.target.value)}
            placeholder={pdfPlaceholder || "Ex: Ghana, Afrique de l'Ouest"}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Certifications</span>
          <AIBadge hasPdf={hasPdf} hasValue={hasCerts} />
        </div>
        <CertificationSelector
          selected={formData.certifications}
          onToggle={(id) => dispatch({ type: 'TOGGLE_CERTIFICATION', payload: id })}
        />
      </div>

      <FPTextarea
        label="Description libre"
        value={formData.descriptionLibre}
        onChange={(e) => setField('descriptionLibre', e.target.value)}
        placeholder="Notes supplementaires pour l'IA..."
        rows={3}
        helperText="Optionnel : informations supplementaires pour guider l'IA"
      />

      {hasPdf && (
        <p className="text-xs text-amber-400/70 bg-amber-500/5 rounded-lg px-4 py-2.5 border border-amber-500/10">
          Les champs vides seront completes automatiquement a partir de votre fiche technique PDF.
        </p>
      )}
      {!hasPdf && (
        <p className="text-xs text-slate-500">
          Tous les champs techniques sont obligatoires sans fiche technique PDF.
        </p>
      )}
    </div>
  );
}
