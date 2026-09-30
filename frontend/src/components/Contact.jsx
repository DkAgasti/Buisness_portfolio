'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, MapPin, MessageCircle, Clock, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { useContent } from '@/components/ContentProvider';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '';

const PROJECT_TYPES = [
  { value: 'general', label: 'General inquiry' },
  { value: 'web-app', label: 'Web application' },
  { value: 'backend-api', label: 'Backend / API' },
  { value: 'full-stack', label: 'Full-stack build' },
  { value: 'consultation', label: 'Consultation' },
];

export function Contact() {
  const [loading, setLoading] = useState(false);
  const { siteConfig } = useContent();
  const config = siteConfig || {};

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Save to backend
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to send message');
      }

      toast.success('Message sent successfully! I\'ll get back to you soon.');
      reset();
    } catch (err) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: config.email, href: `mailto:${config.email}` },
    { icon: MapPin, label: 'Location', value: config.location, href: null },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: config.whatsapp,
      href: `https://wa.me/${(config.whatsapp || '').replace(/[^\d]/g, '')}`,
    },
    { icon: Clock, label: 'Response Time', value: config.responseTime, href: null },
  ];

  const inputClasses =
    'w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:border-white/20 transition-colors text-sm';

  return (
    <section id="contact" className="py-14 sm:py-16 lg:py-24" data-testid="contact-section">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10 lg:mb-12">
            <span className="section-eyebrow mb-4">Contact</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3 mt-4">
              Let&apos;s Work <span className="gradient-text">Together</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Have a project in mind? Let&apos;s bring your ideas to lifes
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Contact Info */}
          <ScrollReveal className="lg:col-span-2">
            <div className="space-y-4">
              {contactInfo.map(({ icon: Icon, label, value, href }) => {
                const Inner = (
                  <SpotlightCard className="glass rounded-2xl p-4 flex items-center gap-4 gradient-border transition-transform duration-300 hover:-translate-y-1">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                      <p className="text-sm font-medium truncate">{value}</p>
                    </div>
                  </SpotlightCard>
                );
                return href ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="block">
                    {Inner}
                  </a>
                ) : (
                  <div key={label}>{Inner}</div>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal delay={0.15} className="lg:col-span-3">
            <div className="glass rounded-2xl p-6 sm:p-8 gradient-border" data-testid="contact-form">
              {/* Availability reassurance (dynamic response time from site config) */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-6 text-sm">
                <span className="inline-flex items-center gap-2 text-foreground font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
                  </span>
                  Available for new projects
                </span>
                {config.responseTime && (
                  <span className="text-muted-foreground">· {config.responseTime}</span>
                )}
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className={inputClasses}
                      placeholder="Your name"
                      data-testid="contact-form-name-input"
                    />
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Email</label>
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                      })}
                      className={inputClasses}
                      placeholder="you@example.com"
                      data-testid="contact-form-email-input"
                    />
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Project type</label>
                  <select
                    {...register('project_type')}
                    defaultValue="general"
                    className={`${inputClasses} appearance-none cursor-pointer`}
                    data-testid="contact-form-project-type"
                  >
                    {PROJECT_TYPES.map((t) => (
                      <option key={t.value} value={t.value} className="bg-[#0d0f16]">
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Message</label>
                  <textarea
                    {...register('message', {
                      required: 'Message is required',
                      minLength: { value: 10, message: 'Min 10 characters' },
                    })}
                    rows={5}
                    className={`${inputClasses} resize-none`}
                    placeholder="Tell me about your project..."
                    data-testid="contact-form-message-input"
                  />
                  {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 px-4 text-sm disabled:opacity-50"
                  data-testid="contact-form-submit-button"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
