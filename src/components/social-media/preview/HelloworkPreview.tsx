import { ThumbsUp, MessageCircle, Share2, ExternalLink, BadgeCheck } from 'lucide-react';
import type { GeneratedPost } from '../../../types';
import { generateStats, formatCount } from './engagementStats';

interface HelloworkPreviewProps {
  post: GeneratedPost;
}

const HW_GREEN = '#00D4AA';

export default function HelloworkPreview({ post }: HelloworkPreviewProps) {
  const stats = generateStats(post.content, 'hellowork');

  const hasOffer =
    post.content.toLowerCase().includes('offre') ||
    post.content.toLowerCase().includes('recrut') ||
    post.content.toLowerCase().includes('poste') ||
    post.content.toLowerCase().includes('candidat');

  return (
    <div className="bg-white font-sans text-sm text-gray-900">
      <div className="flex items-start gap-3 px-4 pt-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: HW_GREEN }}
        >
          F
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-900">Fuseau SAS</span>
            <BadgeCheck className="h-4 w-4" style={{ color: HW_GREEN }} />
          </div>
          <p className="text-xs text-gray-500">Industrie Agroalimentaire &middot; Rungis, France</p>
          <p className="mt-0.5 text-xs text-gray-400">Il y a 4 h</p>
        </div>
      </div>

      <div className="px-4 pb-2 pt-3">
        {post.content.split('\n').map((line, i) => (
          <p key={i} className={line.trim() === '' ? 'h-3' : 'leading-relaxed text-gray-800'}>
            {line}
          </p>
        ))}
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="mt-2" style={{ color: HW_GREEN }}>
            {post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
          </p>
        )}
      </div>

      {post.image && (
        <img
          src={post.image}
          alt=""
          className="w-full object-cover"
          style={{ maxHeight: 280 }}
        />
      )}

      {hasOffer && (
        <div className="mx-4 my-3 flex items-center justify-between rounded-lg border border-gray-200 p-3">
          <div>
            <p className="text-xs font-semibold text-gray-800">Nouvelle opportunite</p>
            <p className="text-[11px] text-gray-500">Fuseau SAS recrute</p>
          </div>
          <button
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: HW_GREEN }}
          >
            <span>Voir l&apos;offre</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <span className="text-xs text-gray-500">{formatCount(stats.likes)} reactions</span>
        <div className="flex gap-3 text-xs text-gray-500">
          <span>{stats.comments} commentaires</span>
          <span>{stats.shares} partages</span>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-gray-100">
        {[
          { icon: ThumbsUp, label: 'Reagir' },
          { icon: MessageCircle, label: 'Commenter' },
          { icon: Share2, label: 'Partager' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
