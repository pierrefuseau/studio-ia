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
      console.log('🚀 === DÉBUT ENVOI WEBHOOK N8N ===');
      console.log('📋 Payload reçu:', {
        treatmentType: payload.treatmentType,
        client: payload.productData.name || 'Client Anonyme',
        commentaire: payload.productData.description || 'Aucun commentaire',
        hasImageFiles: payload.productData.imageFiles?.length || 0,
        hasSingleImageFile: payload.productData.imageFile ? 1 : 0,
        hasImageUrl: payload.productData.imageUrl ? 1 : 0
      });

      // Préparer les URLs des images
      let imageUrls: string[] = [];
      
      // Si plusieurs fichiers
      if (payload.productData.imageFiles && payload.productData.imageFiles.length > 0) {
        console.log('📁 Mode MULTIPLE FILES détecté:', payload.productData.imageFiles.length, 'fichiers');
        imageUrls = payload.productData.imageFiles.map((file, index) => 
          const url = `https://bolt-files/${file.name || `image_${index}.jpg`}`;
          console.log(`  📄 Fichier ${index + 1}:`, {
            name: file.name,
            size: file.size,
            type: file.type,
            url: url
          });
          return url;
        );
      }
      // Si un seul fichier
      else if (payload.productData.imageFile) {
        console.log('📄 Mode SINGLE FILE détecté:', {
          name: payload.productData.imageFile.name,
          size: payload.productData.imageFile.size,
          type: payload.productData.imageFile.type
        });
        imageUrls = [`https://bolt-files/${payload.productData.imageFile.name || 'image.jpg'}`];
      }
      // Si URL d'image
      else if (payload.productData.imageUrl) {
        console.log('🔗 Mode IMAGE URL détecté:', payload.productData.imageUrl);
        imageUrls = [payload.productData.imageUrl];
      }
      
      console.log('🖼️ URLs d\'images générées:', imageUrls);
      
      // Construire le JSON exact comme spécifié
      const jsonPayload = {
        client: payload.productData.name || 'Client Anonyme',
        commentaire: payload.productData.description || 'Aucun commentaire',
        treatmentType: payload.treatmentType,
        images: imageUrls
      };

      console.log('📤 JSON final à envoyer:', JSON.stringify(jsonPayload, null, 2));
      console.log('🌐 URL webhook:', this.webhookUrl);

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        body: JSON.stringify(jsonPayload),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('📡 Réponse HTTP:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur réponse:', errorText);
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Réponse n8n:', result);
      console.log('🎉 === ENVOI RÉUSSI ===');
      
      return true;
    } catch (error) {
      console.error('💥 === ERREUR WEBHOOK N8N ===');
      console.error('❌ Détails:', error);
      console.error('📍 Stack:', error instanceof Error ? error.stack : 'Pas de stack');
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