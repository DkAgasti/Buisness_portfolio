// Single source of truth for the page's content width. The header, every
// section, and the footer must all use this so their left/right edges never
// drift apart again — do not hardcode a width value anywhere else.
//
// A max-width is deliberate, not accidental: with none at all, two-column
// layouts (the hero's text + illustration, for one) stretch their columns
// to fill the full viewport, tearing them apart with dead space in the
// middle on wide screens. 1600px keeps content cohesive on wide monitors
// while still using nearly the full width on normal ones — much less
// side margin than the earlier 1400px cap.
export const CONTAINER = 'mx-auto max-w-[1600px] px-4 sm:px-6';
