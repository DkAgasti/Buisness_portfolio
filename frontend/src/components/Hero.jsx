'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Play, Star, FolderKanban, Users, CalendarDays, Award } from 'lucide-react';
import { openContactModal } from '@/components/ContactModal';
import { CONTAINER } from '@/lib/container';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { useContent } from '@/components/ContentProvider';
import { realUrl } from '@/lib/project';

const AVATAR_COUNT = 5;
const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export function Hero() {
  const { siteConfig } = useContent();
  const config = siteConfig || {};

  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    fetch(`${API}/api/testimonials`)
      .then((r) => r.json())
      .then((data) => setReviews(Array.isArray(data.testimonials) ? data.testimonials : []))
      .catch(() => {});
  }, []);

  const avgRating = reviews.length
    ? Math.round((reviews.reduce((sum, t) => sum + (t.rating || 0), 0) / reviews.length) * 10) / 10
    : 5;

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const reveal = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: [0.21, 0.47, 0.32, 0.98] },
  });

  // Client Satisfaction has no CMS field (site config only tracks projects/
  // clients/experience), so it stays a fixed 100 — everything else is
  // admin-editable, falling back to these defaults if unset.
  const stats = [
    { icon: FolderKanban, value: config.stats_projects || 6, suffix: '+', label: 'Projects Completed' },
    { icon: Users, value: config.stats_clients || 5, suffix: '+', label: 'Happy Clients' },
    { icon: CalendarDays, value: config.stats_experience || 3, suffix: '+', label: 'Years of Experience' },
    { icon: Award, value: 100, suffix: '%', label: 'Client Satisfaction' },
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-10 sm:pt-14" data-testid="hero-section">
      {/* Soft ambient blobs, localized to hero */}
      <div className="blob w-[380px] h-[380px] bg-indigo-300/30 -top-20 -left-24" aria-hidden="true" />
      <div className="blob w-[320px] h-[320px] bg-violet-300/25 top-10 right-0" aria-hidden="true" />

      <div className={`relative ${CONTAINER}`}>
        {/* Text column gets a fixed, comfortable reading width; the image
            column takes all remaining space and scales to fill it (its
            source is exactly 3:2, matching the frame below with no
            letterboxing) instead of leaving dead space on wide screens. */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,480px)_1fr] gap-12 items-center">
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
              Websites, mobile apps and custom digital products designed beautifully and built to perform.
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
                {Array.from({ length: AVATAR_COUNT }).map((_, i) => {
                  const t = reviews[i];
                  if (!t) {
                    return (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-full bg-[hsl(var(--band))] border-2 border-[hsl(var(--background))]"
                      />
                    );
                  }
                  return realUrl(t.avatar) ? (
                    <img
                      key={t._id || t.id || i}
                      src={t.avatar}
                      alt={t.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-[hsl(var(--background))]"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div
                      key={t._id || t.id || i}
                      className="w-9 h-9 rounded-full border-2 border-[hsl(var(--background))] bg-primary/10 flex items-center justify-center"
                    >
                      <span className="text-xs font-semibold text-primary">
                        {(t.name || '?').trim()[0]?.toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium">Trusted by 10+ happy clients</p>
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-[hsl(var(--border))]'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">{avgRating.toFixed(1)}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative aspect-[3/2] hidden sm:block"
            style={{
              // Fades the image's own rectangular edge into the page
              // background instead of showing a hard boundary.
              maskImage: 'radial-gradient(ellipse 68% 68% at center, black 55%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 68% 68% at center, black 55%, transparent 100%)',
            }}
          >
            <Image
              src="/images/portfolio_hero.png"
              alt="Product mockup — laptop and phone showing the app"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain"
            />
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
                <AnimatedCounter end={value} suffix={suffix} />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
