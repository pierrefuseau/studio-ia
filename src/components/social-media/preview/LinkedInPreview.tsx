import type { GeneratedPost } from '../../../types';
import { generateStats, formatCount } from './engagementStats';
import { ENTREPRISE_LOGOS } from '../wizard/types';

interface LinkedInPreviewProps {
  post: GeneratedPost;
}

const LI_BLUE = '#0A66C2';
const FONT = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

function LikeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.46 11l-3.91-3.91a7 7 0 0 1-1.69-2.74l-.49-1.47A2.76 2.76 0 0 0 10.76 1 2.75 2.75 0 0 0 8 3.74v1.12a9.19 9.19 0 0 0 .46 2.85L8.89 9H4.12A2.12 2.12 0 0 0 2 11.12a2.16 2.16 0 0 0 .92 1.76A2.11 2.11 0 0 0 2 14.62a2.14 2.14 0 0 0 1.28 2 2 2 0 0 0-.28 1 2.12 2.12 0 0 0 2 2.12v.14A2.12 2.12 0 0 0 7.12 22h7.49a8.08 8.08 0 0 0 3.58-.84l.31-.16H21V11zM19.5 19.5h-.83l-.63.33a6.07 6.07 0 0 1-2.68.63H7.12a.62.62 0 0 1-.62-.63v-.89l-.75-.37a.62.62 0 0 1-.25-.83.63.63 0 0 1 .55-.31h.73l-.49-.67a.63.63 0 0 1-.09-.67.63.63 0 0 1 .56-.36h.81l-.54-.71a.63.63 0 0 1-.09-.65.62.62 0 0 1 .58-.37h.85l-.66-.92A.66.66 0 0 1 7 13.37a.62.62 0 0 1 .62-.62h4.14l-.87-2.61a7.2 7.2 0 0 1-.37-2.28V6.73a1.25 1.25 0 0 1 2.5 0l.49 1.47a8.48 8.48 0 0 0 2.05 3.33l3.94 3.93z" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M7 9h10v1.5H7zm0 4h7v1.5H7z" />
      <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v13A1.5 1.5 0 0 0 3.5 18h3.7l4.59 3.47a1 1 0 0 0 1.2 0L17.6 18h2.9a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 20.5 2zm0 14.5h-3.46L12 20.42 6.96 16.5H3.5v-13h17z" />
    </svg>
  );
}

function RepostIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M13.96 5H6c-1.1 0-2 .9-2 2v5.04h1.5V7c0-.28.22-.5.5-.5h7.96l-2.73 2.73 1.06 1.06L16.58 6l-4.29-4.29-1.06 1.06zm-3.92 14H18c1.1 0 2-.9 2-2v-5.04h-1.5V17c0 .28-.22.5-.5.5h-7.96l2.73-2.73-1.06-1.06L7.42 18l4.29 4.29 1.06-1.06z" />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M21 3L0 10l7.66 4.26L20 6l-8.26 7.66L16 21z" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM3 8c0-.18.01-.36.04-.53h2.1A16.4 16.4 0 0 0 5 8c0 .18.01.35.02.53H3.04A5.04 5.04 0 0 1 3 8zm.34-2.03h1.8a11.3 11.3 0 0 1 .88-2.65A5.52 5.52 0 0 0 3.34 5.97zM8 13.5c-.69 0-1.57-1.04-2.07-2.97h4.14c-.5 1.93-1.38 2.97-2.07 2.97zm-2.26-4.47A14.2 14.2 0 0 1 5.5 8c0-.36.01-.7.04-1.03h4.92c.03.33.04.67.04 1.03 0 .35-.01.7-.04 1.03H5.74zm4.28 4.65a11.3 11.3 0 0 0 .88-2.65h1.76a5.52 5.52 0 0 1-2.64 2.65zM12.66 5.97h-1.76a11.3 11.3 0 0 0-.88-2.65 5.52 5.52 0 0 1 2.64 2.65zM8 2.5c.69 0 1.57 1.04 2.07 2.97H5.93C6.43 3.54 7.31 2.5 8 2.5zm2.86 5.03h2.1A5.04 5.04 0 0 1 13 8c0 .18-.01.36-.04.53h-2.1A16.4 16.4 0 0 0 11 8c0-.18-.01-.35-.02-.53z" />
    </svg>
  );
}

