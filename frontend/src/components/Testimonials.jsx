"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Quote, Star } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { CONTAINER } from "@/lib/container";
import { realUrl } from "@/lib/project";
import { openTestimonialModal } from "@/components/TestimonialModal";

const API = process.env.NEXT_PUBLIC_BACKEND_URL || '';

function Stars({ rating }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-[hsl(var(--border))]"}`}
        />
      ))}
    </div>
  );
}

function Avatar({ name, avatar }) {
  if (realUrl(avatar)) {
    return (
      <img
        src={avatar}
        alt={name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        loading="lazy"
        decoding="async"
      />
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-semibold text-primary">
        {(name || '?').trim()[0]?.toUpperCase()}
      </span>
    </div>
  );
}

export function Testimonials() {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [liveTestimonials, setLiveTestimonials] = useState([]);

  const fetchLive = () => {
    fetch(`${API}/api/testimonials`)
      .then((r) => r.json())
      .then((data) => setLiveTestimonials(Array.isArray(data.testimonials) ? data.testimonials : []))
      .catch(() => {});
  };

  useEffect(() => {
    fetchLive();
    window.addEventListener('testimonialAdded', fetchLive);
    return () => window.removeEventListener('testimonialAdded', fetchLive);
  }, []);

  const testimonials = liveTestimonials;
  const count = testimonials.length;

  const scrollToIndex = (i) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i];
    if (card)
      track.scrollTo({
        left: card.offsetLeft - track.offsetLeft,
        behavior: "smooth",
      });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      let closest = 0;
      let closestDist = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const dist = Math.abs(
          child.offsetLeft - track.offsetLeft - track.scrollLeft,
        );
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = (e) => {
    e.preventDefault();
    document
      .querySelector("#testimonials")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="testimonials"
      className="py-14 sm:py-16 lg:py-20"
      data-testid="testimonials-section"
    >
      <div className={CONTAINER}>
        <ScrollReveal>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10 lg:mb-12">
            <div>
              <span className="section-eyebrow mb-3 block">Testimonials</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading tracking-tight mb-3">
                What Clients Say
              </h2>
              <p className="text-muted-foreground max-w-md">
                Don&apos;t just take my word for it. Here&apos;s what my clients
                have to say about working with me.
              </p>
            </div>
            <div className="flex items-center gap-5">
              <button
                onClick={openTestimonialModal}
                className="text-sm font-medium text-primary hover:opacity-80 transition-opacity whitespace-nowrap inline-flex items-center"
                data-testid="leave-review-button"
              >
                Leave a Review
                 <ArrowRight className="w-4 h-4" />
              </button>
              
            </div>
          </div>
        </ScrollReveal>

        {count > 0 ? (
          <ScrollReveal delay={0.1}>
            <div
              ref={trackRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
              data-testid="testimonials-carousel"
            >
              {testimonials.map((t, i) => (
                <div
                  key={t._id || t.id || i}
                  className="snap-start shrink-0 min-w-0 w-[85%] sm:w-[calc((100%-2.5rem)/3)] card-surface rounded-2xl p-6 flex flex-col"
                  data-testid="testimonial-card"
                >
                  <div className="flex items-start justify-between mb-3">
                    <Quote className="w-6 h-6 text-primary/60 flex-shrink-0" />
                    {t.rating && <Stars rating={t.rating} />}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 break-words">
                    &ldquo;{t.message}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-5">
                    <Avatar name={t.name} avatar={t.avatar} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{t.name}</p>
                      {t.role && (
                        <p className="text-xs text-muted-foreground truncate">
                          {t.role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {count > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((t, i) => (
                  <button
                    key={t._id || t.id || i}
                    onClick={() => scrollToIndex(i)}
                    aria-label={`Go to review ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === activeIndex ? "w-6 bg-primary" : "w-2 bg-[hsl(var(--border))]"}`}
                  />
                ))}
              </div>
            )}
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={0.1}>
            <div
              className="card-surface rounded-2xl p-10 text-center text-muted-foreground text-sm"
              data-testid="testimonials-empty"
            >
              No reviews yet — be the first to leave one.
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
