import { Heart, MessageCircle, Share2, Bookmark, Music } from 'lucide-react';
import type { GeneratedPost } from '../../../types';
import { generateStats, formatCount } from './engagementStats';

interface TikTokPreviewProps {
  post: GeneratedPost;
}

export default function TikTokPreview({ post }: TikTokPreviewProps) {
  const stats = generateStats(post.content, 'tiktok');

  const truncated =
    post.content.length > 120 ? post.content.slice(0, 120) + '...' : post.content;

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden bg-gray-900 font-sans text-white">
      {post.image ? (
        <img
          src={post.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-12 z-10 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-bold">@fuseau_officiel</span>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-white/90">{truncated}</p>
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="mb-3 text-xs font-medium text-white/80">
            {post.hashtags
              .slice(0, 4)
              .map((h) => (h.startsWith('#') ? h : `#${h}`))
              .join(' ')}
          </p>
        )}
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
          <Music className="h-3 w-3 animate-pulse" />
          <span className="truncate text-[10px]">Son original - Fuseau SAS</span>
        </div>
      </div>

      <div className="absolute bottom-16 right-3 z-10 flex flex-col items-center gap-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-fuseau-primary text-xs font-bold">
          F
        </div>

        {[
          { icon: Heart, count: stats.likes },
          { icon: MessageCircle, count: stats.comments },
          { icon: Share2, count: stats.shares },
          { icon: Bookmark, count: 0 },
        ].map(({ icon: Icon, count }, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20">
              <Icon className="h-5 w-5" />
            </div>
            {count > 0 && (
              <span className="text-[10px] font-medium">{formatCount(count)}</span>
            )}
          </div>
        ))}

        <div className="h-8 w-8 animate-spin rounded-md border-2 border-white/30 bg-gradient-to-br from-fuseau-primary to-fuseau-accent" style={{ animationDuration: '4s' }} />
      </div>
    </div>
  );
}
