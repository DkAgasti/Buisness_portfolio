'use client';

import {
  Code2, Smartphone, Sparkles, Layers, ArrowRight, ArrowUpRight,
  Server, Database, Globe, Monitor, Zap, Search, Cloud, Shield, Cpu,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { openContactModal } from '@/components/ContactModal';
import { useContent } from '@/components/ContentProvider';
import { CONTAINER } from '@/lib/container';

// Fallback shown only while the admin hasn't added any services yet, or the API is unreachable.
const FALLBACK_SERVICES = [
  { icon: Code2, title: 'Website Development', description: 'Modern, responsive websites and web applications.' },
  { icon: Smartphone, title: 'Mobile App Development', description: 'iOS & Android applications with polished UX.' },
  { icon: Sparkles, title: 'UI/UX Design', description: 'Clean interfaces designed around users and business goals.' },
  { icon: Layers, title: 'Custom Digital Products', description: 'From idea → design → development → launch.' },
];

// Matches the icon choices offered in Admin > Services.
const ICON_MAP = { Server, Database, Globe, Monitor, Zap, Search, Cloud, Code2, Shield, Cpu };

export function Services() {
  const { services: servicesData } = useContent();
  const services =
    Array.isArray(servicesData) && servicesData.length > 0
      ? servicesData.map((s) => ({ ...s, icon: ICON_MAP[s.icon] || Layers }))
      : FALLBACK_SERVICES;

  const scrollToTop = (e) => {
    e.preventDefault();
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="services" className="py-14 sm:py-16 lg:py-20" data-testid="services-section">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,260px)_1fr] gap-8 lg:gap-10 items-start">
          <ScrollReveal>
            <span className="section-eyebrow mb-3 block">What I Do</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3">Services</h2>
            <p className="text-muted-foreground mb-6">
              End-to-end digital solutions to help your business grow and succeed.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1} className="min-w-0">
            <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
              <div className="flex w-max gap-4 sm:gap-5 services-marquee-track">
                {[...services, ...services].map((service, idx) => {
                  const Icon = service.icon;
                  return (
                    <div
                      key={idx}
                      className="card-surface rounded-2xl p-6 w-64 sm:w-72 flex-shrink-0 flex flex-col"
                      data-testid="service-card"
                    >
                      <div className="w-11 h-11 rounded-xl bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold font-heading text-base mb-1.5">{service.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">{service.description}</p>
                      <div className="mt-4 text-primary">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
