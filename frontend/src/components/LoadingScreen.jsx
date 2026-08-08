'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1900);
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / 1700, 1);
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050507]"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          data-testid="loading-screen"
        >
          {/* Ambient glow */}
          <div className="absolute w-[420px] h-[420px] rounded-full bg-blue-600/20 blur-[110px]" />
          <div className="absolute w-[320px] h-[320px] rounded-full bg-purple-600/20 blur-[110px] translate-x-24 translate-y-16" />

          <div className="relative flex flex-col items-center">
            {/* Rotating conic ring around the mark */}
            <div className="relative w-20 h-20 mb-7">
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent, #3b82f6, #8b5cf6, #ec4899, transparent)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-[3px] rounded-[0.85rem] bg-white flex items-center justify-center overflow-hidden">
                <motion.img
                  src="/logo.png"
                  alt="Logo"
                  className="w-18 h-18 object-contain p-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15 }}
                />
              </div>
            </div>

            {/* Determinate progress bar */}
            <div className="w-44 h-[3px] rounded-full bg-white/8 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 text-[11px] text-white/40 tracking-[0.25em] uppercase"
            >
              Crafting Experience
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
