import { WebhookPayload } from '../types';

// Fonction utilitaire pour convertir un fichier en base64
const toB64 = (file: File): Promise<string> =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.readAsDataURL(file);
  });

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
      });

      // Préparer les fichiers à convertir en base64
      let filesToConvert: File[] = [];
      
      // Si plusieurs fichiers
      if (payload.productData.imageFiles && payload.productData.imageFiles.length > 0) {
        console.log('📁 Mode MULTIPLE FILES détecté:', payload.productData.imageFiles.length, 'fichiers');
        filesToConvert = payload.productData.imageFiles;
        payload.productData.imageFiles.forEach((file, index) => {
          console.log(`  📄 Fichier ${index + 1}:`, {
            name: file.name,
            size: file.size,
            type: file.type
          });
        });
      }
      // Si un seul fichier
      else if (payload.productData.imageFile) {
        console.log('📄 Mode SINGLE FILE détecté:', {
          name: payload.productData.imageFile.name,
          size: payload.productData.imageFile.size,
          type: payload.productData.imageFile.type
        });
        filesToConvert = [payload.productData.imageFile];
      }
      else {
        console.log('⚠️ Aucun fichier à traiter');
        throw new Error('Aucun fichier image fourni');
      }
      
      console.log('🔄 Conversion en base64 de', filesToConvert.length, 'fichier(s)...');
      
      // Convertir tous les fichiers en base64
      const imagesBase64 = await Promise.all(filesToConvert.map(toB64));
      
      console.log('✅ Conversion terminée:', {
        nombreImages: imagesBase64.length,
        taillesBase64: imagesBase64.map(b64 => `${Math.round(b64.length / 1024)}KB`)
      });
      
      const jsonPayload = {
        client: payload.productData.name || 'Client Anonyme',
        commentaire: payload.productData.description || 'Aucun commentaire',
        treatmentType: payload.treatmentType,
        imagesBase64: imagesBase64
      };
      
      console.log('📤 JSON final à envoyer:', {
        ...jsonPayload,
        imagesBase64: `[${jsonPayload.imagesBase64.length} images base64]`
      });
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
  'https://n8n.srv778298.hstgr.cloud/webhook-test/fb09047a-1a80-44e7-833a-99fe0eda3266'
);