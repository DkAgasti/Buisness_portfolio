'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { useContent } from '@/components/ContentProvider';

export function FAQ() {
  const [open, setOpen] = useState(0);
  const { faqs: dynamicFaqs } = useContent();
  const faqs = dynamicFaqs || [];

  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="py-14 sm:py-16 lg:py-24" data-testid="faq-section">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10 lg:mb-12">
            <span className="section-eyebrow mb-4">FAQ</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3 mt-4">
              Questions, <span className="gradient-text">answered</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Everything you need to know before we start working together.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = open === idx;
            return (
              <ScrollReveal key={item.q} delay={idx * 0.05}>
                <div className="glass rounded-2xl gradient-border overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 sm:py-5"
                  >
                    <span className="font-medium font-heading text-base sm:text-lg">{item.q}</span>
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center transition-transform duration-300 ${
                        isOpen ? 'rotate-45' : ''
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 sm:px-6 pb-5 text-muted-foreground leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
