import type { GeneratedPost } from '../../../types';
import { generateStats, formatCount } from './engagementStats';

interface HelloworkPreviewProps {
  post: GeneratedPost;
}

const HW_GREEN = '#00D4AA';
const HW_DARK = '#1A1A2E';
const FONT = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

function ThumbIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M7 10v12" />
      <path d="M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88z" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ShareIconEl({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

export default function HelloworkPreview({ post }: HelloworkPreviewProps) {
  const stats = generateStats(post.content, 'hellowork');

  const hasOffer =
    post.content.toLowerCase().includes('offre') ||
    post.content.toLowerCase().includes('recrut') ||
    post.content.toLowerCase().includes('poste') ||
    post.content.toLowerCase().includes('candidat');

  return (
    <div className="bg-white text-[14px] text-[#1A1A2E]" style={{ fontFamily: FONT }}>
      <div className="flex items-start gap-3 px-4 pt-4">
        <div
          className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: HW_GREEN }}
        >
          F
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[14px] font-semibold" style={{ color: HW_DARK }}>Fuseau SAS</span>
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill={HW_GREEN}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-[12px] text-[#6B7280]">Industrie Agroalimentaire &middot; Rungis, France</p>
          <p className="mt-0.5 text-[12px] text-[#9CA3AF]">Il y a 4 h</p>
        </div>
        <button className="p-1 text-[#9CA3AF]">
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="10" cy="4" r="1.5" />
            <circle cx="10" cy="10" r="1.5" />
            <circle cx="10" cy="16" r="1.5" />
          </svg>
        </button>
      </div>

      <div className="px-4 pb-2 pt-3">
        {post.content.split('\n').map((line, i) => (
          <p key={i} className={line.trim() === '' ? 'h-3' : 'leading-[1.5] text-[#374151]'}>
            {line}
          </p>
        ))}
        {post.hashtags && post.hashtags.length > 0 && (
          <p className="mt-2 text-[14px] font-medium" style={{ color: HW_GREEN }}>
            {post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
          </p>
        )}
      </div>

      {post.image && (
        <img src={post.image} alt="" className="w-full object-cover" style={{ maxHeight: 280 }} />
      )}

      {hasOffer && (
        <div className="mx-4 my-3 overflow-hidden rounded-xl border border-[#E5E7EB]">
          <div className="flex items-center justify-between p-3">
            <div>
              <p className="text-[13px] font-semibold" style={{ color: HW_DARK }}>Nouvelle opportunite</p>
              <p className="text-[12px] text-[#6B7280]">Fuseau SAS recrute</p>
            </div>
            <button
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: HW_GREEN }}
            >
              Voir l&apos;offre
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-2">
        <span className="text-[12px] text-[#6B7280]">{formatCount(stats.likes)} reactions</span>
        <div className="flex items-center gap-2 text-[12px] text-[#6B7280]">
          <span>{stats.comments} commentaires</span>
          <span>&middot;</span>
          <span>{stats.shares} partages</span>
        </div>
      </div>

      <div className="grid grid-cols-3">
        {[
          { Icon: ThumbIcon, label: 'Reagir' },
          { Icon: CommentIcon, label: 'Commenter' },
          { Icon: ShareIconEl, label: 'Partager' },
        ].map(({ Icon, label }) => (
          <button
            key={label}
            className="flex items-center justify-center gap-1.5 py-3 text-[13px] font-medium text-[#6B7280] transition-colors hover:bg-[#F9FAFB]"
          >
            <Icon className="h-[18px] w-[18px]" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
