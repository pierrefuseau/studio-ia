import { WebhookPayload } from '../types';

export class WebhookService {
  private static instance: WebhookService;
  private webhookUrl = '/api/n8n-webhook';

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
      console.log('🚀 Envoi JSON vers n8n webhook:', payload);

      // Préparer FormData pour l'envoi
      const formData = new FormData();
      formData.append('client', payload.productData.name || '');
      formData.append('commentaire', payload.productData.description || '');
      formData.append('treatmentType', payload.treatmentType || '');
      formData.append('productName', payload.productData.name || '');
      formData.append('productDescription', payload.productData.description || '');
      formData.append('productPromotion', payload.productData.promotion || '');
      
      // Ajouter l'image si elle existe
      if (payload.productData.imageFile instanceof File) {
        formData.append('images', payload.productData.imageFile);
      }

      console.log('📤 FormData envoyé vers n8n');

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.text();
      console.log('✅ Réponse n8n:', result);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur webhook n8n:', error);
      return false;
    }
  }

  async sendBatchTreatmentRequest(payload: {
    treatmentType?: string;
    productData: {
      name?: string;
      code?: string;
      description?: string;
      promotion?: string;
    };
    images: File[];
  }): Promise<boolean> {
    try {
      console.log('🚀 Envoi batch vers n8n:', payload);

      // Préparer FormData pour l'envoi batch
      const formData = new FormData();
      formData.append('client', payload.productData.name || '');
      formData.append('commentaire', payload.productData.description || '');
      formData.append('treatmentType', payload.treatmentType || '');
      formData.append('productName', payload.productData.name || '');
      formData.append('productDescription', payload.productData.description || '');
      formData.append('productPromotion', payload.productData.promotion || '');
      
      // Ajouter toutes les images
      payload.images.forEach((file, index) => {
        formData.append('images', file);
      });

      console.log('📤 FormData batch envoyé vers n8n');

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.text();
      console.log('✅ Réponse n8n batch:', result);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur webhook batch n8n:', error);
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