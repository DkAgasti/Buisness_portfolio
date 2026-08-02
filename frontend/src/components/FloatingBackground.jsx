'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Ambient floating orbs that drift (CSS) and parallax with scroll (transform
 * only — cheap). Sits behind all content (z-index:-1) and never intercepts
 * pointer events. Parallax is disabled for reduced-motion users; CSS handles
 * disabling the drift animation.
 */
const ORBS = [
  { top: '8%', left: '6%', size: 260, color: 'rgba(59,130,246,0.14)', factor: -0.12, dur: 15, delay: 0 },
  { top: '32%', right: '4%', size: 320, color: 'rgba(139,92,246,0.12)', factor: 0.1, dur: 19, delay: 2 },
  { top: '62%', left: '10%', size: 300, color: 'rgba(236,72,153,0.1)', factor: -0.08, dur: 17, delay: 1 },
  { top: '82%', right: '12%', size: 240, color: 'rgba(6,182,212,0.12)', factor: 0.14, dur: 21, delay: 3 },
];

function Orb({ conf, enabled }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => v * conf.factor);
  const { factor, dur, delay, color, size, ...pos } = conf;

  return (
    <motion.div style={{ y: enabled ? y : 0, ...pos, position: 'absolute' }}>
      <div
        className="floating-orb"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at center, ${color}, transparent 70%)`,
          animation: `orb-float ${dur}s ease-in-out ${delay}s infinite`,
        }}
      />
    </motion.div>
  );
}

export function FloatingBackground() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEnabled(false);
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-[1] overflow-hidden pointer-events-none hidden sm:block"
      style={{ zIndex: -1 }}
    >
      {ORBS.map((conf, i) => (
        <Orb key={i} conf={conf} enabled={enabled} />
      ))}
    </div>
  );
}
