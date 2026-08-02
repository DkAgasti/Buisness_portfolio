'use client';

import { ScrollReveal } from '@/components/ScrollReveal';
import { useContent } from '@/components/ContentProvider';

// A single scrolling row of technology chips. Duplicated inline for a
// seamless loop; pauses on hover. Direction is configurable.
function MarqueeRow({ items, reverse = false }) {
  return (
    <div className="relative overflow-hidden py-1.5 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div className={`tech-marquee-track flex w-max gap-3 ${reverse ? 'tech-marquee-reverse' : ''}`}>
        {[...items, ...items].map((tech, idx) => (
          <span
            key={`${tech}-${idx}`}
            className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-foreground/10 bg-foreground/[0.03] px-4 py-2 text-sm font-medium text-muted-foreground backdrop-blur transition-colors duration-300 hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60 transition-colors duration-300 group-hover:bg-primary" />
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TechStack() {
  // Driven by the same skills managed in the admin panel (Skills tab).
  const { skills: dynamicSkills } = useContent();
  const skills = dynamicSkills || [];

  // Flatten every category's items into one de-duplicated list of chips.
  const techList = Array.from(
    new Set((skills || []).flatMap((c) => c.items || []))
  );

  if (techList.length === 0) return null;

  // Split into two rows that drift in opposite directions for depth.
  const mid = Math.ceil(techList.length / 2);
  const rowA = techList.slice(0, mid);
  const rowB = techList.slice(mid);

  return (
    <section id="tech" className="py-10 sm:py-14" data-testid="tech-stack-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground/70 mb-6">
            The stack I build production software with
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="space-y-3">
            <MarqueeRow items={rowA} />
            {rowB.length > 0 && <MarqueeRow items={rowB} reverse />}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
