'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export function EmailGate({ children }) {
  const [mounted, setMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(true); // Default true for SSR - crawlers see full content
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('portfolio_email');
    if (saved) {
      setUnlocked(true);
    } else {
      setUnlocked(false);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      await fetch(`${API}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });
      localStorage.setItem('portfolio_email', trimmed);
      setUnlocked(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Before mount (SSR + first render): show full content for crawlers
  const showGate = mounted && !unlocked;

  return (
    <>
      <div className={showGate ? 'blur-md pointer-events-none select-none' : ''} style={{ transition: 'filter 0.5s ease' }}>
        {children}
      </div>

      <AnimatePresence>
        {showGate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center px-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="w-full max-w-md glass rounded-2xl p-8 relative"
              style={{ background: 'rgba(10,10,26,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-xl font-bold font-heading text-white mb-2">
                  Welcome to My Portfolio
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Enter your email to explore my work, projects, and experience. No spam, I promise.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.25)]"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Please wait...</>
                  ) : (
                    <>Explore Portfolio <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </form>

              <p className="text-[10px] text-gray-500 text-center mt-4">
                Your email is safe with me. Used only for communication purposes.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
