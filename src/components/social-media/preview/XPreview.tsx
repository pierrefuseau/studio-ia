import { MessageCircle, Repeat2, Heart, BarChart3, Bookmark, Share } from 'lucide-react';
import type { GeneratedPost } from '../../../types';
import { generateStats, formatCount } from './engagementStats';

interface XPreviewProps {
  post: GeneratedPost;
}

export default function XPreview({ post }: XPreviewProps) {
  const stats = generateStats(post.content, 'x');

  return (
    <div className="bg-white font-sans text-[15px] text-gray-900">
      <div className="flex gap-3 px-4 pt-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fuseau-secondary text-sm font-bold text-white">
          F
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-bold">Fuseau</span>
            <svg className="h-[18px] w-[18px] text-[#1D9BF0]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.88 13.43 2 12 2s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.88 9.33 2 10.57 2 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81C9.33 21.12 10.57 22 12 22s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91C21.12 14.67 22 13.43 22 12zm-11.08 4.44L7.71 13l1.41-1.41 2.05 2.05 4.71-4.71 1.41 1.41-6.12 6.1z" />
            </svg>
            <span className="text-gray-500">@fuseau_sas</span>
            <span className="text-gray-500">&#183;</span>
            <span className="text-gray-500">2h</span>
          </div>

          <div className="mt-1">
            {post.content.split('\n').map((line, i) => (
              <p key={i} className={line.trim() === '' ? 'h-2.5' : 'leading-relaxed'}>
                {line}
              </p>
            ))}
            {post.hashtags && post.hashtags.length > 0 && (
              <p className="mt-1 text-[#1D9BF0]">
                {post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
              </p>
            )}
          </div>

          {post.image && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200">
              <img
                src={post.image}
                alt=""
                className="w-full object-cover"
                style={{ maxHeight: 280 }}
              />
            </div>
          )}

          <div className="mt-2 flex items-center justify-between pb-3 pr-8 text-gray-500">
            {[
              { icon: MessageCircle, count: stats.comments },
              { icon: Repeat2, count: stats.shares },
              { icon: Heart, count: stats.likes },
              { icon: BarChart3, count: stats.views },
              { icon: Bookmark, count: 0 },
              { icon: Share, count: 0 },
            ].map(({ icon: Icon, count }, i) => (
              <button
                key={i}
                className="group flex items-center gap-1 transition-colors hover:text-[#1D9BF0]"
              >
                <Icon className="h-4 w-4" />
                {count > 0 && (
                  <span className="text-xs">{formatCount(count)}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
