'use client';

import { useLayoutEffect, useRef, type RefObject } from 'react';
import { gsap, ScrollTrigger } from './gsap';

/**
 * Wraps a scene in gsap.context() so every tween and ScrollTrigger it
 * creates is reverted on unmount. Scenes receive a gsap.matchMedia()
 * instance and must register their desktop / mobile / reduced branches
 * on it rather than reading breakpoints themselves.
 */
export function useScrollScene<T extends HTMLElement>(
  setup: (ctx: { root: T; mm: gsap.MatchMedia; self: gsap.Context }) => void,
  deps: unknown[] = [],
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context((self) => setup({ root, mm, self }), root);

    // Pinned layouts need a recalculation once fonts and images settle.
    const refresh = () => ScrollTrigger.refresh();
    if (document.fonts?.ready) void document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh, { once: true });

    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
