import type { GeneratedPost } from '../../../types';
import { generateStats, formatCount } from './engagementStats';

interface TikTokPreviewProps {
  post: GeneratedPost;
}

const FONT = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 5.82 2 10.5c0 2.65 1.48 5.02 3.8 6.56V22l4.17-2.58c.66.1 1.33.15 2.03.15 5.52 0 10-3.82 10-8.52S17.52 2 12 2z" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M5 2h14a1 1 0 0 1 1 1v19.143a.5.5 0 0 1-.766.424L12 18.03l-7.234 4.536A.5.5 0 0 1 4 22.143V3a1 1 0 0 1 1-1z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M10 5l-1.41 1.41L12.17 10H4v2h8.17l-3.58 3.59L10 17l6-6-6-6z" />
    </svg>
  );
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </svg>
  );
}

export default function TikTokPreview({ post }: TikTokPreviewProps) {
  const stats = generateStats(post.content, 'tiktok');
  const truncated = post.content.length > 100 ? post.content.slice(0, 100) + '...' : post.content;

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden bg-[#161823] text-white" style={{ fontFamily: FONT }}>
      {post.image ? (
        <img src={post.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-[#232535] to-[#161823]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-14 z-10 px-3 pb-16">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-bold">@fuseau_officiel</span>
        </div>
        <p className="mt-1.5 text-[13px] leading-[1.4] text-white/90">{truncated}</p>
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="mt-1 text-[13px] font-medium text-white/80">
            {post.hashtags.slice(0, 4).map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <MusicIcon className="h-3 w-3 text-white" />
          <div className="overflow-hidden">
            <p className="animate-marquee whitespace-nowrap text-[12px] text-white/80">
              Son original - Fuseau SAS
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-14 right-2 z-10 flex flex-col items-center gap-4">
        <div className="relative mb-2">
          <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#C8102E] text-xs font-bold text-white ring-2 ring-white">
            F
          </div>
          <div className="absolute -bottom-1.5 left-1/2 flex h-[18px] w-[18px] -translate-x-1/2 items-center justify-center rounded-full bg-[#FE2C55] text-[12px] font-bold text-white">
            +
          </div>
        </div>

        {[
          { Icon: HeartIcon, count: stats.likes, label: 'likes' },
          { Icon: CommentIcon, count: stats.comments, label: 'comments' },
          { Icon: BookmarkIcon, count: Math.floor(stats.likes * 0.15), label: 'bookmarks' },
          { Icon: ShareIcon, count: stats.shares, label: 'shares' },
        ].map(({ Icon, count, label }) => (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <div className="flex h-[40px] w-[40px] items-center justify-center">
              <Icon className="h-[28px] w-[28px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
            </div>
            <span className="text-[11px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              {formatCount(count)}
            </span>
          </div>
        ))}

        <div
          className="mt-1 h-[36px] w-[36px] overflow-hidden rounded-full border-[3px] border-[#161823] bg-gradient-to-br from-[#25F4EE] to-[#FE2C55]"
          style={{ animation: 'spin 4s linear infinite' }}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-[#161823] m-[4px]">
            <MusicIcon className="h-3 w-3 text-white" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-around border-t border-white/10 bg-[#161823]/90 px-2 py-2 backdrop-blur-sm">
        {['Accueil', 'Amis', '', 'Boite de\nreception', 'Profil'].map((label, i) => (
          <div key={i} className="flex flex-col items-center gap-0.5">
            {i === 2 ? (
              <div className="flex h-[28px] w-[42px] items-center justify-center overflow-hidden rounded-lg">
                <div className="absolute h-[28px] w-[32px] rounded-lg bg-[#25F4EE] translate-x-[-2px]" />
                <div className="absolute h-[28px] w-[32px] rounded-lg bg-[#FE2C55] translate-x-[2px]" />
                <div className="relative z-10 flex h-[26px] w-[30px] items-center justify-center rounded-md bg-white">
                  <svg className="h-4 w-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </div>
              </div>
            ) : (
              <>
                <div className={`h-5 w-5 rounded-sm ${i === 0 ? 'bg-white' : 'bg-white/40'}`} />
                <span className={`text-[9px] ${i === 0 ? 'text-white' : 'text-white/50'}`}>
                  {label}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
