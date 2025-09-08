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
        client: payload.productData.name,
        hasImages: payload.productData.imageFiles?.length || (payload.productData.imageFile ? 1 : 0)
      });

      // Préparer les URLs des images
      let imageUrls: string[] = [];
      
      // Si plusieurs fichiers
      if (payload.productData.imageFiles && payload.productData.imageFiles.length > 0) {
        imageUrls = payload.productData.imageFiles.map((file, index) => 
          `https://bolt-files/${file.name || `image_${index}.jpg`}`
        );
      }
      // Si un seul fichier
      else if (payload.productData.imageFile) {
        imageUrls = [`https://bolt-files/${payload.productData.imageFile.name || 'image.jpg'}`];
      }
      // Si URL d'image
      else if (payload.productData.imageUrl) {
        imageUrls = [payload.productData.imageUrl];
      }
      
      // Construire le JSON exact comme spécifié
      const jsonPayload = {
        client: payload.productData.name || 'Client Anonyme',
        commentaire: payload.productData.description || 'Aucun commentaire',
        treatmentType: payload.treatmentType,
        images: imageUrls
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        body: JSON.stringify(jsonPayload),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ JSON envoyé à n8n:', jsonPayload);
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