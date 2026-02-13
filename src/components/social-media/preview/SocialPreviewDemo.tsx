import { useState } from 'react';
import { cn } from '../../../utils/cn';
import type { PlatformId, GeneratedPost } from '../../../types';
import PlatformIcon from '../wizard/PlatformIcon';
import PreviewRenderer from './PreviewRenderer';

const PLATFORMS: { id: PlatformId; label: string; color: string }[] = [
  { id: 'linkedin', label: 'LinkedIn', color: '#0077B5' },
  { id: 'facebook', label: 'Facebook', color: '#1877F2' },
  { id: 'instagram', label: 'Instagram', color: '#E4405F' },
  { id: 'tiktok', label: 'TikTok', color: '#000000' },
  { id: 'x', label: 'X', color: '#14171A' },
  { id: 'hellowork', label: 'Hellowork', color: '#00D4AA' },
];

const DEMO_POST: GeneratedPost = {
  network: 'linkedin',
  content:
    "Decouvrez notre nouvelle gamme de produits frais, elaboree avec soin pour repondre aux attentes de nos clients les plus exigeants.\n\nQualite, fraicheur et savoir-faire : voila ce qui nous anime au quotidien chez Fuseau.",
  image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
  hashtags: ['Fuseau', 'Agroalimentaire', 'QualiteFrance', 'Innovation'],
};

interface SocialPreviewDemoProps {
  className?: string;
}

export default function SocialPreviewDemo({ className }: SocialPreviewDemoProps) {
  const [selected, setSelected] = useState<PlatformId>('linkedin');

  const post: GeneratedPost = { ...DEMO_POST, network: selected };

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-6 sm:mb-8 lg:mb-10">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 font-heading">
          Apercu des publications
        </h2>
        <p className="mt-1.5 text-sm sm:text-base text-gray-500 max-w-md sm:max-w-xl">
          Selectionnez un reseau social pour visualiser le rendu de votre publication.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">
        <div>
          <div className="grid grid-cols-2 gap-2 min-[420px]:gap-3 sm:grid-cols-3">
            {PLATFORMS.map(({ id, label, color }) => {
              const active = selected === id;
              return (
                <button
                  key={id}
                  onClick={() => setSelected(id)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-xl p-3 sm:p-4 border-2 transition-all duration-200 text-left',
                    active
                      ? 'border-current shadow-md bg-white'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  )}
                  style={active ? { borderColor: color, color } : undefined}
                >
                  <PlatformIcon
                    platform={id}
                    className={cn('w-5 h-5 shrink-0', !active && 'text-gray-400')}
                  />
                  <span
                    className={cn(
                      'text-xs sm:text-sm font-semibold truncate',
                      active ? 'text-gray-900' : 'text-gray-600'
                    )}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 lg:p-5 rounded-xl bg-gray-50 border border-gray-200">
            <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              Informations
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-gray-500">
              <li>Format adapte automatiquement a chaque plateforme</li>
              <li>Hashtags et mentions optimises par reseau</li>
              <li>Engagement simule pour un apercu realiste</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center overflow-hidden">
          <PreviewRenderer post={post} network={selected} showMockFrame device="mobile" />
        </div>
      </div>
    </div>
  );
}
