import React, { useState } from 'react';
import { Package, Sparkles, Type, Wand2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { useToast } from './ui/Toast';

export function ProductInfoForm() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingField, setGeneratingField] = useState<string | null>(null);

  const updateProduct = (updates: Partial<typeof state.product>) => {
    const currentProduct = state.product || { id: Date.now().toString() };
    dispatch({
      type: 'SET_PRODUCT',
      payload: { ...currentProduct, ...updates }
    });
  };

  const generateSuggestions = async () => {
    setIsGenerating(true);
    setGeneratingField('suggestions');
    
    // Simulation de l'IA pour générer des suggestions
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockSuggestions = [
      'Smartphone dernière génération avec écran OLED',
      'Écouteurs sans fil premium avec réduction de bruit',
      'Montre connectée élégante pour le sport',
      'Accessoire lifestyle moderne et minimaliste'
    ];
    
    setSuggestions(mockSuggestions);
    setIsGenerating(false);
    setGeneratingField(null);
    
    addToast({
      type: 'success',
      title: 'Suggestions générées',
      description: 'L\'IA a analysé votre contexte'
    });
  };

  const generateDescription = async () => {
    if (!state.product?.name) {
      addToast({
        type: 'warning',
        title: 'Nom requis',
        description: 'Ajoutez d\'abord un nom de produit'
      });
      return;
    }

    setIsGenerating(true);
    setGeneratingField('generate');
    
    // Simulation de génération de description
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockDescription = `${state.product.name} représente l'excellence en matière d'innovation et de design. Conçu pour répondre aux besoins des utilisateurs les plus exigeants, ce produit combine performance, élégance et fonctionnalité. Idéal pour les professionnels et les particuliers qui recherchent la qualité et la fiabilité dans leur quotidien.`;
    
    updateProduct({ description: mockDescription });
    setIsGenerating(false);
    setGeneratingField(null);
    
    addToast({
      type: 'success',
      title: 'Description générée',
      description: 'L\'IA a créé une description optimisée'
    });
  };

  const improveProductName = async () => {
    if (!state.product?.name?.trim()) {
      addToast({
        type: 'warning',
        title: 'Nom requis',
        description: 'Ajoutez d\'abord un nom de produit'
      });
      return;
    }

    setIsGenerating(true);
    setGeneratingField('name');
    
    // Simulation de l'amélioration IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const currentName = state.product.name;
    let improvedName = currentName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    // Ajouter des détails si le nom est trop simple
    if (currentName.split(' ').length < 4) {
      const enhancements = ['Pro', 'Premium', 'Édition Limitée', 'Nouvelle Génération'];
      const randomEnhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
      improvedName += ` ${randomEnhancement}`;
    }
    
    updateProduct({ name: improvedName });
    setIsGenerating(false);
    setGeneratingField(null);
    
    addToast({
      type: 'success',
      title: 'Nom amélioré',
      description: 'L\'IA a optimisé le nom de votre produit'
    });
  };

  const improveDescription = async () => {
    if (!state.product?.description?.trim()) {
      addToast({
        type: 'warning',
        title: 'Description requise',
        description: 'Ajoutez d\'abord une description à améliorer'
      });
      return;
    }

    setIsGenerating(true);
    setGeneratingField('improve');
    
    // Simulation de l'amélioration IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const currentDescription = state.product.description;
    const improvements = [
      'Découvrez l\'excellence avec',
      'Profitez d\'une expérience unique grâce à',
      'Révolutionnez votre quotidien avec'
    ];
    const randomStart = improvements[Math.floor(Math.random() * improvements.length)];
    
    const improvedDescription = `${randomStart} ${currentDescription.toLowerCase()}. Conçu avec les dernières innovations technologiques, ce produit allie performance exceptionnelle et design raffiné. Parfait pour les utilisateurs exigeants qui recherchent qualité, durabilité et style dans un seul produit.`;
    
    updateProduct({ description: improvedDescription });
    setIsGenerating(false);
    setGeneratingField(null);
    
    addToast({
      type: 'success',
      title: 'Description améliorée',
      description: 'L\'IA a enrichi votre description'
    });
  };

  return (
    <Card glass className="p-4 sm:p-5 lg:p-6">
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Informations Produit
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Décrivez votre produit pour optimiser les traitements IA
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {state.product?.name && state.product?.description ? (
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Complet
                </span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                  En cours
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3">
            <div className="relative">
              <Input
                label="Nom du produit"
                placeholder="Ex: iPhone 15 Pro Max 256GB Titane Naturel"
                value={state.product?.name || ''}
                onChange={(e) => updateProduct({ name: e.target.value })}
                helperText={`${state.product?.name?.length || 0}/100 caractères`}
                rightIcon={
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => improveProductName()}
                      disabled={isGenerating || !state.product?.name?.trim()}
                      className="p-2 sm:p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                      title="Améliorer avec IA"
                    >
                      {isGenerating && generatingField === 'name' ? (
                        <div className="w-5 h-5 sm:w-4 sm:h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Wand2 className="w-5 h-5 sm:w-4 sm:h-4 text-orange-500" />
                      )}
                    </button>
                    <button
                      onClick={generateSuggestions}
                      disabled={isGenerating}
                      className="p-2 sm:p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                      title="Générer avec IA"
                    >
                      {isGenerating && generatingField === 'suggestions' ? (
                        <div className="w-5 h-5 sm:w-4 sm:h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-5 h-5 sm:w-4 sm:h-4 text-blue-500" />
                      )}
                    </button>
                  </div>
                }
              />
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center">
                  <Wand2 className="w-3 h-3 mr-1" />
                  Suggestions IA
                </p>
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        updateProduct({ name: suggestion });
                        setSuggestions([]);
                      }}
                      className="block w-full text-left text-xs p-2 sm:p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-700 dark:hover:text-orange-300 transition-all duration-200 sm:hover:scale-[1.02] border border-blue-200/50 dark:border-blue-700/50 hover:border-orange-300 dark:hover:border-orange-600"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description du produit
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={improveDescription}
                  disabled={isGenerating || !state.product?.description?.trim()}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Améliorer la description avec IA"
                >
                  {isGenerating && generatingField === 'improve' ? (
                    <div className="w-3 h-3 border border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                  <span>Améliorer</span>
                </button>
                <button
                  onClick={generateDescription}
                  disabled={isGenerating || !state.product?.name}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-md hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Générer une description avec IA"
                >
                  {isGenerating && generatingField === 'generate' ? (
                    <div className="w-3 h-3 border border-orange-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Wand2 className="w-3 h-3" />
                  )}
                  <span>Générer</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                placeholder="Décrivez votre produit : caractéristiques principales, utilisation, public cible, points forts..."
                value={state.product?.description || ''}
                onChange={(e) => updateProduct({ description: e.target.value })}
                className="w-full px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none min-h-[80px] sm:min-h-[100px]"
                rows={4}
              />
              <div className="sm:absolute sm:bottom-3 sm:right-3 mt-1 sm:mt-0 text-right flex items-center justify-end space-x-2">
                <span className="text-xs text-gray-400">
                  {state.product?.description?.split(' ').filter(word => word.length > 0).length || 0} mots
                </span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className="text-xs text-gray-400">
                  {state.product?.description?.length || 0} caractères
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2">
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                  <Type className="w-4 h-4 text-gray-500" />
                </button>
                <div className="text-xs text-gray-400">
                  Utilisez des mots-clés pour optimiser l'IA
                </div>
              </div>

              {state.product?.description && (
                <div className="flex items-center space-x-2">
                  <div className="text-xs text-gray-500">Qualité:</div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    state.product.description.length > 100
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : state.product.description.length > 50
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                      : 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
                  }`}>
                    {state.product.description.length > 100 ? 'Excellente' :
                     state.product.description.length > 50 ? 'Bonne' : 'Basique'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {(!state.product?.name || !state.product?.description) && (
          <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-orange-50 dark:from-blue-900/20 dark:to-orange-900/20 rounded-lg border border-blue-200 dark:border-blue-700/30">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0 animate-pulse" />
              <div>
                <h4 className="text-xs sm:text-sm font-medium gradient-text mb-1">
                  Optimisez vos résultats avec l'IA
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                  Plus vous fournissez d'informations détaillées, plus nos algorithmes pourront créer des visuels précis et adaptés à votre produit.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}