'use client';

import { useRef, useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { TestimonialForm } from '@/components/TestimonialForm';
import { TestimonialList } from '@/components/TestimonialList';

export function Testimonials() {
  const formRef = useRef(null);
  const [formHeight, setFormHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      if (formRef.current) {
        setFormHeight(formRef.current.offsetHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    // Re-measure after fonts/content load
    const timer = setTimeout(updateHeight, 500);
    return () => {
      window.removeEventListener('resize', updateHeight);
      clearTimeout(timer);
    };
  }, []);

  return (
    <section id="testimonials" className="py-14 sm:py-16 lg:py-24" data-testid="testimonials-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10 lg:mb-12">
            <span className="section-eyebrow mb-4">Testimonials</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3 mt-4">
              Client <span className="gradient-text">Reviews</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              What people say about working with me
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
          <ScrollReveal className="lg:col-span-2">
            <div ref={formRef}>
              <TestimonialForm />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15} className="lg:col-span-3">
            <div style={formHeight ? { height: `${formHeight}px` } : {}}>
              <TestimonialList />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
