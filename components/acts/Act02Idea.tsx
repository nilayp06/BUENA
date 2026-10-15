'use client';

import { gsap } from '@/lib/gsap';
import { useScrollScene } from '@/lib/useScrollScene';
import { EASE, SCRUB, MM } from '@/lib/motion';
import { taglines } from '@/content/product';
import ThemeMorph, { LIGHT } from '@/components/atmos/ThemeMorph';
import RevealText from '@/components/ui/RevealText';
import Eyebrow from '@/components/ui/Eyebrow';
import { BottlePose } from '@/components/product/BottleStage';
import styles from './Act02Idea.module.css';

/**
 * ACT 02 - THE IDEA
 *
 * Dawn. The whole page changes temperature from night to warm daylight,
 * and the bottle recedes to let the statement carry the frame. The first
 * of the two token morphs that bookend the story.
 */
export default function Act02Idea() {
  const ref = useScrollScene<HTMLElement>(({ root, mm }) => {
    const q = gsap.utils.selector(root);

    const scene = (scale: number) => {
      gsap.to(q(`.${styles.wash}`), {
        yPercent: -14 * scale,
        scale: 1.12,
        ease: EASE.scrub,
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: SCRUB },
      });
    };

    mm.add(MM.desktop, () => scene(1));
    mm.add(MM.mobile, () => scene(0.4));
  });

  return (
    <section ref={ref} id="idea" className={`act ${styles.act}`} aria-labelledby="act-idea">
      <ThemeMorph to={LIGHT} start="top 85%" end="top 30%" />
      {/* Steps back and to the right, into the gap between the statement and
          the aside, so it never sits on top of the words. */}
      <BottlePose id="idea" x={9} y={2} scale={0.62} rotate={-4} blur={0} mx={0} my={16} mscale={0.5} />

      <div className={styles.wash} aria-hidden="true" />

      <div className={`shell ${styles.content}`}>
        <Eyebrow className={styles.eyebrow}>The idea</Eyebrow>

        <RevealText
          id="act-idea"
          as="h2"
          className={`display t-xl ${styles.statement}`}
          lines={['The good life', <em key="em">in every drop.</em>]}
        />

        <div className={styles.aside}>
          <p className="lede">
            Not a promise — a habit. Water you reach for without thinking, cold
            and clean and quiet, doing the one thing water should do.
          </p>
          <p className={styles.note}>{taglines.byNature}</p>
        </div>
      </div>
    </section>
  );
}
