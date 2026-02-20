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
  currentStep: 'hero' | 'treatment';
}

export interface WebhookConfig {
  url: string;
  token?: string;
  enabled: boolean;
}

export type BackgroundOption = 'white' | 'black' | 'transparent';

export interface WebhookPayload {
  treatmentType: string;
  treatmentDisplayName?: string;
  backgroundOption?: BackgroundOption;
  productData: {
    name?: string;
    code?: string;
    description?: string;
    promotion?: string;
    imageFiles?: File[];
    originalFileName?: string;
  };
  treatmentParams?: {
    situationPrompt?: string;
    magazineContent?: string;
  };
  timestamp: string;
  sessionId: string;
}

export type PlatformId = 'linkedin' | 'tiktok' | 'instagram' | 'facebook' | 'x' | 'hellowork';
export type ToneId = 'professionnel' | 'decontracte' | 'inspirant' | 'humoristique' | 'promotionnel' | 'informatif';
export type PostType = 'personnalise' | 'generique';
export type CategoryId = 'nouveau-produit' | 'recette' | 'evenement' | 'promotion' | 'engagement' | 'coulisses' | 'temoignage' | 'conseil' | 'actualite';

export interface SocialMediaState {
  entreprise: string;
  platforms: PlatformId[];
  postType: PostType;
  tone: ToneId;
  category: CategoryId | '';
  textePersonnalise: string;
  url: string;
  uploadedFiles: UploadedFile[];
}

export interface GeneratedPost {
  network: PlatformId;
  content: string;
  image?: string;
  hashtags?: string[];
  entreprise?: string;
}

export interface SocialMediaApiResponse {
  post?: string;
  response?: string;
  image?: string;
  imageUrl?: string;
}