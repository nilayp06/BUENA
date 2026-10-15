'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { EASE, prefersReducedMotion } from '@/lib/motion';
import styles from './MagneticButton.module.css';

/**
 * Primary CTA. The magnetic pull is a pointer-only enhancement: it is
 * skipped entirely for touch, coarse pointers and reduced motion, and the
 * element stays a real <a>/<button> so keyboard and screen readers are
 * unaffected either way.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'solid' | 'ghost';
  className?: string;
}) {
  const root = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const strength = 0.32;
    const quickX = gsap.quickTo(el, 'x', { duration: 0.5, ease: EASE.out });
    const quickY = gsap.quickTo(el, 'y', { duration: 0.5, ease: EASE.out });
    const labelX = gsap.quickTo(label.current, 'x', { duration: 0.65, ease: EASE.out });
    const labelY = gsap.quickTo(label.current, 'y', { duration: 0.65, ease: EASE.out });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      quickX(dx * strength);
      quickY(dy * strength);
      labelX(dx * strength * 0.4);
      labelY(dy * strength * 0.4);
    };

    const reset = () => {
      quickX(0); quickY(0); labelX(0); labelY(0);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', reset);
    };
  }, []);

  const cls = `${styles.btn} ${styles[variant]} ${className}`;
  const inner = (
    <>
      <span ref={label} className={styles.label}>
        {children}
      </span>
      <span className={styles.arrow} aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path
            d="M1 7.5h12M8 2.5l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </>
  );

  if (href) {
    const external = href.startsWith('http');
    return (
      <a
        ref={root}
        className={cls}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }

  return (
    <button ref={root} type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}
