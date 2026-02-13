import { ThumbsUp, MessageCircle, Share2, Globe } from 'lucide-react';
import type { GeneratedPost } from '../../../types';
import { generateStats, formatCount } from './engagementStats';

interface FacebookPreviewProps {
  post: GeneratedPost;
}

const FB_BLUE = '#1877F2';

export default function FacebookPreview({ post }: FacebookPreviewProps) {
  const stats = generateStats(post.content, 'facebook');

  return (
    <div className="bg-white font-sans text-sm text-gray-900">
      <div className="flex items-start gap-2.5 px-4 pt-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: FB_BLUE }}
        >
          F
        </div>
        <div>
          <p className="font-semibold leading-tight text-gray-900">Fuseau</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>2 h</span>
            <span>&#183;</span>
            <Globe className="h-3 w-3" />
          </div>
        </div>
      </div>

      <div className="px-4 pb-2 pt-2.5">
        {post.content.split('\n').map((line, i) => (
          <p key={i} className={line.trim() === '' ? 'h-3' : 'leading-relaxed text-gray-800'}>
            {line}
          </p>
        ))}
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="mt-1.5" style={{ color: FB_BLUE }}>
            {post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
          </p>
        )}
      </div>

      {post.image && (
        <img
          src={post.image}
          alt=""
          className="w-full object-cover"
          style={{ maxHeight: 320 }}
        />
      )}

      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="flex -space-x-1">
            <span
              className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[9px] text-white"
              style={{ backgroundColor: FB_BLUE }}
            >
              &#128077;
            </span>
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[9px] text-white">
              &#10084;&#65039;
            </span>
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-yellow-400 text-[9px]">
              &#128518;
            </span>
          </span>
          <span>{formatCount(stats.likes)}</span>
        </div>
        <div className="flex gap-3 text-xs text-gray-500">
          <span>{stats.comments} commentaires</span>
          <span>{stats.shares} partages</span>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-gray-100">
        {[
          { icon: ThumbsUp, label: "J'aime" },
          { icon: MessageCircle, label: 'Commenter' },
          { icon: Share2, label: 'Partager' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center justify-center gap-2 py-2.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
