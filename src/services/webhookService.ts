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

      // TOUJOURS préparer un tableau de fichiers à convertir
      let filesToConvert: File[] = [];
      
      // Récupérer TOUS les fichiers dans un tableau
      if (payload.productData.imageFiles && payload.productData.imageFiles.length > 0) {
        console.log('📁 Fichiers multiples détectés:', payload.productData.imageFiles.length, 'fichiers');
        filesToConvert = payload.productData.imageFiles;
      }
      // Si un seul fichier, le mettre dans un tableau
      else if (payload.productData.imageFile) {
        console.log('📄 Fichier unique détecté, ajout au tableau');
        filesToConvert = [payload.productData.imageFile];
      }
      else {
        console.log('❌ Aucun fichier à traiter');
        throw new Error('Aucun fichier image fourni');
      }
      
      // Log détaillé de tous les fichiers
      console.log('📦 Fichiers à traiter:', filesToConvert.length);
      filesToConvert.forEach((file, index) => {
        console.log(`  📄 Fichier ${index + 1}:`, {
          name: file.name,
          size: file.size,
          type: file.type
        });
      });
      
      console.log('🔄 Conversion en Base64 (sans préfixe) de', filesToConvert.length, 'fichier(s)...');
      
      // Convertir TOUS les fichiers en Base64 pur (sans préfixe)
      const imagesBase64 = await Promise.all(filesToConvert.map(toB64));
      
      console.log('✅ Conversion terminée:', {
        nombreImages: imagesBase64.length,
        taillesBase64: imagesBase64.map(b64 => `${Math.round(b64.length / 1024)}KB`)
      });
      
      // Construire le payload JSON avec le tableau imagesBase64
      const jsonPayload = {
        client: payload.productData.name || 'Client Anonyme',
        commentaire: payload.productData.description || 'Aucun commentaire',
        treatmentType: payload.treatmentType,
        imagesBase64: imagesBase64
      };
      
      console.log('📤 JSON final à envoyer:', {
        client: jsonPayload.client,
        commentaire: jsonPayload.commentaire,
        treatmentType: jsonPayload.treatmentType,
        nombreImagesBase64: jsonPayload.imagesBase64.length
      });
      console.log('🌐 URL webhook:', this.webhookUrl);

      // Envoi POST vers n8n
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
      console.log('🎉 === ENVOI TABLEAU IMAGES RÉUSSI ===');
      
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