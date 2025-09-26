import React, { useState } from 'react';
import { ChevronLeft, Camera, ImagePlus, FileText, Share2 } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { UploadZone } from './UploadZone';
import { ProductForm } from './ProductForm';
import { ProcessingStatus } from './ProcessingStatus';
import { useToast } from './ui/Toast';
import { webhookService } from '../services/webhookService';
import { WebhookPayload } from '../types';

export function TreatmentWorkspace() {
  const { state, dispatch } = useApp();
  const { addToast } = useToast();

  const handleBack = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 'hero' });
    dispatch({ type: 'SELECT_TREATMENT_TYPE', payload: '' });
  };

  const getTreatmentConfig = () => {
    switch (state.selectedTreatmentType) {
      case 'background-removal':
        return {
          name: 'Détourage Studio',
          description: 'Créez un packshot professionnel sur fond blanc',
          icon: <Camera className="w-5 h-5" />,
          fields: []
        };
      case 'scene-composition':
        return {
          name: 'Mise en situation Packaging',
          description: 'Intégrez votre packaging dans un environnement réaliste',
          icon: <ImagePlus className="w-5 h-5" />,
          fields: [
            {
              key: 'situationPrompt',
              label: 'Description de l\'environnement',
              placeholder: 'Ex: Dans un salon moderne, sur une table en bois, avec une lumière naturelle douce...',
              type: 'textarea'
            }
          ]
        };
      case 'product-scene':
        return {
          name: 'Mise en situation Produit Brut',
          description: 'Intégrez votre produit brut dans un environnement personnalisé',
          icon: <ImagePlus className="w-5 h-5" />,
          fields: [
            {
              key: 'productName', 
              label: 'Nom du produit',
              placeholder: 'Ex: Chaise ergonomique, Gamme mobilier bureau...',
              type: 'input'
            },
            {
              key: 'situationDescription',
              label: 'Quelle mise en situation ?',
              placeholder: 'Ex: Dans un bureau moderne avec éclairage naturel, sur un parquet en chêne, ambiance cosy et professionnelle...',
              type: 'textarea'
            }
          ]
        };
      case 'social-pack':
        return {
          name: 'Pack Social Media',
          description: 'Formats optimisés pour les réseaux sociaux',
          icon: <Share2 className="w-5 h-5" />,
          fields: []
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

    // Préparer le payload pour n8n
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
      title: 'Traitement lancé',
      description: 'Votre demande est en cours de traitement'
    });
    
    dispatch({ type: 'START_PROCESSING' });

    try {
      const success = await webhookService.sendTreatmentRequest(payload);
      
      if (success) {
        addToast({
          type: 'success',
          title: 'Traitement envoyé',
          description: 'Votre demande a été transmise avec succès'
        });
      } else {
        throw new Error('Échec de l\'envoi');
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
    // Réinitialiser aussi le traitement en cours si nécessaire
    if (state.isProcessing) {
      // Arrêter le traitement en cours
      // Note: Dans une vraie app, il faudrait annuler la requête HTTP
    }
  };

  const config = getTreatmentConfig();
  if (!config) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb simple */}
        <button 
          onClick={handleBack} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Retour</span>
        </button>

        {/* Titre du traitement */}
        <div className="flex items-center gap-3 mb-8">
          <div className="text-gray-600">
            {config.icon}
          </div>
          <div>
            <h2 className="text-2xl font-light text-gray-900">
              {config.name}
            </h2>
            <p className="text-sm text-gray-500">
              {config.description}
            </p>
          </div>
        </div>

        {/* Layout en 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Upload et formulaire */}
          <div className="lg:col-span-2 space-y-6">
            <UploadZone />
            {state.selectedTreatmentType !== 'background-removal' && (
              <ProductForm treatmentType={state.selectedTreatmentType} />
            )}
          </div>

          {/* Colonne droite - Actions et preview */}
          <div className="space-y-6">
            {/* État de traitement */}
            {state.isProcessing && <ProcessingStatus />}
          </div>
        </div>
      </div>
    </div>
  );
}