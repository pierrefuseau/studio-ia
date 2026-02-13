import type { PlatformId } from '../../../types';

function seedRandom(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

function rangeFromSeed(seed: number, min: number, max: number): number {
  return Math.floor(seed * (max - min + 1)) + min;
}

export interface EngagementStats {
  likes: number;
  comments: number;
  shares: number;
  views: number;
}

const networkRanges: Record<PlatformId, { likes: [number, number]; comments: [number, number]; shares: [number, number]; views: [number, number] }> = {
  linkedin: {
    likes: [45, 320],
    comments: [8, 55],
    shares: [5, 40],
    views: [800, 6500],
  },
  instagram: {
    likes: [120, 2400],
    comments: [12, 180],
    shares: [20, 150],
    views: [1500, 25000],
  },
  facebook: {
    likes: [30, 450],
    comments: [10, 80],
    shares: [5, 60],
    views: [500, 8000],
  },
  tiktok: {
    likes: [500, 15000],
    comments: [40, 600],
    shares: [80, 2000],
    views: [5000, 250000],
  },
  x: {
    likes: [20, 350],
    comments: [5, 45],
    shares: [8, 120],
    views: [400, 12000],
  },
  hellowork: {
    likes: [15, 120],
    comments: [3, 25],
    shares: [2, 18],
    views: [200, 3000],
  },
};

export function generateStats(content: string, network: PlatformId): EngagementStats {
  const ranges = networkRanges[network];
  const s1 = seedRandom(content + network);
  const s2 = seedRandom(content + network + 'c');
  const s3 = seedRandom(content + network + 's');
  const s4 = seedRandom(content + network + 'v');

  return {
    likes: rangeFromSeed(s1, ...ranges.likes),
    comments: rangeFromSeed(s2, ...ranges.comments),
    shares: rangeFromSeed(s3, ...ranges.shares),
    views: rangeFromSeed(s4, ...ranges.views),
  };
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) {
    const val = n / 1_000_000;
    return val % 1 === 0 ? `${val}M` : `${val.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const val = n / 1_000;
    return val % 1 === 0 ? `${val}K` : `${val.toFixed(1)}K`;
  }
  return String(n);
}
