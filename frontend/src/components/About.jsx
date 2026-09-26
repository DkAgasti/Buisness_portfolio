"use client";

import {
  CalendarDays,
  FolderKanban,
  Users,
  Mail,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Placeholder } from "@/components/ui/placeholder";
import { useContent } from "@/components/ContentProvider";
import { realUrl } from "@/lib/project";
import { DEFAULT_NAME, DEFAULT_ROLE } from "@/lib/identity";
import { CONTAINER } from "@/lib/container";
import { AnimatedCounter } from "@/components/ui/animated-counter";

function WhatsAppIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.47 14.38c-.29-.15-1.7-.84-1.97-.93-.26-.1-.46-.15-.65.15-.19.29-.75.93-.92 1.12-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.33-1.44-.86-.77-1.44-1.71-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.5.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.65-1.58-.9-2.16-.24-.58-.48-.48-.65-.49-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.77.36-.26.29-1 .98-1 2.4 0 1.4 1.03 2.76 1.17 2.95.14.19 2.03 3.1 4.93 4.34.69.3 1.22.48 1.64.62.69.22 1.32.19 1.81.11.55-.08 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34z" />
      <path d="M12.02 2C6.5 2 2 6.48 2 11.98c0 1.86.51 3.65 1.47 5.21L2 22l4.94-1.44a10.03 10.03 0 0 0 5.08 1.38h.01c5.51 0 10-4.48 10-9.98C22 6.48 17.53 2 12.02 2zm0 18.1h-.01a8.24 8.24 0 0 1-4.2-1.15l-.3-.18-2.98.87.79-2.9-.19-.3a8.2 8.2 0 0 1-1.26-4.44c0-4.54 3.7-8.22 8.26-8.22 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.81c0 4.53-3.7 8.19-8.35 8.19z" />
    </svg>
  );
}

const STATS = [
  { icon: CalendarDays, value: 3, suffix: "+", label: "Years of Experience" },
  { icon: FolderKanban, value: 6, suffix: "+", label: "Projects Completed" },
  { icon: Users, value: 5, suffix: "+", label: "Happy Clients" },
];

export function About() {
  const { siteConfig } = useContent();
  const config = siteConfig || {};
  const name = config.name || DEFAULT_NAME;
  const role = config.role || DEFAULT_ROLE;
  const bio = config.bio || "";
  const avatar = config.avatar;
  const stats = STATS;

  const contactLinks = [
    realUrl(config.email) && {
      icon: Mail,
      href: `mailto:${config.email}`,
      label: "Email",
      text: config.email,
    },
    realUrl(config.whatsapp) && {
      icon: WhatsAppIcon,
      href: `https://wa.me/${config.whatsapp.replace(/[^\d]/g, "")}`,
      label: "WhatsApp",
      text: config.whatsapp,
    },
  ].filter(Boolean);

  const scrollToTop = (e) => {
    e.preventDefault();
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="about"
      className="py-14 sm:py-16 lg:py-20"
      data-testid="about-section"
    >
      <div className={CONTAINER}>
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,260px)_1fr_minmax(0,220px)] gap-10 lg:gap-12 items-start max-w-6xl mx-auto">
          {/* Portrait */}
          <ScrollReveal>
            <div className="relative w-full max-w-[260px] mx-auto lg:mx-0">
              {realUrl(avatar) ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-full aspect-[4/5] object-cover rounded-[1.75rem] shadow-sm"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <Placeholder
                  ratio="4/5"
                  rounded="rounded-[1.75rem]"
                  label="portrait"
                  className="w-full shadow-sm"
                />
              )}
              <div className="sticky-note absolute -top-4 -right-6 -rotate-6 bg-white card-surface rounded-lg px-4 py-2">
                Build Good Things
              </div>
            </div>
          </ScrollReveal>

          {/* Bio */}
          <ScrollReveal delay={0.1}>
            <span className="section-eyebrow mb-3 block">About Me</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-1">
              {name}
            </h2>
            {role && <p className="text-muted-foreground mb-4">{role}</p>}
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-prose">
              {bio}
            </p>

            {contactLinks.length > 0 && (
              <div className="flex flex-col gap-2">
                {contactLinks.map(({ icon: Icon, href, label, text }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
                  >
                    <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                    {text}
                  </a>
                ))}
              </div>
            )}
          </ScrollReveal>
          <ScrollReveal delay={0.15} className="relative self-stretch h-full">
            {config.responseTime && (
              <div className="sticky-note absolute -top-5 -right-2 xl:top-6 xl:right-auto xl:left-full xl:ml-3 -rotate-6 bg-white card-surface rounded-lg px-4 py-2 whitespace-nowrap z-10">
                {config.responseTime}
              </div>
            )}
            <div className="card-surface rounded-2xl p-5 h-full flex flex-col justify-center divide-y divide-[hsl(var(--border))] xl:relative xl:-right-28">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--muted))] flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-bold font-heading leading-tight">
                      <AnimatedCounter end={s.value} suffix={s.suffix} />
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky-note absolute -bottom-5 -right-2 xl:-right-8 rotate-6 bg-white card-surface rounded-lg px-4 py-2 whitespace-nowrap">
              Let&apos;s build something great
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
