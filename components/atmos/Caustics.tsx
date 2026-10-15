import styles from './Caustics.module.css';

/**
 * Water caustics, drawn rather than filmed.
 *
 * The turbulence is rendered ONCE and the two layers are then drifted and
 * counter-rotated against each other with plain transforms. Animating
 * feTurbulence's baseFrequency directly would re-run the filter every frame
 * and is far too expensive for a full-bleed layer; two slowly interfering
 * copies read as moving light for free.
 */
export default function Caustics({ className = '' }: { className?: string }) {
  return (
    <div className={`${styles.wrap} ${className}`} aria-hidden="true">
      <svg className={styles.svg}>
        <filter id="bv-caustics">
          <feTurbulence type="fractalNoise" baseFrequency="0.011 0.026" numOctaves="2" seed="7" />
          {/* Squeeze the noise into thin bright ridges - the light web. */}
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.62
                    0 0 0 0 0.84
                    0 0 0 0 0.96
                    1.6 0 0 0 -0.62"
          />
        </filter>
        <rect className={styles.a} width="100%" height="100%" filter="url(#bv-caustics)" />
        <rect className={styles.b} width="100%" height="100%" filter="url(#bv-caustics)" />
      </svg>
    </div>
  );
}
