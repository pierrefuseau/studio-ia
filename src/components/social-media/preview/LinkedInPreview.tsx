import { ThumbsUp, MessageCircle, Repeat2, Send } from 'lucide-react';
import type { GeneratedPost } from '../../../types';
import { generateStats, formatCount } from './engagementStats';

interface LinkedInPreviewProps {
  post: GeneratedPost;
}

const LINKEDIN_BLUE = '#0077B5';

export default function LinkedInPreview({ post }: LinkedInPreviewProps) {
  const stats = generateStats(post.content, 'linkedin');

  return (
    <div className="bg-white font-sans text-sm text-gray-900">
      <div className="flex items-start gap-3 px-4 pt-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
          style={{ backgroundColor: LINKEDIN_BLUE }}
        >
          F
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight text-gray-900">Fuseau SAS</p>
          <p className="text-xs text-gray-500">Industrie Agroalimentaire</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>3 j</span>
            <span>&#183;</span>
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
            </svg>
          </div>
        </div>
        <span
          className="rounded-full px-3 py-0.5 text-xs font-medium"
          style={{ backgroundColor: `${LINKEDIN_BLUE}15`, color: LINKEDIN_BLUE }}
        >
          1er
        </span>
      </div>

      <div className="px-4 pb-2 pt-3">
        {post.content.split('\n').map((line, i) => (
          <p key={i} className={line.trim() === '' ? 'h-3' : 'leading-relaxed text-gray-800'}>
            {line}
          </p>
        ))}
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="mt-2" style={{ color: LINKEDIN_BLUE }}>
            {post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
          </p>
        )}
      </div>

      {post.image && (
        <img
          src={post.image}
          alt=""
          className="w-full object-cover"
          style={{ maxHeight: 300 }}
        />
      )}

      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-1.5">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="flex -space-x-1">
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] text-white"
              style={{ backgroundColor: LINKEDIN_BLUE }}
            >
              +
            </span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] text-white">
              &#10084;
            </span>
          </span>
          <span>{formatCount(stats.likes)}</span>
        </div>
        <div className="flex gap-3 text-xs text-gray-500">
          <span>{stats.comments} commentaires</span>
          <span>{stats.shares} partages</span>
        </div>
      </div>

      <div className="grid grid-cols-4 border-t border-gray-100">
        {[
          { icon: ThumbsUp, label: "J'aime" },
          { icon: MessageCircle, label: 'Commenter' },
          { icon: Repeat2, label: 'Repartager' },
          { icon: Send, label: 'Envoyer' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
