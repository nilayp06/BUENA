'use client';

import { gsap } from '@/lib/gsap';
import { useScrollScene } from '@/lib/useScrollScene';
import { EASE, SCRUB, MM } from '@/lib/motion';
import { mineralProfile, naturallyAlkaline, spec, origin } from '@/content/product';
import ThemeMorph, { LIGHT } from '@/components/atmos/ThemeMorph';
import Eyebrow from '@/components/ui/Eyebrow';
import { BottlePose } from '@/components/product/BottleStage';
import styles from './Act04Product.module.css';

/**
 * ACT 04 - THE PRODUCT
 *
 * The centrepiece. The bottle holds the middle of the frame while its real
 * mineral profile assembles around it on drawn connector lines - the Aava
 * mineral-diagram idea rebuilt as thin engraved rules rather than rounded
 * cards, using the actual figures from the product sheet.
 *
 * On mobile the radial diagram becomes a vertical reveal: same data, a
 * composition that belongs to the screen it is on.
 */

/**
 * Node geometry, expressed once as percentages of the diagram box and used
 * for BOTH the label placement and the connector lines. Keeping a single
 * source avoids the two coordinate spaces drifting apart.
 *
 * `hub` is where the line meets the bottle silhouette; `elbow` is the bend
 * that lets the line run horizontally into the label.
 */
const NODES = [
  { x: 14, y: 26, hubX: 43, hubY: 33, side: 'left' as const },
  { x: 86, y: 34, hubX: 57, hubY: 40, side: 'right' as const },
  { x: 13, y: 68, hubX: 43, hubY: 66, side: 'left' as const },
  { x: 87, y: 74, hubX: 57, hubY: 72, side: 'right' as const },
];

/** The connector runs from the bottle, bends, then meets the label. */
const wireFor = (n: (typeof NODES)[number]) => {
  const pad = n.side === 'left' ? 1.5 : -1.5;
  return `M${n.hubX * 10},${n.hubY * 10} L${(n.x + (n.side === 'left' ? 8 : -8)) * 10},${n.hubY * 10} L${(n.x + pad) * 10},${n.y * 10}`;
};

export default function Act04Product() {
  const ref = useScrollScene<HTMLElement>(({ root, mm }) => {
    const q = gsap.utils.selector(root);

    const desktop = () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: SCRUB,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        q(`.${styles.wire}`),
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, ease: EASE.scrub, duration: 0.28, stagger: 0.07 },
        0.08,
      )
        .fromTo(
          q(`.${styles.node}`),
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, ease: EASE.scrub, duration: 0.2, stagger: 0.07 },
          0.16,
        )
        .fromTo(
          q(`.${styles.claim}`),
          { autoAlpha: 0, y: 30 },
          { autoAlpha: 1, y: 0, ease: EASE.scrub, duration: 0.2 },
          0.6,
        );
    };

    const mobile = () => {
      gsap.fromTo(
        q(`.${styles.node}`),
        { autoAlpha: 0, x: -20 },
        {
          autoAlpha: 1,
          x: 0,
          ease: EASE.out,
          duration: 0.7,
          stagger: 0.1,
          scrollTrigger: { trigger: q(`.${styles.diagram}`)[0], start: 'top 75%', once: true },
        },
      );
      gsap.fromTo(
        q(`.${styles.claim}`),
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1, y: 0, ease: EASE.out, duration: 0.7,
          scrollTrigger: { trigger: q(`.${styles.claim}`)[0], start: 'top 85%', once: true },
        },
      );
    };

    mm.add(MM.desktop, desktop);
    mm.add(MM.mobile, mobile);
    mm.add(MM.reduced, () => {
      gsap.set([q(`.${styles.node}`), q(`.${styles.claim}`)], { autoAlpha: 1, x: 0, y: 0 });
      gsap.set(q(`.${styles.wire}`), { strokeDashoffset: 0 });
    });
  });

  return (
    <section ref={ref} id="product" className={`act ${styles.act}`} aria-labelledby="act-product">
      <ThemeMorph to={LIGHT} start="top 70%" end="top 20%" />
      {/* Pinned dead centre: the frame the whole page has been building to.
          Sized to clear the heading above it and the claim below. */}
      <BottlePose id="product" y={2} scale={0.72} rotate={0} mscale={0.62} my={-12} />

      <div className={styles.sticky}>
        <div className={`shell ${styles.head}`}>
          <Eyebrow>The product</Eyebrow>
          <h2 id="act-product" className={`display t-md ${styles.title}`}>
            {naturallyAlkaline.title}
          </h2>
          <p className={styles.sub}>{naturallyAlkaline.sub}</p>
        </div>

        <div className={styles.diagram}>
          {/* Connector lines. Hidden from mobile, where the layout is a list. */}
          <svg
            className={styles.wires}
            viewBox="0 0 1000 1000"
            /* `none` so the viewBox maps 1:1 onto the box the labels are
               positioned in - with `meet` the two spaces diverge. */
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {NODES.map((n, i) => (
              <path
                key={i}
                className={styles.wire}
                pathLength={1}
                style={{ strokeDasharray: 1 }}
                d={wireFor(n)}
              />
            ))}
          </svg>

          <ul className={styles.nodes}>
            {mineralProfile.map((m, i) => (
              <li
                key={m.symbol}
                className={styles.node}
                data-side={NODES[i].side}
                style={{
                  left: `${NODES[i].x}%`,
                  top: `${NODES[i].y}%`,
                  transform: NODES[i].side === 'right' ? 'translate(-100%, -50%)' : 'translateY(-50%)',
                }}
              >
                <span className={styles.symbol} aria-hidden="true">
                  {m.symbol}
                </span>
                <span className={styles.amount}>
                  {m.amount}
                  <small>{m.unit}</small>
                </span>
                <span className={styles.mineral}>{m.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`shell ${styles.claim}`}>
          <p className={styles.claimText}>
            Four minerals, gathered on the way up through {origin.place} granite.
            Nothing added.
          </p>
          <p className={styles.claimMeta}>
            <span>{spec.ingredients}</span>
            <span aria-hidden="true">·</span>
            <span>{spec.volume}</span>
            <span aria-hidden="true">·</span>
            <span>Per bottle</span>
          </p>
        </div>
      </div>
    </section>
  );
}