export default function LinkedInPreview({ post }: LinkedInPreviewProps) {
  const stats = generateStats(post.content, 'linkedin');
  const companyName = post.entreprise || 'Fuseau';
  const logoUrl = post.entreprise ? ENTREPRISE_LOGOS[post.entreprise] : null;

  return (
    <div className="bg-white text-[14px] text-[#191919]" style={{ fontFamily: FONT }}>
      <div className="flex items-start gap-2 px-4 pt-3">
        {logoUrl ? (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full overflow-hidden bg-white border border-[#E0E0E0]">
            <img src={logoUrl} alt={companyName} className="h-full w-full object-contain p-1" />
          </div>
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
            style={{ backgroundColor: LI_BLUE }}
          >
            {companyName.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-1">
            <span className="text-[14px] font-semibold text-[#191919]">{companyName}</span>
            <span className="text-[12px] text-[#666666]">&middot; 1er</span>
          </div>
          <p className="text-[12px] leading-tight text-[#666666]">Industrie Agroalimentaire</p>
          <div className="flex items-center gap-1 text-[12px] text-[#666666]">
            <span>3 j</span>
            <span>&middot;</span>
            <GlobeIcon className="h-3 w-3" />
          </div>
        </div>
        <button className="p-1 text-[#666666]">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM4 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm16 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
          </svg>
        </button>
      </div>

      <div className="px-4 pb-1 pt-3">
        {post.content.split('\n').map((line, i) => (
          <p key={i} className={line.trim() === '' ? 'h-3' : 'leading-[1.43] text-[#191919]'}>
            {line}
          </p>
        ))}
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="mt-2 text-[14px] font-medium" style={{ color: LI_BLUE }}>
            {post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
          </p>
        )}
      </div>

      {post.image && (
        <img src={post.image} alt="" className="mt-1 w-full object-cover" style={{ maxHeight: 300 }} />
      )}

      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1">
          <span className="flex -space-x-0.5">
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[10px]" style={{ backgroundColor: LI_BLUE }}>
              <svg className="h-[10px] w-[10px] text-white" viewBox="0 0 16 16" fill="currentColor">
                <path d="M13.19 5H9.53l.39-2.18a1.88 1.88 0 0 0-.47-1.59 1.84 1.84 0 0 0-2.69.15L4 5H1v8h2.35l3.28 2a2 2 0 0 0 1.07.31H12a2 2 0 0 0 1.95-1.56l1-4.38A2 2 0 0 0 13.19 5z" />
              </svg>
            </span>
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#DF704D] text-[10px] text-white">
              <svg className="h-[10px] w-[10px]" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 16A5.46 5.46 0 0 1 3.55 13.8a2.64 2.64 0 0 1-.25-.38C1.31 10.84 2 7.5 2 7.5s.43-1.18 1.38-2.12A5.41 5.41 0 0 1 8 3.5a5.41 5.41 0 0 1 4.62 1.88C13.57 6.32 14 7.5 14 7.5s.69 3.34-1.3 5.92a2.64 2.64 0 0 1-.25.38A5.46 5.46 0 0 1 8 16z" />
              </svg>
            </span>
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#6DAE4F] text-[10px] text-white">
              <svg className="h-[10px] w-[10px]" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a4.5 4.5 0 0 0-4.5 4.5c0 .98.41 2.03 1.15 2.88L8 12l3.35-3.62c.74-.85 1.15-1.9 1.15-2.88A4.5 4.5 0 0 0 8 1z" />
              </svg>
            </span>
          </span>
          <span className="ml-1 text-[12px] text-[#666666]">{formatCount(stats.likes)}</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#666666]">
          <span>{stats.comments} commentaires</span>
          <span>&middot;</span>
          <span>{stats.shares} partages</span>
        </div>
      </div>

      <div className="border-t border-[#E0E0E0]" />

      <div className="grid grid-cols-4">
        {[
          { Icon: LikeIcon, label: "J'aime" },
          { Icon: CommentIcon, label: 'Commenter' },
          { Icon: RepostIcon, label: 'Diffuser' },
          { Icon: SendIcon, label: 'Envoyer' },
        ].map(({ Icon, label }) => (
          <button
            key={label}
            className="flex items-center justify-center gap-1 py-3 text-[12px] font-semibold text-[#666666] transition-colors hover:bg-[#F3F2EF]"
          >
            <Icon className="h-[18px] w-[18px]" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
