import React, { useState } from 'react';
import { Camera, ImagePlus, UtensilsCrossed, ChevronUp, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const hasSideContent = state.isProcessing;

  return (
    <div className="max-w-full md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto p-3 sm:p-4 md:p-6">
      <ContentHeader
        breadcrumbs={[
          { label: config.name },
        ]}
        title={config.name}
        subtitle={config.description}
        icon={config.icon}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <div className="md:col-span-1 lg:col-span-2 space-y-4 sm:space-y-5">
          <UploadZone />
          {state.selectedTreatmentType !== 'background-removal' && (
            <ProductForm treatmentType={state.selectedTreatmentType} />
          )}
        </div>

        <div className="hidden md:block md:col-span-1 space-y-5">
          {state.isProcessing && <ProcessingStatus />}
        </div>
      </div>

      {hasSideContent && (
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="md:hidden fixed bottom-5 right-5 z-40 flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        >
          <ChevronUp className="w-4 h-4" />
          <span className="text-sm font-medium">Statut</span>
        </button>
      )}

      <AnimatePresence>
        {hasSideContent && isDrawerOpen && (
          <>
            <motion.div
              className="md:hidden fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
            />
            <motion.div
              className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between rounded-t-2xl">
                <div className="w-10 h-1 bg-gray-300 rounded-full absolute left-1/2 -translate-x-1/2 top-2" />
                <span className="text-sm font-semibold text-gray-900 mt-2">Statut du traitement</span>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors mt-2"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {state.isProcessing && <ProcessingStatus />}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
