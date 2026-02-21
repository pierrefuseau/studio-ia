import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PenLine, ChefHat, Camera, FileText, FileSearch, FileOutput, Check, Loader2 } from 'lucide-react';

const GENERATION_STEPS = [
  { id: 1, label: 'Analyse de la fiche technique PDF...', icon: FileSearch, duration: 12000 },
  { id: 2, label: 'Redaction du contenu marketing...', icon: PenLine, duration: 8000 },
  { id: 3, label: 'Creation de la recette professionnelle...', icon: ChefHat, duration: 10000 },
  { id: 4, label: 'Shooting photo de la recette...', icon: Camera, duration: 12000 },
  { id: 5, label: 'Mise en page finale...', icon: FileOutput, duration: 5000 },
];

export function GenerationProgress() {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    let cumulative = 0;
    GENERATION_STEPS.forEach((step, i) => {
      cumulative += step.duration;
      timers.push(setTimeout(() => setActiveStep(i + 1), cumulative));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const progress = Math.min(((activeStep) / GENERATION_STEPS.length) * 100, 95);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-amber-500/5 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-amber-600/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/20 mb-4"
          >
            <FileText className="w-7 h-7" />
          </motion.div>
          <h2 className="text-xl font-bold text-slate-100">Generation en cours</h2>
          <p className="text-sm text-slate-400 mt-1">{elapsed}s ecoulees</p>
        </div>

        <div className="space-y-1">
          <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {GENERATION_STEPS.map((step, i) => {
            const Icon = step.icon;
            const status = activeStep > i ? 'done' : activeStep === i ? 'active' : 'waiting';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/40"
              >
                <div className="flex-shrink-0">
                  {status === 'done' ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-400" />
                    </div>
                  ) : status === 'active' ? (
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-500" />
                    </div>
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    status === 'done'
                      ? 'text-green-400'
                      : status === 'active'
                        ? 'text-amber-400'
                        : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
