import { Sparkles, Package, FlaskConical, UtensilsCrossed, AlertTriangle, Award } from 'lucide-react';
import { useFiche } from '../FicheProduitContext';
import { ALLERGENS } from '../../../utils/allergenData';
import { CERTIFICATIONS } from '../../../utils/certificationData';

interface StepPreviewProps {
  onGenerate: () => void;
}

export function StepPreview({ onGenerate }: StepPreviewProps) {
  const { state } = useFiche();
  const { formData } = state;

  const selectedAllergens = formData.allergenes.filter((a) => a.selected);
  const allergenLabels = selectedAllergens.map((a) => {
    const info = ALLERGENS.find((al) => al.id === a.id);
    return info ? `${info.label}${a.traces ? ' (traces)' : ''}` : a.id;
  });

  const certLabels = formData.certifications.map((id) => {
    const info = CERTIFICATIONS.find((c) => c.id === id);
    return info ? info.label : id;
  });

  const nv = formData.nutritionValues;
  const hasNutrition = Object.values(nv).some((v) => v !== '');

  const canGenerate = formData.marque && formData.nomProduit && formData.gamme;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Apercu & Generation</h2>
        <p className="text-sm text-slate-400 mt-1">Verifiez les informations avant de generer la fiche</p>
      </div>

      <div className="space-y-4">
        <Section icon={Package} title="Identite produit">
          <Row label="Marque" value={formData.marque} />
          <Row label="Nom" value={formData.nomProduit} />
          <Row label="Reference" value={formData.referenceInterne} />
          {formData.codeEAN && <Row label="Code EAN" value={formData.codeEAN} />}
          <Row label="Gamme" value={formData.gamme} />
          {formData.photoPreview && (
            <div className="mt-2">
              <img
                src={formData.photoPreview}
                alt="Photo produit"
                className="w-24 h-24 object-contain rounded-lg border border-slate-600/40"
              />
            </div>
          )}
        </Section>

        <Section icon={FlaskConical} title="Details techniques">
          {formData.poidsNet && <Row label="Poids net" value={formData.poidsNet} />}
          {formData.conditionnement && <Row label="Conditionnement" value={formData.conditionnement} />}
          {formData.ingredients && (
            <Row label="Ingredients" value={formData.ingredients} />
          )}
          {selectedAllergens.length > 0 && (
            <div className="py-1.5">
              <span className="text-xs text-slate-500">Allergenes : </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {selectedAllergens.map((a) => {
                  const info = ALLERGENS.find((al) => al.id === a.id);
                  return (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                      style={{ backgroundColor: info?.color || '#64748B' }}
                    >
                      {info?.symbol}
                      {a.traces && <span className="text-white/70">T</span>}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {hasNutrition && (
            <div className="py-1.5">
              <span className="text-xs text-slate-500">Valeurs nutritionnelles : </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                {nv.energieKcal && <NutriPill label="Energie" value={`${nv.energieKcal} kcal`} />}
                {nv.matieresGrasses && <NutriPill label="Graisses" value={`${nv.matieresGrasses} g`} />}
                {nv.glucides && <NutriPill label="Glucides" value={`${nv.glucides} g`} />}
                {nv.proteines && <NutriPill label="Proteines" value={`${nv.proteines} g`} />}
              </div>
            </div>
          )}
          {certLabels.length > 0 && (
            <div className="py-1.5">
              <span className="text-xs text-slate-500">Certifications : </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {formData.certifications.map((id) => {
                  const info = CERTIFICATIONS.find((c) => c.id === id);
                  return (
                    <span
                      key={id}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                      style={{ backgroundColor: info?.color || '#64748B' }}
                    >
                      {info?.shortLabel || id}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </Section>

        <Section icon={UtensilsCrossed} title="Recette">
          <Row
            label="Style"
            value={formData.styleRecette === 'auto' ? 'Automatique' : formData.styleRecette}
          />
          <Row label="Difficulte" value={`${'*'.repeat(formData.difficulte)} (${formData.difficulte}/3)`} />
          <Row label="Portions" value={String(formData.portions)} />
          {formData.notesRecette && <Row label="Notes" value={formData.notesRecette} />}
          <Row
            label="Format pro"
            value={formData.formatProfessionnel ? 'Oui' : 'Non'}
          />
        </Section>
      </div>

      {!canGenerate && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-300">
            Veuillez remplir les champs obligatoires : marque, nom du produit et gamme.
          </p>
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={!canGenerate}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-base font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.01]"
      >
        <Sparkles className="w-5 h-5" />
        Generer la fiche produit
      </button>
      <p className="text-center text-xs text-slate-500">
        La generation prend environ 30 a 45 secondes
      </p>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-600/30 bg-slate-800/40 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/30 border-b border-slate-600/20">
        <Icon className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-semibold text-slate-200">{title}</span>
      </div>
      <div className="px-4 py-3 space-y-1">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 py-1">
      <span className="text-xs text-slate-500 flex-shrink-0 w-28">{label}</span>
      <span className="text-xs text-slate-200 break-words">{value}</span>
    </div>
  );
}

function NutriPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-700/50 rounded px-2 py-1 text-center">
      <p className="text-[10px] text-slate-400">{label}</p>
      <p className="text-xs font-semibold text-slate-200">{value}</p>
    </div>
  );
}
