/**
 * Procedural topographic contour lines.
 *
 * Used as the connective tissue of the Origin act - the contours draw on
 * as the landscape settles, then converge into the connector lines of the
 * mineral diagram in the next act. Deterministic for stable hydration.
 */

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const TOPO_VIEW = { w: 1000, h: 640 } as const;

/**
 * Nested irregular closed rings, each a little wider than the last, as a
 * survey map draws elevation. Every ring shares the same noise field so
 * they stay concentric instead of crossing.
 */
export function contourPaths(seed = 4242, rings = 9): string[] {
  const rand = rng(seed);
  const { w, h } = TOPO_VIEW;
  const cx = w * 0.5;
  const cy = h * 0.52;
  const steps = 96;

  // One shared noise field so rings never intersect.
  const field = Array.from({ length: 13 }, () => rand() * 2 - 1);
  const noiseAt = (angle: number) => {
    let v = 0;
    for (let k = 0; k < field.length; k++) {
      v += field[k] * Math.sin(angle * (k + 1) + field[k] * 3.1) / (k + 1.6);
    }
    return v;
  };

  const paths: string[] = [];
  for (let r = 0; r < rings; r++) {
    const t = (r + 1) / rings;
    const rx = w * 0.07 + t * w * 0.46;
    const ry = h * 0.05 + t * h * 0.42;
    // Outer rings wobble more, as real contours do on shallow ground.
    const wobble = 0.06 + t * 0.14;

    let d = '';
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const n = 1 + noiseAt(a) * wobble;
      const x = cx + Math.cos(a) * rx * n;
      const y = cy + Math.sin(a) * ry * n;
      d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }
    paths.push(`${d}Z`);
  }
  return paths;
}
