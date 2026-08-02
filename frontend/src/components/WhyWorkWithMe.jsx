'use client';

import {
  ShieldCheck, Layers, Sparkles, MessageSquare,
  Bot, Server, Smartphone, LifeBuoy,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { useContent } from '@/components/ContentProvider';

const iconMap = { ShieldCheck, Layers, Sparkles, MessageSquare, Bot, Server, Smartphone, LifeBuoy };

export function WhyWorkWithMe() {
  const { why: dynamicWhy } = useContent();
  const whyWorkWithMe = dynamicWhy || [];

  if (!whyWorkWithMe || whyWorkWithMe.length === 0) return null;

  return (
    <section id="why" className="py-14 sm:py-16 lg:py-24" data-testid="why-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10 lg:mb-12">
            <span className="section-eyebrow mb-4">Why me</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3 mt-4">
              Built to be <span className="gradient-text">reliable</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Not just code that works today — software you can trust to grow.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {whyWorkWithMe.map((item, idx) => {
            const Icon = iconMap[item.icon] || ShieldCheck;
            return (
              <ScrollReveal key={item.title} delay={(idx % 4) * 0.06}>
                <SpotlightCard className="glass rounded-2xl p-6 h-full gradient-border overflow-hidden transition-transform duration-300 hover:-translate-y-1">
                  {/* corner glow on hover */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/10 border border-white/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold font-heading text-base mb-1.5">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
