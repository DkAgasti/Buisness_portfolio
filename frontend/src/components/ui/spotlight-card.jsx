'use client';

import { useRef } from 'react';

/**
 * SpotlightCard — a surface that reveals a soft radial glow following the
 * cursor. Shares the exact spotlight language used on the project cards so
 * every interactive surface across the site feels like one system.
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(99,102,241,0.14)',
  radius = 260,
  ...props
}) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={handleMove} className={`group relative ${className}`} {...props}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(${radius}px circle at var(--mx) var(--my), ${spotlightColor}, transparent 45%)`,
        }}
      />
      {children}
    </div>
  );
}
