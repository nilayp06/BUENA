'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { EASE, prefersReducedMotion } from '@/lib/motion';
import { brand } from '@/content/product';
import styles from './Preloader.module.css';

/**
 * Act 00 - "The First Drop".
 *
 * A single drop falls, lands, and its ripple opens the hero. Deliberately
 * short (~1.7s) and fully skipped under reduced motion, where the page is
 * simply there on arrival. Scroll is locked only while it plays.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      setDone(true);
      return;
    }

    const el = root.current;
    if (!el) return;

    const q = gsap.utils.selector(el);
    document.documentElement.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = '';
        setDone(true);
      },
    });

    tl.fromTo(q(`.${styles.word}`), { yPercent: 108 }, {
      yPercent: 0, duration: 0.9, ease: EASE.out, stagger: 0.08,
    })
      .fromTo(q(`.${styles.drop}`), { y: -140, autoAlpha: 0 }, {
        y: 0, autoAlpha: 1, duration: 0.62, ease: 'power2.in',
      }, '-=0.35')
      .fromTo(q(`.${styles.ripple}`), { scale: 0, autoAlpha: 0.85 }, {
        scale: 1, autoAlpha: 0, duration: 1.0, ease: EASE.out, stagger: 0.12,
      }, '-=0.06')
      .to(q(`.${styles.drop}`), { scaleY: 0.25, scaleX: 1.5, autoAlpha: 0, duration: 0.3, ease: EASE.out }, '<')
      .to(q(`.${styles.word}`), { yPercent: -108, duration: 0.7, ease: 'power3.inOut', stagger: 0.05 }, '-=0.35')
      // The curtain lifts rather than fading, so it reads as a reveal.
      .to(el, { yPercent: -100, duration: 1.0, ease: 'power4.inOut' }, '-=0.3');

    return () => {
      document.documentElement.style.overflow = '';
      tl.kill();
    };
  }, []);

  if (done) return null;

  return (
    <div ref={root} className={styles.veil} role="status" aria-label="Loading">
      <div className={styles.lockup}>
        {brand.wordmark.map((w) => (
          <span className={styles.line} key={w}>
            <span className={styles.word}>{w}</span>
          </span>
        ))}
      </div>
      <span className={styles.drop} aria-hidden="true" />
      <span className={styles.ripple} aria-hidden="true" />
      <span className={styles.ripple} aria-hidden="true" />
    </div>
  );
}
