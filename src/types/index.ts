// Types de base pour l'application
export interface Product {
  id: string;
  name?: string;
  code?: string;
  description?: string;
  promotion?: string;
  image?: File | string;
  imageUrl?: string;
}

export interface Treatment {
  id: string;
  name: string;
  description: string;
  icon: string;
  badge?: string;
  enabled: boolean;
  options?: Record<string, any>;
}

export interface ProcessingJob {
  id: string;
  productId: string;
  treatments: Treatment[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: ProcessingResult[];
  createdAt: Date;
}

export interface ProcessingResult {
  id: string;
  treatmentId: string;
  imageUrl: string;
  metadata: {
    width: number;
    height: number;
    size: number;
    format: string;
  };
}

export type Theme = 'light' | 'dark';

export interface AppState {
  theme: Theme;
  product: Product | null;
  treatments: Treatment[];
  jobs: ProcessingJob[];
  isProcessing: boolean;
  webhookConfig: WebhookConfig;
}

export interface WebhookConfig {
  url: string;
  token?: string;
  enabled: boolean;
}

export interface WebhookPayload {
  treatmentType: string;
  treatmentDisplayName?: string;
  client?: string;
  commentaire?: string;
  productData: {
    name?: string;
    code?: string;
    description?: string;
    promotion?: string;
    imageUrl?: string;
    imageFile?: File;
    originalFileName?: string;
    imageFiles?: Array<{
      file: File;
      originalName: string;
      id: string;
      url?: string;
    }>;
  };
  treatmentParams?: {
    situationPrompt?: string;
    magazineContent?: string;
    batchMode?: boolean;
    batchIndex?: number;
    batchTotal?: number;
    batchSessionId?: string;
  };
  timestamp: string;
  sessionId: string;
  images?: string[];
}