'use client';

/**
 * The ONLY place GSAP is registered and the only place Lenis is bridged
 * to ScrollTrigger. Importing gsap anywhere else goes through this module.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

let lenis: Lenis | null = null;
let booted = false;

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function initSmoothScroll() {
  if (booted || typeof window === 'undefined') return lenis;
  booted = true;

  // Reduced motion gets native scroll — smoothing is itself a motion effect.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.85,
    gestureOrientation: 'vertical',
    smoothWheel: true,
    // Native scrolling on touch feels better than smoothed touch and
    // avoids fighting iOS momentum + address-bar resize.
    syncTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Lenis owns the scroll position, so a plain window.scrollTo() moves the
  // page without ScrollTrigger ever hearing about it. Expose the instance
  // outside production so scenes can be driven from the console or a test.
  if (process.env.NODE_ENV !== 'production') {
    const w = window as unknown as Record<string, unknown>;
    w.__lenis = lenis;
    w.__ScrollTrigger = ScrollTrigger;
  }

  return lenis;
}

export function destroySmoothScroll() {
  lenis?.destroy();
  lenis = null;
  booted = false;
}

export function getLenis() {
  return lenis;
}

/** Programmatic scroll that works with or without Lenis. */
export function scrollTo(target: string | number, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : null;
  if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
  else if (typeof target === 'number') window.scrollTo(0, target + offset);
}

export { gsap, ScrollTrigger };
