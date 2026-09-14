'use client';

import { Code2, Smartphone, Sparkles, Layers, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { openContactModal } from '@/components/ContactModal';
import { CONTAINER } from '@/lib/container';

const SERVICES = [
  {
    icon: Code2,
    title: 'Website Development',
    description: 'Modern, responsive websites and web applications.',
  },
  {
    icon: Smartphone,
    title: 'Mobile App Development',
    description: 'iOS & Android applications with polished UX.',
  },
  {
    icon: Sparkles,
    title: 'UI/UX Design',
    description: 'Clean interfaces designed around users and business goals.',
  },
  {
    icon: Layers,
    title: 'Custom Digital Products',
    description: 'From idea → design → development → launch.',
  },
];

export function Services() {
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
            <a href="#services" onClick={scrollToTop} className="btn-outline inline-flex px-5 py-2.5 text-sm">
              View all services
              <ArrowRight className="w-4 h-4" />
            </a>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {SERVICES.map((service, idx) => {
              const Icon = service.icon;
              return (
                <ScrollReveal key={service.title} delay={idx * 0.06}>
                  <div className="card-surface rounded-2xl p-6 h-full flex flex-col" data-testid="service-card">
                    <div className="w-11 h-11 rounded-xl bg-[hsl(var(--muted))] flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-semibold font-heading text-base mb-1.5">{service.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{service.description}</p>
                    <div className="mt-4 text-primary">
                      <ArrowUpRight className="w-4 h-4" />
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
