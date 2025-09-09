import { WebhookPayload } from '../types';

// Fonction utilitaire pour convertir un fichier en base64 pur (sans préfixe)
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
      console.log('🚀 === DÉBUT ENVOI MULTI-UPLOAD WEBHOOK N8N ===');

      // 📂 Collecte de TOUS les fichiers dans un tableau
      let filesToConvert: File[] = [];
      
      if (payload.productData.imageFiles?.length) {
        // 📂 Multi-images
        filesToConvert = payload.productData.imageFiles;
        console.log('📁 Multi-images:', filesToConvert.length, 'fichiers');
      } else if (payload.productData.imageFile) {
        // 📂 Single image fallback
        filesToConvert = [payload.productData.imageFile];
        console.log('📁 Single image fallback');
      } else {
        throw new Error('Aucun fichier image fourni');
      }
      
      // ⚡ Conversion de TOUS les fichiers en Base64 pur
      const imagesBase64 = await Promise.all(filesToConvert.map(toB64));
      
      // 🚀 PAYLOAD JSON FINAL
      const jsonPayload = {
        client: 'Studio Produit',
        productName: payload.productData.name || '',
        productDescription: payload.productData.description || '',
        treatmentType: payload.treatmentType,
        imagesBase64: imagesBase64,   // ⚡ tableau complet d'images en base64
        originalFileNames: filesToConvert.map(file => file.name)  // 📝 noms des fichiers originaux
      };
      
      console.log('📤 JSON final à envoyer:', {
        productName: jsonPayload.productName,
        productDescription: jsonPayload.productDescription,
        treatmentType: jsonPayload.treatmentType,
        imagesCount: jsonPayload.imagesBase64.length,
        fileNames: jsonPayload.originalFileNames
      });
      
      console.log('📤 Envoi vers n8n:', {
        productName: jsonPayload.productName,
        productDescription: jsonPayload.productDescription,
        treatmentType: jsonPayload.treatmentType,
        imagesCount: jsonPayload.imagesBase64.length,
        originalFiles: jsonPayload.originalFileNames
      });

      // 📡 Envoi POST vers n8n
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

      console.log('✅ === MULTI-UPLOAD RÉUSSI ===');
      
      return true;
    } catch (error) {
      console.error('❌ Erreur Webhook n8n:', error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const testPayload: WebhookPayload = {
        treatmentType: 'test',
        productData: {
          name: 'Produit Test',
          description: 'Description test pour connexion webhook'
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