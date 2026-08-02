export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://5yearcodepro.com';
  const now = new Date();

  // Single-page site — the main URL is what Google indexes. Section anchors are
  // listed to reflect the current page structure (kept in sync with page.js).
  const sections = [
    { hash: '', priority: 1.0, freq: 'weekly' },
    { hash: '#projects', priority: 0.9, freq: 'weekly' },
    { hash: '#services', priority: 0.8, freq: 'monthly' },
    { hash: '#process', priority: 0.7, freq: 'monthly' },
    { hash: '#about', priority: 0.7, freq: 'monthly' },
    { hash: '#experience', priority: 0.6, freq: 'monthly' },
    { hash: '#testimonials', priority: 0.6, freq: 'weekly' },
    { hash: '#faq', priority: 0.6, freq: 'monthly' },
    { hash: '#contact', priority: 0.9, freq: 'monthly' },
  ];

  return sections.map((s) => ({
    url: `${baseUrl}/${s.hash}`,
    lastModified: now,
    changeFrequency: s.freq,
    priority: s.priority,
  }));
}
