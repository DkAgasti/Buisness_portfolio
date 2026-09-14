'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Globe, Smartphone, Code2, FolderKanban, Users, CalendarDays, Award } from 'lucide-react';
import { openContactModal } from '@/components/ContactModal';
import { Placeholder } from '@/components/ui/placeholder';
import { CONTAINER } from '@/lib/container';

const AVATAR_COUNT = 5;

export function Hero() {
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] },
  });

  const stats = [
    { icon: FolderKanban, value: 6, suffix: '+', label: 'Projects Completed' },
    { icon: Users, value: 5, suffix: '+', label: 'Happy Clients' },
    { icon: CalendarDays, value: 3, suffix: '+', label: 'Years of Experience' },
    { icon: Award, value: 100, suffix: '%', label: 'Client Satisfaction' },
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-10 sm:pt-14" data-testid="hero-section">
      {/* Soft ambient blobs, localized to hero */}
      <div className="blob w-[380px] h-[380px] bg-indigo-300/30 -top-20 -left-24" aria-hidden="true" />
      <div className="blob w-[320px] h-[320px] bg-violet-300/25 top-10 right-0" aria-hidden="true" />

      <div className={`relative ${CONTAINER}`}>
        {/* Capped (not re-centered, so it stays pinned to the same left edge
            as the container/navbar) so the two-column composition can't
            stretch apart into dead space on very wide screens. */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl">
          {/* Left: copy */}
          <div>
            <motion.div {...reveal(0)} className="mb-5">
              <span
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[hsl(var(--border))] font-medium text-xs text-primary"
                style={{ textTransform: 'none' }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Available for new projects
              </span>
            </motion.div>

            <motion.h1
              {...reveal(0.1)}
              className="text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] font-bold font-heading tracking-tight mb-5"
            >
              I turn ideas into
              <br />
              <span className="gradient-text">digital experiences.</span>
            </motion.h1>

            <motion.p {...reveal(0.2)} className="text-base sm:text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
              Websites, mobile apps and custom digital products — designed beautifully and built to perform.
            </motion.p>

            <motion.div {...reveal(0.3)} className="flex flex-wrap gap-4 mb-9">
              <button onClick={openContactModal} className="btn-primary px-6 py-3.5" data-testid="hero-primary-cta-button">
                Start a Project
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="#projects"
                onClick={(e) => handleScrollTo(e, '#projects')}
                className="btn-outline px-6 py-3.5"
                data-testid="hero-secondary-cta-button"
              >
                <Play className="w-4 h-4" />
                View My Work
              </a>
            </motion.div>

            <motion.div {...reveal(0.4)} className="flex items-center gap-3" data-testid="hero-trust-indicators">
              <div className="flex -space-x-3">
                {Array.from({ length: AVATAR_COUNT }).map((_, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-[hsl(var(--band))] border-2 border-[hsl(var(--background))]"
                  />
                ))}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium">Trusted by 10+ happy clients</p>
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">5.0</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative h-[340px] sm:h-[420px] lg:h-[460px] hidden sm:block"
          >
            {/* Soft decorative ring behind the composition */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] aspect-square rounded-full border border-primary/15" aria-hidden="true" />

            {/* Potted plant, behind the laptop's top-left corner */}
            <Placeholder
              ratio="1/1"
              rounded="rounded-lg"
              className="absolute left-6 top-2 w-11 shadow-md z-0"
            />

            {/* Laptop / browser card */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-3 w-[76%] max-w-[400px] rounded-2xl card-surface shadow-xl overflow-hidden z-[5]">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[hsl(var(--border))]">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
              </div>
              <Placeholder ratio="16/10" rounded="rounded-none" label="Product dashboard" className="w-full" />
            </div>

            {/* Phone card */}
            <div className="absolute right-0 sm:right-4 bottom-0 rotate-3 w-[124px] sm:w-[150px] rounded-[1.6rem] card-surface shadow-xl overflow-hidden border-4 border-white z-10">
              <Placeholder ratio="9/19.5" rounded="rounded-none" label="App screen" className="w-full" />
            </div>

            {/* Floating labeled chips */}
            <div className="absolute left-0 top-6 flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl card-surface shadow-lg z-10">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Globe className="w-3.5 h-3.5 text-primary" />
              </span>
              <span className="text-xs font-medium">Web Apps</span>
            </div>
            <div className="absolute right-10 sm:right-16 top-24 flex items-center gap-2 pl-2 pr-3 py-2 rounded-xl card-surface shadow-lg z-10">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-3.5 h-3.5 text-primary" />
              </span>
              <span className="text-xs font-medium">Mobile Apps</span>
            </div>
            <div className="absolute left-4 bottom-8 w-9 h-9 rounded-lg card-surface shadow-lg flex items-center justify-center z-10">
              <Code2 className="w-4 h-4 text-primary" />
            </div>

            {/* Code snippet chip */}
            <div className="absolute right-2 top-0 w-32 rounded-xl bg-[#161328] shadow-lg px-3 py-2.5 font-mono text-[9px] leading-relaxed text-indigo-200/90 z-10">
              <span className="text-pink-300">const</span> app = () =&gt;{'{'}
              <br />
              &nbsp;&nbsp;<span className="text-sky-300">return</span> &lt;div
              <br />
              &nbsp;&nbsp;className=&quot;app&quot;/&gt;
            </div>

            {/* Handwritten annotation */}
            <p className="sticky-note absolute -bottom-2 right-6 sm:right-2 -rotate-3 z-20 text-primary/70 text-base whitespace-nowrap">
              Ideas → Real Products
            </p>
          </motion.div>
        </div>

        {/* Stats bar — one continuous card, divided by internal rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-14 sm:mt-16 mb-10 card-surface rounded-2xl grid grid-cols-2 sm:grid-cols-4"
          data-testid="hero-stats"
        >
          {stats.map(({ icon: Icon, value, suffix, label }, i) => (
            <div
              key={label}
              className={`p-5 sm:p-6 text-center ${i > 0 ? 'border-t sm:border-t-0 sm:border-l border-[hsl(var(--border))]' : ''}`}
            >
              <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-2xl sm:text-3xl font-bold font-heading">
                {value}
                {suffix}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
