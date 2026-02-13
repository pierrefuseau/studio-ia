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
    }),
    [activeTab, postContent, postImage]
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
      <div className="flex flex-col items-center justify-center py-20">
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
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900">Contenu genere</h3>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{postContent}</p>
          </div>

          {postImage && (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <img src={postImage} alt="" className="w-full object-cover" />
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copie' : 'Copier'}
            </Button>
            <Button variant="ghost" size="sm" onClick={onGenerate}>
              <RefreshCw className="h-4 w-4" />
              Regenerer
            </Button>
            <Button variant="ghost" size="sm" onClick={onGenerate}>
              <Shuffle className="h-4 w-4" />
              Variante
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">Apercu</h3>
            <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
              {(['mobile', 'desktop'] as Device[]).map((d) => {
                const active = device === d;
                const Icon = d === 'mobile' ? Smartphone : Monitor;
                return (
                  <button
                    key={d}
                    onClick={() => setDevice(d)}
                    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
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
            <div className="flex gap-1.5 overflow-x-auto rounded-xl bg-gray-100 p-1">
              {state.platforms.map((p) => {
                const platform = PLATFORMS.find((pl) => pl.id === p);
                const active = activeTab === p;
                return (
                  <button
                    key={p}
                    onClick={() => setActiveTab(p)}
                    className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      active
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <PlatformIcon platform={p} className="h-3.5 w-3.5" />
                    {platform?.label}
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
    </div>
  );
}
