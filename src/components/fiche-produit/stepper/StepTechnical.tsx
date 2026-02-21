import { useFiche } from '../FicheProduitContext';
import { FPInput } from '../ui/FPInput';
import { FPTextarea } from '../ui/FPTextarea';
import { AllergenSelector } from '../ui/AllergenSelector';
import { NutritionForm } from '../ui/NutritionForm';
import { CertificationSelector } from '../ui/CertificationSelector';

export function StepTechnical() {
  const { state, setField, dispatch } = useFiche();
  const { formData } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Details techniques</h2>
        <p className="text-sm text-slate-400 mt-1">Composition, allergenes et valeurs nutritionnelles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FPInput
          label="Poids net"
          value={formData.poidsNet}
          onChange={(e) => setField('poidsNet', e.target.value)}
          placeholder="Ex: 1 kg"
        />
        <FPInput
          label="DLC / DLUO"
          value={formData.dlcDluo}
          onChange={(e) => setField('dlcDluo', e.target.value)}
          placeholder="Ex: 18 mois a partir de la date de fabrication"
        />
      </div>

      <FPInput
        label="Conditionnement"
        value={formData.conditionnement}
        onChange={(e) => setField('conditionnement', e.target.value)}
        placeholder="Ex: Sac de 1kg - Carton de 8 sacs - Palette de 60 cartons"
      />

      <FPTextarea
        label="Ingredients"
        value={formData.ingredients}
        onChange={(e) => setField('ingredients', e.target.value)}
        placeholder="Ex: Pate de cacao Ghana (65%), sucre de canne, beurre de cacao..."
        rows={3}
        required
      />

      <AllergenSelector
        allergenes={formData.allergenes}
        onToggle={(id, selected, traces) =>
          dispatch({ type: 'SET_ALLERGEN', payload: { id, selected, traces } })
        }
      />

      <NutritionForm
        values={formData.nutritionValues}
        onChange={(partial) => dispatch({ type: 'SET_NUTRITION', payload: partial })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FPInput
          label="Conditions de conservation"
          value={formData.conservation}
          onChange={(e) => setField('conservation', e.target.value)}
          placeholder="Ex: A conserver au sec, entre 15 et 18 degres C"
        />
        <FPInput
          label="Origine"
          value={formData.origine}
          onChange={(e) => setField('origine', e.target.value)}
          placeholder="Ex: Ghana, Afrique de l'Ouest"
        />
      </div>

      <CertificationSelector
        selected={formData.certifications}
        onToggle={(id) => dispatch({ type: 'TOGGLE_CERTIFICATION', payload: id })}
      />

      <FPTextarea
        label="Description libre"
        value={formData.descriptionLibre}
        onChange={(e) => setField('descriptionLibre', e.target.value)}
        placeholder="Notes supplementaires pour l'IA..."
        rows={3}
        helperText="Optionnel : informations supplementaires pour guider l'IA"
      />
    </div>
  );
}
