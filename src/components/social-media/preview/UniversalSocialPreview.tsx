import {
  ThumbsUp,
  MessageCircle,
  Share2,
  Repeat2,
  Send,
  Heart,
  Bookmark,
  BarChart3,
  MoreHorizontal,
  Globe,
  Music,
  ExternalLink,
  BadgeCheck,
} from 'lucide-react';
import type { GeneratedPost, PlatformId } from '../../../types';
import { generateStats, formatCount } from './engagementStats';

interface UniversalSocialPreviewProps {
  post: GeneratedPost;
  network: PlatformId;
}

const LINKEDIN_BLUE = '#0077B5';
const FB_BLUE = '#1877F2';
const X_BLUE = '#1D9BF0';
const HW_GREEN = '#00D4AA';

function ContentLines({ content, hashtagColor, hashtags }: { content: string; hashtagColor?: string; hashtags?: string[] }) {
  return (
    <>
      {content.split('\n').map((line, i) => (
        <p key={i} className={line.trim() === '' ? 'h-3' : 'leading-relaxed text-gray-800'}>
          {line}
        </p>
      ))}
      {hashtags && hashtags.length > 0 && (
        <p className="mt-2" style={hashtagColor ? { color: hashtagColor } : undefined}>
          {hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
        </p>
      )}
    </>
  );
}

function ActionBar({ items, cols }: { items: { icon: typeof ThumbsUp; label: string }[]; cols: number }) {
  return (
    <div className={`grid border-t border-gray-100`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {items.map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="flex items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="hidden min-[360px]:inline truncate">{label}</span>
        </button>
      ))}
    </div>
  );
}

function LinkedInSection({ post }: { post: GeneratedPost }) {
  const stats = generateStats(post.content, 'linkedin');

  return (
    <div className="bg-white font-sans text-sm text-gray-900">
      <div className="flex items-start gap-3 px-4 pt-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
          style={{ backgroundColor: LINKEDIN_BLUE }}
        >
          F
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-tight text-gray-900">Fuseau SAS</p>
          <p className="text-xs text-gray-500">Industrie Agroalimentaire</p>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>3 j</span>
            <span>&#183;</span>
            <svg className="h-3 w-3" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 12.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z" />
            </svg>
          </div>
        </div>
        <span
          className="rounded-full px-3 py-0.5 text-xs font-medium"
          style={{ backgroundColor: `${LINKEDIN_BLUE}15`, color: LINKEDIN_BLUE }}
        >
          1er
        </span>
      </div>

      <div className="px-4 pb-2 pt-3">
        <ContentLines content={post.content} hashtagColor={LINKEDIN_BLUE} hashtags={post.hashtags} />
      </div>

      {post.image && (
        <img src={post.image} alt="" className="w-full h-40 sm:h-48 object-cover" />
      )}

      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-1.5">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="flex -space-x-1">
            <span
              className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] text-white"
              style={{ backgroundColor: LINKEDIN_BLUE }}
            >
              +
            </span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] text-white">
              &#10084;
            </span>
          </span>
          <span>{formatCount(stats.likes)}</span>
        </div>
        <div className="flex gap-3 text-xs text-gray-500">
          <span>{stats.comments} commentaires</span>
          <span>{stats.shares} partages</span>
        </div>
      </div>

      <ActionBar
        cols={4}
        items={[
          { icon: ThumbsUp, label: "J'aime" },
          { icon: MessageCircle, label: 'Commenter' },
          { icon: Repeat2, label: 'Repartager' },
          { icon: Send, label: 'Envoyer' },
        ]}
      />
    </div>
  );
}

