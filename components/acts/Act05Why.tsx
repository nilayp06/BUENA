'use client';

import { gsap } from '@/lib/gsap';
import { useScrollScene } from '@/lib/useScrollScene';
import { EASE, DUR, STAGGER, SCRUB, MM } from '@/lib/motion';
import { pillars } from '@/content/product';
import { ICONS } from '@/components/ui/Icons';
import RevealText from '@/components/ui/RevealText';
import Eyebrow from '@/components/ui/Eyebrow';
import { BottlePose } from '@/components/product/BottleStage';
import styles from './Act05Why.module.css';

/**
 * ACT 05 - WHY BUENA VIDA
 *
 * The three pillars printed on the brand's own creative, given room as
 * oversized numerals. The connector lines from the previous act straighten
 * out into the rules that separate these rows - the diagram unwinding into
 * a list.
 */
export default function Act05Why() {
  const ref = useScrollScene<HTMLElement>(({ root, mm }) => {
    const q = gsap.utils.selector(root);

    const rows = () => {
      gsap.utils.toArray<HTMLElement>(q(`.${styles.row}`)).forEach((row) => {
        gsap.fromTo(
          row.querySelectorAll('[data-rise]'),
          { autoAlpha: 0, y: 34 },
          {
            autoAlpha: 1,
            y: 0,
            duration: DUR.slow,
            ease: EASE.out,
            stagger: STAGGER.base,
            scrollTrigger: { trigger: row, start: 'top 80%', once: true },
          },
        );
        // The rule draws itself across as the row arrives.
        gsap.fromTo(
          row.querySelector(`.${styles.rule}`),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: DUR.cinematic,
            ease: EASE.out,
            scrollTrigger: { trigger: row, start: 'top 84%', once: true },
          },
        );
      });
    };

    const drift = (scale: number) => {
      gsap.utils.toArray<HTMLElement>(q(`.${styles.index}`)).forEach((n, i) => {
        gsap.to(n, {
          yPercent: -18 * scale * (1 + i * 0.12),
          ease: EASE.scrub,
          scrollTrigger: { trigger: n.closest(`.${styles.row}`), start: 'top bottom', end: 'bottom top', scrub: SCRUB },
        });
      });
    };

    mm.add(MM.desktop, () => { rows(); drift(1); });
    mm.add(MM.mobile, () => { rows(); drift(0.35); });
    mm.add(MM.reduced, () => {
      gsap.set([q('[data-rise]'), q(`.${styles.rule}`)], { autoAlpha: 1, y: 0, scaleX: 1 });
    });
  });

  return (
    <section ref={ref} id="why" className={`act ${styles.act}`} aria-labelledby="act-why">
      {/* Out of frame: this act belongs to the words. */}
      <BottlePose id="why" y={0} scale={0.5} opacity={0} blur={8} mopacity={0} />

      <div className={`shell ${styles.head}`}>
        <Eyebrow>Why Buena Vida</Eyebrow>
        <RevealText
          id="act-why"
          as="h2"
          className={`display t-lg ${styles.title}`}
          lines={['Three reasons.', <em key="e">No footnotes.</em>]}
        />
      </div>

      <ol className={`shell ${styles.list}`}>
        {pillars.map((p) => {
          const Icon = ICONS[p.icon];
          return (
            <li className={styles.row} key={p.index}>
              <span className={styles.rule} aria-hidden="true" />
              <span className={styles.index} aria-hidden="true">
                {p.index}
              </span>
              <div className={styles.rowBody}>
                <Icon className={styles.icon} />
                <h3 className={styles.rowTitle} data-rise>
                  {p.title}
                </h3>
                <p className={styles.rowText} data-rise>
                  {p.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
