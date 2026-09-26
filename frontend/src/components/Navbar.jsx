'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import { navLinks } from '@/lib/nav';
import { useContent } from '@/components/ContentProvider';
import { realUrl } from '@/lib/project';
import { openContactModal } from '@/components/ContactModal';
import { DEFAULT_NAME } from '@/lib/identity';
import { CONTAINER } from '@/lib/container';

// Inline style (not a Tailwind class) so the slow, smooth easing always
// applies reliably regardless of arbitrary-value class generation.
// `max-width` is driven from plain px numbers (not "auto"/"none") because
// browsers can't smoothly interpolate a width transition to/from those
// keywords — mixing them is what made the pill's content used to "snap"
// into place instantly even though the background faded in slowly.
const NAV_EASE = 'all 2.4s cubic-bezier(0.22, 1, 0.36, 1)';

export function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { siteConfig } = useContent();
  const config = siteConfig || {};
  const logo = config.logo || config.avatar || config.photo || config.profileImage || config.image;
  const companyName = DEFAULT_NAME;

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace('#', ''));
    const isHome = pathname === '/';

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (!isHome) return;

      const line = window.innerHeight * 0.35;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
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
    if (pathname !== '/') {
      router.push(`/${href}`);
      setMobileOpen(false);
      return;
    }
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 ${scrolled ? 'py-3' : 'py-5'}`}
        style={{ transition: NAV_EASE }}
        data-testid="navbar"
      >
        <nav className={CONTAINER} style={{ transition: NAV_EASE }}>
          <div
            className={`flex items-center justify-between rounded-2xl mx-auto ${
              scrolled ? 'nav-glass px-6 py-3.5' : 'px-0 py-0 bg-transparent'
            }`}
            style={{ transition: NAV_EASE, maxWidth: scrolled ? 1024 : 4000 }}
          >
            {/* Logo — image only, no name text */}
            <a
              href="/"
              className="flex items-center"
              onClick={(e) => {
                e.preventDefault();
                if (pathname !== '/') {
                  router.push('/');
                  return;
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="Back to top"
            >
              <div className="relative h-10 flex items-center justify-center">
                {realUrl(logo) ? (
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-full w-auto object-contain"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <span className="text-sm font-bold text-primary font-heading">
                    {companyName.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </span>
                )}
              </div>
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
                    activeSection === link.href.replace('#', '') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                  data-testid={`navbar-link-${link.name.toLowerCase()}`}
                >
                  {link.name}
                  {activeSection === link.href.replace('#', '') && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-lg bg-[hsl(var(--muted))] -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </a>
              ))}
              <button
                onClick={openContactModal}
                className="px-3.5 py-2 text-sm font-medium rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                data-testid="navbar-link-contact"
              >
                Contact
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={openContactModal} className="btn-primary hidden lg:inline-flex px-5 py-2.5 text-sm">
                Start a Project
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg text-foreground hover:bg-[hsl(var(--muted))] transition-colors"
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
              className="lg:hidden mx-4 sm:mx-6 mt-2 rounded-2xl nav-glass overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === link.href.replace('#', '')
                        ? 'text-foreground bg-[hsl(var(--muted))]'
                        : 'text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--muted))]'
                    }`}
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openContactModal();
                  }}
                  className="block w-full px-4 py-3 rounded-lg text-sm font-medium text-left text-muted-foreground hover:text-foreground hover:bg-[hsl(var(--muted))] transition-colors"
                >
                  Contact
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    openContactModal();
                  }}
                  className="btn-primary w-full mt-3 py-3 text-sm"
                >
                  Start a Project
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
