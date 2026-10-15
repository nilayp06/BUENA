'use client';

import { gsap } from '@/lib/gsap';
import { useScrollScene } from '@/lib/useScrollScene';
import { EASE, DUR, STAGGER, MM } from '@/lib/motion';
import { nutrition, dietary, spec, tds, UNVERIFIED } from '@/content/product';
import ThemeMorph, { LIGHT } from '@/components/atmos/ThemeMorph';
import RevealText from '@/components/ui/RevealText';
import Eyebrow from '@/components/ui/Eyebrow';
import { BottlePose } from '@/components/product/BottleStage';
import styles from './Act07Details.module.css';

/**
 * ACT 07 - PRODUCT DETAILS
 *
 * The practical section. Everything here is transcribed from the label and
 * product sheet. Anything the assets do not state - price, stockists -
 * renders as a visible placeholder rather than a plausible invention.
 */
export default function Act07Details() {
  const ref = useScrollScene<HTMLElement>(({ root, mm }) => {
    const q = gsap.utils.selector(root);

    const reveal = () => {
      gsap.fromTo(
        q('[data-detail]'),
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: DUR.base,
          ease: EASE.out,
          stagger: STAGGER.tight,
          scrollTrigger: { trigger: q(`.${styles.grid}`)[0], start: 'top 82%', once: true },
        },
      );
    };

    mm.add(MM.desktop, reveal);
    mm.add(MM.mobile, reveal);
    mm.add(MM.reduced, () => gsap.set(q('[data-detail]'), { autoAlpha: 1, y: 0 }));
  });

  return (
    <section ref={ref} id="details" className={`act ${styles.act}`} aria-labelledby="act-details">
      <ThemeMorph to={LIGHT} start="top 70%" end="top 25%" />
      {/* Parked in the margin the grid leaves free - present, not in the way. */}
      <BottlePose id="details" x={38} y={2} scale={0.56} rotate={-6} mopacity={0} mscale={0.4} />

      <div className={`shell ${styles.head}`}>
        <Eyebrow>The details</Eyebrow>
        <RevealText
          id="act-details"
          as="h2"
          className={`display t-lg ${styles.title}`}
          lines={['Everything else', <em key="e">on one page.</em>]}
        />
      </div>

      <div className={`shell ${styles.grid}`}>
        {/* ---- nutrition ---- */}
        <div className={styles.block} data-detail>
          <h3 className={styles.blockTitle}>Nutrition</h3>
          <p className={styles.blockNote}>
            Serving size 1 bottle ({spec.volume}) · {spec.servings}
          </p>
          <table className={styles.table}>
            <caption className="sr-only">
              Nutrition facts per {spec.volume} bottle of Buena Vida Spring Water
            </caption>
            <thead>
              <tr>
                <th scope="col">Nutrient</th>
                <th scope="col">Amount</th>
                <th scope="col">% Daily Value</th>
              </tr>
            </thead>
            <tbody>
              {nutrition.map((n) => (
                <tr key={n.name}>
                  <th scope="row">{n.name}</th>
                  <td>{n.amount}</td>
                  <td>{n.dv ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.fineprint}>
            Percent Daily Values are based on a 2,000 calorie diet.
          </p>
        </div>

        {/* ---- specification ---- */}
        <div className={styles.block} data-detail>
          <h3 className={styles.blockTitle}>Specification</h3>
          <dl className={styles.specList}>
            <div className={styles.specRow}>
              <dt>Volume</dt>
              <dd>
                {spec.volume} · {spec.volumeImperial}
              </dd>
            </div>
            <div className={styles.specRow}>
              <dt>Ingredients</dt>
              <dd>{spec.ingredients}</dd>
            </div>
            <div className={styles.specRow}>
              <dt>{tds.label}</dt>
              <dd>
                ~{tds.value} {tds.unit}
              </dd>
            </div>
            <div className={styles.specRow}>
              <dt>Container</dt>
              <dd>{spec.container}</dd>
            </div>
            <div className={styles.specRow}>
              <dt>Dietary</dt>
              <dd>{dietary.join(' · ')}</dd>
            </div>
          </dl>

          <p className={styles.recycle}>{spec.recycling}</p>
        </div>

        {/* ---- availability ---- */}
        <div className={styles.block} data-detail>
          <h3 className={styles.blockTitle}>Availability</h3>

          <div className={styles.specRow}>
            <dt className={styles.pendingLabel}>Price</dt>
            <dd className={styles.pending}>
              {UNVERIFIED.price ?? (
                <span className={styles.todo}>
                  To be supplied
                  <small>Not printed on any provided asset</small>
                </span>
              )}
            </dd>
          </div>

          <div className={styles.specRow}>
            <dt className={styles.pendingLabel}>Stockists</dt>
            <dd className={styles.pending}>
              {UNVERIFIED.retailers.length > 0 ? (
                UNVERIFIED.retailers.join(' · ')
              ) : (
                <span className={styles.todo}>
                  To be supplied
                  <small>Not printed on any provided asset</small>
                </span>
              )}
            </dd>
          </div>

          <p className={styles.blockNote}>
            These fields are intentionally blank. Send the real figures and they
            drop straight into <code>content/product.ts</code>.
          </p>
        </div>
      </div>
    </section>
  );
}
