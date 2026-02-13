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
    <div className="flex h-full flex-col">
      <ContentHeader
        breadcrumbs={[
          { label: 'Studio IA' },
          { label: 'Reseaux Sociaux' },
        ]}
        title="Generateur de posts"
        subtitle="Creez du contenu adapte a chaque plateforme en quelques clics"
        icon={<Share2 className="h-5 w-5" />}
      />

      <nav aria-label="Etapes du formulaire" className="mb-6 flex items-center gap-1">
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
                className="flex w-full items-center gap-2"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                    done
                      ? 'bg-fuseau-primary text-white'
                      : active
                        ? 'bg-fuseau-primary text-white shadow-md shadow-fuseau-primary/30'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span
                  className={`hidden text-xs font-medium sm:block ${
                    active ? 'text-gray-900' : done ? 'text-fuseau-primary' : 'text-gray-400'
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="mx-2 h-px flex-1" aria-hidden="true">
                  <div
                    className={`h-full rounded-full transition-colors duration-300 ${
                      i < step ? 'bg-fuseau-primary' : 'bg-gray-200'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-card">
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

      <div className="mt-4 flex items-center justify-between">
        <div>
          {step > 0 && (
            <Button variant="ghost" size="sm" onClick={() => goTo(step - 1)} aria-label="Retour a l'etape precedente">
              <ChevronLeft className="h-4 w-4" />
              Precedent
            </Button>
          )}
        </div>
        <div>
          {step < STEPS.length - 1 && (
            <Button size="sm" disabled={!canProceed} onClick={() => goTo(step + 1)} aria-label="Passer a l'etape suivante">
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
