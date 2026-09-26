'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Loader2, Send, Star, Upload, User } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export function TestimonialModal() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarFileRef = useRef(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const nameValue = watch('name');

  const uploadAvatar = async (file) => {
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(`${API_BASE}/api/testimonials/upload`, { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.detail || 'Failed to upload image');
      setAvatarUrl(data.url);
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setUploadingAvatar(false);
    }
  };

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-testimonial-modal', handler);
    return () => window.removeEventListener('open-testimonial-modal', handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, rating, avatar: avatarUrl || undefined }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to submit review');
      }
      toast.success('Thank you for your review!');
      reset();
      setRating(5);
      setAvatarUrl('');
      setOpen(false);
      window.dispatchEvent(new CustomEvent('testimonialAdded'));
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full px-3.5 py-2.5 rounded-xl bg-white border border-[hsl(var(--border))] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-colors text-sm';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center px-4 py-8 bg-[hsl(var(--foreground))]/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md card-surface rounded-3xl p-6 sm:p-8 relative"
            data-testid="testimonial-modal"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center hover:bg-[hsl(var(--muted))] transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="section-eyebrow mb-2 block">Leave a Review</span>
            <h3 className="text-2xl font-bold font-heading tracking-tight mb-6">What was it like working together?</h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Photo (optional)</label>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[hsl(var(--muted))] flex items-center justify-center flex-shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Your photo" className="w-full h-full object-cover" />
                    ) : nameValue?.trim() ? (
                      <span className="text-sm font-semibold text-primary">
                        {nameValue.trim()[0].toUpperCase()}
                      </span>
                    ) : (
                      <User className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    ref={avatarFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => { uploadAvatar(e.target.files?.[0]); e.target.value = ''; }}
                  />
                  <button
                    type="button"
                    disabled={uploadingAvatar}
                    onClick={() => avatarFileRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-[hsl(var(--border))] rounded-lg text-xs font-medium hover:bg-[hsl(var(--muted))] disabled:opacity-50 transition-colors"
                  >
                    {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {avatarUrl ? 'Change' : 'Upload'}
                  </button>
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="text-xs text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground/70 mt-1.5">
                  No photo? We&apos;ll show the first letter of your name instead.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className={inputClasses}
                  placeholder="Your name"
                  data-testid="testimonial-name-input"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Rating</label>
                <div className="flex gap-1" data-testid="testimonial-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-0.5 hover:scale-110 transition-transform"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-[hsl(var(--border))]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Message</label>
                <textarea
                  {...register('message', {
                    required: 'Message is required',
                    minLength: { value: 10, message: 'Min 10 characters' },
                  })}
                  rows={4}
                  className={`${inputClasses} resize-none`}
                  placeholder="Share your experience working with me..."
                  data-testid="testimonial-message-input"
                />
                {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 px-4 text-sm disabled:opacity-50"
                data-testid="testimonial-submit-button"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function openTestimonialModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-testimonial-modal'));
  }
}
