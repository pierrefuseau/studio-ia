import { useFiche } from '../FicheProduitContext';
import { EditableField } from './EditableField';
import { ALLERGENS } from '../../../utils/allergenData';
import { CERTIFICATIONS } from '../../../utils/certificationData';
import type { GeneratedProduct } from '../../../types/product';

export function ProductPagePreview() {
  const { state, dispatch } = useFiche();
  const { formData, editedContent } = state;
  const product = editedContent.product;

  if (!product) return null;

  const selectedAllergens = formData.allergenes.filter((a) => a.selected);
  const nv = formData.nutritionValues;

  const updateProduct = (partial: Partial<GeneratedProduct>) => {
    dispatch({ type: 'UPDATE_EDITED_PRODUCT', payload: partial });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden" style={{ aspectRatio: '210/297' }}>
      <div className="h-full flex flex-col p-6 text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600">
              {formData.marque}
            </p>
            <h1 className="text-xl font-bold mt-1 text-gray-900 leading-tight">
              {formData.nomProduit}
            </h1>
            <p className="text-[10px] text-gray-400 mt-0.5">{formData.referenceInterne}</p>
          </div>
          {formData.photoPreview && (
            <img
              src={formData.photoPreview}
              alt={formData.nomProduit}
              className="w-24 h-24 object-contain rounded-lg"
            />
          )}
        </div>

        <div className="bg-amber-50 rounded-lg p-3 mb-3">
          <EditableField
            value={product.accroche}
            onChange={(v) => updateProduct({ accroche: v })}
            as="p"
            className="text-sm font-semibold text-amber-800 italic leading-relaxed"
          />
        </div>

        <EditableField
          value={product.description}
          onChange={(v) => updateProduct({ description: v })}
          as="p"
          className="text-[11px] text-gray-600 leading-relaxed mb-3"
          multiline
        />

        <div className="mb-3">
          <h3 className="text-xs font-bold text-gray-800 mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
            Arguments cles
          </h3>
          <div className="grid grid-cols-2 gap-1.5">
            {product.arguments.map((arg, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <EditableField
                  value={arg}
                  onChange={(v) => {
                    const args = [...product.arguments];
                    args[i] = v;
                    updateProduct({ arguments: args });
                  }}
                  as="span"
                  className="text-[10px] text-gray-600 leading-tight"
                />
              </div>
            ))}
          </div>
        </div>

        {product.utilisations.length > 0 && (
          <div className="mb-3">
            <h3 className="text-xs font-bold text-gray-800 mb-1 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>
              Utilisations
            </h3>
            <div className="flex flex-wrap gap-1">
              {product.utilisations.map((u, i) => (
                <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-full text-[9px] text-gray-600">
                  {u}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto space-y-2">
          {selectedAllergens.length > 0 && (
            <div>
              <h4 className="text-[9px] font-bold text-gray-700 uppercase mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Allergenes</h4>
              <div className="flex flex-wrap gap-1">
                {selectedAllergens.map((a) => {
                  const info = ALLERGENS.find((al) => al.id === a.id);
                  return (
                    <span
                      key={a.id}
                      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-bold text-white"
                      style={{ backgroundColor: info?.color || '#64748B' }}
                    >
                      {info?.label}{a.traces ? ' (traces)' : ''}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-2">
            <h4 className="text-[9px] font-bold text-gray-700 uppercase mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Valeurs nutritionnelles pour 100g
            </h4>
            <div className="grid grid-cols-4 gap-1 text-center">
              {nv.energieKcal && <MiniNutri label="Energie" value={`${nv.energieKcal} kcal`} />}
              {nv.matieresGrasses && <MiniNutri label="Graisses" value={`${nv.matieresGrasses}g`} />}
              {nv.glucides && <MiniNutri label="Glucides" value={`${nv.glucides}g`} />}
              {nv.proteines && <MiniNutri label="Proteines" value={`${nv.proteines}g`} />}
            </div>
          </div>

          {formData.certifications.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formData.certifications.map((id) => {
                const info = CERTIFICATIONS.find((c) => c.id === id);
                return (
                  <span
                    key={id}
                    className="px-1.5 py-0.5 rounded text-[8px] font-bold"
                    style={{ backgroundColor: info?.bgColor, color: info?.color }}
                  >
                    {info?.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniNutri({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded p-1">
      <p className="text-[7px] text-gray-400 uppercase">{label}</p>
      <p className="text-[9px] font-bold text-gray-700">{value}</p>
    </div>
  );
}
