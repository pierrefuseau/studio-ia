import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft, AlertTriangle } from 'lucide-react';
import { cn } from '../../../utils/cn';
import { useFiche } from '../FicheProduitContext';
import { StepIdentity } from './StepIdentity';
import { StepTechnical } from './StepTechnical';
import { StepRecipe } from './StepRecipe';
import { StepPreview } from './StepPreview';

const STEPS = [
  { id: 1, label: 'Identite produit' },
  { id: 2, label: 'Details techniques' },
  { id: 3, label: 'Recette associee' },
  { id: 4, label: 'Apercu & Generation' },
];

interface StepperLayoutProps {
  onGenerate: () => void;
}

export function StepperLayout({ onGenerate }: StepperLayoutProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const { state } = useFiche();
  const { formData } = state;

  const hasPdf = !!formData.pdfBase64;

  const step2Valid = hasPdf
    ? !!formData.poidsNet.trim() && !!formData.conditionnement.trim()
    : !!formData.poidsNet.trim() && !!formData.conditionnement.trim() && !!formData.ingredients.trim();

  const step2Blocked = currentStep === 2 && !hasPdf;

  const goTo = (step: number) => {
    if (step < 1 || step > 4) return;
    if (currentStep === 2 && step > 2 && !step2Valid) return;
    setDirection(step > currentStep ? 1 : -1);
    setCurrentStep(step);
  };

  const next = () => goTo(currentStep + 1);
  const prev = () => goTo(currentStep - 1);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  };

  const nextDisabled = currentStep === 2 && !step2Valid;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 sm:gap-2">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => goTo(step.id)}
              className={cn(
                'flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg transition-all duration-150',
                currentStep === step.id
                  ? 'bg-amber-500/15 text-amber-400'
                  : currentStep > step.id
                    ? 'text-green-400 hover:bg-slate-700/50'
                    : 'text-slate-500 hover:bg-slate-700/50 hover:text-slate-300'
              )}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                  currentStep === step.id
                    ? 'bg-amber-500 text-slate-900'
                    : currentStep > step.id
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-slate-700 text-slate-400'
                )}
              >
                {currentStep > step.id ? <Check className="w-3.5 h-3.5" /> : step.id}
              </div>
              <span className="text-xs font-medium hidden sm:inline">{step.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  'w-4 sm:w-8 h-px mx-1',
                  currentStep > step.id ? 'bg-green-500/40' : 'bg-slate-700'
                )}
              />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {currentStep === 1 && <StepIdentity />}
          {currentStep === 2 && <StepTechnical />}
          {currentStep === 3 && <StepRecipe />}
          {currentStep === 4 && <StepPreview onGenerate={onGenerate} />}
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col gap-2 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <button
            onClick={prev}
            disabled={currentStep === 1}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
              currentStep === 1
                ? 'text-slate-600 cursor-not-allowed'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Precedent
          </button>
          {currentStep < 4 && (
            <button
              onClick={next}
              disabled={nextDisabled}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 shadow-md',
                nextDisabled
                  ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  : 'bg-amber-500 text-slate-900 hover:bg-amber-400 hover:shadow-lg'
              )}
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        {step2Blocked && !hasPdf && currentStep === 2 && (
          <div className="flex items-center gap-2 justify-end">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <p className="text-[11px] text-amber-400/70">Veuillez uploader la fiche technique PDF pour continuer</p>
          </div>
        )}
      </div>
    </div>
  );
}
