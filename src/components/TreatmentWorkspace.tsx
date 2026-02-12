import React from 'react';
import { Camera, ImagePlus, UtensilsCrossed } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { UploadZone } from './UploadZone';
import { ProductForm } from './ProductForm';
import { ProcessingStatus } from './ProcessingStatus';
import { ContentHeader } from './ContentHeader';
import { useToast } from './ui/Toast';
import { webhookService } from '../services/webhookService';
import { WebhookPayload } from '../types';

export function TreatmentWorkspace() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();

  const goHome = () => {
    dispatch({ type: 'SELECT_TREATMENT_TYPE', payload: null });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'hero' });
  };

  const getTreatmentConfig = () => {
    switch (state.selectedTreatmentType) {
      case 'background-removal':
        return {
          name: 'Detourage Studio',
          description: 'Creez un packshot professionnel sur fond blanc',
          icon: <Camera className="w-5 h-5" />,
          fields: []
        };
      case 'scene-composition':
        return {
          name: 'Mise en situation Packaging',
          description: 'Integrez votre packaging dans un environnement realiste',
          icon: <ImagePlus className="w-5 h-5" />,
          fields: [
            {
              key: 'situationPrompt',
              label: 'Description de l\'environnement',
              placeholder: 'Ex: Dans un salon moderne, sur une table en bois...',
              type: 'textarea'
            }
          ]
        };
      case 'product-scene':
        return {
          name: 'Mise en situation Produit Brut',
          description: 'Integrez votre produit brut dans un environnement personnalise',
          icon: <ImagePlus className="w-5 h-5" />,
          fields: [
            {
              key: 'productName',
              label: 'Nom du produit',
              placeholder: 'Ex: Chaise ergonomique...',
              type: 'input'
            },
            {
              key: 'situationDescription',
              label: 'Quelle mise en situation ?',
              placeholder: 'Ex: Dans un bureau moderne avec eclairage naturel...',
              type: 'textarea'
            }
          ]
        };
      case 'recipe-scene':
        return {
          name: 'Recettes du Chef',
          description: 'Sublimez vos plats avec une mise en scene gastronomique',
          icon: <UtensilsCrossed className="w-5 h-5" />,
          fields: [
            {
              key: 'recipeName',
              label: 'Nom de la recette',
              placeholder: 'Ex: Tarte au citron meringuee...',
              type: 'input'
            },
            {
              key: 'situationDescription',
              label: 'Quelle mise en scene ?',
              placeholder: 'Ex: Sur une table rustique en bois...',
              type: 'textarea'
            }
          ]
        };
      default:
        return null;
    }
  };

  const handleGenerate = async () => {
    if (!state.product?.imageUrl) {
      addToast({
        type: 'warning',
        title: 'Image requise',
        description: 'Veuillez d\'abord uploader une image'
      });
      return;
    }

    const config = getTreatmentConfig();
    if (!config) return;

    const payload: WebhookPayload = {
      treatmentType: state.selectedTreatmentType || 'unknown',
      treatmentDisplayName: config.name,
      productData: {
        name: state.product.name || undefined,
        code: state.product.code || undefined,
        description: state.product.description || undefined,
        promotion: state.selectedTreatmentType === 'magazine-layout'
          ? (state.product.promotion || '')
          : (state.product.promotion || undefined),
        imageUrl: state.product.imageUrl,
        imageFiles: state.product.image instanceof File ? [state.product.image] : undefined,
        originalFileName: state.product.image instanceof File ? state.product.image.name : undefined
      },
      treatmentParams: {
        situationPrompt: undefined,
        magazineContent: undefined
      },
      timestamp: new Date().toISOString(),
      sessionId: 'session-' + Date.now()
    };

    addToast({
      type: 'info',
      title: 'Traitement lance',
      description: 'Votre demande est en cours de traitement'
    });

    dispatch({ type: 'START_PROCESSING' });

    try {
      const success = await webhookService.sendTreatmentRequest(payload);

      if (success) {
        addToast({
          type: 'success',
          title: 'Traitement envoye',
          description: 'Votre demande a ete transmise avec succes'
        });
      } else {
        throw new Error('Echec de l\'envoi');
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erreur',
        description: 'Impossible de lancer le traitement'
      });
    }
  };

  const handleReset = () => {
    dispatch({ type: 'SET_PRODUCT', payload: null });
  };

  const config = getTreatmentConfig();
  if (!config) return null;

  return (
    <div className="max-w-5xl">
      <ContentHeader
        breadcrumbs={[
          { label: 'Accueil', onClick: goHome },
          { label: config.name },
        ]}
        title={config.name}
        subtitle={config.description}
        icon={config.icon}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <UploadZone />
          {state.selectedTreatmentType !== 'background-removal' && (
            <ProductForm treatmentType={state.selectedTreatmentType} />
          )}
        </div>

        <div className="space-y-5">
          {state.isProcessing && <ProcessingStatus />}
        </div>
      </div>
    </div>
  );
}
