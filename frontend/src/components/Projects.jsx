'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectModal } from '@/components/ProjectModal';
import { useContent } from '@/components/ContentProvider';

export function Projects() {
  const [selected, setSelected] = useState(null);
  const { projects: dynamicProjects } = useContent();
  const projects = dynamicProjects || [];

  const filtered = projects;

  const scrollToContact = (e) => {
    e.preventDefault();
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="projects" className="py-14 sm:py-16 lg:py-24" data-testid="projects-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10 lg:mb-12">
            <span className="section-eyebrow mb-4">Selected Work</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3 mt-4">
              Featured <span className="gradient-text">Products</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Real software, shipped end-to-end. Click any product for the full case study.
            </p>
          </div>
        </ScrollReveal>

        {/* Auto-scrolling single-row marquee — glides slowly, pauses on hover */}
        {filtered.length > 0 && (
          <div className="relative left-1/2 -translate-x-1/2 w-screen overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div className="projects-marquee-track flex w-max">
              {[...filtered, ...filtered].map((project, idx) => (
                <ProjectCard
                  key={`${project.id || project._id || project.name}-${idx}`}
                  project={project}
                  onOpen={setSelected}
                  className="w-[300px] sm:w-[340px] flex-shrink-0 mr-5 sm:mr-6"
                />
              ))}
            </div>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-14">
            <p className="text-muted-foreground mb-4">
              New work is on the way.
            </p>
            <a href="#contact" onClick={scrollToContact} className="btn-ghost inline-flex px-5 py-2.5 text-sm">
              Discuss your project
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}

        {/* Closing CTA — turn interest into a conversation */}
        {filtered.length > 0 && (
          <ScrollReveal delay={0.1}>
            <div className="mt-14 text-center">
              <p className="text-muted-foreground mb-4">
                Have a project like these in mind?
              </p>
              <a href="#contact" onClick={scrollToContact} className="btn-primary inline-flex px-6 py-3">
                Let&apos;s build it together
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </ScrollReveal>
        )}
      </div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
