'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { useContent } from '@/components/ContentProvider';

export function Experience() {
  const { experience: dynamicExp } = useContent();
  const experience = dynamicExp || [];

  // Render nothing until there's data. The scroll-linked timeline lives in a
  // child so useScroll only runs once its target element is actually mounted
  // (avoids framer-motion's "ref defined but not hydrated" error).
  if (!experience || experience.length === 0) return null;

  return <ExperienceTimeline experience={experience} />;
}

function ExperienceTimeline({ experience }) {
  const scrollBoxRef = useRef(null);
  const canScroll = experience.length > 1;
  const [atEnd, setAtEnd] = useState(false);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - 4);
  };

  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    container: canScroll ? scrollBoxRef : undefined,
    offset: ['start 0.75', 'end 1'],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 80, damping: 26, restDelta: 0.001 });

  return (
    <section id="experience" className="py-14 sm:py-16 lg:py-24" data-testid="experience-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-12 lg:mb-16">
            <span className="section-eyebrow mb-4">Career</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3 mt-4">
              Work <span className="gradient-text">Experience</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              My professional journey building impactful products
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
        <div
          ref={scrollBoxRef}
          onScroll={canScroll ? handleScroll : undefined}
          className={canScroll ? 'exp-scroll relative overflow-y-auto' : 'relative'}
          style={canScroll ? { maxHeight: '480px' } : undefined}
        >
        <div ref={timelineRef} className="relative" data-testid="experience-timeline">
          {/* Track (desktop center / mobile left) */}
          <div className="absolute top-0 bottom-0 w-px bg-gray-200 dark:bg-white/10 left-[19px] md:left-1/2 md:-translate-x-1/2" />
          {/* Animated drawing line */}
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-blue-500 via-violet-500 to-pink-500 left-[19px] md:left-1/2 md:-translate-x-1/2"
          />

          <div className="space-y-10 md:space-y-14">
            {experience.map((exp, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row md:items-center ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Card side */}
                  <div className={`w-full md:w-[calc(50%-2.5rem)] pl-14 md:pl-0 ${isLeft ? 'md:pr-10' : 'md:pl-10'}`}>
                    <ScrollReveal direction={isLeft ? 'right' : 'left'}>
                      <SpotlightCard className="glass rounded-2xl p-6 gradient-border transition-transform duration-300 hover:-translate-y-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2.5 py-1 text-xs rounded-md bg-primary/10 text-primary font-medium inline-flex items-center gap-1.5">
                            <Calendar className="w-3 h-3" />
                            {exp.duration}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold font-heading mb-1">{exp.role}</h3>
                        <p className="text-primary text-sm font-medium flex items-center gap-1.5 mb-4">
                          <Briefcase className="w-3.5 h-3.5" />
                          {exp.company}
                        </p>
                        <ul className="space-y-2.5">
                          {exp.achievements?.map((a, i) => (
                            <li key={i} className="flex gap-2.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-primary/70 flex-shrink-0 mt-0.5" />
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </SpotlightCard>
                    </ScrollReveal>
                  </div>

                  {/* Node */}
                  <div className="absolute left-[10px] md:left-1/2 md:-translate-x-1/2 top-6 md:top-1/2 md:-translate-y-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                      className="w-5 h-5 rounded-full border-2 border-primary bg-background flex items-center justify-center shadow-[0_0_14px_-2px_rgba(59,130,246,0.8)]"
                    >
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </motion.div>
                  </div>

                  {/* Spacer for opposite side (desktop) */}
                  <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
                </div>
              );
            })}
          </div>
        </div>
        </div>

          {/* Bottom fade hint that there's more to scroll — hidden once fully scrolled
              so the last experience is never covered */}
          {canScroll && !atEnd && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent transition-opacity duration-300" />
          )}
        </div>
      </div>
    </section>
  );
}
