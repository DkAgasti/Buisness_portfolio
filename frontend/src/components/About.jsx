'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, MapPin, GraduationCap, Briefcase, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { Reveal } from '@/components/ui/reveal';
import { useContent } from '@/components/ContentProvider';
import { realUrl } from '@/lib/project';

function AnimatedCounter({ end, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(end);
      return;
    }
    let startTime = null;
    const duration = 2000;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

export function About() {
  const { siteConfig } = useContent();
  const config = siteConfig || {};
  const avatar = config.avatar || config.photo || config.profileImage || config.image;
  const initials = (config.name || '').split(' ').map((n) => n[0]).join('');

  const details = [
    config.location && { icon: MapPin, label: config.location },
    config.education && { icon: GraduationCap, label: config.education },
    { icon: Briefcase, label: 'Open to freelance & contract' },
  ].filter(Boolean);

  const stats = [
    { value: config.stats_projects || config.stats?.projects || 50, suffix: '+', label: 'Projects Completed' },
    { value: config.stats_clients || config.stats?.clients || 30, suffix: '+', label: 'Happy Clients' },
    { value: config.stats_experience || config.stats?.experience || 4, suffix: '+', label: 'Years Experience' },
  ];

  return (
    <section id="about" className="py-14 sm:py-16 lg:py-24" data-testid="about-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Profile card */}
            <div className="relative w-64 h-72 sm:w-72 sm:h-80 flex-shrink-0 group">
              {/* rotating gradient halo */}
              <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative w-full h-full rounded-[1.75rem] overflow-hidden glass gradient-border">
                <Reveal className="w-full h-full">
                  {realUrl(avatar) ? (
                    <img
                      src={avatar}
                      alt={config.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center relative">
                      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:24px_24px]" />
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_-8px_rgba(99,102,241,0.7)]">
                        <span className="text-5xl font-bold text-white font-heading">{initials}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">Your photo here</p>
                    </div>
                  )}
                </Reveal>
              </div>
              {/* floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-4 -right-3 glass-strong rounded-2xl px-4 py-3 flex items-center gap-2 shadow-xl"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <div className="leading-tight">
                  <div className="text-sm font-bold font-heading gradient-text">
                    {stats[2].value}+ yrs
                  </div>
                  <div className="text-[10px] text-muted-foreground">experience</div>
                </div>
              </motion.div>
            </div>

            {/* Bio */}
            <div className="flex-1">
              <span className="section-eyebrow mb-4">About Me</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-4 mt-4">
                Turning ideas into <span className="gradient-text">production software</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-prose">
                {config.bio}
              </p>

              {/* Detail chips */}
              <div className="flex flex-wrap gap-2.5 mb-7">
                {details.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm glass text-muted-foreground"
                  >
                    <Icon className="w-3.5 h-3.5 text-primary" />
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats */}
        <ScrollReveal delay={0.2}>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6" data-testid="about-stats">
            {stats.map((stat) => (
              <SpotlightCard
                key={stat.label}
                className="glass rounded-2xl p-6 text-center gradient-border transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl sm:text-4xl font-bold font-heading gradient-text mb-1">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </SpotlightCard>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
