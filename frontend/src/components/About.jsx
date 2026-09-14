'use client';

import { ArrowRight, CalendarDays, FolderKanban, Users } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Placeholder } from '@/components/ui/placeholder';
import { DEFAULT_NAME, DEFAULT_ROLE } from '@/lib/identity';
import { CONTAINER } from '@/lib/container';

const TECH = ['React', 'Next.js', 'Node.js', 'MongoDB', 'Expo', 'Figma'];

const BIO =
  "I'm a passionate developer who loves turning ideas into polished digital products. I work with businesses, startups and individuals to build websites, mobile apps and custom solutions that not only look great but also solve real problems.";

const STATS = [
  { icon: CalendarDays, value: 3, suffix: '+', label: 'Years of Experience' },
  { icon: FolderKanban, value: 6, suffix: '+', label: 'Projects Completed' },
  { icon: Users, value: 5, suffix: '+', label: 'Happy Clients' },
];

export function About() {
  const name = DEFAULT_NAME;
  const role = DEFAULT_ROLE;
  const stats = STATS;

  const scrollToTop = (e) => {
    e.preventDefault();
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="py-14 sm:py-16 lg:py-20" data-testid="about-section">
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,260px)_1fr_minmax(0,220px)] gap-10 lg:gap-8 items-start">
          {/* Portrait */}
          <ScrollReveal>
            <div className="relative w-full max-w-[260px] mx-auto lg:mx-0">
              <Placeholder ratio="4/5" rounded="rounded-[1.75rem]" label="portrait" className="w-full shadow-sm" />
              <div className="sticky-note absolute -top-4 -right-6 -rotate-6 bg-white card-surface rounded-lg px-4 py-2">
                Build Good Things
              </div>
            </div>
          </ScrollReveal>

          {/* Bio */}
          <ScrollReveal delay={0.1}>
            <span className="section-eyebrow mb-3 block">About Me</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-1">I&apos;m {name}</h2>
            {role && <p className="text-muted-foreground mb-4">{role}</p>}
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-prose">{BIO}</p>

            <div className="flex flex-wrap gap-2 mb-7">
              {TECH.map((t) => (
                <span key={t} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[hsl(var(--muted))] text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>

            <a href="#about" onClick={scrollToTop} className="btn-outline inline-flex px-5 py-2.5 text-sm">
              More about me
              <ArrowRight className="w-4 h-4" />
            </a>
          </ScrollReveal>

          {/* Stats card */}
          <ScrollReveal delay={0.15} className="relative">
            <div className="card-surface rounded-2xl p-5 flex flex-col divide-y divide-[hsl(var(--border))]">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--muted))] flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold font-heading leading-tight">
                      {s.value}
                      {s.suffix}
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky-note absolute -bottom-5 -right-2 rotate-2 bg-white card-surface rounded-lg px-4 py-2 whitespace-nowrap">
              Let&apos;s build something great
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
