'use client';

import { Github, Linkedin, X, Instagram, Mail } from 'lucide-react';
import { navLinks } from '@/lib/nav';
import { useContent } from '@/components/ContentProvider';
import { realUrl } from '@/lib/project';
import { openContactModal } from '@/components/ContactModal';
import { DEFAULT_NAME, DEFAULT_ROLE } from '@/lib/identity';
import { CONTAINER } from '@/lib/container';

export function Footer() {
  const { siteConfig } = useContent();
  const config = siteConfig || {};
  const name = DEFAULT_NAME;
  const role = DEFAULT_ROLE;
  const logo = config.avatar || config.photo || config.profileImage || config.image;
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('');

  const handleNavClick = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const socials = [
    { icon: Github, href: realUrl(config.github) ? config.github : '#', label: 'GitHub' },
    { icon: Linkedin, href: realUrl(config.linkedin) ? config.linkedin : '#', label: 'LinkedIn' },
    { icon: X, href: realUrl(config.twitter) ? config.twitter : '#', label: 'X' },
    { icon: Instagram, href: realUrl(config.instagram) ? config.instagram : '#', label: 'Instagram' },
    { icon: Mail, href: realUrl(config.email) ? `mailto:${config.email}` : '#', label: 'Email' },
  ];

  return (
    <footer className="border-t border-[hsl(var(--border))]" data-testid="footer">
      <div className={`${CONTAINER} py-10`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <a
            href="#"
            className="flex items-center gap-2.5"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0">
              {realUrl(logo) ? (
                <img src={logo} alt={`${name} logo`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
              ) : (
                <span className="text-sm font-bold text-white font-heading">{initials}</span>
              )}
            </div>
            <span className="leading-tight">
              <span className="block font-heading font-semibold text-sm">{name}</span>
              {role && <span className="block text-[11px] text-muted-foreground">{role}</span>}
            </span>
          </a>

          <div className="flex flex-wrap items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
            <button onClick={openContactModal} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground mr-1 hidden sm:inline">Follow me</span>
            {socials.map(({ icon: Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target={href.startsWith('mailto:') || href === '#' ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-[hsl(var(--border))] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">&copy; 2025 {name}. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built with passion &bull; Designed for impact</p>
        </div>
      </div>
    </footer>
  );
}
