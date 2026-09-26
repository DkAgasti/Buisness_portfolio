'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight, TrendingUp } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { Placeholder } from '@/components/ui/placeholder';
import { useContent } from '@/components/ContentProvider';
import { getCover, realUrl } from '@/lib/project';
import { PROJECTS as FALLBACK_PROJECTS } from '@/lib/projects-data';
import { CONTAINER } from '@/lib/container';

function FeaturedCard({ project, onOpen, large = false }) {
  const cover = getCover(project);
  return (
    <button
      onClick={() => onOpen(project)}
      className={`group w-full text-left relative rounded-2xl overflow-hidden h-full flex flex-col justify-end ${
        large ? 'min-h-[420px] sm:min-h-[520px]' : 'min-h-[420px]'
      }`}
      data-testid="project-card"
      aria-label={`Open case study for ${project.name}`}
    >
      {realUrl(cover) ? (
        <img
          src={cover}
          alt={project.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <Placeholder
          ratio={project.placeholderRatio || '4/5'}
          rounded="rounded-none"
          label={project.placeholderLabel}
          className="absolute inset-0 w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      <span className="absolute top-4 left-4 px-3 py-1 text-[11px] rounded-full bg-primary text-white font-semibold uppercase tracking-wide">
        Featured
      </span>
      {project.category && (
        <span className="absolute bottom-[6.5rem] left-4 px-2.5 py-1 text-[11px] rounded-md bg-white/90 text-foreground font-medium">
          {project.category}
        </span>
      )}

      <div className="relative z-10 p-5 text-white">
        <h3 className="text-xl font-bold font-heading mb-1">{project.name}</h3>
        <p className="text-sm text-white/80 mb-2">{project.description}</p>
        {project.result && (
          <p className="inline-flex items-center gap-1.5 text-xs text-white/70">
            <TrendingUp className="w-3.5 h-3.5" />
            {project.result}
          </p>
        )}
      </div>

      <span className="absolute bottom-5 right-5 w-9 h-9 rounded-full bg-white flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
        <ArrowUpRight className="w-4 h-4" />
      </span>
    </button>
  );
}

export function Projects() {
  const [selected, setSelected] = useState(null);
  const { projects: adminProjects } = useContent();
  const PROJECTS = Array.isArray(adminProjects) && adminProjects.length > 0 ? adminProjects : FALLBACK_PROJECTS;
  const featured = PROJECTS.find((p) => p.featured) || PROJECTS[0];
  const rest = PROJECTS.filter((p) => p !== featured);

  return (
    <section id="projects" className="py-14 sm:py-16 lg:py-20" data-testid="projects-section">
      <div className={CONTAINER}>
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10 lg:mb-12">
            <div>
              <span className="section-eyebrow mb-3 block">My Portfolio</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3">Selected Work</h2>
              <p className="text-muted-foreground max-w-md">
                A few of my recent projects. Each one was a unique challenge, and I&apos;m proud of the results.
              </p>
            </div>
            <Link href="/work" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all whitespace-nowrap">
              View all projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          {rest.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-2">
                <FeaturedCard project={featured} onOpen={setSelected} />
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {rest.map((project, i) => (
                  <ProjectCard key={project._id || project.id || `${project.name}-${i}`} project={project} onOpen={setSelected} />
                ))}
              </div>
            </div>
          ) : (
            <FeaturedCard project={featured} onOpen={setSelected} large />
          )}
        </ScrollReveal>
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
