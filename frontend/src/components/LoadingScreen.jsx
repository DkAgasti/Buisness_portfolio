'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '@/components/ContentProvider';
import { realUrl } from '@/lib/project';

const TOTAL_DURATION = 3200; 
const PROGRESS_DURATION = 2900;

function HelloDraw() {
  return (
    <div className="relative overflow-hidden" style={{ lineHeight: 1 }}>
      <motion.div
        className="text-8xl sm:text-9xl text-black"
        style={{ fontFamily: 'var(--font-script), cursive' }}
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 1.3, delay: 0.2, ease: [0.65, 0, 0.35, 1] }}
      >
        hello
      </motion.div>
    </div>
  );
}

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const { siteConfig } = useContent();
  const config = siteConfig || {};
  const logo = config.logo || config.avatar || config.photo || config.profileImage || config.image;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), TOTAL_DURATION);
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / PROGRESS_DURATION, 1);
      // easeOutCubic
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[hsl(var(--background))]"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          data-testid="loading-screen"
        >
          {/* Ambient glow */}
          <div className="absolute w-[420px] h-[420px] rounded-full bg-indigo-300/25 blur-[110px]" />
          <div className="absolute w-[320px] h-[320px] rounded-full bg-violet-300/25 blur-[110px] translate-x-24 translate-y-16" />

          <div className="relative flex flex-col items-center">
            <div className="mb-8">
              <HelloDraw />
            </div>

            {/* Determinate progress bar */}
            <div className="w-44 h-[3px] rounded-full bg-[hsl(var(--muted))] overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Brand reveal, once "hello" has settled */}
            {realUrl(logo) && (
              <motion.div
                className="relative h-9 mt-5 flex items-center justify-center"
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.7, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <img src={logo} alt="Logo" className="h-full w-auto object-contain" decoding="async" />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
