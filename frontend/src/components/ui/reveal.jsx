'use client';

import { motion } from 'framer-motion';

/**
 * Reveal — wraps media in a gradient "curtain" that wipes away when the
 * element scrolls into view, for a premium image-reveal effect.
 * Curtain is hidden entirely for reduced-motion users (motion-reduce:hidden),
 * so the media shows immediately.
 */
export function Reveal({ children, className = '', delay = 0 }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, delay, ease: [0.76, 0, 0.24, 1] }}
        style={{ originY: 0 }}
        className="absolute inset-0 z-[25] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 motion-reduce:hidden"
      />
    </div>
  );
}
