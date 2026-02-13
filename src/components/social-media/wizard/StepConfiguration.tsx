import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import type { SocialMediaState, PlatformId } from '../../../types';
import { PLATFORMS, ENTREPRISES, ENTREPRISE_LOGOS } from './types';
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

const PLATFORM_VISUALS: Record<
  PlatformId,
  {
    color: string;
    selectedIconStyle: React.CSSProperties;
    unselectedIconStyle: React.CSSProperties;
    unselectedIconColor: string;
  }
> = {
  linkedin: {
    color: '#0077B5',
    selectedIconStyle: { backgroundColor: '#0077B5' },
    unselectedIconStyle: { backgroundColor: 'rgba(0, 119, 181, 0.12)' },
    unselectedIconColor: '#0077B5',
  },
  instagram: {
    color: '#E4405F',
    selectedIconStyle: {
      background:
        'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    },
    unselectedIconStyle: {
      background:
        'linear-gradient(45deg, rgba(240,148,51,0.12), rgba(230,104,60,0.1), rgba(220,39,67,0.1), rgba(204,35,102,0.1), rgba(188,24,136,0.12))',
    },
    unselectedIconColor: '#E4405F',
  },
  facebook: {
    color: '#1877F2',
    selectedIconStyle: { backgroundColor: '#1877F2' },
    unselectedIconStyle: { backgroundColor: 'rgba(24, 119, 242, 0.12)' },
    unselectedIconColor: '#1877F2',
  },
  tiktok: {
    color: '#000000',
    selectedIconStyle: {
      background:
        'radial-gradient(circle at 85% 15%, rgba(37,244,238,0.35), transparent 55%), radial-gradient(circle at 15% 85%, rgba(254,44,85,0.35), transparent 55%), #000',
    },
    unselectedIconStyle: { backgroundColor: '#f3f4f6' },
    unselectedIconColor: '#000000',
  },
  x: {
    color: '#000000',
    selectedIconStyle: { backgroundColor: '#000000' },
    unselectedIconStyle: { backgroundColor: '#f3f4f6' },
    unselectedIconColor: '#000000',
  },
  hellowork: {
    color: '#00D4AA',
    selectedIconStyle: { backgroundColor: '#00D4AA' },
    unselectedIconStyle: { backgroundColor: 'rgba(0, 212, 170, 0.12)' },
    unselectedIconColor: '#00D4AA',
  },
};

export default function StepConfiguration({
  state,
  onChange,
}: StepConfigurationProps) {
  const togglePlatform = (id: PlatformId) => {
    const current = state.platforms;
    const next = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    onChange({ platforms: next });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h3 className="mb-1 text-base font-semibold text-gray-900">
          Entreprise
        </h3>
        <p className="mb-3 sm:mb-4 text-sm text-gray-500">
          Selectionnez l'entreprise emettrice
        </p>

        <motion.div
          className="grid grid-cols-2 xs:grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5"
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
                className={`relative flex flex-col items-center gap-2 sm:gap-2.5 rounded-2xl border-2 p-3 sm:p-4 transition-all duration-200 ${
                  selected
                    ? 'border-fuseau-primary bg-fuseau-cream shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-fuseau-primary"
                  >
                    <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
                  </motion.div>
                )}
                {ENTREPRISE_LOGOS[name] ? (
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full overflow-hidden bg-white border border-gray-100">
                    <img
                      src={ENTREPRISE_LOGOS[name]!}
                      alt={name}
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                ) : (
                  <div
                    className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full text-[11px] sm:text-sm font-bold text-white ${ENTREPRISE_COLORS[i]}`}
                  >
                    {getInitials(name)}
                  </div>
                )}
                <span className="text-center text-[10px] sm:text-xs font-medium text-gray-700 leading-tight">
                  {name}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div>
        <h3 className="mb-1 text-base font-semibold text-gray-900">
          Plateformes
        </h3>
        <p className="mb-3 sm:mb-4 text-sm text-gray-500">
          Selectionnez une ou plusieurs plateformes cibles
        </p>

        <motion.div
          className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {PLATFORMS.map((platform) => {
            const selected = state.platforms.includes(platform.id);
            const vis = PLATFORM_VISUALS[platform.id];

            return (
              <motion.button
                key={platform.id}
                variants={itemVariants}
                whileHover={
                  selected
                    ? { scale: 1.01 }
                    : {
                        y: -2,
                        boxShadow: `0 0 0 1px ${vis.color}4D, 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)`,
                      }
                }
                whileTap={{ scale: 0.97 }}
                animate={
                  selected
                    ? {
                        boxShadow: `0 0 0 2px ${vis.color}, 0 10px 15px -3px ${vis.color}26`,
                      }
                    : {
                        boxShadow:
                          '0 0 0 0px transparent, 0 1px 2px 0 rgba(0,0,0,0.05)',
                      }
                }
                transition={{ duration: 0.2 }}
                onClick={() => togglePlatform(platform.id)}
                className={`relative flex items-center gap-3 sm:gap-4 rounded-2xl border-2 p-3 sm:p-4 text-left transition-colors duration-200 ${
                  selected
                    ? 'border-transparent bg-white'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                      }}
                      className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-emerald-500"
                    >
                      <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  key={`icon-${platform.id}-${selected}`}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 20,
                  }}
                  className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    ...(selected
                      ? vis.selectedIconStyle
                      : vis.unselectedIconStyle),
                    ...(selected
                      ? { boxShadow: 'inset 0 2px 4px 0 rgba(0,0,0,0.15)' }
                      : {}),
                    color: selected ? '#ffffff' : vis.unselectedIconColor,
                  }}
                >
                  <PlatformIcon platform={platform.id} className="h-5 w-5 sm:h-6 sm:w-6" />
                </motion.div>

                <div className="min-w-0">
                  <span className="block text-xs sm:text-sm font-semibold text-gray-800">
                    {platform.label}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-gray-400">
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
