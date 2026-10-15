'use client';

import { gsap } from '@/lib/gsap';
import { useScrollScene } from '@/lib/useScrollScene';
import { EASE, SCRUB, MM, DUR, STAGGER } from '@/lib/motion';
import { contourPaths, TOPO_VIEW } from '@/lib/topo';
import { origin, tds, award } from '@/content/product';
import ThemeMorph, { DEEP } from '@/components/atmos/ThemeMorph';
import RevealText from '@/components/ui/RevealText';
import Eyebrow from '@/components/ui/Eyebrow';
import { BottlePose } from '@/components/product/BottleStage';
import styles from './Act03Origin.module.css';

const CONTOURS = contourPaths(4242, 9);

/**
 * ACT 03 - THE ORIGIN
 *
 * The signature transition of the site: we push into the engraved lake
 * artwork printed on the bottle's own label until it fills the frame, then
 * dissolve it into the real Palomar landscape. The brand's own packaging
 * becomes the world the product came from - and the blur through the
 * hand-off is exactly where the low-resolution source is invisible.
 */
export default function Act03Origin() {
  const ref = useScrollScene<HTMLElement>(({ root, mm }) => {
    const q = gsap.utils.selector(root);

    const scene = (mobile: boolean) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      });

      // A three-step dissolve. The tiny label crop is only ever on screen
      // briefly and behind a growing aperture, handing off to a full
      // resolution engraving of the same scene before anyone can study it,
      // and only then to the real photograph.
      //
      // 1. Push into the artwork printed on the bottle.
      tl.fromTo(
        q(`.${styles.label}`),
        { clipPath: 'circle(5% at 50% 50%)', scale: 1.55 },
        { clipPath: 'circle(80% at 50% 50%)', scale: 1.05, ease: EASE.scrub, duration: 0.3 },
        0,
      )
        // 2. Same scene, same language, full resolution.
        .to(q(`.${styles.label}`), { autoAlpha: 0, ease: EASE.scrub, duration: 0.16 }, 0.26)
        .fromTo(
          q(`.${styles.etch}`),
          { autoAlpha: 0, scale: 1.2 },
          { autoAlpha: 1, scale: 1.08, ease: EASE.scrub, duration: 0.22 },
          0.24,
        )
        // 3. The illustration becomes the real mountain.
        .to(q(`.${styles.etch}`), { autoAlpha: 0, scale: 1.02, ease: EASE.scrub, duration: 0.2 }, 0.44)
        .fromTo(
          q(`.${styles.place}`),
          { autoAlpha: 0, scale: 1.14 },
          { autoAlpha: 1, scale: 1.04, ease: EASE.scrub, duration: 0.24 },
          0.42,
        )
        // 4. Contours survey the terrain.
        .fromTo(
          q(`.${styles.contour}`),
          { strokeDashoffset: 1 },
          { strokeDashoffset: 0, ease: EASE.scrub, duration: 0.28, stagger: 0.012 },
          0.54,
        )
        .to(q(`.${styles.place}`), { scale: 1, yPercent: mobile ? -3 : -8, ease: EASE.scrub, duration: 0.34 }, 0.62);
    };

    const copy = () => {
      gsap.from(q('[data-fact]'), {
        autoAlpha: 0,
        y: 28,
        duration: DUR.slow,
        ease: EASE.out,
        stagger: STAGGER.loose,
        scrollTrigger: { trigger: q(`.${styles.facts}`)[0], start: 'top 82%', once: true },
      });
    };

    mm.add(MM.desktop, () => { scene(false); copy(); });
    mm.add(MM.mobile, () => { scene(true); copy(); });
    mm.add(MM.reduced, () => {
      // Skip straight to the destination frame - no push-in, no dissolve.
      gsap.set([q(`.${styles.label}`), q(`.${styles.etch}`)], { autoAlpha: 0 });
      gsap.set(q(`.${styles.place}`), { autoAlpha: 1, scale: 1 });
      gsap.set(q(`.${styles.contour}`), { strokeDashoffset: 0 });
    });
  });

  return (
    <section ref={ref} id="origin" className={`act ${styles.act}`} aria-labelledby="act-origin">
      <ThemeMorph to={DEEP} start="top 60%" end="top 10%" />
      {/* The bottle drops away while its own artwork takes over the frame. */}
      <BottlePose id="origin" y={0} scale={0.42} rotate={0} opacity={0} blur={6} mscale={0.4} mopacity={0} />

      {/* The wrapper owns the scroll distance; the sticky child owns the
          frame. Without this wrapper any sibling after the sticky would
          stack straight after its 100dvh box rather than after the scroll. */}
      <div className={styles.stickyWrap}>
      <div className={styles.sticky}>
        {/* The bottle's own engraved label artwork, pushed in on. */}
        <img
          className={styles.label}
          src="/product/label-lake.webp"
          width={1100}
          height={620}
          alt=""
          aria-hidden="true"
        />

        {/* ...handed off at full resolution, same scene, same language... */}
        <picture>
          <source srcSet="/env/engraved-lake.avif" type="image/avif" />
          <img
            className={styles.etch}
            src="/env/engraved-lake.webp"
            width={1600}
            height={1000}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        </picture>

        {/* ...dissolving into the real place. */}
        <picture>
          <source srcSet="/env/palomar.avif" type="image/avif" />
          <img
            className={styles.place}
            src="/env/palomar.webp"
            width={1920}
            height={1200}
            alt={`${origin.place}, ${origin.region} — the forested granite mountain Buena Vida is sourced from`}
            loading="lazy"
          />
        </picture>

        <svg
          className={styles.topo}
          viewBox={`0 0 ${TOPO_VIEW.w} ${TOPO_VIEW.h}`}
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {CONTOURS.map((d, i) => (
            <path
              key={i}
              d={d}
              className={styles.contour}
              pathLength={1}
              style={{ strokeDasharray: 1, opacity: 0.18 + i * 0.045 }}
            />
          ))}
        </svg>

        <div className={styles.scrim} />

        <div className={`shell ${styles.content}`}>
          <Eyebrow>The origin</Eyebrow>
          <RevealText
            id="act-origin"
            as="h2"
            className={`display t-lg ${styles.title}`}
            lines={[origin.place, <em key="ca">{origin.region}</em>]}
          />
          <p className={`lede ${styles.body}`}>{origin.minerals}</p>
        </div>
      </div>
      </div>

      <div className={`shell ${styles.facts}`}>
        <div className={styles.fact} data-fact>
          <span className={styles.figure}>
            {tds.value}
            <small>{tds.unit}</small>
          </span>
          <span className={styles.factLabel}>{tds.label}</span>
          <p className={styles.factBody}>{tds.claim}</p>
        </div>

        <div className={styles.fact} data-fact>
          <span className={styles.figureSmall}>{award.title}</span>
          <span className={styles.factLabel}>Recognition</span>
          <p className={styles.factBody}>{award.body}</p>
        </div>
      </div>
    </section>
  );
}
