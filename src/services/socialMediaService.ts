import type { SocialMediaState, SocialMediaApiResponse } from '../types';
import { errorHandler } from './errorHandler';
import { PLATFORMS, TONES, CATEGORIES } from '../components/social-media/wizard/types';

const WEBHOOK_URL = 'https://n8n.srv778298.hstgr.cloud/webhook/social-media-backend';

const toBase64 = (file: File): Promise<string> =>
  new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.readAsDataURL(file);
  });

function extractImageUrls(text: string): string[] {
  const urls: string[] = [];

  const directPattern = /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|gif|webp|svg)(?:\?[^\s"'<>]*)?/gi;
  for (const match of text.matchAll(directPattern)) {
    urls.push(match[0]);
  }

  const drivePattern = /https?:\/\/drive\.google\.com\/(?:file\/d\/|uc\?[^\s"'<>]*id=)([a-zA-Z0-9_-]+)/gi;
  for (const match of text.matchAll(drivePattern)) {
    urls.push(`https://drive.google.com/uc?export=view&id=${match[1]}`);
  }

  const imgTagPattern = /<img[^>]+src=["']([^"']+)["']/gi;
  for (const match of text.matchAll(imgTagPattern)) {
    if (!urls.includes(match[1])) urls.push(match[1]);
  }

  const bgPattern = /background-image:\s*url\(["']?([^"')]+)["']?\)/gi;
  for (const match of text.matchAll(bgPattern)) {
    if (!urls.includes(match[1])) urls.push(match[1]);
  }

  return [...new Set(urls)];
}

export class SocialMediaService {
  private static instance: SocialMediaService;

  static getInstance(): SocialMediaService {
    if (!SocialMediaService.instance) {
      SocialMediaService.instance = new SocialMediaService();
    }
    return SocialMediaService.instance;
  }

  async generatePost(state: SocialMediaState): Promise<SocialMediaApiResponse> {
    const sessionId = `social-${Date.now()}`;

    return errorHandler.retryWithBackoff(
      async () => {
        const formData = new FormData();

        formData.append('entreprise', state.entreprise);

        const platformLabels = state.platforms
          .map((id) => PLATFORMS.find((p) => p.id === id)?.label || id)
          .join(', ');
        formData.append('plateforme', platformLabels);

        formData.append('typePost', state.postType);

        const toneLabel = TONES.find((t) => t.id === state.tone)?.label || state.tone;
        formData.append('ton', toneLabel);

        if (state.postType === 'personnalise') {
          formData.append('textePersonnalise', state.textePersonnalise);
        } else {
          const catLabel = CATEGORIES.find((c) => c.id === state.category)?.label || state.category;
          formData.append('categorieGenerique', catLabel);
        }

        if (state.url.trim()) {
          formData.append('url', state.url.trim());
        }

        if (state.uploadedFiles.length > 0) {
          const base64Files = await Promise.all(
            state.uploadedFiles.map(async (uf) => ({
              name: uf.file.name,
              type: uf.file.type,
              data: await toBase64(uf.file),
            }))
          );
          formData.append('fichiers', JSON.stringify(base64Files));
        }

        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          throw new Error(
            `Erreur serveur (${response.status}): ${errorText || response.statusText}`
          );
        }

        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const json = await response.json();
          return this.normalizeResponse(json);
        }

        const raw = await response.text();
        return this.parseTextResponse(raw);
      },
      sessionId,
      { maxAttempts: 2, initialDelay: 2000, timeout: 120000 }
    );
  }

  private normalizeResponse(json: Record<string, unknown>): SocialMediaApiResponse {
    const post = (json.post || json.response || json.text || json.content || '') as string;
    const image = (json.image || json.imageUrl || json.image_url || '') as string;

    let finalImage = image;
    if (!finalImage && typeof post === 'string') {
      const extracted = extractImageUrls(post);
      if (extracted.length > 0) finalImage = extracted[0];
    }

    return {
      post: String(post),
      response: String(post),
      image: finalImage || undefined,
      imageUrl: finalImage || undefined,
    };
  }

  private parseTextResponse(raw: string): SocialMediaApiResponse {
    const images = extractImageUrls(raw);
    return {
      post: raw,
      response: raw,
      image: images[0] || undefined,
      imageUrl: images[0] || undefined,
    };
  }
}

export const socialMediaService = SocialMediaService.getInstance();
