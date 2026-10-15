/**
 * The shared motion vocabulary. Every act imports from here so the whole
 * site moves with one rhythm instead of each section inventing its own.
 */

export const EASE = {
  /** Entrances — long cinematic settle. */
  out: 'expo.out',
  /** Morphs and colour transitions. */
  inOut: 'power2.inOut',
  /** Exits — faster than entrances. */
  in: 'power2.in',
  /** Scroll-scrubbed timelines are always linear; scroll IS the easing. */
  scrub: 'none',
} as const;

export const DUR = {
  fast: 0.36,
  base: 0.6,
  slow: 1.1,
  cinematic: 1.6,
} as const;

/** Stagger between items in a list/grid reveal. */
export const STAGGER = { tight: 0.04, base: 0.07, loose: 0.12 } as const;

/** Scrub smoothing. Lenis already damps input, so a small number is enough. */
export const SCRUB = 0.6;

export const BREAK = { mobile: '(max-width: 767px)', desktop: '(min-width: 768px)' } as const;

/** matchMedia query set used by every act's gsap.matchMedia() block. */
export const MM = {
  desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
} as const;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Toggle will-change only while a ScrollTrigger is live. Leaving
 * will-change on permanently forces wasted GPU layers on every element.
 */
export const willChange = (el: Element | null, on: boolean) => {
  if (el instanceof HTMLElement) el.style.willChange = on ? 'transform, opacity' : '';
};

/** Standard ScrollTrigger callbacks that manage will-change for a scene. */
export const layerHints = (targets: () => Element[]) => ({
  onToggle: (self: { isActive: boolean }) =>
    targets().forEach((t) => willChange(t, self.isActive)),
});
