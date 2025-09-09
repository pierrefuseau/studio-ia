import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Theme, Product, Treatment, ProcessingJob, WebhookConfig, UploadedFile } from '../types';

// État initial de l'application
const initialState: AppState = {
  theme: 'light',
  products: [],
  selectedProduct: null,
  product: null,
  treatments: [
    {
      id: 'background-removal',
      name: 'Détourage Studio',
      description: 'Packshot professionnel sur fond blanc',
      icon: 'Camera',
      badge: 'Rapide',
      enabled: false,
      options: {
        shadowIntensity: 50,
        sharpness: 75,
        whiteBalance: 'auto'
      }
    },
    {
      id: 'scene-composition',
      name: 'Mise en Situation',
      description: 'Intégration dans un environnement réaliste',
      icon: 'ImagePlus',
      badge: 'Premium',
      enabled: false,
      options: {
        environment: 'modern-office',
        lighting: 'natural'
      }
    },
    {
      id: 'magazine-layout',
      name: 'Page Flyer Promotionnelle A4',
      description: 'Mise en page publicitaire professionnelle',
      icon: 'FileText',
      badge: 'Nouveau',
      enabled: false,
      options: {
        template: 'elegant-minimal',
        position: 'center',
        textSize: 'medium'
      }
    }
  ],
  jobs: [],
  isProcessing: false,
  webhookConfig: {
    url: 'https://n8n.srv778298.hstgr.cloud/webhook-test/fb09047a-1a80-44e7-833a-99fe0eda3266',
    enabled: false
  },
  selectedTreatmentType: null,
  currentStep: 'hero'
};

// Actions du reducer
type Action = 
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'ADD_PRODUCTS'; payload: UploadedFile[] }
  | { type: 'REMOVE_PRODUCT'; payload: string }
  | { type: 'UPDATE_PRODUCT'; payload: { id: string; updates: Partial<UploadedFile> } }
  | { type: 'SELECT_PRODUCT'; payload: UploadedFile | null }
  | { type: 'CLEAR_PRODUCTS' }
  | { type: 'SET_PRODUCT'; payload: any }
  | { type: 'TOGGLE_TREATMENT'; payload: string }
  | { type: 'UPDATE_TREATMENT_OPTIONS'; payload: { id: string; options: any } }
  | { type: 'START_PROCESSING' }
  | { type: 'ADD_JOB'; payload: ProcessingJob }
  | { type: 'UPDATE_JOB'; payload: { id: string; updates: Partial<ProcessingJob> } }
  | { type: 'SET_WEBHOOK_CONFIG'; payload: WebhookConfig }
  | { type: 'SELECT_TREATMENT_TYPE'; payload: string | null }
  | { type: 'SET_CURRENT_STEP'; payload: 'hero' | 'treatment' };

// Reducer
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'ADD_PRODUCTS':
      return { 
        ...state, 
        products: [...state.products, ...action.payload],
        selectedProduct: action.payload.length > 0 ? action.payload[0] : state.selectedProduct
      };
    case 'REMOVE_PRODUCT':
      const filteredProducts = state.products.filter(p => p.id !== action.payload);
      return { 
        ...state, 
        products: filteredProducts,
        selectedProduct: state.selectedProduct?.id === action.payload 
          ? (filteredProducts.length > 0 ? filteredProducts[0] : null)
          : state.selectedProduct
      };
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(p =>
          p.id === action.payload.id
            ? { ...p, ...action.payload.updates }
            : p
        ),
        selectedProduct: state.selectedProduct?.id === action.payload.id
          ? { ...state.selectedProduct, ...action.payload.updates }
          : state.selectedProduct
      };
    case 'SELECT_PRODUCT':
      return { ...state, selectedProduct: action.payload };
    case 'CLEAR_PRODUCTS':
      return { ...state, products: [], selectedProduct: null };
    case 'SET_PRODUCT':
      return { ...state, product: action.payload };
    case 'TOGGLE_TREATMENT':
      return {
        ...state,
        treatments: state.treatments.map(t => 
          t.id === action.payload ? { ...t, enabled: !t.enabled } : t
        )
      };
    case 'UPDATE_TREATMENT_OPTIONS':
      return {
        ...state,
        treatments: state.treatments.map(t => 
          t.id === action.payload.id 
            ? { ...t, options: { ...t.options, ...action.payload.options } }
            : t
        )
      };
    case 'START_PROCESSING':
      return { ...state, isProcessing: true };
    case 'ADD_JOB':
      return { ...state, jobs: [...state.jobs, action.payload] };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map(job =>
          job.id === action.payload.id
            ? { ...job, ...action.payload.updates }
            : job
        )
      };
    case 'SET_WEBHOOK_CONFIG':
      return { ...state, webhookConfig: action.payload };
    case 'SELECT_TREATMENT_TYPE':
      return { 
        ...state, 
        selectedTreatmentType: action.payload,
        currentStep: action.payload ? 'treatment' : 'hero'
      };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persister le thème dans localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', state.theme);
    // Appliquer la classe au body pour le mode sombre
    document.body.className = state.theme === 'dark' ? 'dark' : '';
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook pour utiliser le context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}