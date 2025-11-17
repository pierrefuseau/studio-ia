// Types de base pour l'application
export interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  name?: string;
  description?: string;
  code?: string;
  promotion?: string;
}

export interface Product {
  id: string;
  name?: string;
  code?: string;
  description?: string;
  promotion?: string;
  image?: File | string;
  imageUrl?: string;
  images?: File[];
  imageUrls?: string[];
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
  products: UploadedFile[];
  selectedProduct: UploadedFile | null;
  product: Product | null;
  treatments: Treatment[];
  jobs: ProcessingJob[];
  isProcessing: boolean;
  webhookConfig: WebhookConfig;
  selectedTreatmentType: string | null;
  currentStep: 'hero' | 'treatment' | 'gallery';
  history: HistoryItem[];
  currentProgress?: ProcessingProgress;
}

export interface WebhookConfig {
  url: string;
  token?: string;
  enabled: boolean;
}

export interface WebhookPayload {
  treatmentType: string;
  treatmentDisplayName?: string;
  productData: {
    name?: string;
    code?: string;
    description?: string;
    promotion?: string;
    imageFiles?: File[];
    imageFile?: File;
    originalFileName?: string;
  };
  treatmentParams?: {
    situationPrompt?: string;
    magazineContent?: string;
  };
  timestamp: string;
  sessionId: string;
}

// Types pour l'historique et la galerie
export interface HistoryItem {
  id: string;
  productName: string;
  productDescription?: string;
  treatmentType: string;
  treatmentDisplayName: string;
  originalImageUrl: string;
  originalImageName: string;
  processedImageUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  completedAt?: string;
  error?: string;
  metadata?: {
    fileSize: number;
    dimensions: { width: number; height: number };
    format: string;
  };
}

// Types pour la validation d'images
export interface ImageValidationResult {
  isValid: boolean;
  errors: ImageValidationError[];
  warnings: ImageValidationWarning[];
  suggestions: string[];
}

export interface ImageValidationError {
  type: 'size' | 'dimension' | 'format' | 'quality';
  message: string;
  value?: number;
  limit?: number;
}

export interface ImageValidationWarning {
  type: 'size' | 'dimension' | 'quality' | 'aspect-ratio';
  message: string;
  value?: number;
  recommended?: number;
}

// Configuration de validation
export interface ImageValidationConfig {
  maxSizeInMB: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  allowedFormats: string[];
  recommendedAspectRatio?: number;
}

// Types pour le suivi en temps réel
export interface ProcessingProgress {
  jobId: string;
  status: 'queued' | 'uploading' | 'analyzing' | 'processing' | 'rendering' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  estimatedTimeRemaining?: number;
  message?: string;
}