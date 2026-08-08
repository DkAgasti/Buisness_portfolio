"use client";

import { Github, Linkedin, Twitter, Heart, ArrowRight } from "lucide-react";
import { navLinks } from "@/lib/nav";
import { useContent } from "@/components/ContentProvider";
import { Magnetic } from "@/components/ui/magnetic";
import { realUrl } from '@/lib/project';

export function Footer() {
  const { siteConfig } = useContent();
  const config = siteConfig || {};
  const brand = config.companyName || config.name || "";
  const logo = config.avatar || config.photo || config.profileImage || config.image;

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative mt-10" data-testid="footer">
      {/* gradient top hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-10">
        {/* CTA band */}
        <div className="glass-strong rounded-3xl p-8 sm:p-10 mb-14 relative overflow-hidden gradient-border">
          <div className="absolute -top-24 -right-16 w-64 h-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold font-heading mb-2">
                Have a project in <span className="gradient-text">mind?</span>
              </h3>
              <p className="text-muted-foreground max-w-md">
                Let&apos;s build something people love to use. I&apos;m
                available for freelance and contract work.
              </p>
            </div>
            <Magnetic>
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="btn-primary px-6 py-3 whitespace-nowrap"
              >
                Start a conversation
                <ArrowRight className="w-4 h-4" />
              </a>
            </Magnetic>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Logo & tagline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_18px_-4px_rgba(59,130,246,0.6)] ring-1 ring-white/15">
                {realUrl(logo) ? (
                  <img
                    src={logo}
                    alt={`${brand} logo`}
                    className="w-full h-full object-cover"
                    loading="eager"
                    decoding="async"
                  />
                ) : (
                  <span className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white font-heading">
                    {brand.charAt(0)}
                  </span>
                )}
                {/* signature sheen sweep on hover */}
                <span className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700" />
              </div>
              <span className="font-heading font-semibold">{brand}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {config.tagline || ""}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-3 text-sm">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navLinks.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-primary transition-all duration-300" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-heading font-semibold mb-3 text-sm">Connect</h4>

            {config.email && (
              <a
                href={`mailto:${config.email}`}
                className="text-sm text-muted-foreground mt-4 inline-block hover:text-primary transition-colors"
              >
                {config.email}
              </a>
            )}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {brand}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with Next.js{" "}
            <Heart className="w-3 h-3 text-red-400 fill-red-400" />
          </p>
        </div>
      </div>
    </footer>
  );
}
