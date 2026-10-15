'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, scrollTo } from '@/lib/gsap';
import { EASE, DUR, STAGGER, prefersReducedMotion } from '@/lib/motion';
import { brand } from '@/content/product';
import styles from './Nav.module.css';

const LINKS = [
  { label: 'Origin', href: '#origin' },
  { label: 'Product', href: '#product' },
  { label: 'Experience', href: '#experience' },
  { label: 'Details', href: '#details' },
] as const;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

  /* Condense the bar once the hero is behind us. */
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onUpdate: (self) => el.classList.toggle(styles.condensed, self.progress > 0 || self.scroll() > 80),
      onToggle: (self) => el.classList.toggle(styles.condensed, self.isActive),
    });
    return () => st.kill();
  }, []);

  /* Mobile panel: animate in, trap focus, restore it on close. */
  useEffect(() => {
    const el = panel.current;
    if (!el) return;

    if (!open) {
      gsap.set(el, { autoAlpha: 0, pointerEvents: 'none' });
      return;
    }

    const items = el.querySelectorAll('[data-nav-item]');
    const reduced = prefersReducedMotion();

    gsap.set(el, { autoAlpha: 1, pointerEvents: 'auto' });
    if (reduced) {
      gsap.set(items, { yPercent: 0, opacity: 1 });
    } else {
      // opacity, not autoAlpha: autoAlpha would set visibility:hidden at 0,
      // and a hidden element cannot take the focus we move into it below.
      gsap.fromTo(
        items,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: DUR.base, ease: EASE.out, stagger: STAGGER.base },
      );
    }

    const previous = document.activeElement as HTMLElement | null;
    const focusables = el.querySelectorAll<HTMLElement>('a, button');
    focusables[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      (previous ?? toggle.current)?.focus();
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    scrollTo(href, -40);
  };

  return (
    <>
      <header ref={bar} className={styles.bar}>
        <a
          className={styles.brand}
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            go('#top');
          }}
        >
          <span className={styles.brandMark}>{brand.name}</span>
          <span className={styles.brandSub}>{brand.descriptor}</span>
        </a>

        <nav className={styles.links} aria-label="Primary">
          {LINKS.map((l) => (
            <a
              key={l.href}
              className={styles.link}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                go(l.href);
              }}
            >
              <span>{l.label}</span>
            </a>
          ))}
        </nav>

        <a className={styles.cta} href="#find" onClick={(e) => { e.preventDefault(); go('#find'); }}>
          Find Buena&nbsp;Vida
        </a>

        <button
          ref={toggle}
          type="button"
          className={styles.burger}
          aria-expanded={open}
          aria-controls="bv-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.burgerLine} ${open ? styles.burgerOpen : ''}`} />
          <span className={`${styles.burgerLine} ${open ? styles.burgerOpen : ''}`} />
        </button>
      </header>

      <div ref={panel} id="bv-menu" className={styles.panel} hidden={!open}>
        <nav aria-label="Mobile">
          {LINKS.map((l) => (
            <span className={styles.panelRow} key={l.href}>
              <a
                data-nav-item
                className={styles.panelLink}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.href);
                }}
              >
                {l.label}
              </a>
            </span>
          ))}
          <span className={styles.panelRow}>
            <a
              data-nav-item
              className={`${styles.panelLink} ${styles.panelCta}`}
              href="#find"
              onClick={(e) => {
                e.preventDefault();
                go('#find');
              }}
            >
              Find Buena Vida
            </a>
          </span>
        </nav>
      </div>
    </>
  );
}