function FacebookSection({ post }: { post: GeneratedPost }) {
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
        <ContentLines content={post.content} hashtagColor={FB_BLUE} hashtags={post.hashtags} />
      </div>

      {post.image && (
        <img src={post.image} alt="" className="w-full h-48 sm:h-64 object-cover" />
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

      <ActionBar
        cols={3}
        items={[
          { icon: ThumbsUp, label: "J'aime" },
          { icon: MessageCircle, label: 'Commenter' },
          { icon: Share2, label: 'Partager' },
        ]}
      />
    </div>
  );
}

function InstagramSection({ post }: { post: GeneratedPost }) {
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

function XSection({ post }: { post: GeneratedPost }) {
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
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill={X_BLUE}>
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
              <p className="mt-1" style={{ color: X_BLUE }}>
                {post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
              </p>
            )}
          </div>

          {post.image && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200">
              <img src={post.image} alt="" className="w-full h-48 sm:h-64 object-cover" />
            </div>
          )}

          <div className="mt-2 flex items-center justify-between pb-3 pr-4 sm:pr-8 text-gray-500">
            {[
              { icon: MessageCircle, count: stats.comments },
              { icon: Repeat2, count: stats.shares },
              { icon: Heart, count: stats.likes },
              { icon: BarChart3, count: stats.views },
              { icon: Bookmark, count: 0 },
              { icon: Share2, count: 0 },
            ].map(({ icon: Icon, count }, i) => (
              <button
                key={i}
                className="group flex items-center gap-1 transition-colors hover:text-[#1D9BF0]"
              >
                <Icon className="h-4 w-4" />
                {count > 0 && <span className="text-xs">{formatCount(count)}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TikTokSection({ post }: { post: GeneratedPost }) {
  const stats = generateStats(post.content, 'tiktok');
  const truncated =
    post.content.length > 120 ? post.content.slice(0, 120) + '...' : post.content;

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden bg-gray-900 font-sans text-white">
      {post.image ? (
        <img src={post.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
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

      <div className="absolute bottom-16 sm:bottom-24 right-2 sm:right-4 z-10 flex flex-col items-center gap-5">
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

        <div
          className="h-8 w-8 animate-spin rounded-md border-2 border-white/30 bg-gradient-to-br from-fuseau-primary to-fuseau-accent"
          style={{ animationDuration: '4s' }}
        />
      </div>
    </div>
  );
}

function HelloworkSection({ post }: { post: GeneratedPost }) {
  const stats = generateStats(post.content, 'hellowork');
  const hasOffer =
    post.content.toLowerCase().includes('offre') ||
    post.content.toLowerCase().includes('recrut') ||
    post.content.toLowerCase().includes('poste') ||
    post.content.toLowerCase().includes('candidat');

  return (
    <div className="bg-white font-sans text-sm text-gray-900">
      <div className="flex items-start gap-3 px-4 pt-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: HW_GREEN }}
        >
          F
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-900">Fuseau SAS</span>
            <BadgeCheck className="h-4 w-4" style={{ color: HW_GREEN }} />
          </div>
          <p className="text-xs text-gray-500">Industrie Agroalimentaire &middot; Rungis, France</p>
          <p className="mt-0.5 text-xs text-gray-400">Il y a 4 h</p>
        </div>
      </div>

      <div className="px-4 pb-2 pt-3">
        <ContentLines content={post.content} hashtagColor={HW_GREEN} hashtags={post.hashtags} />
      </div>

      {post.image && (
        <img src={post.image} alt="" className="w-full h-40 sm:h-48 object-cover" />
      )}

      {hasOffer && (
        <div className="mx-4 my-3 flex items-center justify-between rounded-lg border border-gray-200 p-3">
          <div>
            <p className="text-xs font-semibold text-gray-800">Nouvelle opportunite</p>
            <p className="text-[11px] text-gray-500">Fuseau SAS recrute</p>
          </div>
          <button
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: HW_GREEN }}
          >
            <span>Voir l&apos;offre</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <span className="text-xs text-gray-500">{formatCount(stats.likes)} reactions</span>
        <div className="flex gap-3 text-xs text-gray-500">
          <span>{stats.comments} commentaires</span>
          <span>{stats.shares} partages</span>
        </div>
      </div>

      <ActionBar
        cols={3}
        items={[
          { icon: ThumbsUp, label: 'Reagir' },
          { icon: MessageCircle, label: 'Commenter' },
          { icon: Share2, label: 'Partager' },
        ]}
      />
    </div>
  );
}

export default function UniversalSocialPreview({ post, network }: UniversalSocialPreviewProps) {
  switch (network) {
    case 'linkedin':
      return <LinkedInSection post={post} />;
    case 'facebook':
      return <FacebookSection post={post} />;
    case 'instagram':
      return <InstagramSection post={post} />;
    case 'x':
      return <XSection post={post} />;
    case 'tiktok':
      return <TikTokSection post={post} />;
    case 'hellowork':
      return <HelloworkSection post={post} />;
    default:
      return null;
  }
}
