import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilePlus, Clock, Settings, AlertTriangle, X } from 'lucide-react';
import { FicheProvider, useFiche } from './FicheProduitContext';
import { StepperLayout } from './stepper/StepperLayout';
import { GenerationProgress } from './generation/GenerationProgress';
import { ResultScreen } from './preview/ResultScreen';
import { HistoryPage } from './pages/HistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { generateFicheProduit } from '../../api/fpWebhookClient';
import { cn } from '../../utils/cn';
import type { FicheModuleView, FicheHistoryItem } from '../../types/product';

const tabs: { id: FicheModuleView; label: string; icon: React.ElementType }[] = [
  { id: 'new', label: 'Nouvelle fiche', icon: FilePlus },
  { id: 'history', label: 'Historique', icon: Clock },
  { id: 'settings', label: 'Parametres', icon: Settings },
];

function FicheContent() {
  const { state, dispatch } = useFiche();
  const { currentView, generationError } = state;

  const isTabView = currentView === 'new' || currentView === 'history' || currentView === 'settings';

  const doGenerate = useCallback(async () => {
    dispatch({ type: 'START_GENERATION' });
    try {
      const result = await generateFicheProduit(state.webhookUrl, state.formData);
      dispatch({ type: 'GENERATION_SUCCESS', payload: result });

      const historyItem: FicheHistoryItem = {
        id: crypto.randomUUID(),
        formData: { ...state.formData, photoFile: null },
        generatedContent: result,
        createdAt: new Date().toISOString(),
        photoPreview: state.formData.photoPreview,
      };
      dispatch({ type: 'ADD_HISTORY_ITEM', payload: historyItem });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      dispatch({ type: 'GENERATION_ERROR', payload: message });
    }
  }, [state.webhookUrl, state.formData, dispatch]);

  return (
    <div className="min-h-[80vh] bg-[#0F172A] rounded-2xl border border-slate-700/40 overflow-hidden">
      {isTabView && (
        <div className="flex items-center gap-1 px-4 pt-4 pb-2 border-b border-slate-700/40">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: tab.id })}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/30'
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {generationError && (
        <div className="mx-4 mt-4 flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-300">{generationError}</p>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'new' })}
            className="text-red-400 hover:text-red-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === 'new' && <StepperLayout onGenerate={doGenerate} />}
            {currentView === 'generating' && <GenerationProgress />}
            {currentView === 'result' && <ResultScreen onRegenerate={doGenerate} />}
            {currentView === 'history' && <HistoryPage />}
            {currentView === 'settings' && <SettingsPage />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function FicheProduitModule() {
  return (
    <FicheProvider>
      <FicheContent />
    </FicheProvider>
  );
}
