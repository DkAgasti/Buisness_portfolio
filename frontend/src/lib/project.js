// Helpers that normalize the (intentionally minimal) project schema coming from
// the backend while gracefully surfacing richer optional fields the CMS may add
// later — cover image, gallery, videos, case-study copy, results, etc.
// Nothing here fabricates data: a field is only rendered when it exists.

const isRealUrl = (v) => typeof v === 'string' && v.trim() && v.trim() !== '#';

export function getCover(p) {
  const candidates = [p.coverImage, p.cover, p.image, p.thumbnail];
  const first = candidates.find(isRealUrl);
  if (first) return first;
  const imgs = p.gallery || p.images || p.screenshots;
  if (Array.isArray(imgs) && imgs.length) {
    const item = imgs[0];
    const url = typeof item === 'string' ? item : item?.url || item?.src;
    if (isRealUrl(url)) return url;
  }
  return null;
}

function normalizeMedia(list) {
  if (!list) return [];
  const arr = Array.isArray(list) ? list : [list];
  return arr
    .map((item) => {
      if (typeof item === 'string') return { url: item };
      if (item && typeof item === 'object') return { url: item.url || item.src, caption: item.caption };
      return null;
    })
    .filter((x) => x && isRealUrl(x.url));
}

export function getGallery(p) {
  return normalizeMedia(p.gallery || p.images || p.screenshots);
}

export function getMobileShots(p) {
  return normalizeMedia(p.mobileScreenshots || p.mobile || p.mobileImages);
}

export function getVideos(p) {
  return normalizeMedia(p.videos || p.video);
}

// Accepts a string (single or newline/•-separated), or an array. Returns string[].
export function toList(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((v) => (typeof v === 'string' ? v : v?.text || '')).filter(Boolean);
  return String(val)
    .split(/\n|•|·/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// Results may be [{ value, label }] metrics, plain array, or a paragraph.
export function getResults(p) {
  const r = p.results || p.outcome || p.impact;
  if (!r) return { metrics: [], text: '' };
  if (Array.isArray(r)) {
    if (r.length && typeof r[0] === 'object' && (r[0].value || r[0].metric)) {
      return {
        metrics: r.map((m) => ({ value: m.value || m.metric, label: m.label || m.name || '' })),
        text: '',
      };
    }
    return { metrics: [], text: '', list: toList(r) };
  }
  return { metrics: [], text: String(r) };
}

export function hasCaseStudy(p) {
  return Boolean(
    p.problem ||
      p.solution ||
      p.challenges ||
      p.results ||
      p.outcome ||
      p.architecture ||
      p.process ||
      (p.features && p.features.length) ||
      getGallery(p).length ||
      getVideos(p).length ||
      getMobileShots(p).length
  );
}

export const realUrl = isRealUrl;

// Deterministic gradient pair for placeholder covers (no external assets).
const GRADIENTS = [
  ['#3b82f6', '#8b5cf6'],
  ['#8b5cf6', '#ec4899'],
  ['#06b6d4', '#3b82f6'],
  ['#6366f1', '#a855f7'],
  ['#0ea5e9', '#6366f1'],
  ['#f43f5e', '#8b5cf6'],
];

export function gradientFor(key = '') {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}
