import type { GeneratedPost } from '../../../types';
import { generateStats, formatCount } from './engagementStats';

interface InstagramPreviewProps {
  post: GeneratedPost;
}

const FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <line x1="22" y1="3" x2="9.218" y2="10.083" />
      <polygon points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <polygon points="20 21 12 13.44 4 21 4 3 20 3 20 21" />
    </svg>
  );
}

export default function InstagramPreview({ post }: InstagramPreviewProps) {
  const stats = generateStats(post.content, 'instagram');

  return (
    <div className="bg-white text-[14px] text-[#262626]" style={{ fontFamily: FONT }}>
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="rounded-full p-[2px]" style={{ background: 'linear-gradient(135deg, #FEDA75 0%, #FA7E1E 25%, #D62976 50%, #962FBF 75%, #4F5BD5 100%)' }}>
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white ring-[2px] ring-white">
              <span className="text-[10px] font-bold text-[#C8102E]">F</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[13px] font-semibold text-[#262626]">fuseau_officiel</span>
            <svg className="h-3.5 w-3.5 text-[#0095F6]" viewBox="0 0 40 40" fill="currentColor">
              <path d="M19.998 3.094L14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v6.354h6.234L14.638 40l5.36-3.094L25.358 40l2.972-5.15h6.234v-6.354L40 25.359 36.905 20 40 14.641l-5.436-3.137V5.15h-6.234L25.358 0l-5.36 3.094Zm7.415 11.225l2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z" />
            </svg>
          </div>
        </div>
        <svg className="h-6 w-6 text-[#262626]" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="6" cy="12" r="1.5" />
          <circle cx="18" cy="12" r="1.5" />
        </svg>
      </div>

      <div className="relative aspect-square w-full bg-[#EFEFEF]">
        {post.image ? (
          <img src={post.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl font-bold text-[#DBDBDB]">FUSEAU</span>
          </div>
        )}
      </div>

      <div className="px-3 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HeartIcon className="h-[24px] w-[24px] text-[#262626] cursor-pointer hover:text-[#8E8E8E]" />
            <CommentIcon className="h-[24px] w-[24px] text-[#262626] cursor-pointer hover:text-[#8E8E8E]" />
            <ShareIcon className="h-[24px] w-[24px] text-[#262626] cursor-pointer hover:text-[#8E8E8E]" />
          </div>
          <BookmarkIcon className="h-[24px] w-[24px] text-[#262626] cursor-pointer hover:text-[#8E8E8E]" />
        </div>

        <p className="mt-2 text-[14px] font-semibold text-[#262626]">
          {formatCount(stats.likes)} J&apos;aime
        </p>

        <div className="mt-1">
          <span className="mr-1 text-[14px] font-semibold text-[#262626]">fuseau_officiel</span>
          <span className="whitespace-pre-wrap text-[14px] text-[#262626]">{post.content}</span>
        </div>

        {post.hashtags && post.hashtags.length > 0 && (
          <p className="mt-0.5 text-[14px] text-[#00376B]">
            {post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
          </p>
        )}

        <button className="mt-1 block text-[14px] text-[#8E8E8E]">
          Voir les {stats.comments} commentaires
        </button>

        <p className="mt-1 pb-3 text-[10px] uppercase tracking-wide text-[#8E8E8E]">
          Il y a 2 heures
        </p>
      </div>
    </div>
  );
}
