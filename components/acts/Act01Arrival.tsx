'use client';

import { gsap } from '@/lib/gsap';
import { useScrollScene } from '@/lib/useScrollScene';
import { EASE, DUR, SCRUB, MM } from '@/lib/motion';
import { brand, taglines, origin } from '@/content/product';
import Ridges from '@/components/atmos/Ridges';
import { BottlePose } from '@/components/product/BottleStage';
import styles from './Act01Arrival.module.css';

/**
 * ACT 01 - THE ARRIVAL
 *
 * Pre-dawn ridgeline. The wordmark arrives as architecture, the bottle
 * rises out of the mist between its two lines, and the environment drifts
 * in depth tiers behind it. The opening frame of the film.
 */
export default function Act01Arrival() {
  const ref = useScrollScene<HTMLElement>(({ root, mm }) => {
    const q = gsap.utils.selector(root);

    /* --- entrance: the scene assembles itself before any scrolling --- */
    const intro = (reduced: boolean) => {
      if (reduced) {
        gsap.set([q('[data-depth]'), q(`.${styles.word}`), q(`.${styles.meta}`)], {
          autoAlpha: 1, yPercent: 0, scale: 1,
        });
        return;
      }
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(q('[data-depth]'),
        { autoAlpha: 0, scale: 1.08 },
        { autoAlpha: 1, scale: 1, duration: 2.0, ease: EASE.out, stagger: 0.09 })
        .fromTo(q(`.${styles.word}`),
          { yPercent: 116 },
          { yPercent: 0, duration: 1.5, ease: EASE.out, stagger: 0.1 }, '-=1.55')
        .fromTo(q(`.${styles.meta}`),
          { autoAlpha: 0, y: 26 },
          { autoAlpha: 1, y: 0, duration: DUR.slow, ease: EASE.out, stagger: 0.09 }, '-=0.95');
    };

    /* --- scroll: depth tiers drift at different rates --- */
    const parallax = (scale: number) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      });

      // Far layers barely move; near layers move most. That difference IS
      // the depth - matching the reference's fast/slow/static tiering.
      tl.to(q('[data-depth="sky"]'), { yPercent: 6 * scale, ease: EASE.scrub }, 0)
        .to(q('[data-depth="glow"]'), { yPercent: 10 * scale, autoAlpha: 0.35, ease: EASE.scrub }, 0)
        .to(q('[data-depth="far"]'), { yPercent: -4 * scale, ease: EASE.scrub }, 0)
        .to(q('[data-depth="mid"]'), { yPercent: -11 * scale, ease: EASE.scrub }, 0)
        .to(q('[data-depth="near"]'), { yPercent: -26 * scale, ease: EASE.scrub }, 0)
        .to(q('[data-depth="mist"]'), { yPercent: -44 * scale, autoAlpha: 0.7, ease: EASE.scrub }, 0)
        // The wordmark sinks behind the ridgeline as we descend into the scene.
        .to(q(`.${styles.wordmark}`), { yPercent: -18 * scale, autoAlpha: 0.15, ease: EASE.scrub }, 0)
        .to(q(`.${styles.meta}`), { autoAlpha: 0, y: -40, ease: EASE.scrub }, 0)
        .to(q(`.${styles.cue}`), { autoAlpha: 0, ease: EASE.scrub }, 0);
    };

    mm.add(MM.desktop, () => { intro(false); parallax(1); });
    mm.add(MM.mobile, () => { intro(false); parallax(0.45); });
    mm.add(MM.reduced, () => intro(true));
  });

  return (
    <section ref={ref} id="top" className={`act ${styles.act}`} aria-labelledby="act-arrival">
      {/* Bottle rises out of the mist, already in focus at rest. */}
      <BottlePose id="arrival" y={4} scale={1} blur={0} my={13} mscale={0.8} />

      <div className={styles.sticky}>
        <Ridges />

        <div className={`shell ${styles.content}`}>
          <h1 id="act-arrival" className={`display t-hero ${styles.wordmark}`}>
            <span className="sr-only">
              {brand.name} {brand.descriptor}
            </span>
            {brand.wordmark.map((w) => (
              <span className={styles.line} key={w} aria-hidden="true">
                <span className={styles.word}>{w}</span>
              </span>
            ))}
          </h1>

          <div className={`${styles.meta} ${styles.bottom}`}>
            <p className={styles.origin}>
              {origin.place}
              <span aria-hidden="true"> · </span>
              {origin.region}
            </p>
            <p className={styles.volume}>{taglines.seal}</p>
          </div>
        </div>

        <div className={styles.cue} aria-hidden="true">
          <span className={styles.cueLabel}>Scroll</span>
          <span className={styles.cueTrack}>
            <span className={styles.cueDot} />
          </span>
        </div>
      </div>
    </section>
  );
}
