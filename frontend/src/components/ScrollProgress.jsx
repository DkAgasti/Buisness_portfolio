'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin gradient progress bar that tracks page scroll.
 * Anchored to the top of the viewport.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500"
      data-testid="scroll-progress"
    />
  );
}
