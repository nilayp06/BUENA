import styles from './Grain.module.css';

/**
 * Global film grain. One static SVG feTurbulence rendered once and held on
 * its own composited layer - deliberately NOT a per-frame canvas, which
 * would burn main-thread time on every scroll frame for a static texture.
 */
export default function Grain() {
  return (
    <div className={styles.grain} aria-hidden="true">
      <svg className={styles.svg} xmlns="http://www.w3.org/2000/svg">
        <filter id="bv-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.82"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#bv-grain)" />
      </svg>
    </div>
  );
}
