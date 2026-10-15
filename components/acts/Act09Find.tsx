'use client';

import { gsap } from '@/lib/gsap';
import { useScrollScene } from '@/lib/useScrollScene';
import { EASE, DUR, STAGGER, MM } from '@/lib/motion';
import { brand, taglines, origin, spec } from '@/content/product';
import RevealText from '@/components/ui/RevealText';
import MagneticButton from '@/components/ui/MagneticButton';
import { BottlePose } from '@/components/product/BottleStage';
import styles from './Act09Find.module.css';

/**
 * ACT 09 - FIND BUENA VIDA
 *
 * The conclusion. The CTA points at the brand's real destinations rather
 * than a checkout that does not exist yet, so nothing here promises
 * something the assets cannot back up.
 */
export default function Act09Find() {
  const ref = useScrollScene<HTMLElement>(({ root, mm }) => {
    const q = gsap.utils.selector(root);

    const reveal = () => {
      // opacity, NOT autoAlpha. autoAlpha sets visibility:hidden at 0, which
      // takes these out of the tab order entirely - and since the reveal only
      // fires on scroll, a keyboard-only user could never reach the primary
      // CTA. With plain opacity the links stay focusable, and tabbing to one
      // scrolls it into view, which fires this reveal.
      gsap.fromTo(
        q('[data-end]'),
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: DUR.slow,
          ease: EASE.out,
          stagger: STAGGER.base,
          scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        },
      );
    };

    mm.add(MM.desktop, reveal);
    mm.add(MM.mobile, reveal);
    mm.add(MM.reduced, () => gsap.set(q('[data-end]'), { opacity: 1, y: 0 }));
  });

  return (
    <footer ref={ref} id="find" className={`act ${styles.act}`} aria-labelledby="act-find">
      {/* Bottle steps aside so the closing line and CTA own the frame. */}
      <BottlePose id="find" x={30} y={8} scale={0.52} rotate={-8} opacity={0.5} blur={2} mopacity={0} />

      <div className={`shell ${styles.inner}`}>
        <RevealText
          id="act-find"
          as="h2"
          className={`display t-xl ${styles.closing}`}
          lines={['Find your', <em key="e">Buena Vida.</em>]}
        />

        <div className={styles.actions} data-end>
          <MagneticButton href={brand.siteUrl} variant="solid">
            Find Buena Vida
          </MagneticButton>
          <MagneticButton href={brand.instagramUrl} variant="ghost">
            {brand.instagram}
          </MagneticButton>
        </div>

        <p className={styles.sign} data-end>
          {taglines.liveWell}
        </p>

        <div className={styles.meta} data-end>
          <span>
            {origin.place}, {origin.region}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {spec.volume} · {spec.volumeImperial}
          </span>
          <span aria-hidden="true">·</span>
          <span>{spec.recycling}</span>
        </div>

        <div className={styles.legal} data-end>
          <span>
            © {new Date().getFullYear()} {brand.name}. {brand.descriptor}.
          </span>
          <a href={brand.siteUrl} target="_blank" rel="noopener noreferrer">
            {brand.site}
          </a>
        </div>
      </div>
    </footer>
  );
}
