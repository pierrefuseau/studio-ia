import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { SocialMediaState, PlatformId } from '../../../types';
import { PLATFORMS, ENTREPRISES } from './types';
import PlatformIcon from './PlatformIcon';

interface StepConfigurationProps {
  state: SocialMediaState;
  onChange: (updates: Partial<SocialMediaState>) => void;
}

const ENTREPRISE_COLORS = [
  'bg-fuseau-primary',
  'bg-fuseau-secondary',
  'bg-fuseau-accent',
  'bg-fuseau-primary-dark',
  'bg-fuseau-secondary-light',
];

function getInitials(name: string): string {
  return name
    .split(/[\s']+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function StepConfiguration({ state, onChange }: StepConfigurationProps) {
  const togglePlatform = (id: PlatformId) => {
    const current = state.platforms;
    const next = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    onChange({ platforms: next });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="mb-1 text-base font-semibold text-gray-900">Entreprise</h3>
        <p className="mb-4 text-sm text-gray-500">Selectionnez l'entreprise emettrice</p>

        <motion.div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {ENTREPRISES.map((name, i) => {
            const selected = state.entreprise === name;
            return (
              <motion.button
                key={name}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onChange({ entreprise: name })}
                className={`relative flex flex-col items-center gap-2.5 rounded-2xl border-2 px-3 py-4 transition-all duration-200 ${
                  selected
                    ? 'border-fuseau-primary bg-fuseau-cream shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-fuseau-primary"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white ${ENTREPRISE_COLORS[i]}`}
                >
                  {getInitials(name)}
                </div>
                <span className="text-center text-xs font-medium text-gray-700">
                  {name}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div>
        <h3 className="mb-1 text-base font-semibold text-gray-900">Plateformes</h3>
        <p className="mb-4 text-sm text-gray-500">
          Selectionnez une ou plusieurs plateformes cibles
        </p>

        <motion.div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {PLATFORMS.map((platform) => {
            const selected = state.platforms.includes(platform.id);
            return (
              <motion.button
                key={platform.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => togglePlatform(platform.id)}
                className={`relative flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all duration-200 ${
                  selected
                    ? 'border-fuseau-primary bg-fuseau-cream shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-fuseau-primary"
                  >
                    <Check className="h-3 w-3 text-white" />
                  </motion.div>
                )}
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: platform.color }}
                >
                  <PlatformIcon platform={platform.id} className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-sm font-medium text-gray-800">
                    {platform.label}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {platform.charLimit.toLocaleString()} car.
                  </span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
