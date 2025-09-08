import { WebhookPayload } from '../types';

export class WebhookService {
  private static instance: WebhookService;
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl;
  }

  static getInstance(webhookUrl: string): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService(webhookUrl);
    }
    return WebhookService.instance;
  }

  async sendTreatmentRequest(payload: WebhookPayload): Promise<boolean> {
    try {
      console.log('🚀 Envoi vers n8n webhook:', {
        treatmentType: payload.treatmentType,
        productName: payload.productData.name,
        hasImage: !!payload.productData.imageFile
      });

      // Préparer les données pour n8n
      const formData = new FormData();
      
      // Type de traitement - CRITIQUE pour la redirection n8n
      formData.append('treatmentType', payload.treatmentType);
      
      // Informations détaillées du traitement
      switch (payload.treatmentType) {
        case 'background-removal':
          formData.append('treatmentName', 'Détourage Studio');
          formData.append('treatmentCategory', 'detourage');
          break;
        case 'scene-composition':
          formData.append('treatmentName', 'Mise en Situation');
          formData.append('treatmentCategory', 'mise_en_situation');
          break;
        case 'magazine-layout':
          formData.append('treatmentName', 'Page de Flyer promo A4');
          formData.append('treatmentCategory', 'magazine');
          break;
        default:
          formData.append('treatmentName', 'Traitement Inconnu');
          formData.append('treatmentCategory', 'unknown');
      }
      
      // Données de base
      formData.append('timestamp', payload.timestamp);
      formData.append('sessionId', payload.sessionId);
      
      // Données produit
      if (payload.productData.name) {
        formData.append('productName', payload.productData.name);
      }
      if (payload.productData.code) {
        formData.append('productCode', payload.productData.code);
      }
      if (payload.productData.description) {
        formData.append('productDescription', payload.productData.description);
      }
      
      // Toujours envoyer le champ promotion, même vide, pour le traitement magazine
      if (payload.treatmentType === 'magazine-layout') {
        formData.append('productPromotion', payload.productData.promotion || '');
      } else if (payload.productData.promotion) {
        formData.append('productPromotion', payload.productData.promotion);
      }
      
      // Image (si c'est un File)
      if (payload.productData.imageFile instanceof File) {
        formData.append('productImage', payload.productData.imageFile);
        formData.append('originalFileName', payload.productData.imageFile.name);
      } else if (payload.productData.imageUrl) {
        formData.append('productImageUrl', payload.productData.imageUrl);
      }
      
      // Paramètres spécifiques au traitement
      if (payload.treatmentParams?.situationPrompt) {
        formData.append('situationPrompt', payload.treatmentParams.situationPrompt);
      }
      if (payload.treatmentParams?.magazineContent) {
        formData.append('magazineContent', payload.treatmentParams.magazineContent);
      }
      
      // Paramètres batch
      if (payload.treatmentParams?.batchMode) {
        formData.append('batchMode', 'true');
        formData.append('batchIndex', payload.treatmentParams.batchIndex?.toString() || '0');
        formData.append('batchTotal', payload.treatmentParams.batchTotal?.toString() || '1');
        formData.append('batchSessionId', payload.treatmentParams.batchSessionId || '');
      }

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Réponse n8n:', result);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur webhook n8n:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const testPayload: WebhookPayload = {
        treatmentType: 'test',
        productData: {
          name: 'Test Connection',
          description: 'Test de connexion webhook'
        },
        timestamp: new Date().toISOString(),
        sessionId: 'test-' + Date.now()
      };

      return await this.sendTreatmentRequest(testPayload);
    } catch (error) {
      console.error('❌ Test connexion échoué:', error);
      return false;
    }
  }
}

export const webhookService = WebhookService.getInstance(
  '/api/n8n-webhook'
);