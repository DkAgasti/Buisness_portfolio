'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Star, Loader2, Send, MessageSquarePlus } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || '';

export function TestimonialForm() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const messageValue = watch('message', '');

  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, rating }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Failed to submit review');
      }

      toast.success('Thank you for your review!');
      reset();
      setRating(0);

      // Dispatch custom event to refresh testimonial list
      window.dispatchEvent(new CustomEvent('testimonialAdded'));
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 hover:border-white/20 transition-colors text-sm';

  return (
    <div className="glass rounded-2xl p-6 gradient-border h-full" data-testid="testimonials-form">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-600/10 border border-white/10 flex items-center justify-center">
          <MessageSquarePlus className="w-4.5 h-4.5 text-primary" />
        </div>
        <h3 className="text-lg font-semibold font-heading">Leave a Review</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Name</label>
          <input
            {...register('name', {
              required: 'Name is required',
              maxLength: { value: 50, message: 'Max 50 characters' },
            })}
            className={inputClasses}
            placeholder="Your name"
            data-testid="testimonial-name-input"
          />
          {errors.name && (
            <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Rating</label>
          <div className="flex gap-1" data-testid="testimonial-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileTap={{ scale: 0.85 }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-0.5 transition-transform hover:scale-110"
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star
                  className={`w-6 h-6 transition-all duration-150 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.5)]'
                      : 'text-gray-300 dark:text-white/20'
                  }`}
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div>
          <div className="flex justify-between mb-1.5">
            <label className="text-sm font-medium text-muted-foreground">Message</label>
            <span className={`text-xs ${messageValue.length > 500 ? 'text-red-400' : 'text-muted-foreground'}`}>
              {messageValue.length}/500
            </span>
          </div>
          <textarea
            {...register('message', {
              required: 'Message is required',
              minLength: { value: 10, message: 'Min 10 characters' },
              maxLength: { value: 500, message: 'Max 500 characters' },
            })}
            rows={4}
            className={`${inputClasses} resize-none`}
            placeholder="Share your experience working with me..."
            data-testid="testimonial-message-input"
          />
          {errors.message && (
            <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2.5 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="testimonials-submit-button"
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
    </div>
  );
}
