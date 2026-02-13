import type { GeneratedPost, PlatformId } from '../../../types';
import MockFrame from './MockFrame';
import LinkedInPreview from './LinkedInPreview';
import InstagramPreview from './InstagramPreview';
import FacebookPreview from './FacebookPreview';
import TikTokPreview from './TikTokPreview';
import XPreview from './XPreview';
import HelloworkPreview from './HelloworkPreview';

interface PreviewRendererProps {
  post: GeneratedPost;
  network: PlatformId;
  showMockFrame?: boolean;
  device?: 'mobile' | 'desktop';
}

const networkUrls: Record<PlatformId, string> = {
  linkedin: 'linkedin.com/feed',
  instagram: 'instagram.com/fuseau_officiel',
  facebook: 'facebook.com/Fuseau',
  tiktok: 'tiktok.com/@fuseau_officiel',
  x: 'x.com/fuseau_sas',
  hellowork: 'hellowork.com/fuseau-sas',
};

function PreviewContent({ post, network }: { post: GeneratedPost; network: PlatformId }) {
  switch (network) {
    case 'linkedin':
      return <LinkedInPreview post={post} />;
    case 'instagram':
      return <InstagramPreview post={post} />;
    case 'facebook':
      return <FacebookPreview post={post} />;
    case 'tiktok':
      return <TikTokPreview post={post} />;
    case 'x':
      return <XPreview post={post} />;
    case 'hellowork':
      return <HelloworkPreview post={post} />;
    default:
      return null;
  }
}

export default function PreviewRenderer({
  post,
  network,
  showMockFrame = false,
  device = 'mobile',
}: PreviewRendererProps) {
  const content = <PreviewContent post={post} network={network} />;

  if (!showMockFrame) {
    return (
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        {content}
      </div>
    );
  }

  return (
    <MockFrame device={device} url={networkUrls[network]}>
      {content}
    </MockFrame>
  );
}
