/**
 * Procedural mountain ridge generator.
 *
 * The hero's depth planes are drawn rather than generated as images.
 * Diffusion models return photographic mountains, not flat silhouettes, and
 * converting a photo's luminance to alpha leaves the sky partly opaque and
 * punches holes through snow. Drawn paths are crisp at any viewport, tint
 * from a single `fill`, weigh ~1KB, and let us place the horizon exactly.
 *
 * Deterministic: the same seed always yields the same ridge, so the layout
 * never shifts between server render and hydration.
 */

/** mulberry32 - small, fast, seedable. */
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

export const VIEW = { w: 1000, h: 320 } as const;

export type RidgeOptions = {
  seed: number;
  /** Number of crest control points. Fewer = broader, calmer forms. */
  points?: number;
  /** Peak height as a fraction of the viewBox height. */
  amplitude?: number;
  /** 0 = smooth rolling hills, 1 = sharp alpine peaks. */
  jaggedness?: number;
  /** Where the lowest point of the crest sits, 0 (top) to 1 (bottom). */
  baseline?: number;
};

/**
 * Builds the crest as fractal sums of seeded octaves, then closes the path
 * down the sides and along the bottom so it fills as a solid plane.
 */
export function ridgePath({
  seed,
  points = 14,
  amplitude = 0.62,
  jaggedness = 0.5,
  baseline = 0.86,
}: RidgeOptions): string {
  const rand = rng(seed);
  const { w, h } = VIEW;
  const base = h * baseline;

  // Three octaves of seeded noise: broad form, mid detail, fine jitter.
  const octaves = [
    { n: 3, amp: 1 },
    { n: 7, amp: 0.42 },
    { n: 17, amp: 0.16 },
  ].map((o) => ({ ...o, phase: Array.from({ length: o.n + 1 }, () => rand()) }));

  const sample = (t: number) => {
    let v = 0;
    for (const o of octaves) {
      const x = t * o.n;
      const i = Math.floor(x);
      const f = x - i;
      const a = o.phase[Math.min(i, o.n)];
      const b = o.phase[Math.min(i + 1, o.n)];
      // Smoothstep between control points keeps octaves continuous.
      const s = f * f * (3 - 2 * f);
      v += (a + (b - a) * s) * o.amp;
    }
    v /= 1.58; // normalise back to roughly 0..1
    // Raising to a power sharpens summits without lifting the valleys,
    // which is what separates an alpine range from rolling hills.
    return Math.pow(v, 1 + jaggedness * 1.6);
  };

  const crest: string[] = [];
  for (let i = 0; i <= points; i++) {
    const t = i / points;
    const x = t * w;
    const y = base - sample(t) * h * amplitude;
    crest.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  // Sharp ranges use straight segments; soft ones get smoothed corners.
  const body =
    jaggedness > 0.45
      ? crest.map((p, i) => (i === 0 ? `M${p}` : `L${p}`)).join('')
      : smooth(crest);

  return `${body}L${w},${h}L0,${h}Z`;
}

/** Quadratic through midpoints - rounded crests with no cusps. */
function smooth(pts: string[]): string {
  const xy = pts.map((p) => p.split(',').map(Number) as [number, number]);
  let d = `M${xy[0][0]},${xy[0][1]}`;
  for (let i = 1; i < xy.length; i++) {
    const [px, py] = xy[i - 1];
    const [cx, cy] = xy[i];
    d += `Q${px.toFixed(1)},${py.toFixed(1)} ${((px + cx) / 2).toFixed(1)},${((py + cy) / 2).toFixed(1)}`;
  }
  const last = xy[xy.length - 1];
  return `${d}L${last[0]},${last[1]}`;
}

/**
 * Pine tops along a crest - the Palomar detail that makes the nearest
 * plane read as forest rather than bare rock.
 */
export function pinePath(seed: number, count = 34): string {
  const rand = rng(seed);
  const { w, h } = VIEW;
  const base = h * 0.82;
  let d = '';

  for (let i = 0; i < count; i++) {
    const x = (i / count) * w + (rand() - 0.5) * 16;
    const tall = 14 + rand() * 30;
    const wide = 3.6 + rand() * 3.4;
    const y = base - rand() * 12;
    // A simple triangular conifer with a slight lean for variety.
    const lean = (rand() - 0.5) * 3;
    d += `M${(x - wide).toFixed(1)},${y.toFixed(1)}L${(x + lean).toFixed(1)},${(y - tall).toFixed(1)}L${(x + wide).toFixed(1)},${y.toFixed(1)}Z`;
  }
  return `${d}M0,${base}L${w},${base}L${w},${h}L0,${h}Z`;
}

/** The three hero planes, far to near. Fixed seeds keep them stable. */
export const HERO_RIDGES = {
  far: ridgePath({ seed: 20_607, points: 9, amplitude: 0.42, jaggedness: 0.18, baseline: 0.95 }),
  mid: ridgePath({ seed: 71_419, points: 15, amplitude: 0.74, jaggedness: 0.72, baseline: 0.99 }),
  near: ridgePath({ seed: 33_285, points: 11, amplitude: 0.5, jaggedness: 0.55, baseline: 1.02 }),
  pines: pinePath(90_118, 40),
} as const;
