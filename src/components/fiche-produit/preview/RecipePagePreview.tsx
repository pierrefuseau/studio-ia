import { useFiche } from '../FicheProduitContext';
import { EditableField } from './EditableField';
import { ChefHat, Clock, Users, Star } from 'lucide-react';
import type { GeneratedRecipe } from '../../../types/product';

export function RecipePagePreview() {
  const { state, dispatch } = useFiche();
  const { editedContent, generatedContent } = state;
  const recipe = editedContent.recipe;

  if (!recipe) return null;

  const recipeImage = generatedContent?.recipeImageBase64;

  const updateRecipe = (partial: Partial<GeneratedRecipe>) => {
    dispatch({ type: 'UPDATE_EDITED_RECIPE', payload: partial });
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden" style={{ aspectRatio: '210/297' }}>
      <div className="h-full flex flex-col text-gray-900">
        {recipeImage && (
          <div className="h-36 overflow-hidden relative">
            <img
              src={`data:image/png;base64,${recipeImage}`}
              alt="Recette"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          </div>
        )}

        <div className="flex-1 px-6 pb-5" style={{ marginTop: recipeImage ? '-1rem' : '1.5rem' }}>
          <div className="relative z-10">
            <EditableField
              value={recipe.nom}
              onChange={(v) => updateRecipe({ nom: v })}
              as="h2"
              className="text-lg font-bold text-gray-900 leading-tight"
            />
            <EditableField
              value={recipe.description}
              onChange={(v) => updateRecipe({ description: v })}
              as="p"
              className="text-[10px] text-gray-500 mt-1 italic leading-relaxed"
              multiline
            />
          </div>

          <div className="flex items-center gap-4 mt-3 mb-3">
            <MetaBadge icon={Clock} label={recipe.tempsPreparation} sub="Preparation" />
            <MetaBadge icon={Clock} label={recipe.tempsCuisson} sub="Cuisson" />
            <MetaBadge icon={Users} label={recipe.portions} sub="Portions" />
            <div className="flex items-center gap-0.5">
              {Array.from({ length: recipe.difficulte }).map((_, i) => (
                <ChefHat key={i} className="w-3.5 h-3.5 text-amber-500" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-2">
              <h3
                className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-2 pb-1 border-b border-gray-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Ingredients
              </h3>
              <ul className="space-y-1">
                {recipe.ingredients.map((ing, i) => (
                  <li
                    key={i}
                    className={`text-[9px] leading-tight flex items-start gap-1 ${
                      ing.isVedette ? 'font-bold text-amber-700' : 'text-gray-600'
                    }`}
                  >
                    {ing.isVedette && <Star className="w-2.5 h-2.5 text-amber-500 flex-shrink-0 mt-0.5" />}
                    <span>
                      <span className="font-medium">{ing.quantite}</span>{' '}
                      {ing.nom}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-3">
              <h3
                className="text-[10px] font-bold text-gray-800 uppercase tracking-wider mb-2 pb-1 border-b border-gray-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Preparation
              </h3>
              <ol className="space-y-2">
                {recipe.etapes.map((etape) => (
                  <li key={etape.numero} className="flex gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[7px] font-bold flex-shrink-0 mt-0.5">
                      {etape.numero}
                    </span>
                    <div>
                      <p className="text-[9px] font-semibold text-gray-800">{etape.titre}</p>
                      <EditableField
                        value={etape.description}
                        onChange={(v) => {
                          const etapes = recipe.etapes.map((e) =>
                            e.numero === etape.numero ? { ...e, description: v } : e
                          );
                          updateRecipe({ etapes });
                        }}
                        as="p"
                        className="text-[8px] text-gray-500 leading-relaxed"
                        multiline
                      />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-auto pt-3">
            {recipe.motDuChef && (
              <div className="bg-amber-50 rounded-lg p-2.5 mb-2">
                <p className="text-[8px] font-bold text-amber-700 uppercase mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Le mot du chef
                </p>
                <EditableField
                  value={recipe.motDuChef}
                  onChange={(v) => updateRecipe({ motDuChef: v })}
                  as="p"
                  className="text-[9px] text-amber-800 italic leading-relaxed"
                  multiline
                />
              </div>
            )}

            {recipe.variantes.length > 0 && (
              <div>
                <p className="text-[8px] font-bold text-gray-600 uppercase mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Variantes
                </p>
                <div className="flex flex-wrap gap-1">
                  {recipe.variantes.map((v, i) => (
                    <span key={i} className="px-1.5 py-0.5 bg-gray-100 rounded text-[8px] text-gray-500">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaBadge({ icon: Icon, label, sub }: { icon: React.ElementType; label: string; sub: string }) {
  return (
    <div className="flex items-center gap-1">
      <Icon className="w-3 h-3 text-gray-400" />
      <div>
        <p className="text-[9px] font-semibold text-gray-700">{label}</p>
        <p className="text-[7px] text-gray-400">{sub}</p>
      </div>
    </div>
  );
}
