import { HERO_RIDGES, VIEW } from '@/lib/ridge';
import styles from './Ridges.module.css';

/**
 * The layered mountain environment behind the hero.
 *
 * Sky and mist are generated photography; the ridge planes are drawn
 * procedurally (see lib/ridge.ts) so each depth tier is a crisp, solidly
 * tinted shape that the parallax can move independently. Presentational
 * only - Act01 owns the motion so the ridges, the headline and the bottle
 * can be choreographed against one another.
 */
export default function Ridges() {
  return (
    <div className={styles.env} aria-hidden="true">
      <picture>
        <source srcSet="/env/sky-dawn.avif" type="image/avif" />
        <img
          className={styles.sky}
          src="/env/sky-dawn.webp"
          width={1920}
          height={1080}
          alt=""
          data-depth="sky"
          fetchPriority="high"
        />
      </picture>

      <div className={styles.horizon} data-depth="glow" />

      <svg
        className={`${styles.plane} ${styles.far}`}
        data-depth="far"
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={HERO_RIDGES.far} />
      </svg>

      <svg
        className={`${styles.plane} ${styles.mid}`}
        data-depth="mid"
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={HERO_RIDGES.mid} />
      </svg>

      <svg
        className={`${styles.plane} ${styles.near}`}
        data-depth="near"
        viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d={HERO_RIDGES.near} />
        <path d={HERO_RIDGES.pines} className={styles.pines} />
      </svg>

      <img
        className={styles.mist}
        src="/env/mist.webp"
        width={1920}
        height={700}
        alt=""
        data-depth="mist"
        loading="lazy"
      />

      <div className={styles.vignette} />
    </div>
  );
}
