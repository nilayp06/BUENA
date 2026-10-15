'use client';

import { gsap } from '@/lib/gsap';
import { useScrollScene } from '@/lib/useScrollScene';
import { EASE, SCRUB, MM } from '@/lib/motion';
import { taglines, brand } from '@/content/product';
import ThemeMorph, { DARK } from '@/components/atmos/ThemeMorph';
import RevealText from '@/components/ui/RevealText';
import { BottlePose } from '@/components/product/BottleStage';
import styles from './Act08Final.module.css';

/**
 * ACT 08 - THE FINAL MOMENT
 *
 * Back to night, and the largest the product ever gets. The page returns
 * to the temperature it opened at, which is what makes the whole thing
 * read as one closed loop rather than a stack of sections.
 */
export default function Act08Final() {
  const ref = useScrollScene<HTMLElement>(({ root, mm }) => {
    const q = gsap.utils.selector(root);

    const scene = (scale: number) => {
      // The wordmark opens outward behind the bottle as it fills the frame.
      gsap.fromTo(
        q(`.${styles.ghost}`),
        { letterSpacing: '-0.04em', autoAlpha: 0.05, scale: 0.94 },
        {
          letterSpacing: `${0.1 * scale}em`,
          autoAlpha: 0.14,
          scale: 1,
          ease: EASE.scrub,
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: SCRUB },
        },
      );

      gsap.to(q(`.${styles.halo}`), {
        scale: 1.35,
        autoAlpha: 0.9,
        ease: EASE.scrub,
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'center center', scrub: SCRUB },
      });
    };

    mm.add(MM.desktop, () => scene(1));
    mm.add(MM.mobile, () => scene(0.4));
    mm.add(MM.reduced, () => gsap.set(q(`.${styles.ghost}`), { autoAlpha: 0.12 }));
  });

  return (
    <section ref={ref} id="final" className={`act ${styles.act}`} aria-labelledby="act-final">
      <ThemeMorph to={DARK} start="top 80%" end="top 30%" />
      {/* The largest the product ever gets - deliberately cropped by the
          bottom of the frame, with the statement held clear at top left. */}
      <BottlePose id="final" y={14} scale={1.45} rotate={0} blur={0} mscale={1.0} my={10} />

      <div className={styles.sticky}>
        <span className={styles.halo} aria-hidden="true" />

        <span className={`display ${styles.ghost}`} aria-hidden="true">
          {brand.wordmark.join(' ')}
        </span>

        {/* Reduced motion anchors the shared bottle stage to the hero, so
            this act carries its own still of the product to close the
            story. Hidden whenever the choreographed bottle is doing its job. */}
        <img
          className={styles.still}
          src="/product/bottle@2x.webp"
          width={733}
          height={2007}
          alt="The Buena Vida aluminium bottle"
          loading="lazy"
        />

        <div className={`shell ${styles.content}`}>
          <RevealText
            id="act-final"
            as="h2"
            className={`display t-md ${styles.line}`}
            lines={[taglines.seal]}
          />
        </div>
      </div>
    </section>
  );
}
