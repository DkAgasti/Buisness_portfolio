'use client';

import { ArrowRight, TrendingUp } from 'lucide-react';
import { Placeholder } from '@/components/ui/placeholder';

export function ProjectCard({ project, onOpen }) {
  return (
    <button
      onClick={() => onOpen(project)}
      className="group w-full text-left card-surface rounded-2xl overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform duration-300"
      data-testid="project-card"
      aria-label={`Open case study for ${project.name}`}
    >
      <div className="relative">
        <Placeholder ratio="16/10" rounded="rounded-none" label={project.placeholderLabel} className="w-full group-hover:scale-105 transition-transform duration-500" />
        {project.category && (
          <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] rounded-md bg-white/90 backdrop-blur text-foreground font-medium">
            {project.category}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold font-heading text-base mb-1">{project.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 truncate">{project.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2">
          {project.result ? (
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground min-w-0">
              <TrendingUp className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="truncate">{project.result}</span>
            </span>
          ) : (
            <span />
          )}
          <span className="w-8 h-8 rounded-full border border-[hsl(var(--border))] flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-colors">
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </button>
  );
}
