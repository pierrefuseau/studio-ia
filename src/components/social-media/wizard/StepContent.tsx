import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, PenLine, Sparkles } from 'lucide-react';
import type { SocialMediaState, PostType, ToneId, CategoryId } from '../../../types';
import { TONES, CATEGORIES, PLATFORMS } from './types';

interface StepContentProps {
  state: SocialMediaState;
  onChange: (updates: Partial<SocialMediaState>) => void;
}

const fadeSlide = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
};

export default function StepContent({ state, onChange }: StepContentProps) {
  const [hoveredType, setHoveredType] = useState<PostType | null>(null);

  const minCharLimit = state.platforms.length > 0
    ? Math.min(...state.platforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.charLimit ?? 280))
    : 280;

  const charCount = state.textePersonnalise.length;
  const charOverflow = charCount > minCharLimit;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h3 className="mb-1 text-base font-semibold text-gray-900">Type de post</h3>
        <p className="mb-3 sm:mb-4 text-sm text-gray-500">Choisissez comment creer votre contenu</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
          {([
            {
              type: 'personnalise' as PostType,
              icon: PenLine,
              title: 'Personnalise',
              desc: 'Redigez votre propre texte, l\'IA l\'adaptera a chaque plateforme',
            },
            {
              type: 'generique' as PostType,
              icon: Sparkles,
              title: 'Generique',
              desc: 'L\'IA genere le contenu a partir d\'un ton et d\'une categorie',
            },
          ]).map(({ type, icon: Icon, title, desc }) => {
            const selected = state.postType === type;
            const hovered = hoveredType === type;
            return (
              <motion.button
                key={type}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredType(type)}
                onHoverEnd={() => setHoveredType(null)}
                onClick={() => onChange({ postType: type })}
                className={`relative flex flex-row sm:flex-col items-center sm:items-center gap-3 rounded-2xl border-2 p-3 sm:p-4 text-left sm:text-center transition-all duration-200 ${
                  selected
                    ? 'border-fuseau-primary bg-fuseau-cream shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 flex h-5 w-5 items-center justify-center rounded-full bg-fuseau-primary"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
                <div
                  className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                    selected || hovered
                      ? 'bg-fuseau-secondary text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{title}</p>
                  <p className="mt-0.5 sm:mt-1 text-xs leading-relaxed text-gray-500">{desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {state.postType === 'personnalise' ? (
          <motion.div key="personnalise" {...fadeSlide} className="space-y-3">
            <h3 className="text-base font-semibold text-gray-900">Votre texte</h3>
            <div className="relative">
              <textarea
                value={state.textePersonnalise}
                onChange={(e) => onChange({ textePersonnalise: e.target.value })}
                placeholder="Redigez le contenu de votre post..."
                className="w-full resize-y rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-fuseau-primary focus:outline-none min-h-[120px] sm:min-h-[160px]"
              />
              <div className="mt-1 flex items-center justify-between px-1">
                <span className="text-xs text-gray-400">
                  Limite la plus basse : {minCharLimit.toLocaleString()} caracteres
                </span>
                <span
                  className={`text-xs font-medium ${
                    charOverflow ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {charCount.toLocaleString()} / {minCharLimit.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="generique" {...fadeSlide} className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="mb-1 text-base font-semibold text-gray-900">Ton</h3>
              <p className="mb-3 sm:mb-4 text-sm text-gray-500">Definissez le style d'ecriture</p>

              <motion.div
                className="flex flex-wrap gap-1.5 sm:gap-2"
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                {TONES.map((tone) => {
                  const selected = state.tone === tone.id;
                  return (
                    <motion.button
                      key={tone.id}
                      variants={item}
                      onClick={() => onChange({ tone: tone.id as ToneId })}
                      className={`relative inline-flex items-center gap-1.5 sm:gap-2 rounded-full border-2 px-2 sm:px-3 py-1 sm:py-1.5 text-left transition-all duration-200 ${
                        selected
                          ? 'border-fuseau-primary bg-fuseau-cream shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{tone.emoji}</span>
                      <span className={`text-[11px] sm:text-xs font-medium ${selected ? 'text-fuseau-primary' : 'text-gray-600'}`}>
                        {tone.label}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            <div>
              <h3 className="mb-1 text-base font-semibold text-gray-900">Categorie</h3>
              <p className="mb-3 sm:mb-4 text-sm text-gray-500">Quel type de contenu souhaitez-vous ?</p>

              <motion.div
                className="flex flex-wrap gap-1.5 sm:gap-2"
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                {CATEGORIES.map((cat) => {
                  const selected = state.category === cat.id;
                  return (
                    <motion.button
                      key={cat.id}
                      variants={item}
                      onClick={() => onChange({ category: cat.id as CategoryId })}
                      className={`relative inline-flex items-center gap-1.5 sm:gap-2 rounded-full border-2 px-2 sm:px-3 py-1 sm:py-1.5 text-left transition-all duration-200 ${
                        selected
                          ? 'border-fuseau-primary bg-fuseau-cream shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{cat.emoji}</span>
                      <span className={`text-[11px] sm:text-xs font-medium ${selected ? 'text-fuseau-primary' : 'text-gray-600'}`}>
                        {cat.label}
                      </span>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
