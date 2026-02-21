import { useFiche } from '../FicheProduitContext';
import { FPInput } from '../ui/FPInput';
import { FPSelect } from '../ui/FPSelect';
import { FPFileUpload } from '../ui/FPFileUpload';
import type { Marque, Gamme } from '../../../types/product';

const MARQUES = [
  { value: 'FUSEAU', label: 'FUSEAU' },
  { value: 'DELICES AGRO', label: 'DELICES AGRO' },
  { value: "C'PROPRE", label: "C'PROPRE" },
];

const GAMMES = [
  'Chocolats', 'Farines & Amidons', 'Cremes & Beurres', 'Fruits & Purees',
  'Epices & Aromes', 'Sucres & Edulcorants', 'Levures & Agents levants',
  'Huiles & Graisses', 'Fruits secs & Oleagineux', 'Produits laitiers',
  'Oeufs & Ovoproduits', 'Gelatines & Gelifiants', 'Colorants & Decorations',
  'Snacking', 'Boulangerie', 'Patisserie',
].map((g) => ({ value: g, label: g }));

export function StepIdentity() {
  const { state, setField, dispatch } = useFiche();
  const { formData } = state;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-100">Identite produit</h2>
        <p className="text-sm text-slate-400 mt-1">Informations generales sur le produit</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FPSelect
          label="Marque"
          value={formData.marque}
          onChange={(v) => setField('marque', v as Marque)}
          options={MARQUES}
          placeholder="Selectionnez une marque"
          required
        />
        <FPSelect
          label="Gamme / Categorie"
          value={formData.gamme}
          onChange={(v) => setField('gamme', v as Gamme)}
          options={GAMMES}
          placeholder="Selectionnez une gamme"
          required
        />
      </div>

      <FPInput
        label="Nom du produit"
        value={formData.nomProduit}
        onChange={(e) => setField('nomProduit', e.target.value)}
        placeholder="Ex: Chocolat Noir 70% Origine Ghana"
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FPInput
          label="Reference interne"
          value={formData.referenceInterne}
          onChange={(e) => setField('referenceInterne', e.target.value)}
          placeholder="Ex: DA-CHO-070-GH"
          required
        />
        <FPInput
          label="Code EAN"
          value={formData.codeEAN}
          onChange={(e) => setField('codeEAN', e.target.value)}
          placeholder="Ex: 3760001234567"
        />
      </div>

      <FPFileUpload
        preview={formData.photoPreview}
        onFileSelect={(file, preview) => {
          dispatch({ type: 'UPDATE_FORM', payload: { photoFile: file, photoPreview: preview } });
        }}
        onClear={() => {
          dispatch({ type: 'UPDATE_FORM', payload: { photoFile: null, photoPreview: '' } });
        }}
      />
    </div>
  );
}
