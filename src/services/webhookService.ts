import { WebhookPayload } from '../types';

export class WebhookService {
  private static instance: WebhookService;
  private webhookUrl = 'https://n8n.sn/v7f8298/webhook/image-upload';

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

      // Créer une URL temporaire pour l'image
      let imageUrl = '';
      if (payload.productData.imageFile instanceof File) {
        imageUrl = URL.createObjectURL(payload.productData.imageFile);
      } else if (payload.productData.imageUrl) {
        imageUrl = payload.productData.imageUrl;
      }

      // Préparer le payload JSON avec le format exact demandé
      const jsonPayload = {
        client: payload.productData.name || '',
        commentaire: payload.productData.description || '',
        treatmentType: payload.treatmentType || '',
        productName: payload.productData.name || '',
        productDescription: payload.productData.description || '',
        productPromotion: payload.productData.promotion || '',
        images: imageUrl ? [imageUrl] : []
      };

      console.log('📤 Payload JSON envoyé:', jsonPayload);

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(jsonPayload)
      });

      // Nettoyer l'URL temporaire
      if (imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imageUrl);
      }

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Réponse n8n JSON:', result);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur webhook JSON n8n:', error);
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
      console.log('🚀 Envoi batch JSON vers n8n:', payload);

      // Créer des URLs temporaires pour les images
      const imageUrls = payload.images.map(file => URL.createObjectURL(file));

      // Préparer le payload JSON avec le format exact demandé
      const jsonPayload = {
        client: payload.productData.name || '',
        commentaire: payload.productData.description || '',
        treatmentType: payload.treatmentType || '',
        productName: payload.productData.name || '',
        productDescription: payload.productData.description || '',
        productPromotion: payload.productData.promotion || '',
        images: imageUrls
      };

      console.log('📤 Payload batch JSON envoyé:', jsonPayload);

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(jsonPayload)
      });

      // Nettoyer les URLs temporaires
      imageUrls.forEach(url => URL.revokeObjectURL(url));
      
      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Réponse n8n batch JSON:', result);
      
      return true;
    } catch (error) {
      console.error('❌ Erreur webhook batch JSON n8n:', error);
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
  'https://n8n.sn/v7f8298/webhook/image-upload'
);