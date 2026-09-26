'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  ExternalLink,
  Github,
  Target,
  Lightbulb,
  Mountain,
  ListChecks,
  Layers,
  TrendingUp,
  Workflow,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  getCover,
  getGallery,
  getVideos,
  getMobileShots,
  getResults,
  toList,
  realUrl,
  gradientFor,
} from '@/lib/project';
import { Placeholder } from '@/components/ui/placeholder';

/**
 * Auto-playing hero carousel: each slide glides right-to-left, then the next
 * image comes in. Pauses on hover, supports dots + arrows, and loops.
 */
function HeroCarousel({ images, alt }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;

  const go = (i) => setIndex(((i % count) + count) % count);

  useEffect(() => {
    if (paused || count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 3500);
    return () => clearInterval(id);
  }, [paused, count]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Sliding track */}
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${alt} ${i + 1}`}
            draggable={false}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
            className="w-full h-full flex-shrink-0 object-cover select-none"
          />
        ))}
      </div>

      {/* Prev / Next */}
      <button
        onClick={() => go(index - 1)}
        aria-label="Previous image"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={() => go(index + 1)}
        aria-label="Next image"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Dots */}
      <div className="absolute top-4 left-4 z-20 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to image ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <section className="mb-8">
      <h3 className="flex items-center gap-2 text-sm font-semibold font-heading uppercase tracking-wider text-primary mb-3">
        <Icon className="w-4 h-4" />
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move focus into the dialog for keyboard users.
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [onClose]);

  const cover = getCover(project);
  const gallery = getGallery(project);
  // Design preview only: shown when the admin hasn't uploaded real gallery
  // photos yet, so the scrollable layout is visible before real data exists.
  const placeholderGallery = gallery.length === 0 ? project.placeholderGallery || [] : [];
  // Cover + gallery images, de-duplicated — used for the auto-sliding hero.
  const heroImages = Array.from(new Set([cover, ...gallery.map((g) => g.url)].filter(Boolean)));
  const videos = getVideos(project);
  const mobileShots = getMobileShots(project);
  const results = getResults(project);
  const challenges = toList(project.challenges);
  const process = toList(project.process || project.developmentProcess);
  const features = toList(project.features);
  const [c1, c2] = gradientFor(project.name || '');
  const metaItems = [
    project.role && { label: 'My Role', value: project.role },
    (project.timeline || project.duration) && { label: 'Timeline', value: project.timeline || project.duration },
    project.client && { label: 'Client', value: project.client },
    project.year && { label: 'Year', value: project.year },
  ].filter(Boolean);

  return (
    <motion.div
      className="fixed inset-0 z-[9997] flex items-stretch sm:items-center justify-center p-0 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      data-testid="project-modal"
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="relative w-full max-w-4xl card-surface sm:rounded-3xl overflow-hidden flex flex-col max-h-[100dvh] sm:max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        {/* Close */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md border border-white/15 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          aria-label="Close case study"
          data-testid="project-modal-close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero */}
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden flex-shrink-0">
          {heroImages.length > 1 ? (
            <HeroCarousel images={heroImages} alt={`${project.name} screenshot`} />
          ) : cover ? (
            <img src={cover} alt={`${project.name} cover`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
              <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0c14] via-[#0a0c14]/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="inline-block px-2.5 py-1 text-xs rounded-md bg-primary/20 border border-primary/30 text-primary-foreground/90 font-medium mb-2">
              {project.category}
            </span>
            <h2 id="project-modal-title" className="text-2xl sm:text-3xl font-bold font-heading text-white">
              {project.name}
            </h2>
          </div>
        </div>

        {/* Body — fills remaining height and scrolls internally on any screen */}
        <div className="p-6 sm:p-8 flex-1 min-h-0 overflow-y-auto overscroll-contain">
          {/* Action links */}
          {(realUrl(project.live) || realUrl(project.github)) && (
            <div className="flex flex-wrap gap-3 mb-8">
              {realUrl(project.live) && (
                <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn-primary px-5 py-2.5 text-sm">
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
              {realUrl(project.github) && (
                <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn-outline px-5 py-2.5 text-sm">
                  <Github className="w-4 h-4" /> View Code
                </a>
              )}
            </div>
          )}

          {/* Project meta (rendered only when provided by the CMS) */}
          {metaItems.length > 0 && (
            <div className="flex flex-wrap gap-x-10 gap-y-4 mb-8 pb-6 border-b border-[hsl(var(--border))]">
              {metaItems.map((m) => (
                <div key={m.label}>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground/70 mb-1">
                    {m.label}
                  </div>
                  <div className="text-sm font-medium">{m.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Overview */}
          {project.description && (
            <Section icon={Target} title="Overview">
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            </Section>
          )}

          {/* Gallery — every uploaded picture, scrollable at the visitor's own pace
              (separate from the auto-cycling hero carousel above). */}
          {(gallery.length > 0 || placeholderGallery.length > 0) && (
            <Section icon={Layers} title="Gallery">
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                {gallery.length > 0
                  ? gallery.map((g, i) => (
                      <img
                        key={i}
                        src={g.url}
                        alt={g.caption || `${project.name} screenshot ${i + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="snap-start h-64 sm:h-80 w-auto max-w-[90%] flex-shrink-0 rounded-2xl border-2 border-[hsl(var(--border))] object-cover"
                      />
                    ))
                  : placeholderGallery.map((label, i) => (
                      <Placeholder
                        key={i}
                        ratio="16/10"
                        label={label}
                        className="snap-start h-64 sm:h-80 w-auto max-w-[90%] flex-shrink-0"
                      />
                    ))}
              </div>
            </Section>
          )}

          {project.problem && (
            <Section icon={Target} title="The Problem">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.problem}</p>
            </Section>
          )}

          {project.solution && (
            <Section icon={Lightbulb} title="The Solution">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.solution}</p>
            </Section>
          )}

          {challenges.length > 0 && (
            <Section icon={Mountain} title="Challenges">
              <ul className="space-y-2.5">
                {challenges.map((c, i) => (
                  <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {process.length > 0 && (
            <Section icon={Workflow} title="Development Process">
              <ol className="space-y-3">
                {process.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {features.length > 0 && (
            <Section icon={ListChecks} title="Key Features">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-2.5 text-sm p-3 rounded-lg bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
                    <ListChecks className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {project.architecture && (
            <Section icon={Layers} title="Architecture">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{project.architecture}</p>
            </Section>
          )}

          {/* Results */}
          {(results.metrics.length > 0 || results.text || (results.list && results.list.length)) && (
            <Section icon={TrendingUp} title="Results & Impact">
              {results.metrics.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  {results.metrics.map((m, i) => (
                    <div key={i} className="card-surface rounded-xl p-4 text-center">
                      <div className="text-2xl font-bold font-heading gradient-text">{m.value}</div>
                      <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}
              {results.text && <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{results.text}</p>}
              {results.list && results.list.length > 0 && (
                <ul className="space-y-2.5">
                  {results.list.map((r, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <Section icon={Layers} title="Demo Videos">
              <div className="space-y-4">
                {videos.map((v, i) => (
                  <video
                    key={i}
                    src={v.url}
                    controls
                    preload="metadata"
                    className="w-full rounded-xl border border-[hsl(var(--border))] bg-black"
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Mobile screenshots */}
          {mobileShots.length > 0 && (
            <Section icon={Layers} title="Mobile Screens">
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {mobileShots.map((m, i) => (
                  <img
                    key={i}
                    src={m.url}
                    alt={m.caption || `${project.name} mobile ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    className="h-72 w-auto rounded-2xl border-2 border-[hsl(var(--border))] flex-shrink-0"
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Tech stack */}
          {(project.tech || []).length > 0 && (
            <Section icon={Layers} title="Tech Stack">
              <div className="flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 text-sm rounded-lg bg-foreground/[0.06] border border-foreground/15 text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
