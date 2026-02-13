import type { GeneratedPost } from '../../../types';
import { generateStats, formatCount } from './engagementStats';

interface XPreviewProps {
  post: GeneratedPost;
}

const FONT = '"TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const TEXT_PRIMARY = '#0F1419';
const TEXT_SECONDARY = '#536471';
const ACCENT = '#1D9BF0';

function ReplyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M1.751 10c-.036 0-.071-.001-.107-.003C1.291 9.979 1 9.66 1 9.293V3.293c0-.37.295-.69.649-.708.026-.001.053-.002.08-.002h.011c.195.007.383.088.523.228l2.1 2.1c1.595-1.322 3.632-2.121 5.862-2.121 5.069 0 9.188 4.131 9.188 9.22 0 .197-.009.393-.026.587-.104 1.166-.573 2.272-1.353 3.197-.025.03-.05.06-.078.088l-.012.012c-1.705 1.877-4.138 3.057-6.863 3.057-2.725 0-5.158-1.18-6.863-3.057l-.012-.012c-.028-.028-.053-.058-.078-.088-.78-.925-1.249-2.031-1.353-3.197-.017-.194-.026-.39-.026-.587 0-1.096.192-2.148.544-3.127l-1.33-1.33C1.911 9.87 1.84 9.939 1.751 10zm3.948.01c0 3.998 3.234 7.242 7.226 7.242 3.992 0 7.225-3.244 7.225-7.242 0-3.998-3.233-7.242-7.225-7.242-1.73 0-3.318.614-4.559 1.635l2.244 2.244c.145.145.19.362.115.552-.075.19-.26.314-.464.314H4.7V2.15c0-.205.124-.39.314-.465.19-.075.407-.03.552.115l2.244 2.244C6.52 5.285 5.699 7.552 5.699 10.01z" />
    </svg>
  );
}

function RetweetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.791-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.791 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.965 3.036 4.269 5.834 6.59.543.449 1.043.84 1.293 1.02.25-.18.75-.571 1.293-1.02 2.798-2.321 4.76-4.625 5.834-6.59 1.112-2.04 1.03-3.7.479-4.82-.561-1.13-1.667-1.84-2.91-1.91zM12 20.703l-.343-.29c-2.96-2.46-5.063-4.896-6.246-7.06-1.248-2.286-1.095-4.263-.345-5.783.73-1.481 2.283-2.595 4.04-2.69 1.662-.088 3.407.75 4.894 2.82 1.487-2.07 3.232-2.908 4.893-2.82 1.758.095 3.31 1.209 4.042 2.69.749 1.52.902 3.497-.346 5.782-1.183 2.165-3.286 4.601-6.246 7.061l-.343.29z" />
    </svg>
  );
}

function ViewIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8.75 21V3h2v18h-2zM18.75 21V8.5h2V21h-2zM13.75 21v-7.5h2V21h-2zM3.75 21v-4.5h2V21h-2z" />
    </svg>
  );
}

function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.4-1.42L12 2.59zM20 15v4c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2v-4h2v4h12v-4h2z" />
    </svg>
  );
}

export default function XPreview({ post }: XPreviewProps) {
  const stats = generateStats(post.content, 'x');

  return (
    <div className="bg-white text-[15px]" style={{ fontFamily: FONT, color: TEXT_PRIMARY }}>
      <div className="flex gap-3 px-4 pt-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0F1D3D] text-sm font-bold text-white">
          F
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="text-[15px] font-bold" style={{ color: TEXT_PRIMARY }}>Fuseau</span>
            <svg className="h-[18px] w-[18px]" viewBox="0 0 22 22">
              <path
                d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.855-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.69-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.636.433 1.221.878 1.69.47.446 1.055.752 1.69.883.635.13 1.294.083 1.902-.143.271.586.702 1.084 1.24 1.438.54.354 1.167.551 1.813.568.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.225 1.261.272 1.893.143.636-.131 1.221-.437 1.69-.883.445-.47.751-1.054.882-1.69.132-.633.084-1.29-.139-1.896.587-.274 1.084-.705 1.438-1.245.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
                fill={ACCENT}
              />
            </svg>
            <span className="text-[15px]" style={{ color: TEXT_SECONDARY }}>@fuseau_sas</span>
            <span style={{ color: TEXT_SECONDARY }}>&middot;</span>
            <span className="text-[15px]" style={{ color: TEXT_SECONDARY }}>2h</span>
          </div>

          <div className="mt-0.5">
            {post.content.split('\n').map((line, i) => (
              <p key={i} className={line.trim() === '' ? 'h-3' : 'text-[15px] leading-[1.3125]'} style={{ color: TEXT_PRIMARY }}>
                {line}
              </p>
            ))}
            {post.hashtags && post.hashtags.length > 0 && (
              <p className="text-[15px]" style={{ color: ACCENT }}>
                {post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
              </p>
            )}
          </div>

          {post.image && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-[#CFD9DE]">
              <img src={post.image} alt="" className="w-full object-cover" style={{ maxHeight: 286 }} />
            </div>
          )}

          <div className="mt-2 flex items-center justify-between pb-3 text-[13px]" style={{ color: TEXT_SECONDARY }}>
            <button className="group flex items-center gap-1 transition-colors hover:text-[#1D9BF0]">
              <ReplyIcon className="h-[18px] w-[18px]" />
              <span>{formatCount(stats.comments)}</span>
            </button>
            <button className="group flex items-center gap-1 transition-colors hover:text-[#00BA7C]">
              <RetweetIcon className="h-[18px] w-[18px]" />
              <span>{formatCount(stats.shares)}</span>
            </button>
            <button className="group flex items-center gap-1 transition-colors hover:text-[#F91880]">
              <HeartIcon className="h-[18px] w-[18px]" />
              <span>{formatCount(stats.likes)}</span>
            </button>
            <button className="group flex items-center gap-1 transition-colors hover:text-[#1D9BF0]">
              <ViewIcon className="h-[18px] w-[18px]" />
              <span>{formatCount(stats.views)}</span>
            </button>
            <div className="flex items-center gap-3">
              <button className="transition-colors hover:text-[#1D9BF0]">
                <BookmarkIcon className="h-[18px] w-[18px]" />
              </button>
              <button className="transition-colors hover:text-[#1D9BF0]">
                <ShareIcon className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
