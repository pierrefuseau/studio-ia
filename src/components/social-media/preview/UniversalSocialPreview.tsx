import type { GeneratedPost, PlatformId } from '../../../types';
import LinkedInPreview from './LinkedInPreview';
import InstagramPreview from './InstagramPreview';
import FacebookPreview from './FacebookPreview';
import TikTokPreview from './TikTokPreview';
import XPreview from './XPreview';
import HelloworkPreview from './HelloworkPreview';

interface UniversalSocialPreviewProps {
  post: GeneratedPost;
  network: PlatformId;
}

export default function UniversalSocialPreview({ post, network }: UniversalSocialPreviewProps) {
  switch (network) {
    case 'linkedin':
      return <LinkedInPreview post={post} />;
    case 'facebook':
      return <FacebookPreview post={post} />;
    case 'instagram':
      return <InstagramPreview post={post} />;
    case 'x':
      return <XPreview post={post} />;
    case 'tiktok':
      return <TikTokPreview post={post} />;
    case 'hellowork':
      return <HelloworkPreview post={post} />;
    default:
      return null;
  }
}
