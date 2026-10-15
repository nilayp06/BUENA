'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { EASE, SCRUB } from '@/lib/motion';

export type Theme = {
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  rule: string;
};

export const DARK: Theme = {
  bg: '#070c10',
  fg: '#eef1f3',
  muted: '#8a9099',
  // The wordmark red fails contrast on near-black, so dark sections use
  // the lifted tint instead. Same brand, legible.
  accent: '#e0656b',
  rule: 'rgba(238,241,243,0.14)',
};

export const LIGHT: Theme = {
  bg: '#f2efe9',
  fg: '#12191f',
  // 4.64:1 on the light surface - the eyebrows and labels this colours
  // are small uppercase text, so it has to clear AA, not just 3:1.
  muted: '#636c78',
  accent: '#a81c24',
  rule: 'rgba(18,25,31,0.16)',
};

export const DEEP: Theme = {
  bg: '#0c2434',
  fg: '#e6f0f6',
  muted: '#8fa8b8',
  accent: '#7ec4ec',
  rule: 'rgba(230,240,246,0.16)',
};

/**
 * Morphs the global semantic tokens as a section passes through.
 *
 * Because every surface on the site reads from --bg/--fg/--accent, this
 * changes the temperature of the WHOLE page at once - which is what makes
 * one act dissolve into the next rather than simply ending.
 */
export default function ThemeMorph({
  to,
  start = 'top 75%',
  end = 'top 25%',
}: {
  to: Theme;
  start?: string;
  end?: string;
}) {
  const marker = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = marker.current;
    const section = el?.closest('section');
    if (!el || !section) return;

    const root = document.documentElement;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const vars = {
      '--bg': to.bg,
      '--fg': to.fg,
      '--muted': to.muted,
      '--accent': to.accent,
      '--rule': to.rule,
    };

    if (reduced) {
      // No scrubbed colour bleed: snap when the section becomes current.
      const st = ScrollTrigger.create({
        trigger: section,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => { if (self.isActive) gsap.set(root, vars); },
      });
      return () => st.kill();
    }

    const tween = gsap.to(root, {
      ...vars,
      ease: EASE.scrub,
      scrollTrigger: { trigger: section, start, end, scrub: SCRUB },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [to, start, end]);

  return <div ref={marker} aria-hidden="true" style={{ display: 'none' }} />;
}
