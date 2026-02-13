import type { GeneratedPost } from '../../../types';
import { generateStats, formatCount } from './engagementStats';

interface FacebookPreviewProps {
  post: GeneratedPost;
}

const FB_BLUE = '#1877F2';
const FONT = 'Helvetica, Arial, sans-serif';

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm-.5 14.47A6.5 6.5 0 0 1 1.5 8c0-.17.01-.34.02-.5h2.3A19.7 19.7 0 0 0 3.5 8c0 .17.01.34.02.5H1.53c.15 1.53.7 2.94 1.57 4.1.04-.04.08-.08.12-.13h.2A8.02 8.02 0 0 0 7.5 14.47zM8 14.96c-.94 0-2.06-1.55-2.43-3.96h4.86c-.37 2.41-1.49 3.96-2.43 3.96zM5.42 9.5A17.7 17.7 0 0 1 5.25 8c0-.52.03-1.02.08-1.5h5.34c.05.48.08.98.08 1.5 0 .51-.03 1.02-.08 1.5H5.42zm5.08 1h2.17a6.46 6.46 0 0 1-3.17 3.47A8.02 8.02 0 0 0 10.5 10.5zM10.5 5.5A8.02 8.02 0 0 0 9.5 2.03a6.46 6.46 0 0 1 3.17 3.47H10.5zm-5 0H3.33A6.46 6.46 0 0 1 6.5 2.03 8.02 8.02 0 0 0 5.5 5.5zM8 1.04c.94 0 2.06 1.55 2.43 3.96H5.57C5.94 2.59 7.06 1.04 8 1.04zM12.17 6.5h2.3c.02.16.03.33.03.5a6.5 6.5 0 0 1-.03.5h-2.3c.02-.16.03-.33.03-.5 0-.17-.01-.34-.03-.5z" />
    </svg>
  );
}

function LikeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M15.653 3.015A5.37 5.37 0 0 0 12.88 4.16l-.88.88-.88-.88a5.38 5.38 0 0 0-3.838-1.59 5.377 5.377 0 0 0-3.793 1.59 5.415 5.415 0 0 0 0 7.67l7.33 7.33a.5.5 0 0 0 .707 0l7.33-7.33a5.415 5.415 0 0 0 0-7.67 5.38 5.38 0 0 0-3.185-1.145z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ThumbIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 21V8l7-7 1.85 1.85L15.55 8H23v4.4L19 21zm-6 0V8h4v13z" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 5.862 2 10.5c0 2.537 1.359 4.811 3.5 6.353V22l4.309-2.394c.708.098 1.44.149 2.191.149C17.523 18.255 22 14.393 22 10.255 22 5.862 17.523 2 12 2zm1.216 11.47l-2.854-3.046L4.39 13.47l6.835-7.26 2.924 3.046 5.9-3.316-6.833 7.26z" />
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

export default function FacebookPreview({ post }: FacebookPreviewProps) {
  const stats = generateStats(post.content, 'facebook');

  return (
    <div className="bg-white text-[15px] text-[#050505]" style={{ fontFamily: FONT }}>
      <div className="flex items-start gap-2 px-4 pt-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: FB_BLUE }}
        >
          F
        </div>
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-[#050505]">Fuseau</p>
          <div className="flex items-center gap-1 text-[13px] text-[#65676B]">
            <span>2 h</span>
            <span>&middot;</span>
            <GlobeIcon className="h-3 w-3" />
          </div>
        </div>
        <button className="p-1 text-[#65676B]">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="10" cy="4" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="10" cy="16" r="1.5" />
          </svg>
        </button>
      </div>

      <div className="px-4 pb-2 pt-2">
        {post.content.split('\n').map((line, i) => (
          <p key={i} className={line.trim() === '' ? 'h-3' : 'text-[15px] leading-[1.33] text-[#050505]'}>
            {line}
          </p>
        ))}
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="mt-1" style={{ color: FB_BLUE }}>
            {post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
          </p>
        )}
      </div>

      {post.image && (
        <img src={post.image} alt="" className="w-full object-cover" style={{ maxHeight: 320 }} />
      )}

      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-1">
          <span className="flex -space-x-0.5">
            <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-white text-[10px]" style={{ backgroundColor: FB_BLUE }}>
              <svg className="h-[12px] w-[12px] text-white" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.22 5.21L8.66 7.65l.52 3.24c.03.2-.17.35-.35.26L6 9.62l-2.83 1.53c-.18.1-.38-.06-.35-.26l.52-3.24L.78 5.21c-.15-.14-.07-.39.14-.42l3.13-.46L5.44 1.4a.25.25 0 0 1 .44 0l1.39 2.93 3.13.46c.2.03.29.28.14.42z" />
              </svg>
            </span>
            <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-white bg-[#F33E58]">
              <svg className="h-[11px] w-[11px] text-white" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 15.04s-6.96-5.23-6.96-9.12a4.08 4.08 0 0 1 4.08-4.08c1.44 0 2.72.75 3.48 1.89.38-.56.88-1.02 1.47-1.35a4.07 4.07 0 0 1 5.49 1.46c.52.89.72 1.93.56 2.96-.52 3.37-4.73 6.71-8.12 8.24z" />
              </svg>
            </span>
            <span className="flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-white bg-[#F7B928]">
              <span className="text-[11px]">&#128518;</span>
            </span>
          </span>
          <span className="ml-1 text-[15px] text-[#65676B]">{formatCount(stats.likes)}</span>
        </div>
        <div className="flex items-center gap-2 text-[15px] text-[#65676B]">
          <span>{stats.comments} commentaires</span>
          <span>{stats.shares} partages</span>
        </div>
      </div>

      <div className="mx-4 border-t border-[#CED0D4]" />

      <div className="grid grid-cols-3 px-1">
        {[
          { Icon: ThumbIcon, label: "J'aime" },
          { Icon: CommentIcon, label: 'Commenter' },
          { Icon: ShareIcon, label: 'Partager' },
        ].map(({ Icon, label }) => (
          <button
            key={label}
            className="flex items-center justify-center gap-1.5 py-3 text-[15px] font-semibold text-[#65676B] transition-colors hover:bg-[#F2F2F2] rounded-md mx-1 my-0.5"
          >
            <Icon className="h-5 w-5" />
            <span className="text-[13px]">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
