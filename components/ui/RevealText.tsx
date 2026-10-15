'use client';

import { useLayoutEffect, useRef, type ElementType, type ReactNode } from 'react';
import { gsap } from '@/lib/gsap';
import { EASE, DUR, STAGGER, MM } from '@/lib/motion';

/**
 * Mask reveal: each line sits in an overflow-hidden track and slides up
 * from beneath it. The workhorse entrance for every headline on the site,
 * so the type always arrives the same way.
 *
 * Pass `lines` as separate strings - we never split text at runtime, which
 * keeps the markup readable to screen readers and avoids re-layout.
 */
export default function RevealText({
  lines,
  as: Tag = 'h2',
  className = '',
  lineClassName = '',
  delay = 0,
  id,
}: {
  lines: readonly (string | ReactNode)[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  id?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    const targets = () => el.querySelectorAll('[data-line]');

    const animate = (distance: string, duration: number) => {
      gsap.fromTo(
        targets(),
        { yPercent: 118, rotate: 1.5 },
        {
          yPercent: 0,
          rotate: 0,
          duration,
          delay,
          ease: EASE.out,
          stagger: STAGGER.base,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        },
      );
      void distance;
    };

    mm.add(MM.desktop, () => animate('118%', DUR.slow));
    mm.add(MM.mobile, () => animate('110%', DUR.base));
    mm.add(MM.reduced, () => {
      gsap.set(targets(), { yPercent: 0, rotate: 0 });
      gsap.fromTo(
        targets(),
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: 0.2,
          stagger: 0.03,
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
        },
      );
    });

    return () => mm.revert();
  }, [delay]);

  return (
    <Tag ref={root} id={id} className={className}>
      {lines.map((line, i) => (
        <span className="mask-line" key={i}>
          <span data-line className={lineClassName}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
