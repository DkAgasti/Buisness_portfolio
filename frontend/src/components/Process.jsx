'use client';

import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CONTAINER } from '@/lib/container';

const STEPS = [
  { title: 'Discover', description: 'Understand your goals, users and requirements.' },
  { title: 'Design', description: 'Create wireframes, UI/UX and visual design.' },
  { title: 'Build', description: 'Develop, test and refine the product.' },
  { title: 'Launch', description: 'Deploy and support for long-term success.' },
];

export function Process() {
  return (
    <section id="process" className="py-14 sm:py-16 lg:py-20" data-testid="process-section">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,260px)_1fr] gap-8 lg:gap-10 items-start">
          <ScrollReveal>
            <span className="section-eyebrow mb-3 block">My Process</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3">How I Work</h2>
            <p className="text-muted-foreground">
              A simple, collaborative process to turn your ideas into real products.
            </p>
          </ScrollReveal>

          <div
            className="grid grid-cols-2 gap-x-6 gap-y-10 xl:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] xl:gap-x-4 xl:gap-y-0"
            data-testid="process-timeline"
          >
            {STEPS.map((step, idx) => (
              <Fragment key={step.title}>
                <ScrollReveal delay={idx * 0.08}>
                  <span className="block text-2xl font-bold font-heading text-primary mb-2">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-semibold font-heading text-base mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </ScrollReveal>
                {idx < STEPS.length - 1 && (
                  <ChevronRight
                    className="hidden xl:block w-5 h-5 text-primary/30 mt-2 flex-shrink-0 self-start"
                    aria-hidden="true"
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
