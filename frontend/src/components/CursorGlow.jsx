'use client';

import { useEffect, useRef } from 'react';

export function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    // Disable on touch devices
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId;
    const handleMouseMove = (e) => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (glowRef.current) {
          glowRef.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed w-[600px] h-[600px] pointer-events-none z-[2] rounded-full opacity-0 sm:opacity-100"
      style={{
        background: 'radial-gradient(300px circle, rgba(59,130,246,0.07), transparent 60%)',
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  );
}
