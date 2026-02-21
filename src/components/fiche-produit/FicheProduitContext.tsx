import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type {
  FicheModuleState,
  FicheModuleView,
  ProductFormData,
  FicheApiResponse,
  GeneratedProduct,
  GeneratedRecipe,
  FicheHistoryItem,
  AllergenSelection,
  NutritionValues,
  Difficulte,
  Marque,
  Gamme,
  RecipeStyle,
} from '../../types/product';
import { ALLERGENS } from '../../utils/allergenData';

const defaultNutrition: NutritionValues = {
  energieKJ: '', energieKcal: '', matieresGrasses: '', acidesGrasSatures: '',
  glucides: '', sucres: '', proteines: '', sel: '', fibres: '',
};

const defaultAllergens: AllergenSelection[] = ALLERGENS.map((a) => ({
  id: a.id, selected: false, traces: false,
}));

export const defaultFormData: ProductFormData = {
  marque: '', nomProduit: '', referenceInterne: '', codeEAN: '', gamme: '',
  photoFile: null, photoPreview: '',
  pdfFile: null, pdfBase64: '', pdfFileName: '',
  poidsNet: '', conditionnement: '', ingredients: '', allergenes: defaultAllergens,
  nutritionValues: defaultNutrition, dlcDluo: '', conservation: '', origine: '',
  certifications: [], descriptionLibre: '',
  styleRecette: 'auto', difficulte: 2, portions: 8, notesRecette: '',
  formatProfessionnel: true,
};

const initialState: FicheModuleState = {
  currentView: 'new',
  formData: defaultFormData,
  generatedContent: null,
  editedContent: { product: null, recipe: null },
  history: [],
  webhookUrl: '',
  isGenerating: false,
  generationError: null,
};

type Action =
  | { type: 'SET_VIEW'; payload: FicheModuleView }
  | { type: 'UPDATE_FORM'; payload: Partial<ProductFormData> }
  | { type: 'SET_FORM_FIELD'; payload: { field: keyof ProductFormData; value: unknown } }
  | { type: 'SET_ALLERGEN'; payload: { id: string; selected: boolean; traces: boolean } }
  | { type: 'SET_NUTRITION'; payload: Partial<NutritionValues> }
  | { type: 'TOGGLE_CERTIFICATION'; payload: string }
  | { type: 'START_GENERATION' }
  | { type: 'GENERATION_SUCCESS'; payload: FicheApiResponse }
  | { type: 'GENERATION_ERROR'; payload: string }
  | { type: 'UPDATE_EDITED_PRODUCT'; payload: Partial<GeneratedProduct> }
  | { type: 'UPDATE_EDITED_RECIPE'; payload: Partial<GeneratedRecipe> }
  | { type: 'SET_HISTORY'; payload: FicheHistoryItem[] }
  | { type: 'ADD_HISTORY_ITEM'; payload: FicheHistoryItem }
  | { type: 'DELETE_HISTORY_ITEM'; payload: string }
  | { type: 'SET_WEBHOOK_URL'; payload: string }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_FROM_HISTORY'; payload: FicheHistoryItem };

function reducer(state: FicheModuleState, action: Action): FicheModuleState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload, generationError: null };
    case 'UPDATE_FORM':
      return { ...state, formData: { ...state.formData, ...action.payload } };
    case 'SET_FORM_FIELD':
      return { ...state, formData: { ...state.formData, [action.payload.field]: action.payload.value } };
    case 'SET_ALLERGEN':
      return {
        ...state,
        formData: {
          ...state.formData,
          allergenes: state.formData.allergenes.map((a) =>
            a.id === action.payload.id
              ? { ...a, selected: action.payload.selected, traces: action.payload.traces }
              : a
          ),
        },
      };
    case 'SET_NUTRITION':
      return {
        ...state,
        formData: {
          ...state.formData,
          nutritionValues: { ...state.formData.nutritionValues, ...action.payload },
        },
      };
    case 'TOGGLE_CERTIFICATION': {
      const certs = state.formData.certifications;
      const has = certs.includes(action.payload);
      return {
        ...state,
        formData: {
          ...state.formData,
          certifications: has ? certs.filter((c) => c !== action.payload) : [...certs, action.payload],
        },
      };
    }
    case 'START_GENERATION':
      return { ...state, isGenerating: true, generationError: null, currentView: 'generating' };
    case 'GENERATION_SUCCESS':
      return {
        ...state,
        isGenerating: false,
        generatedContent: action.payload,
        editedContent: { product: { ...action.payload.product }, recipe: { ...action.payload.recipe } },
        currentView: 'result',
      };
    case 'GENERATION_ERROR':
      return { ...state, isGenerating: false, generationError: action.payload, currentView: 'new' };
    case 'UPDATE_EDITED_PRODUCT':
      return {
        ...state,
        editedContent: {
          ...state.editedContent,
          product: state.editedContent.product
            ? { ...state.editedContent.product, ...action.payload }
            : null,
        },
      };
    case 'UPDATE_EDITED_RECIPE':
      return {
        ...state,
        editedContent: {
          ...state.editedContent,
          recipe: state.editedContent.recipe
            ? { ...state.editedContent.recipe, ...action.payload }
            : null,
        },
      };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'ADD_HISTORY_ITEM':
      return { ...state, history: [action.payload, ...state.history] };
    case 'DELETE_HISTORY_ITEM':
      return { ...state, history: state.history.filter((h) => h.id !== action.payload) };
    case 'SET_WEBHOOK_URL':
      return { ...state, webhookUrl: action.payload };
    case 'RESET_FORM':
      return {
        ...state,
        formData: defaultFormData,
        generatedContent: null,
        editedContent: { product: null, recipe: null },
        currentView: 'new',
      };
    case 'LOAD_FROM_HISTORY': {
      const item = action.payload;
      return {
        ...state,
        formData: { ...item.formData, photoFile: null, photoPreview: item.photoPreview },
        generatedContent: item.generatedContent,
        editedContent: {
          product: { ...item.generatedContent.product },
          recipe: { ...item.generatedContent.recipe },
        },
        currentView: 'result',
      };
    }
    default:
      return state;
  }
}

interface FicheContextValue {
  state: FicheModuleState;
  dispatch: React.Dispatch<Action>;
  setField: (field: keyof ProductFormData, value: unknown) => void;
}

const FicheContext = createContext<FicheContextValue | null>(null);

export function FicheProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('fp-history');
      if (saved) dispatch({ type: 'SET_HISTORY', payload: JSON.parse(saved) });
      const url = localStorage.getItem('fp-webhook-url');
      if (url) dispatch({ type: 'SET_WEBHOOK_URL', payload: url });
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('fp-history', JSON.stringify(state.history));
    } catch { /* ignore */ }
  }, [state.history]);

  useEffect(() => {
    try {
      localStorage.setItem('fp-webhook-url', state.webhookUrl);
    } catch { /* ignore */ }
  }, [state.webhookUrl]);

  const setField = useCallback(
    (field: keyof ProductFormData, value: unknown) => {
      dispatch({ type: 'SET_FORM_FIELD', payload: { field, value } });
    },
    []
  );

  return (
    <FicheContext.Provider value={{ state, dispatch, setField }}>
      {children}
    </FicheContext.Provider>
  );
}

export function useFiche() {
  const ctx = useContext(FicheContext);
  if (!ctx) throw new Error('useFiche must be used within FicheProvider');
  return ctx;
}

export type { Action as FicheAction, Marque, Gamme, RecipeStyle, Difficulte, NutritionValues };
