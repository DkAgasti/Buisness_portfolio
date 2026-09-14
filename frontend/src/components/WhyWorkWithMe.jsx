'use client';

import Image from 'next/image';
import { Wand2, MessageSquare, Target, PackageCheck } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { CONTAINER } from '@/lib/container';

const REASONS = [
  {
    icon: Wand2,
    title: 'Design + Development',
    description: 'Beautiful interfaces, solid code.',
  },
  {
    icon: MessageSquare,
    title: 'Clear Communication',
    description: 'Regular updates, no confusion.',
  },
  {
    icon: Target,
    title: 'Business Focused',
    description: 'Solutions that drive real results.',
  },
  {
    icon: PackageCheck,
    title: 'End-to-End Delivery',
    description: "From idea to launch, I've got you covered.",
  },
];

export function WhyWorkWithMe() {
  return (
    <section id="why" className="relative py-16 sm:py-20 bg-[hsl(var(--band))] overflow-hidden" data-testid="why-section">
      <Image
        src="/images/why_work_bg.png"
        alt=""
        fill
        aria-hidden="true"
        className="object-cover pointer-events-none"
      />

      <div className={`relative ${CONTAINER}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <ScrollReveal>
            <span className="section-eyebrow mb-4 block">Why Work With Me</span>
            <h2 className="text-2xl sm:text-3xl lg:text-[2.15rem] font-bold font-heading tracking-tight leading-tight">
              You don&apos;t need another developer. You need someone who understands the product.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-7">
            {REASONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.title} delay={(idx % 4) * 0.06}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold font-heading text-sm mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
