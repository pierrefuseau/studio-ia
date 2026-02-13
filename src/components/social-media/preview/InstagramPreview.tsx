import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';
import type { GeneratedPost } from '../../../types';
import { generateStats, formatCount } from './engagementStats';

interface InstagramPreviewProps {
  post: GeneratedPost;
}

export default function InstagramPreview({ post }: InstagramPreviewProps) {
  const stats = generateStats(post.content, 'instagram');

  return (
    <div className="bg-white font-sans text-sm text-gray-900">
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-fuseau-primary to-fuseau-accent p-[2px]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-[10px] font-bold text-fuseau-primary">
              F
            </div>
          </div>
          <span className="text-sm font-semibold">fuseau_officiel</span>
        </div>
        <MoreHorizontal className="h-5 w-5 text-gray-900" />
      </div>

      <div className="relative aspect-square w-full bg-gray-100">
        {post.image ? (
          <img src={post.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream-100 to-cream-300">
            <span className="text-4xl font-bold text-fuseau-secondary/20">FUSEAU</span>
          </div>
        )}
      </div>

      <div className="px-3 pb-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="h-6 w-6 text-gray-900 transition-colors hover:text-red-500" />
            <MessageCircle className="h-6 w-6 text-gray-900" />
            <Send className="h-6 w-6 text-gray-900" />
          </div>
          <Bookmark className="h-6 w-6 text-gray-900" />
        </div>

        <p className="mt-2 text-sm font-semibold">
          {formatCount(stats.likes)} J&apos;aime
        </p>

        <div className="mt-1">
          <span className="mr-1.5 font-semibold">fuseau_officiel</span>
          <span className="whitespace-pre-wrap text-gray-800">{post.content}</span>
        </div>

        {post.hashtags && post.hashtags.length > 0 && (
          <p className="mt-1 text-[#00376B]">
            {post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
          </p>
        )}

        <button className="mt-1.5 text-xs text-gray-500">
          Voir les {stats.comments} commentaires
        </button>

        <p className="mt-0.5 text-[10px] uppercase tracking-wide text-gray-400">
          Il y a 2 heures
        </p>
      </div>
    </div>
  );
}
