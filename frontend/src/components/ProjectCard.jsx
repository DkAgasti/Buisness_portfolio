'use client';

import { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { getCover, gradientFor, realUrl, hasCaseStudy } from '@/lib/project';

const MAX_TILT = 6; // degrees

export function ProjectCard({ project, onOpen, className = '' }) {
  const cardRef = useRef(null);
  const rotateX = useSpring(0, { stiffness: 200, damping: 18 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 18 });

  const cover = getCover(project);
  const [c1, c2] = gradientFor(project.name || project.category || '');
  const showCase = hasCaseStudy(project);
  const initials = (project.name || '?')
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  const tiltEnabled = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    el.style.setProperty('--mx', `${px}px`);
    el.style.setProperty('--my', `${py}px`);
    if (tiltEnabled()) {
      rotateY.set(((px / rect.width) - 0.5) * (MAX_TILT * 2));
      rotateX.set((0.5 - py / rect.height) * (MAX_TILT * 2));
    }
  };

  const handleLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const open = () => onOpen(project);
  const stop = (e) => e.stopPropagation();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35 }}
      className={className}
      style={{ perspective: 1000 }}
      data-testid="project-card"
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        onClick={open}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), open())}
        whileHover={{ y: -6 }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative h-full flex flex-col rounded-2xl overflow-hidden glass gradient-border cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-target"
        aria-label={`Open case study for ${project.name}`}
      >
        {/* Cursor spotlight */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
          style={{
            background:
              'radial-gradient(320px circle at var(--mx) var(--my), rgba(99,102,241,0.14), transparent 45%)',
          }}
        />

        {/* Media / preview */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Reveal className="w-full h-full">
            {cover ? (
              <img
                src={cover}
                alt={`${project.name} preview`}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center relative"
                style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
              >
                <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
                <span className="relative text-5xl font-bold font-heading text-white/90 drop-shadow-lg transition-transform duration-500 group-hover:scale-110">
                  {initials}
                </span>
              </div>
            )}
          </Reveal>
          {/* gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

          {/* Category chip */}
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs rounded-md bg-black/40 backdrop-blur-md border border-white/15 text-white font-medium">
            {project.category}
          </span>

          {/* Open affordance */}
          <div className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Body */}
        <div className="relative z-10 p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-semibold font-heading leading-snug">{project.name}</h3>
            <div className="flex gap-2 flex-shrink-0" onClick={stop}>
              {realUrl(project.github) && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 hover:text-primary transition-colors"
                  aria-label={`${project.name} GitHub`}
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {realUrl(project.live) && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 hover:text-primary transition-colors"
                  aria-label={`${project.name} Live Demo`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          <p className="text-[0.925rem] text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          <div className="mt-auto flex flex-wrap gap-1.5">
            {(project.tech || []).slice(0, 5).map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-xs rounded-md bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-muted-foreground"
              >
                {t}
              </span>
            ))}
            {(project.tech || []).length > 5 && (
              <span className="px-2 py-0.5 text-xs rounded-md text-muted-foreground">
                +{project.tech.length - 5}
              </span>
            )}
          </div>

          {showCase && (
            <div className="mt-4 pt-3 border-t border-black/[0.06] dark:border-white/5 flex items-center gap-1.5 text-xs font-medium text-primary opacity-80 group-hover:opacity-100 transition-opacity">
              View case study
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
