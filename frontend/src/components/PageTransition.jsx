'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Gentle whole-content enter transition on mount. Kept subtle so it layers
 * cleanly under the per-section scroll reveals. No-op for reduced-motion.
 */
export function PageTransition({ children }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
}
