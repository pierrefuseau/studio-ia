import React, { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { useToast } from './ui/Toast';

interface ProductFormProps {
  treatmentType?: string;
}

export function ProductForm({ treatmentType }: ProductFormProps) {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();
  const [productName, setProductName] = useState(state.product?.name || '');
  const [productDescription, setProductDescription] = useState(state.product?.description || '');
  const [productCode, setProductCode] = useState(state.product?.code || '');
  const [promotion, setPromotion] = useState(state.product?.promotion || '');
  const [isImproving, setIsImproving] = useState<string | null>(null);

  const updateProduct = (updates: Partial<typeof state.product>) => {
    const currentProduct = state.product || { id: Date.now().toString() };
    dispatch({
      type: 'SET_PRODUCT',
      payload: { ...currentProduct, ...updates }
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductName(value);
    
    console.log('📝 Nom du produit mis à jour:', value);
    
    // Mettre à jour à la fois le produit global et le produit sélectionné
    updateProduct({ name: value });
    
    // Mettre à jour aussi le premier produit dans la liste si il existe
    if (state.products.length > 0) {
      dispatch({
        type: 'UPDATE_PRODUCT',
        payload: { id: state.products[0].id, updates: { name: value } }
      });
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductCode(value);
    updateProduct({ code: value });
  };

  const handlePromotionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPromotion(value);
    console.log('🎯 Promotion mise à jour:', value); // Debug
    updateProduct({ promotion: value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setProductDescription(value);
    
    console.log('📝 Description du produit mise à jour:', value);
    
    // Mettre à jour à la fois le produit global et le produit sélectionné
    updateProduct({ description: value });
    
    // Mettre à jour aussi le premier produit dans la liste si il existe
    if (state.products.length > 0) {
      dispatch({
        type: 'UPDATE_PRODUCT',
        payload: { id: state.products[0].id, updates: { description: value } }
      });
    }
  };

  const improveText = async (field: 'name' | 'description', currentText: string) => {
    if (!currentText.trim()) {
      addToast({
        type: 'warning',
        title: 'Texte requis',
        description: 'Ajoutez d\'abord du texte à améliorer'
      });
      return;
    }

    setIsImproving(field);
    
    try {
      // Simulation de l'amélioration IA
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let improvedText = '';
      
      if (field === 'name') {
        // Amélioration du nom de produit
        improvedText = currentText
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        // Ajouter des détails si le nom est trop simple
        if (currentText.split(' ').length < 3) {
          improvedText += ' - Édition Premium';
        }
      } else if (field === 'promotion') {
        // Amélioration de la promotion
        const promotionPrefixes = [
          'Offre exceptionnelle :',
          'Promotion limitée :',
          'Exclusivité :',
          'Derniers jours :'
        ];
        const randomPrefix = promotionPrefixes[Math.floor(Math.random() * promotionPrefixes.length)];
        
        if (!currentText.toLowerCase().includes('offre') && !currentText.toLowerCase().includes('promotion')) {
          improvedText = `${randomPrefix} ${currentText}`;
        } else {
          improvedText = currentText.charAt(0).toUpperCase() + currentText.slice(1);
        }
      } else {
        // Amélioration de la description
        const improvements = [
          'Découvrez',
          'Profitez d\'une expérience exceptionnelle avec',
          'Conçu avec soin,'
        ];
        const randomStart = improvements[Math.floor(Math.random() * improvements.length)];
        
        improvedText = `${randomStart} ${currentText.toLowerCase()}. Ce produit allie performance et élégance pour répondre à tous vos besoins. Idéal pour un usage quotidien, il vous accompagne dans toutes vos activités avec style et efficacité.`;
      }
      
      if (field === 'name') {
        setProductName(improvedText);
        updateProduct({ name: improvedText });
      } else {
        setProductDescription(improvedText);
        updateProduct({ description: improvedText });
      }
      
      if (field === 'promotion') {
        setPromotion(improvedText);
        updateProduct({ promotion: improvedText });
      }
      
      addToast({
        type: 'success',
        title: 'Texte amélioré',
        description: 'L\'IA a optimisé votre texte'
      });
      
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erreur',
        description: 'Impossible d\'améliorer le texte'
      });
    } finally {
      setIsImproving(null);
    }
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-card">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Informations produit
      </h3>
      
      {/* Code Article - uniquement pour le détourage */}
      {treatmentType === 'background-removal' && (
        <div>
          <label className="block text-sm text-gray-700 mb-1.5">
            Code Article
          </label>
          <input
            type="text"
            value={productCode}
            onChange={handleCodeChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            placeholder="Ex: REF-001-2024"
          />
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-700 mb-1.5">
          Nom du produit {(treatmentType === 'scene-composition' || treatmentType === 'product-scene') && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type="text"
            value={productName}
            onChange={handleNameChange}
            className={`w-full px-3 py-2 pr-10 border rounded-lg focus-ring ${
              (treatmentType === 'scene-composition' || treatmentType === 'product-scene') && !productName.trim()
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-gray-400'
            }`}
            placeholder={treatmentType === 'product-scene' ? "Ex: Chaise ergonomique, Gamme mobilier bureau..." : "Ex: Chaise de bureau ergonomique"}
            required={treatmentType === 'scene-composition' || treatmentType === 'product-scene'}
          />
          <button
            onClick={() => improveText('name', productName)}
            disabled={isImproving === 'name' || !productName.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-fuseau-accent hover:text-fuseau-primary hover:bg-red-50 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Améliorer avec IA"
          >
            {isImproving === 'name' ? (
              <div className="w-4 h-4 border-2 border-fuseau-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
          </button>
        </div>
        {(treatmentType === 'scene-composition' || treatmentType === 'product-scene') && !productName.trim() && (
          <p className="text-xs text-red-500 mt-1">Le nom du produit est obligatoire pour la mise en situation</p>
        )}
      </div>

      {/* Description de la mise en situation - uniquement pour Produit Brut */}
      {treatmentType === 'product-scene' && (
        <div>
          <label className="block text-sm text-gray-700 mb-1.5">
            Quelle mise en situation ?
            <span className="text-gray-400 ml-1 font-normal">(optionnel)</span>
          </label>
          <div className="relative">
            <textarea
              value={productDescription}
              onChange={handleDescriptionChange}
              className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus-ring resize-none"
              rows={3}
              placeholder="Ex: Dans un bureau moderne avec éclairage naturel, sur un parquet en chêne, ambiance cosy et professionnelle..."
            />
            <button
              onClick={() => improveText('description', productDescription)}
              disabled={isImproving === 'description' || !productDescription.trim()}
              className="absolute right-2 top-2 p-1.5 text-fuseau-accent hover:text-fuseau-primary hover:bg-red-50 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Améliorer avec IA"
            >
              {isImproving === 'description' ? (
                <div className="w-4 h-4 border-2 border-fuseau-accent border-t-transparent rounded-full animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Description - masquée pour le détourage */}
      {treatmentType !== 'background-removal' && treatmentType !== 'product-scene' && (
        <div>
        <label className="block text-sm text-gray-700 mb-1.5">
          Description
          {treatmentType === 'scene-composition' ? (
            <span className="text-red-500 ml-1">*</span>
          ) : (
            <span className="text-gray-400 ml-1 font-normal">(optionnel)</span>
          )}
        </label>
        <div className="relative">
          <textarea
            value={productDescription}
            onChange={handleDescriptionChange}
            className={`w-full px-3 py-2 pr-10 border rounded-lg focus-ring resize-none ${
              treatmentType === 'scene-composition' && !productDescription.trim()
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-200 focus:border-gray-400'
            }`}
            rows={3}
            placeholder="Décrivez votre produit..."
            required={treatmentType === 'scene-composition'}
          />
          <button
            onClick={() => improveText('description', productDescription)}
            disabled={isImproving === 'description' || !productDescription.trim()}
            className="absolute right-2 top-2 p-1.5 text-fuseau-accent hover:text-fuseau-primary hover:bg-red-50 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Améliorer avec IA"
          >
            {isImproving === 'description' ? (
              <div className="w-4 h-4 border-2 border-fuseau-accent border-t-transparent rounded-full animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
          </button>
        </div>
        {treatmentType === 'scene-composition' && !productDescription.trim() && (
          <p className="text-xs text-red-500 mt-1">La description est obligatoire pour la mise en situation</p>
        )}
        <div className="mt-1 text-xs text-gray-400 text-right">
          {productDescription.length}/500
        </div>
        </div>
      )}
    </div>
  );
}