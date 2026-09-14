'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Quote } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '';
const PAGE_SIZE = 3;

const AVATAR_GRADIENTS = [
  'from-orange-300 to-rose-400',
  'from-sky-300 to-indigo-400',
  'from-emerald-300 to-teal-400',
  'from-fuchsia-300 to-purple-400',
  'from-amber-300 to-orange-400',
];

function avatarGradient(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length];
}

export function TestimonialList() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/testimonials`);
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data.testimonials || []);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-surface rounded-2xl p-6 h-48 shimmer" />
        ))}
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="card-surface rounded-2xl p-10 text-center">
        <Quote className="w-8 h-8 text-primary/40 mx-auto mb-3" />
        <p className="text-muted-foreground">Be the first to leave a review!</p>
      </div>
    );
  }

  const pageCount = Math.ceil(testimonials.length / PAGE_SIZE);
  const visible = testimonials.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div data-testid="testimonials-carousel">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {visible.map((t, idx) => (
          <div key={`${t.id || t.name}-${idx}`} className="card-surface rounded-2xl p-6 flex flex-col" data-testid="testimonial-card">
            <Quote className="w-7 h-7 text-primary/25 mb-3" />
            <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">&ldquo;{t.message}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient(t.name)} flex items-center justify-center flex-shrink-0`}>
                <span className="text-xs font-bold text-white">{(t.name || '?').charAt(0).toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{t.name}</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`w-3 h-3 ${s <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-[hsl(var(--border))]'}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Go to testimonials page ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === page ? 'w-6 bg-primary' : 'w-2 bg-[hsl(var(--border))]'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
