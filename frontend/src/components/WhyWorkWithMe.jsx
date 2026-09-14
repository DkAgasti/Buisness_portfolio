'use client';

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
      {/* Decorative flowing shapes bleeding off both edges */}
      <svg
        className="absolute -left-24 top-1/2 -translate-y-1/2 w-64 h-64 text-white/40 pointer-events-none"
        viewBox="0 0 200 200"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M45,-59.4C58.3,-49.8,68.9,-35.9,73.6,-19.9C78.3,-3.9,77.1,14.2,69.4,29.1C61.7,44,47.5,55.7,31.7,63.4C15.9,71.1,-1.5,74.8,-18.1,71.4C-34.7,68,-50.5,57.5,-60.9,43.1C-71.3,28.7,-76.3,10.4,-74.1,-6.7C-71.9,-23.8,-62.5,-39.7,-49.3,-49.5C-36.1,-59.3,-19.1,-63,-1.5,-61C16.1,-59,31.7,-69,45,-59.4Z" transform="translate(100 100)" />
      </svg>
      <svg
        className="absolute -right-20 -bottom-16 w-72 h-72 text-primary/10 pointer-events-none"
        viewBox="0 0 200 200"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M39.6,-51.2C52.3,-42.9,64.2,-32.1,69.6,-18.3C75.1,-4.6,74.1,12.1,67.1,26C60.1,39.9,47.1,51,32.7,58.6C18.3,66.2,2.5,70.3,-13.6,69.1C-29.6,68,-45.9,61.6,-56.7,49.9C-67.5,38.1,-72.8,21,-73.4,3.6C-74,-13.9,-70,-27.7,-61.1,-37.5C-52.2,-47.3,-38.4,-53.1,-25.1,-60.6C-11.8,-68.1,1,-77.3,14.1,-75.6C27.3,-73.9,26.9,-59.4,39.6,-51.2Z" transform="translate(100 100)" />
      </svg>

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
