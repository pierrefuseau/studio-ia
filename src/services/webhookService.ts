import { WebhookPayload } from '../types';

const toB64 = (file: File): Promise<string> =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.readAsDataURL(file);
  });

export interface WebhookResponse {
  success: boolean;
  imageBase64?: string;
  mimeType?: string;
  fileName?: string;
  treatmentType?: string;
  backgroundOption?: string;
  transparentRequested?: boolean;
  chromaKeyColor?: string;
  error?: string;
}

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

  async sendTreatmentRequest(payload: WebhookPayload): Promise<WebhookResponse> {
    try {
      console.log('🚀 === DÉBUT ENVOI MULTI-UPLOAD WEBHOOK N8N ===');

      let filesToConvert: File[] = [];

      if (payload.productData.imageFiles?.length) {
        filesToConvert = payload.productData.imageFiles;
        console.log('📁 Multi-images:', filesToConvert.length, 'fichiers');
      } else {
        throw new Error('Aucun fichier image fourni');
      }

      const imagesBase64 = await Promise.all(filesToConvert.map(toB64));

      const jsonPayload = {
        client: 'Studio Produit',
        productName: payload.productData.name || '',
        productDescription: payload.productData.description || '',
        treatmentType: payload.treatmentType,
        backgroundOption: payload.backgroundOption || 'white',
        imagesBase64: imagesBase64,
        originalFileNames: filesToConvert.map(file => file.name),
        situationDescription: payload.treatmentParams?.situationPrompt || payload.productData.description || ''
      };

      console.log('📤 JSON final à envoyer:', {
        productName: jsonPayload.productName,
        treatmentType: jsonPayload.treatmentType,
        imagesCount: jsonPayload.imagesBase64.length,
        fileNames: jsonPayload.originalFileNames,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      let response: Response;
      try {
        response = await fetch(this.webhookUrl, {
          method: 'POST',
          body: JSON.stringify(jsonPayload),
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        return { success: false, error: `Erreur HTTP: ${response.status}` };
      }

      const data: WebhookResponse = await response.json();
      console.log('✅ === RÉPONSE REÇUE ===', { success: data.success, fileName: data.fileName });
      return data;

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('❌ Erreur Webhook n8n:', error);
      if (message.toLowerCase().includes('abort')) {
        return { success: false, error: 'Délai dépassé : la génération a pris trop longtemps' };
      }
      return { success: false, error: `Erreur réseau : ${message}` };
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

      const result = await this.sendTreatmentRequest(testPayload);
      return result.success;
    } catch (error) {
      console.error('❌ Test connexion échoué:', error);
      return false;
    }
  }
}

export const webhookService = WebhookService.getInstance(
  'https://n8n.srv778298.hstgr.cloud/webhook/fb09047a-1a80-44e7-833a-99fe0eda3266'
);
