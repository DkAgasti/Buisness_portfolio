'use client';

import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { openContactModal } from '@/components/ContactModal';
import { CONTAINER } from '@/lib/container';

export function ClosingCTA() {
  return (
    <section className="py-6 sm:py-8" data-testid="closing-cta-section">
      <div className={CONTAINER}>
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-3xl bg-[hsl(var(--band))] px-6 py-10 sm:px-12 sm:py-14">
            <svg
              className="absolute -left-10 -bottom-10 w-40 h-40 text-primary/10 pointer-events-none"
              viewBox="0 0 200 200"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M45,-59.4C58.3,-49.8,68.9,-35.9,73.6,-19.9C78.3,-3.9,77.1,14.2,69.4,29.1C61.7,44,47.5,55.7,31.7,63.4C15.9,71.1,-1.5,74.8,-18.1,71.4C-34.7,68,-50.5,57.5,-60.9,43.1C-71.3,28.7,-76.3,10.4,-74.1,-6.7C-71.9,-23.8,-62.5,-39.7,-49.3,-49.5C-36.1,-59.3,-19.1,-63,-1.5,-61C16.1,-59,31.7,-69,45,-59.4Z" transform="translate(100 100)" />
            </svg>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
              <div className="md:flex-1">
                <span className="inline-flex px-3.5 py-1.5 rounded-full bg-white text-xs font-medium text-primary mb-3" style={{ textTransform: 'none' }}>
                  Let&apos;s work together
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight max-w-md">
                  Have an idea? Let&apos;s build something great.
                </h2>
              </div>
              <div className="md:flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <p className="text-muted-foreground max-w-xs">
                  Get in touch and tell me about your project. I&apos;ll get back to you as soon as possible.
                </p>
                <button onClick={openContactModal} className="btn-primary px-6 py-3.5 whitespace-nowrap flex-shrink-0">
                  Start a Project
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
