'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Linkedin, Twitter, ArrowDown, ArrowRight, Sparkles, Award, CheckCircle2, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useContent } from '@/components/ContentProvider';
import { Magnetic } from '@/components/ui/magnetic';

const HeroScene = dynamic(() => import('@/components/HeroScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0" />,
});

// Base delay lets the loading screen (~1.9s) clear before content reveals.
const BASE = 2.0;

export function Hero() {
  const { siteConfig, roles: dynamicRoles } = useContent();
  const config = siteConfig || {};
  // Roles come from the DB (admin-editable); normalize {text} docs → strings.
  const roles = (dynamicRoles || [])
    .map((r) => (typeof r === 'string' ? r : r.text))
    .filter(Boolean);
  const [displayText, setDisplayText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [phase, setPhase] = useState('typing');
  const [reduced, setReduced] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const sceneY = useTransform(scrollYProgress, [0, 1], [0, 70]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  useEffect(() => {
    if (!roles.length) return; // no roles yet (before content loads)
    const currentRole = roles[roleIndex % roles.length] || '';
    let timeout;

    if (phase === 'typing') {
      if (displayText.length < currentRole.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentRole.substring(0, displayText.length + 1));
        }, 80);
      } else {
        timeout = setTimeout(() => setPhase('pausing'), 2000);
      }
    } else if (phase === 'pausing') {
      timeout = setTimeout(() => setPhase('deleting'), 500);
    } else if (phase === 'deleting') {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, 40);
      } else {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setPhase('typing');
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, phase, roleIndex, roles.length]);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const reveal = (delay) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] },
  });

  const years = config.stats_experience || config.stats?.experience || 4;
  const projectsDone = config.stats_projects || config.stats?.projects || 50;
  const trustSignals = [
    { icon: Award, label: `${years}+ years experience` },
    { icon: CheckCircle2, label: `${projectsDone}+ projects delivered` },
    config.responseTime && { icon: Clock, label: config.responseTime },
  ].filter(Boolean);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-[92vh] flex items-center overflow-hidden"
      data-testid="hero-section"
    >
      {/* 3D Background - Crystal Diamond with Skill Icons */}
      <motion.div className="absolute inset-0 z-0" style={{ y: reduced ? 0 : sceneY }}>
        <HeroScene />
      </motion.div>

      {/* Soft vignette to anchor the text against the 3D scene */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_60%_60%_at_20%_50%,rgba(0,0,0,0.35),transparent)] dark:bg-[radial-gradient(ellipse_65%_65%_at_20%_50%,rgba(0,0,0,0.55),transparent)]" />

      {/* Content */}
      <motion.div
        style={{ y: reduced ? 0 : contentY, opacity: reduced ? 1 : contentOpacity }}
        className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 w-full"
      >
        <div className="max-w-2xl">
          <motion.div {...reveal(BASE)} className="mb-5">
            <span className="section-eyebrow">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Available for freelance work
            </span>
          </motion.div>

          <motion.h1
            {...reveal(BASE + 0.15)}
            className="text-4xl sm:text-5xl lg:text-[4rem] leading-[1.05] font-bold font-heading tracking-tight mb-5"
          >
            Hi, I&apos;m <span className="gradient-text">{config.name || ''}</span>
            <br />
            <span className="text-foreground/90">Helping startups build</span>{' '}
            <span className="text-muted-foreground">production-ready software.</span>
          </motion.h1>

          <motion.div
            {...reveal(BASE + 0.3)}
            className="text-lg sm:text-xl text-muted-foreground mb-3 h-8 font-medium"
          >
            <span className="text-foreground">{displayText}</span>
            <span className="typewriter-cursor" />
          </motion.div>

          <motion.p
            {...reveal(BASE + 0.4)}
            className="text-base text-muted-foreground/90 max-w-xl leading-relaxed mb-8"
          >
            {config.tagline ? `${config.tagline}. ` : ''}I partner with startups and teams to design and build
            reliable, production-ready web applications from robust backend APIs to
            polished, high-performance interfaces.
          </motion.p>

          <motion.div {...reveal(BASE + 0.55)} className="flex flex-wrap gap-4 mb-7">
            <Magnetic>
              <a
                href="#projects"
                onClick={(e) => handleScrollTo(e, '#projects')}
                className="btn-primary px-6 py-3"
                data-testid="hero-primary-cta-button"
              >
                View My Work
                <ArrowRight className="w-4 h-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => handleScrollTo(e, '#contact')}
                className="btn-ghost px-6 py-3"
                data-testid="hero-secondary-cta-button"
              >
                <Sparkles className="w-4 h-4" />
                Get in touch
              </a>
            </Magnetic>
          </motion.div>

          {/* Trust indicators (from dynamic site config) */}
          <motion.div
            {...reveal(BASE + 0.62)}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-9 text-sm text-muted-foreground"
            data-testid="hero-trust-indicators"
          >
            {trustSignals.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary/80" />
                {label}
              </span>
            ))}
          </motion.div>

      
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: BASE + 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-muted-foreground/50">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ArrowDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
