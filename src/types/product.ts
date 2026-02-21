export type Marque = 'FUSEAU' | 'DELICES AGRO' | "C'PROPRE" | '';

export type Gamme =
  | 'Chocolats'
  | 'Farines & Amidons'
  | 'Cremes & Beurres'
  | 'Fruits & Purees'
  | 'Epices & Aromes'
  | 'Sucres & Edulcorants'
  | 'Levures & Agents levants'
  | 'Huiles & Graisses'
  | 'Fruits secs & Oleagineux'
  | 'Produits laitiers'
  | 'Oeufs & Ovoproduits'
  | 'Gelatines & Gelifiants'
  | 'Colorants & Decorations'
  | 'Snacking'
  | 'Boulangerie'
  | 'Patisserie'
  | '';

export type RecipeStyle =
  | 'auto'
  | 'patisserie'
  | 'boulangerie'
  | 'restauration'
  | 'snacking'
  | 'glacerie'
  | 'confiserie'
  | 'chocolaterie';

export type Difficulte = 1 | 2 | 3;

export interface AllergenSelection {
  id: string;
  selected: boolean;
  traces: boolean;
}

export interface NutritionValues {
  energieKJ: string;
  energieKcal: string;
  matieresGrasses: string;
  acidesGrasSatures: string;
  glucides: string;
  sucres: string;
  proteines: string;
  sel: string;
  fibres: string;
}

export interface ProductFormData {
  marque: Marque;
  nomProduit: string;
  referenceInterne: string;
  codeEAN: string;
  gamme: Gamme;
  photoFile: File | null;
  photoPreview: string;

  pdfFile: File | null;
  pdfBase64: string;
  pdfFileName: string;

  poidsNet: string;
  conditionnement: string;
  ingredients: string;
  allergenes: AllergenSelection[];
  nutritionValues: NutritionValues;
  dlcDluo: string;
  conservation: string;
  origine: string;
  certifications: string[];
  descriptionLibre: string;

  styleRecette: RecipeStyle;
  difficulte: Difficulte;
  portions: number;
  notesRecette: string;
  formatProfessionnel: boolean;
}

export interface GeneratedProduct {
  accroche: string;
  description: string;
  arguments: string[];
  utilisations: string[];
  profilAromatique: string;
  conseilUtilisation: string;
}

export interface RecipeIngredient {
  nom: string;
  quantite: string;
  isVedette: boolean;
}

export interface RecipeStep {
  numero: number;
  titre: string;
  description: string;
}

export interface GeneratedRecipe {
  nom: string;
  description: string;
  portions: string;
  tempsPreparation: string;
  tempsCuisson: string;
  difficulte: number;
  ingredients: RecipeIngredient[];
  etapes: RecipeStep[];
  motDuChef: string;
  variantes: string[];
}

export interface FicheApiResponse {
  success: boolean;
  product: GeneratedProduct;
  recipe: GeneratedRecipe;
  recipeImageBase64: string;
}

export interface FicheHistoryItem {
  id: string;
  formData: Omit<ProductFormData, 'photoFile'>;
  generatedContent: FicheApiResponse;
  createdAt: string;
  photoPreview: string;
}

export type FicheModuleView = 'new' | 'generating' | 'result' | 'history' | 'settings';

export interface FicheModuleState {
  currentView: FicheModuleView;
  formData: ProductFormData;
  generatedContent: FicheApiResponse | null;
  editedContent: {
    product: GeneratedProduct | null;
    recipe: GeneratedRecipe | null;
  };
  history: FicheHistoryItem[];
  webhookUrl: string;
  isGenerating: boolean;
  generationError: string | null;
}
