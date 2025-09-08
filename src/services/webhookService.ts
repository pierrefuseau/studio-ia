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
        imageCount: payload.images?.length || 0,
        client: payload.client,
        commentaire: payload.commentaire
      });

      // Préparer le payload JSON selon le format spécifié
      const jsonPayload = {
        client: payload.client || payload.productData.name || 'Client Anonyme',
        commentaire: payload.commentaire || payload.productData.description || 'Aucun commentaire',
        treatmentType: payload.treatmentType,
        images: payload.images || []
      };

      console.log('📤 Payload JSON envoyé:', jsonPayload);

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
        client: 'Test Client',
        commentaire: 'Test de connexion webhook',
        productData: {
          name: 'Test Connection',
          description: 'Test de connexion webhook'
        },
        timestamp: new Date().toISOString(),
        sessionId: 'test-' + Date.now(),
        images: ['https://example.com/test-image.jpg']
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