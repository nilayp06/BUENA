'use client';

import { gsap } from '@/lib/gsap';
import { useScrollScene } from '@/lib/useScrollScene';
import { EASE, SCRUB, MM } from '@/lib/motion';
import { taglines } from '@/content/product';
import ThemeMorph, { DEEP } from '@/components/atmos/ThemeMorph';
import Caustics from '@/components/atmos/Caustics';
import RevealText from '@/components/ui/RevealText';
import Eyebrow from '@/components/ui/Eyebrow';
import { BottlePose } from '@/components/product/BottleStage';
import styles from './Act06Experience.module.css';

/**
 * ACT 06 - THE EXPERIENCE
 *
 * The shift from what the product is to what it feels like. Almost no
 * copy: one line from the brand's own creative, the water, and the light
 * moving on it. The bottle sinks under the surface and holds there.
 */
export default function Act06Experience() {
  const ref = useScrollScene<HTMLElement>(({ root, mm }) => {
    const q = gsap.utils.selector(root);

    const scene = (scale: number) => {
      gsap.to(q(`.${styles.water}`), {
        yPercent: 12 * scale,
        scale: 1.12,
        ease: EASE.scrub,
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: SCRUB },
      });
      // The surface line falls away as we go under.
      gsap.to(q(`.${styles.surface}`), {
        yPercent: -140,
        ease: EASE.scrub,
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'center center', scrub: SCRUB },
      });
    };

    mm.add(MM.desktop, () => scene(1));
    mm.add(MM.mobile, () => scene(0.4));
  });

  return (
    <section ref={ref} id="experience" className={`act ${styles.act}`} aria-labelledby="act-experience">
      <ThemeMorph to={DEEP} start="top 70%" end="top 25%" />
      {/* Submerged: softened, tilted, and held to the right so the statement
          keeps its full measure. */}
      <BottlePose id="experience" x={28} y={3} scale={0.78} rotate={7} blur={1.5} mx={0} my={-18} mscale={0.58} mrotate={5} />

      <div className={styles.frame}>
        <picture>
          <source srcSet="/env/spring.avif" type="image/avif" />
          <img
            className={styles.water}
            src="/env/spring.webp"
            width={1600}
            height={1200}
            alt="Cold spring water running clear over pale stones"
            loading="lazy"
          />
        </picture>

        <Caustics className={styles.caustics} />
        <span className={styles.surface} aria-hidden="true" />
        <div className={styles.scrim} />

        <div className={`shell ${styles.content}`}>
          <Eyebrow className={styles.eyebrow}>The experience</Eyebrow>
          <RevealText
            id="act-experience"
            as="h2"
            className={`display t-xl ${styles.statement}`}
            lines={['Stay hydrated.', <em key="e">Live the good life.</em>]}
          />
          <p className={styles.footnote}>{taglines.crisp}</p>
        </div>
      </div>
    </section>
  );
}
