import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import type { SocialMediaState, SocialMediaApiResponse } from '../../types';
import { ContentHeader } from '../ContentHeader';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { socialMediaService } from '../../services/socialMediaService';
import { INITIAL_SOCIAL_MEDIA_STATE } from './wizard/types';
import StepConfiguration from './wizard/StepConfiguration';
import StepContent from './wizard/StepContent';
import StepMedia from './wizard/StepMedia';
import StepGeneration from './wizard/StepGeneration';

const STEPS = [
  { label: 'Configuration', shortLabel: 'Config' },
  { label: 'Contenu', shortLabel: 'Contenu' },
  { label: 'Medias', shortLabel: 'Medias' },
  { label: 'Generation', shortLabel: 'Generer' },
] as const;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function SocialMediaWorkspace() {
  const { addToast } = useToast();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [state, setState] = useState<SocialMediaState>(INITIAL_SOCIAL_MEDIA_STATE);
  const [result, setResult] = useState<SocialMediaApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((updates: Partial<SocialMediaState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const canProceed = useMemo(() => {
    switch (step) {
      case 0:
        return state.entreprise !== '' && state.platforms.length > 0;
      case 1:
        if (state.postType === 'personnalise') return state.textePersonnalise.trim().length > 0;
        return state.category !== '';
      case 2:
        return true;
      default:
        return false;
    }
  }, [step, state]);

  const goTo = useCallback(
    (next: number) => {
      setDirection(next > step ? 1 : -1);
      setStep(next);
    },
    [step]
  );

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const res = await socialMediaService.generatePost(state);
      setResult(res);
      addToast({ type: 'success', title: 'Post genere avec succes' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      addToast({ type: 'error', title: 'Echec de la generation', description: msg });
    } finally {
      setIsLoading(false);
    }
  }, [state, addToast]);

  return (
    <div className="flex flex-col min-h-screen supports-[min-height:100dvh]:min-h-[100dvh]">
      <ContentHeader
        breadcrumbs={[
          { label: 'Studio IA' },
          { label: 'Reseaux Sociaux' },
        ]}
        title="Generateur de posts"
        subtitle="Creez du contenu adapte a chaque plateforme en quelques clics"
        icon={<Share2 className="h-5 w-5" />}
      />

      <div className="sm:hidden mb-4 px-1">
        <p className="text-xs font-semibold text-fuseau-primary">
          Etape {step + 1}/{STEPS.length}
        </p>
        <p className="text-sm font-medium text-gray-900">{STEPS[step].label}</p>
      </div>

      <nav aria-label="Etapes du formulaire" className="mb-4 sm:mb-6 flex items-center gap-1">
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={i} className="flex flex-1 items-center">
              <button
                onClick={() => {
                  if (i < step) goTo(i);
                }}
                disabled={i > step}
                aria-label={`Etape ${i + 1} : ${s.label}${done ? ' (terminee)' : active ? ' (en cours)' : ''}`}
                aria-current={active ? 'step' : undefined}
                className="flex w-full items-center gap-1.5 sm:gap-2"
              >
                <div
                  className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                    done
                      ? 'bg-fuseau-primary text-white'
                      : active
                        ? 'bg-fuseau-primary text-white shadow-md shadow-fuseau-primary/30'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : i + 1}
                </div>
                <span
                  className={`hidden sm:block text-xs font-medium ${
                    active ? 'text-gray-900' : done ? 'text-fuseau-primary' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="mx-1 sm:mx-2 h-px flex-1" aria-hidden="true">
                  <div
                    className={`h-full rounded-full transition-colors duration-300 ${
                      i < step
                        ? 'bg-fuseau-primary'
                        : 'bg-gray-200 border-0 sm:border-0 border-dashed'
                    }`}
                    style={i >= step ? { backgroundImage: 'none', borderTop: '1.5px dashed', borderColor: i >= step ? '#e5e7eb' : undefined } : undefined}
                  />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl sm:rounded-2xl border border-gray-200 bg-white px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8 shadow-card">
        <div className="mx-auto max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {step === 0 && (
                <StepConfiguration state={state} onChange={handleChange} />
              )}
              {step === 1 && (
                <StepContent state={state} onChange={handleChange} />
              )}
              {step === 2 && (
                <StepMedia state={state} onChange={handleChange} />
              )}
              {step === 3 && (
                <StepGeneration
                  state={state}
                  result={result}
                  isLoading={isLoading}
                  onGenerate={handleGenerate}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 py-3 px-1 sm:py-4 sm:px-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
        <div className="sm:flex-1">
          {step > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => goTo(step - 1)}
              aria-label="Retour a l'etape precedente"
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4" />
              Precedent
            </Button>
          )}
        </div>

        <div className="hidden sm:flex flex-1 justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
                i === step ? 'bg-fuseau-primary' : i < step ? 'bg-fuseau-primary/40' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="sm:flex-1 sm:flex sm:justify-end">
          {step < STEPS.length - 1 && (
            <Button
              size="sm"
              disabled={!canProceed}
              onClick={() => goTo(step + 1)}
              aria-label="Passer a l'etape suivante"
              className="w-full sm:w-auto"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
