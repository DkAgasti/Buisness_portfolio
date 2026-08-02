'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Quote } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const AVATAR_COLORS = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-amber-500',
  'from-indigo-500 to-violet-500',
];

function avatarColor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

// Review text trimmed to exactly 2 lines with a plain inline "Read more" at the
// end of the 2nd line (measured, so it never spills onto a 3rd line).
function ReviewText({ text }) {
  const quoted = `“${text}”`;
  const [expanded, setExpanded] = useState(false);
  const [needsClamp, setNeedsClamp] = useState(false);
  const [display, setDisplay] = useState(quoted);
  const containerRef = useRef(null);
  const measureRef = useRef(null);

  useEffect(() => {
    const measure = () => {
      const el = measureRef.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      let lh = parseFloat(cs.lineHeight);
      if (Number.isNaN(lh)) lh = parseFloat(cs.fontSize) * 1.5;
      const maxH = lh * 2 + 1; // two lines

      el.textContent = quoted;
      if (el.scrollHeight <= maxH) {
        setNeedsClamp(false);
        setDisplay(quoted);
        return;
      }
      setNeedsClamp(true);
      // Largest prefix that still fits once "… Read more" is appended.
      const suffix = '… Read more';
      let lo = 0, hi = quoted.length, best = 0;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        el.textContent = quoted.slice(0, mid) + suffix;
        if (el.scrollHeight <= maxH) { best = mid; lo = mid + 1; } else { hi = mid - 1; }
      }
      setDisplay(quoted.slice(0, best).replace(/\s+$/, ''));
    };

    measure();
    let ro;
    if (containerRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(containerRef.current);
    }
    return () => ro && ro.disconnect();
  }, [quoted]);

  return (
    <div ref={containerRef} className="mb-3 relative z-10">
      {/* Hidden measurer — same width & typography as the visible text. */}
      <p
        ref={measureRef}
        aria-hidden="true"
        className="text-sm leading-relaxed absolute invisible pointer-events-none left-0 right-0 top-0"
      />
      {expanded ? (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {quoted}{' '}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setExpanded(false); }}
            className="font-medium text-primary hover:underline focus:outline-none"
          >
            Read less
          </button>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {display}
          {needsClamp && (
            <>
              {'… '}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setExpanded(true); }}
                className="font-medium text-primary hover:underline focus:outline-none"
              >
                Read more
              </button>
            </>
          )}
        </p>
      )}
    </div>
  );
}

export function TestimonialList() {
  const [testimonials, setTestimonials] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const wrapperRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/testimonials`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
    const interval = setInterval(fetchTestimonials, 30000);
    const handleNewTestimonial = () => fetchTestimonials();
    window.addEventListener('testimonialAdded', handleNewTestimonial);
    return () => {
      clearInterval(interval);
      window.removeEventListener('testimonialAdded', handleNewTestimonial);
    };
  }, [fetchTestimonials]);

  // Only auto-scroll (and duplicate for the seamless loop) when there are more
  // than 3 reviews. With 3 or fewer, show them once, static — no scroll.
  const shouldScroll = testimonials.length > 2;
  const displayed = shouldScroll ? [...testimonials, ...testimonials] : testimonials;

  // CSS animation speed based on item count
  const duration = Math.max(testimonials.length * 6, 15);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 gradient-border h-full" data-testid="testimonials-carousel">
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-gray-100 dark:bg-white/5 shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass rounded-2xl p-6 gradient-border h-full flex flex-col"
      data-testid="testimonials-carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-lg font-semibold font-heading">
          {total > 0 ? `${total} Happy Client${total > 1 ? 's' : ''}` : 'Client Reviews'}
        </h3>
        {total > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        )}
      </div>

      {testimonials.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
          <Quote className="w-8 h-8 text-primary/40 mb-3" />
          <p className="text-muted-foreground">Be the first to leave a review!</p>
        </div>
      ) : (
        <div className={`relative flex-1 ${shouldScroll ? 'overflow-hidden' : 'overflow-y-auto'}`} ref={wrapperRef}>
          {/* top / bottom fade masks — only while auto-scrolling */}
          {shouldScroll && (
            <>
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-10 z-10 bg-gradient-to-b from-[hsl(var(--card))] to-transparent opacity-80" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 z-10 bg-gradient-to-t from-[hsl(var(--card))] to-transparent opacity-80" />
            </>
          )}

          <div
            className={`flex flex-col gap-3 ${shouldScroll ? 'testimonial-scroll' : ''}`}
            style={shouldScroll ? {
              animationDuration: `${duration}s`,
              animationPlayState: isPaused ? 'paused' : 'running',
            } : undefined}
          >
            {/* Duplicated for a seamless loop only when scrolling */}
            {displayed.map((t, idx) => (
              <div
                key={`${t.id || t.name}-${idx}`}
                className="relative p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 hover:border-primary/30 hover:bg-black/[0.02] dark:hover:bg-white/[0.05] transition-colors flex-shrink-0 overflow-hidden"
                data-testid="testimonial-card"
              >
                <Quote className="absolute -top-1 right-2 w-10 h-10 text-primary/[0.07]" />
                <div className="flex gap-0.5 mb-2 relative z-10">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-white/15'
                      }`}
                    />
                  ))}
                </div>
                <ReviewText text={t.message} />
                <div className="flex items-center gap-2.5 relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${avatarColor(t.name)} flex items-center justify-center flex-shrink-0`}
                  >
                    <span className="text-xs font-bold text-white">
                      {(t.name || '?').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.created_at ? formatDistanceToNow(new Date(t.created_at), { addSuffix: true }) : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
