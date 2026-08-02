'use client';

import {
  Server, Database, Globe, Monitor, Zap, Search,
  Code2, Cloud, Smartphone, Layers, ArrowUpRight,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { useContent } from '@/components/ContentProvider';

const iconMap = {
  Server, Database, Globe, Monitor, Zap, Search, Code2, Cloud, Smartphone, Layers,
};

export function Services() {
  const { services: dynamicServices } = useContent();
  const services = dynamicServices || [];

  const scrollToContact = (e) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="py-14 sm:py-16 lg:py-24" data-testid="services-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10 lg:mb-12">
            <span className="section-eyebrow mb-4">Services</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3 mt-4">
              What I <span className="gradient-text">Offer</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              End-to-end engineering to take your product from idea to production.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {services.map((service, idx) => {
            const Icon = iconMap[service.icon] || Server;
            return (
              <ScrollReveal key={service.title} delay={idx * 0.06}>
                <SpotlightCard
                  className="glass rounded-2xl p-6 h-full gradient-border overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1"
                  data-testid="service-card"
                >
                  {/* corner glow */}
                  <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/10 border border-white/10 flex items-center justify-center mb-4 transition-colors group-hover:from-blue-500/30">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold font-heading text-lg mb-2">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="relative z-10 mt-5 pt-4 border-t border-white/5 flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    Learn more
                    <ArrowUpRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <a
              href="#contact"
              onClick={scrollToContact}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:gap-2.5"
            >
              Start a project
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
