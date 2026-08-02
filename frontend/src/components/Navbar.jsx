'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ScrollProgress } from '@/components/ScrollProgress';
import { navLinks } from '@/lib/nav';
import { useContent } from '@/components/ContentProvider';
import { realUrl } from '@/lib/project';

export function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { siteConfig } = useContent();
  const config = siteConfig || {};
  // Same image used in the About Me section; company name is admin-editable.
  const logo = config.avatar || config.photo || config.profileImage || config.image;
  const companyName = config.companyName || config.name || '';

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace('#', ''));

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Deterministic active section: the last section whose top has crossed a
      // reference line ~35% down the viewport is the one being read.
      const line = window.innerHeight * 0.35;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom, force the last nav section (short final sections
      // may never reach the reference line).
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = ids[ids.length - 1];
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <>
      <ScrollProgress />
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-2.5' : 'py-4'
        }`}
        data-testid="navbar"
      >
        <nav className="mx-auto max-w-6xl px-4 sm:px-6">
          <div
            className={`flex items-center justify-between rounded-2xl transition-all duration-300 ${
              scrolled
                ? 'glass px-4 py-2 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.6)]'
                : 'px-0 py-0 bg-transparent'
            }`}
          >
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-2 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_18px_-4px_rgba(59,130,246,0.6)] ring-1 ring-white/15">
                {realUrl(logo) ? (
                  <img
                    src={logo}
                    alt={`${companyName} logo`}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <span className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white font-heading">
                    {companyName.charAt(0)}
                  </span>
                )}
                {/* signature sheen sweep on hover */}
                <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
              </div>
              <span className="brand-underline font-heading font-semibold text-lg hidden sm:block">
                {companyName}
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={activeSection === link.href.replace('#', '') ? 'true' : undefined}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeSection === link.href.replace('#', '')
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`navbar-link-${link.name.toLowerCase()}`}
                >
                  {link.name}
                  {activeSection === link.href.replace('#', '') && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg border bg-gradient-to-b from-black/[0.06] to-black/[0.02] border-black/10 dark:from-white/10 dark:to-white/[0.03] dark:border-white/10 -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </a>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              {/* Mobile toggle */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                data-testid="navbar-mobile-menu-button"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden mx-4 sm:mx-6 mt-2 rounded-2xl glass-strong overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === link.href.replace('#', '')
                        ? 'text-foreground bg-black/5 dark:bg-white/10'
                        : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, '#contact')}
                  className="btn-primary w-full mt-3 py-3 text-sm"
                >
                  Hire Me
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
