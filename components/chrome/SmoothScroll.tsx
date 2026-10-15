'use client';

import { useEffect } from 'react';
import { initSmoothScroll, destroySmoothScroll } from '@/lib/gsap';

/**
 * Boots Lenis once for the whole document and tears it down on unmount.
 * Renders nothing. Reduced-motion users get native scroll (see lib/gsap).
 */
export default function SmoothScroll() {
  useEffect(() => {
    initSmoothScroll();
    return () => destroySmoothScroll();
  }, []);

  return null;
}
