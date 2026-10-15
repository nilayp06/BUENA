'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './ScrollProgress.module.css';

/**
 * Hairline progress indicator down the right edge. Scrubbed directly off
 * document progress - one ScrollTrigger, one transform, no scroll listener.
 */
export default function ScrollProgress() {
  const fill = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = fill.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => gsap.set(el, { scaleY: self.progress }),
      invalidateOnRefresh: true,
    });

    return () => st.kill();
  }, []);

  return (
    <div className={styles.track} aria-hidden="true">
      <span ref={fill} className={styles.fill} />
    </div>
  );
}
