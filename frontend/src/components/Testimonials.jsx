"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Placeholder } from "@/components/ui/placeholder";
import { CONTAINER } from "@/lib/container";
import { TESTIMONIALS } from "@/lib/testimonials-data";
import { openTestimonialModal } from "@/components/TestimonialModal";
import { useContent } from '@/components/ContentProvider';
import { DEFAULT_NAME } from "@/lib/identity";

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

export function Testimonials() {
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const count = TESTIMONIALS.length;
  const { siteConfig } = useContent();
  const config = siteConfig || {};
  const logo = config.avatar || config.photo || config.profileImage || config.image;
  const avgRating = useMemo(() => {
    if (!count) return 0;
    return (
      Math.round(
        (TESTIMONIALS.reduce((sum, t) => sum + (t.rating || 0), 0) / count) *
          10,
      ) / 10
    );
  }, [count]);

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

  const handlePrev = () => scrollToIndex(Math.max(0, activeIndex - 1));
  const handleNext = () => scrollToIndex(Math.min(count - 1, activeIndex + 1));

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

  if (count === 0) return null;

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
            <a
              href="#testimonials"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:gap-2.5 transition-all whitespace-nowrap"
            >
              View all testimonials
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="card-surface rounded-3xl p-5 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[220px_1px_1fr] gap-6 lg:gap-8 items-center">
              {/* Rating summary */}
              <div className="flex flex-row lg:flex-col items-center lg:items-start gap-4 lg:gap-3">
                {/* <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0">
                  <span className="text-sm font-bold text-white font-heading">
                    {DEFAULT_NAME.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </span>
                </div> */}
                <div className="relative h-10 flex items-center justify-center flex-shrink-0">
                  <img
                    src={logo}
                    alt={`logo`}
                    className="h-full w-auto object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold font-heading">
                      {avgRating.toFixed(1)}
                    </span>
                    <Stars rating={Math.round(avgRating)} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Based on {count} review{count !== 1 ? "s" : ""}
                  </p>
                  <button
                    onClick={openTestimonialModal}
                    className="btn-primary mt-4 px-4 py-2 text-sm"
                    data-testid="leave-review-button"
                  >
                    Leave a Review
                  </button>
                </div>
              </div>

              <div
                className="hidden lg:block w-px h-full bg-[hsl(var(--border))]"
                aria-hidden="true"
              />

              {/* Carousel */}
              <div className="relative min-w-0">
                <div
                  ref={trackRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth"
                  data-testid="testimonials-carousel"
                >
                  {TESTIMONIALS.map((t) => (
                    <div
                      key={t.id}
                      className="snap-start shrink-0 w-[85%] sm:w-[300px] card-surface rounded-2xl p-5 flex flex-col"
                      data-testid="testimonial-card"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Placeholder
                          ratio="1/1"
                          rounded="rounded-full"
                          className="w-10 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate">
                            {t.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {t.role}
                          </p>
                        </div>
                      </div>
                      <Stars rating={t.rating} />
                      <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                        {t.message}
                      </p>
                    </div>
                  ))}
                </div>

                {count > 1 && (
                  <>
                    <button
                      onClick={handlePrev}
                      disabled={activeIndex === 0}
                      aria-label="Previous review"
                      className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-[hsl(var(--border))] items-center justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={activeIndex === count - 1}
                      aria-label="Next review"
                      className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border border-[hsl(var(--border))] items-center justify-center shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[hsl(var(--muted))] transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {count > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {TESTIMONIALS.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => scrollToIndex(i)}
                    aria-label={`Go to review ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${i === activeIndex ? "w-6 bg-primary" : "w-2 bg-[hsl(var(--border))]"}`}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
