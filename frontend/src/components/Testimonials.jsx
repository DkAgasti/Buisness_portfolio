'use client';

import { ArrowRight, Quote } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Placeholder } from '@/components/ui/placeholder';
import { TESTIMONIALS } from '@/lib/testimonials-data';
import { CONTAINER } from '@/lib/container';

const DOT_COUNT = 4;

export function Testimonials() {
  const scrollToTop = (e) => {
    e.preventDefault();
    document.querySelector('#testimonials')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="testimonials" className="py-14 sm:py-16 lg:py-20" data-testid="testimonials-section">
      <div className={CONTAINER}>
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10 lg:mb-12">
            <div>
              <span className="section-eyebrow mb-3 block">Testimonials</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3">What Clients Say</h2>
              <p className="text-muted-foreground max-w-md">
                Don&apos;t just take my word for it. Here&apos;s what my clients have to say about working with me.
              </p>
            </div>
            <a href="#testimonials" onClick={scrollToTop} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all whitespace-nowrap">
              View all testimonials
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5" data-testid="testimonials-carousel">
          {TESTIMONIALS.map((t, idx) => (
            <ScrollReveal key={t.id} delay={idx * 0.08}>
              <div className="card-surface rounded-2xl p-6 h-full flex flex-col" data-testid="testimonial-card">
                <Quote className="w-8 h-8 text-primary/20 mb-3 flex-shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">{t.message}</p>
                <div className="flex items-center gap-3">
                  <Placeholder ratio="1/1" rounded="rounded-full" className="w-10 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: DOT_COUNT }).map((_, i) => (
            <span
              key={i}
              aria-hidden="true"
              className={`h-2 rounded-full transition-all ${i === 0 ? 'w-6 bg-primary' : 'w-2 bg-[hsl(var(--border))]'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
