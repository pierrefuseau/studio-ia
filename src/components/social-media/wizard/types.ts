import type { PlatformId, ToneId, CategoryId, SocialMediaState } from '../../../types';

export interface PlatformConfig {
  id: PlatformId;
  label: string;
  icon: string;
  charLimit: number;
  color: string;
}

export interface ToneConfig {
  id: ToneId;
  label: string;
  emoji: string;
  description: string;
}

export interface CategoryConfig {
  id: CategoryId;
  label: string;
  emoji: string;
  description: string;
}

export const PLATFORMS: PlatformConfig[] = [
  { id: 'linkedin', label: 'LinkedIn', icon: 'linkedin', charLimit: 3000, color: '#0077B5' },
  { id: 'instagram', label: 'Instagram', icon: 'instagram', charLimit: 2200, color: '#E4405F' },
  { id: 'facebook', label: 'Facebook', icon: 'facebook', charLimit: 63206, color: '#1877F2' },
  { id: 'tiktok', label: 'TikTok', icon: 'tiktok', charLimit: 2200, color: '#000000' },
  { id: 'x', label: 'X', icon: 'x', charLimit: 280, color: '#000000' },
  { id: 'hellowork', label: 'Hellowork', icon: 'hellowork', charLimit: 3000, color: '#00D4AA' },
];

export const ENTREPRISES = [
  'FUSEAU',
  'DELICES AGRO',
  "C'Propre",
  'Xavier',
  'TRESORS DE CHEFS',
] as const;

export const TONES: ToneConfig[] = [
  { id: 'professionnel', label: 'Professionnel', emoji: '\uD83D\uDC54', description: 'Ton corporate et serieux' },
  { id: 'decontracte', label: 'Decontracte', emoji: '\u270C\uFE0F', description: 'Ton leger et accessible' },
  { id: 'inspirant', label: 'Inspirant', emoji: '\u2728', description: 'Ton motivant et positif' },
  { id: 'humoristique', label: 'Humoristique', emoji: '\uD83D\uDE04', description: 'Ton drole et decale' },
  { id: 'promotionnel', label: 'Promotionnel', emoji: '\uD83D\uDCE2', description: 'Ton commercial et vendeur' },
  { id: 'informatif', label: 'Informatif', emoji: '\uD83D\uDCDA', description: 'Ton educatif et factuel' },
];

export const CATEGORIES: CategoryConfig[] = [
  { id: 'nouveau-produit', label: 'Nouveau produit', emoji: '\uD83C\uDD95', description: 'Lancement ou presentation de produit' },
  { id: 'recette', label: 'Recette', emoji: '\uD83D\uDC68\u200D\uD83C\uDF73', description: 'Recette ou utilisation culinaire' },
  { id: 'evenement', label: 'Evenement', emoji: '\uD83C\uDF89', description: 'Salon, conference ou evenement' },
  { id: 'promotion', label: 'Promotion', emoji: '\uD83C\uDF81', description: 'Offre speciale ou reduction' },
  { id: 'engagement', label: 'Engagement', emoji: '\uD83C\uDF31', description: 'RSE, environnement, valeurs' },
  { id: 'coulisses', label: 'Coulisses', emoji: '\uD83C\uDFAC', description: 'Behind the scenes, equipe' },
  { id: 'temoignage', label: 'Temoignage', emoji: '\uD83D\uDCAC', description: 'Avis client ou partenaire' },
  { id: 'conseil', label: 'Conseil', emoji: '\uD83D\uDCA1', description: 'Astuce ou conseil professionnel' },
  { id: 'actualite', label: 'Actualite', emoji: '\uD83D\uDCF0', description: 'News du secteur ou de l\'entreprise' },
];

export const INITIAL_SOCIAL_MEDIA_STATE: SocialMediaState = {
  entreprise: '',
  platforms: [],
  postType: 'generique',
  tone: 'professionnel',
  category: '',
  textePersonnalise: '',
  url: '',
  uploadedFiles: [],
};
