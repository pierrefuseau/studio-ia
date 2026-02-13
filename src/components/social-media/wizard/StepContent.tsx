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
    <div className="space-y-8">
      <div>
        <h3 className="mb-1 text-base font-semibold text-gray-900">Type de post</h3>
        <p className="mb-4 text-sm text-gray-500">Choisissez comment creer votre contenu</p>

        <div className="grid grid-cols-2 gap-4">
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
                className={`relative flex flex-col items-center gap-3 rounded-2xl border-2 p-6 text-center transition-all duration-200 ${
                  selected
                    ? 'border-fuseau-primary bg-fuseau-cream shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-fuseau-primary"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${
                    selected || hovered
                      ? 'bg-fuseau-secondary text-white'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{desc}</p>
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
                rows={6}
                className="w-full resize-none rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-fuseau-primary focus:outline-none"
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
          <motion.div key="generique" {...fadeSlide} className="space-y-8">
            <div>
              <h3 className="mb-1 text-base font-semibold text-gray-900">Ton</h3>
              <p className="mb-4 text-sm text-gray-500">Definissez le style d'ecriture</p>

              <motion.div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
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
                      className={`relative flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-200 ${
                        selected
                          ? 'border-fuseau-primary bg-fuseau-cream shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {selected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-fuseau-primary"
                        >
                          <Check className="h-2.5 w-2.5 text-white" />
                        </motion.div>
                      )}
                      <span className="text-xl">{tone.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">{tone.label}</p>
                        <p className="truncate text-[11px] text-gray-400">{tone.description}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>

            <div>
              <h3 className="mb-1 text-base font-semibold text-gray-900">Categorie</h3>
              <p className="mb-4 text-sm text-gray-500">Quel type de contenu souhaitez-vous ?</p>

              <motion.div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
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
                      className={`relative flex items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-all duration-200 ${
                        selected
                          ? 'border-fuseau-primary bg-fuseau-cream shadow-md'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      {selected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-fuseau-primary"
                        >
                          <Check className="h-2.5 w-2.5 text-white" />
                        </motion.div>
                      )}
                      <span className="text-xl">{cat.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">{cat.label}</p>
                        <p className="truncate text-[11px] text-gray-400">{cat.description}</p>
                      </div>
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
