'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { useContent } from '@/components/ContentProvider';
import { PROJECTS as FALLBACK_PROJECTS } from '@/lib/projects-data';
import { CONTAINER } from '@/lib/container';

const PAGE_SIZE = 12;

export function WorkGrid() {
  const { projects: adminProjects } = useContent();
  const PROJECTS = Array.isArray(adminProjects) && adminProjects.length > 0 ? adminProjects : FALLBACK_PROJECTS;

  const categories = useMemo(() => {
    const set = new Set(PROJECTS.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [PROJECTS]);

  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState(null);

  const filtered = activeCategory === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === activeCategory);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section className="pt-10 sm:pt-14 pb-14 sm:pb-16 lg:pb-20" data-testid="work-page-section">
      <div className={CONTAINER}>
        <ScrollReveal>
          <span className="section-eyebrow mb-3 block">My Portfolio</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight mb-3">
            All Projects
          </h1>
          <p className="text-muted-foreground max-w-md mb-8">
            Every project I&apos;ve shipped from quick builds to full products.
          </p>
        </ScrollReveal>

        {categories.length > 2 && (
          <ScrollReveal delay={0.05}>
            <div className="flex flex-wrap gap-2 mb-8" data-testid="work-category-filters">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    activeCategory === cat
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-muted-foreground border-[hsl(var(--border))] hover:text-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        )}

        {visible.length > 0 ? (
          <ScrollReveal delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visible.map((project, i) => (
                <ProjectCard
                  key={project._id || project.id || `${project.name}-${i}`}
                  project={project}
                  onOpen={setSelected}
                />
              ))}
            </div>
          </ScrollReveal>
        ) : (
          <div className="card-surface rounded-2xl p-10 text-center text-muted-foreground text-sm">
            No projects in this category yet.
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="btn-outline px-6 py-3"
              data-testid="work-load-more"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
