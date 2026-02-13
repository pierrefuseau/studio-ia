import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Copy,
  RefreshCw,
  Shuffle,
  Monitor,
  Smartphone,
  Check,
  Building2,
  Layers,
  MessageSquareText,
  Palette,
  Tag,
} from 'lucide-react';
import type { SocialMediaState, SocialMediaApiResponse, PlatformId, GeneratedPost } from '../../../types';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { PreviewRenderer } from '../preview';
import { PLATFORMS, TONES, CATEGORIES } from './types';
import PlatformIcon from './PlatformIcon';

interface StepGenerationProps {
  state: SocialMediaState;
  result: SocialMediaApiResponse | null;
  isLoading: boolean;
  onGenerate: () => void;
}

type Device = 'mobile' | 'desktop';

const SHORT_LABELS: Record<PlatformId, string> = {
  linkedin: 'Li',
  instagram: 'Ig',
  facebook: 'Fb',
  tiktok: 'Tk',
  x: 'X',
  hellowork: 'Hw',
};

function SummaryRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
      <Icon className="h-4 w-4 shrink-0 text-fuseau-secondary" />
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="ml-auto text-sm font-semibold text-gray-800">{value}</span>
    </div>
  );
}

export default function StepGeneration({ state, result, isLoading, onGenerate }: StepGenerationProps) {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<PlatformId>(state.platforms[0] || 'linkedin');
  const [device, setDevice] = useState<Device>('mobile');
  const [copied, setCopied] = useState(false);

  const postContent = result?.post || result?.response || '';
  const postImage = result?.image || result?.imageUrl;

  const generatedPost: GeneratedPost = useMemo(
    () => ({
      network: activeTab,
      content: postContent,
      image: postImage,
      hashtags: [],
      entreprise: state.entreprise,
    }),
    [activeTab, postContent, postImage, state.entreprise]
  );

  const toneName = TONES.find((t) => t.id === state.tone)?.label || state.tone;
  const categoryName = CATEGORIES.find((c) => c.id === state.category)?.label || state.category;
  const platformNames = state.platforms
    .map((p) => PLATFORMS.find((pl) => pl.id === p)?.label || p)
    .join(', ');

  const handleCopy = async () => {
    if (!postContent) return;
    try {
      await navigator.clipboard.writeText(postContent);
      setCopied(true);
      addToast({ type: 'success', title: 'Texte copie dans le presse-papier' });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      addToast({ type: 'error', title: 'Impossible de copier le texte' });
    }
  };

  if (!result && !isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="mb-1 text-base font-semibold text-gray-900">Resume de la configuration</h3>
          <p className="mb-4 text-sm text-gray-500">Verifiez vos parametres avant de generer</p>
        </div>

        <div className="space-y-2">
          <SummaryRow icon={Building2} label="Entreprise" value={state.entreprise || 'Non definie'} />
          <SummaryRow icon={Layers} label="Plateformes" value={platformNames || 'Aucune'} />
          <SummaryRow
            icon={MessageSquareText}
            label="Type"
            value={state.postType === 'personnalise' ? 'Personnalise' : 'Generique'}
          />
          {state.postType === 'generique' && (
            <>
              <SummaryRow icon={Palette} label="Ton" value={toneName} />
              {state.category && <SummaryRow icon={Tag} label="Categorie" value={categoryName} />}
            </>
          )}
        </div>

        {state.postType === 'personnalise' && state.textePersonnalise && (
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-2 text-xs font-medium text-gray-500">Texte personnalise</p>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {state.textePersonnalise.length > 300
                ? `${state.textePersonnalise.slice(0, 300)}...`
                : state.textePersonnalise}
            </p>
          </div>
        )}

        <Button onClick={onGenerate} size="lg" className="w-full">
          <Sparkles className="h-5 w-5" />
          Generer le post
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[250px] sm:min-h-[350px] lg:min-h-[400px] flex-col items-center justify-center py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-fuseau-cream"
        >
          <Sparkles className="h-7 w-7 text-fuseau-primary" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-sm font-medium text-gray-600"
        >
          Generation en cours...
        </motion.p>
        <p className="mt-2 text-xs text-gray-400">L'IA redige votre post pour chaque plateforme</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 rounded-xl bg-green-50 px-4 py-3"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.15 }}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-green-500"
        >
          <Check className="h-4 w-4 text-white" />
        </motion.div>
        <p className="text-sm font-medium text-green-800">Post genere avec succes</p>
      </motion.div>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
        <div className="order-2 lg:order-1 space-y-4">
          <h3 className="text-base font-semibold text-gray-900">Contenu genere</h3>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{postContent}</p>
          </div>

          {postImage && (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <img src={postImage} alt="Visuel genere pour le post" className="w-full object-cover" />
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button variant="outline" size="sm" onClick={handleCopy} className="w-full sm:w-auto">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copie' : 'Copier'}
            </Button>
            <Button variant="ghost" size="sm" onClick={onGenerate} className="w-full sm:w-auto">
              <RefreshCw className="h-4 w-4" />
              Regenerer
            </Button>
            <Button variant="ghost" size="sm" onClick={onGenerate} className="w-full sm:w-auto">
              <Shuffle className="h-4 w-4" />
              Variante
            </Button>
          </div>
        </div>

        <div className="order-1 lg:order-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Apercu</h3>
            <div role="tablist" aria-label="Type d'apercu" className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
              {(['mobile', 'desktop'] as Device[]).map((d) => {
                const active = device === d;
                const Icon = d === 'mobile' ? Smartphone : Monitor;
                return (
                  <button
                    key={d}
                    role="tab"
                    aria-selected={active}
                    aria-label={`Apercu ${d === 'mobile' ? 'mobile' : 'bureau'}`}
                    onClick={() => setDevice(d)}
                    className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] sm:text-xs font-medium transition-all ${
                      active
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {d === 'mobile' ? 'Mobile' : 'Desktop'}
                  </button>
                );
              })}
            </div>
          </div>

          {state.platforms.length > 1 && (
            <div role="tablist" aria-label="Plateformes" className="flex gap-1 overflow-x-auto rounded-xl bg-gray-100 p-1">
              {state.platforms.map((p) => {
                const platform = PLATFORMS.find((pl) => pl.id === p);
                const active = activeTab === p;
                return (
                  <button
                    key={p}
                    role="tab"
                    aria-selected={active}
                    aria-label={`Apercu ${platform?.label}`}
                    onClick={() => setActiveTab(p)}
                    className={`flex min-w-0 shrink items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] sm:text-xs font-medium transition-all ${
                      active
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <PlatformIcon platform={p} className="h-3.5 w-3.5 shrink-0" />
                    <span className="sm:hidden">{SHORT_LABELS[p]}</span>
                    <span className="hidden sm:inline">{platform?.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${device}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="max-h-[60vh] overflow-y-auto lg:max-h-none"
            >
              <PreviewRenderer
                post={generatedPost}
                network={activeTab}
                showMockFrame
                device={device}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
