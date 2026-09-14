import type { Channel } from '@/types';
import { useI18n } from './i18n';

// The proxy URL is SIGNED server-side (HMAC + TTL) and delivered as ch.proxyUrl
// for every channel the user is allowed to play. The client never builds or
// signs it -- this is what keeps the proxy from being an open relay and keeps
// any credential out of the query string.
export function proxiedUrl(ch: Channel): string | null {
  return ch.proxyUrl || null;
}

// A stream needs the proxy if it carries custom UA/referrer (browser-forbidden headers).
export function mustProxy(ch: Channel): boolean {
  return !!(ch.userAgent || ch.referrer);
}

export function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtube.com')) return u.searchParams.get('v') || u.pathname.split('/').pop() || null;
    if (u.hostname === 'youtu.be') return u.pathname.slice(1) || null;
  } catch {
    /* invalid */
  }
  return null;
}

export function youTubeEmbed(id: string): string {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&modestbranding=1&rel=0`;
}

// Curated icons + ZH/EN labels for the most useful categories.
export const CATEGORY_META: Record<string, { label: string; zh: string; icon: string }> = {
  sports: { label: 'Sports', zh: '体育', icon: '⚽' },
  news: { label: 'News', zh: '新闻', icon: '📰' },
  movies: { label: 'Movies', zh: '电影', icon: '🎬' },
  series: { label: 'Series', zh: '剧集', icon: '📺' },
  entertainment: { label: 'Entertainment', zh: '综艺', icon: '✨' },
  kids: { label: 'Kids', zh: '少儿', icon: '🧸' },
  music: { label: 'Music', zh: '音乐', icon: '🎵' },
  documentary: { label: 'Docs', zh: '纪录', icon: '🌍' },
  general: { label: 'General', zh: '综合', icon: '📡' },
  culture: { label: 'Culture', zh: '文化', icon: '🎭' },
  comedy: { label: 'Comedy', zh: '喜剧', icon: '😄' },
  cooking: { label: 'Cooking', zh: '美食', icon: '🍳' },
  lifestyle: { label: 'Lifestyle', zh: '生活方式', icon: '💎' },
  business: { label: 'Business', zh: '财经', icon: '📈' },
  science: { label: 'Science', zh: '科学', icon: '🔬' },
  education: { label: 'Education', zh: '教育', icon: '🎓' },
  religious: { label: 'Religion', zh: '宗教', icon: '🕊️' },
  travel: { label: 'Travel', zh: '旅游', icon: '✈️' },
  weather: { label: 'Weather', zh: '天气', icon: '⛅' },
  animation: { label: 'Animation', zh: '动画', icon: '🎨' },
  family: { label: 'Family', zh: '家庭', icon: '👨‍👩‍👧' },
  legislative: { label: 'Politics', zh: '政务', icon: '🏛️' },
  outdoor: { label: 'Outdoor', zh: '户外', icon: '🏔️' },
  auto: { label: 'Auto/Moto', zh: '汽车/摩托', icon: '🏎️' },
  shop: { label: 'Shopping', zh: '购物', icon: '🛍️' },
  relax: { label: 'Relax', zh: '休闲', icon: '🧘' },
  undefined: { label: 'Others', zh: '其他', icon: '📦' },
};

export function categoryLabel(id: string): string {
  const meta = CATEGORY_META[id];
  if (meta) return useI18n.getState().lang === 'zh' ? meta.zh : meta.label;
  return id.charAt(0).toUpperCase() + id.slice(1);
}
export function categoryIcon(id: string): string {
  return CATEGORY_META[id]?.icon || '📺';
}

export function qualityRank(q: string | null): number {
  if (!q) return 0;
  const m = q.match(/(\d{3,4})/);
  return m ? Number(m[1]) : 0;
}

export function debounce<F extends (...a: any[]) => void>(fn: F, ms: number) {
  let t: ReturnType<typeof setTimeout> | undefined;
  const wrapped = (...args: Parameters<F>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
  // Cancel a pending call (e.g. when Enter triggers the action immediately).
  wrapped.cancel = () => clearTimeout(t);
  return wrapped as typeof wrapped & { cancel: () => void };
}
