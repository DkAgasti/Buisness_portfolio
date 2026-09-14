'use client';

import Image from 'next/image';
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
            <Image
              src="/images/Footer_image.png"
              alt=""
              fill
              aria-hidden="true"
              className="object-cover pointer-events-none"
            />

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
