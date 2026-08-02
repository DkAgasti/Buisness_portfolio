'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import {
  Search, ClipboardList, PenTool, Code2, FlaskConical, Rocket, Headphones,
} from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { useContent } from '@/components/ContentProvider';

const iconMap = { Search, ClipboardList, PenTool, Code2, FlaskConical, Rocket, Headphones };

export function Process() {
  const { process: dynamicProcess } = useContent();
  const processSteps = dynamicProcess || [];

  // Scroll-linked timeline lives in a child so useScroll only runs once its
  // target is mounted (avoids "ref defined but not hydrated").
  if (!processSteps || processSteps.length === 0) return null;

  return <ProcessTimeline processSteps={processSteps} />;
}

function ProcessTimeline({ processSteps }) {
  const scrollBoxRef = useRef(null);
  const canScroll = (processSteps?.length || 0) > 2;
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
    <section id="process" className="py-14 sm:py-16 lg:py-24" data-testid="process-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-12 lg:mb-16">
            <span className="section-eyebrow mb-4">How I work</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3 mt-4">
              A process built on <span className="gradient-text">trust</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              From first conversation to long-term support — a clear, proven workflow.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
        <div
          ref={scrollBoxRef}
          onScroll={canScroll ? handleScroll : undefined}
          className={canScroll ? 'exp-scroll relative overflow-y-auto' : 'relative'}
          style={canScroll ? { maxHeight: '440px' } : undefined}
        >
        <div ref={timelineRef} className="relative" data-testid="process-timeline">
          {/* Track (desktop center / mobile left) */}
          <div className="absolute top-0 bottom-0 w-px bg-gray-200 dark:bg-white/10 left-[19px] md:left-1/2 md:-translate-x-1/2" />
          {/* Animated drawing line */}
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute top-0 bottom-0 w-[2px] origin-top bg-gradient-to-b from-blue-500 via-violet-500 to-pink-500 left-[19px] md:left-1/2 md:-translate-x-1/2"
          />

          <div className="space-y-8 md:space-y-12">
            {processSteps.map((step, idx) => {
              const Icon = iconMap[step.icon] || Search;
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={step.title}
                  className={`relative flex flex-col md:flex-row md:items-center ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Card side */}
                  <div className={`w-full md:w-[calc(50%-2.5rem)] pl-14 md:pl-0 ${isLeft ? 'md:pr-10' : 'md:pl-10'}`}>
                    <ScrollReveal direction={isLeft ? 'right' : 'left'}>
                      <SpotlightCard className="glass rounded-2xl p-5 gradient-border transition-transform duration-300 hover:-translate-y-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary/80">
                              Step {String(idx + 1).padStart(2, '0')}
                            </span>
                            <h3 className="text-lg font-bold font-heading leading-tight">{step.title}</h3>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                      </SpotlightCard>
                    </ScrollReveal>
                  </div>

                  {/* Node */}
                  <div className="absolute left-[10px] md:left-1/2 md:-translate-x-1/2 top-5 md:top-1/2 md:-translate-y-1/2 z-10">
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

          {/* Bottom fade hint — hidden once fully scrolled so the last step shows */}
          {canScroll && !atEnd && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent transition-opacity duration-300" />
          )}
        </div>
      </div>
    </section>
  );
}
