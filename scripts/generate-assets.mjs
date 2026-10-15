/**
 * Buena Vida - environment asset pipeline.
 *
 * Generates every atmospheric layer once, at setup, and writes optimised
 * files into public/env. The site itself NEVER calls Pollinations at
 * runtime: hotlinking a slow third-party generator would wreck LCP and
 * make the page depend on someone else's uptime.
 *
 *   node scripts/generate-assets.mjs            # only missing assets
 *   node scripts/generate-assets.mjs --force    # regenerate everything
 *
 * Watermark note: the anonymous Pollinations tier ignores `nologo=true`
 * and stamps the bottom-right corner. We over-request height and crop the
 * bottom strip off. Set POLLINATIONS_TOKEN to skip the crop.
 */
import { mkdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'public', 'env');
const PRODUCT_OUT = path.join(ROOT, 'public', 'product');
const SRC = path.resolve(ROOT, '..', 'assets_and_info');

const TOKEN = process.env.POLLINATIONS_TOKEN || '';
const FORCE = process.argv.includes('--force');
/** Bare args name individual assets to rebuild, e.g. `node ... spring stone`. */
const ONLY = new Set(process.argv.slice(2).filter((a) => !a.startsWith('--')));
/** Fraction of height sacrificed to remove the watermark strip. */
const WATERMARK_CROP = TOKEN ? 0 : 0.14;

const NEG = 'no text, no words, no letters, no watermark, no signature, no people, no logo';

/**
 * kind: 'photo'      -> cinematic backdrop, kept as-is
 *       'silhouette' -> black-on-white shape, converted to a transparent
 *                       tintable PNG so it can be a real parallax plane
 */
const ASSETS = [
  {
    name: 'sky-dawn', kind: 'photo', w: 1920, h: 1080, seed: 1041,
    prompt: `cinematic pre-dawn sky above a cold mountain horizon, deep indigo fading to pale steel blue, faint warm ember glow low on the horizon, high altitude haze, soft gradient, fine film grain, ultra wide, ${NEG}`,
  },
  /*
   * Note: the hero's ridge planes are NOT generated here. Diffusion models
   * reliably return photographic mountains rather than flat silhouettes, and
   * a luminance->alpha conversion of a photo leaves the sky partly opaque
   * (visible rectangular edges) and punches holes through snow. The ridges
   * are drawn procedurally instead - see lib/ridge.ts - which gives crisp,
   * tintable, resolution-independent planes for a couple of KB.
   */
  {
    name: 'mist', kind: 'silhouette', w: 1920, h: 700, seed: 5510, invert: true,
    prompt: `soft white fog bank drifting horizontally across a pure black background, wispy low cloud layer, soft feathered edges, volumetric haze, nothing else, wide panoramic, ${NEG}`,
  },
  {
    name: 'palomar', kind: 'photo', w: 1920, h: 1200, seed: 6621,
    prompt: `cinematic photograph of a forested granite mountain in southern California at first light, tall pines on steep slopes, cold blue shadows, low mist in the valley, muted natural colour, shot on film, ${NEG}`,
  },
  {
    name: 'spring', kind: 'photo', w: 1600, h: 1200, seed: 3471,
    prompt: `close up photograph of crystal clear cold mountain water flowing over smooth pale grey river stones, transparent water, pebbles visible beneath the surface, crisp ripples and bright highlights, bright natural daylight, cool neutral colours, sharp nature photography, ${NEG}`,
  },
  /*
   * Caustics are NOT generated here. Three separate prompts came back as a
   * radial vortex rather than a light web, and the filter-based version in
   * components/atmos/Caustics.tsx animates, tints and costs a few hundred
   * bytes instead of 170KB.
   */
  {
    name: 'engraved-lake', kind: 'photo', w: 1600, h: 1000, seed: 8014,
    prompt: `antique steel plate engraving of a still alpine lake with pine forest and mountain peaks behind, dense parallel line hatching and crosshatching, pure black ink lines on cream paper, nineteenth century book illustration, line art only, no shading blocks, ${NEG}`,
  },
];

const exists = (p) => access(p).then(() => true, () => false);

async function fetchWithRetry(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
        signal: AbortSignal.timeout(180_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 2048) throw new Error(`suspiciously small (${buf.length}b)`);
      return buf;
    } catch (err) {
      const wait = 4000 * (i + 1);
      console.warn(`    retry ${i + 1}/${tries} after ${err.message} - waiting ${wait / 1000}s`);
      if (i === tries - 1) throw err;
      await new Promise((r) => setTimeout(r, wait));
    }
  }
}

/** Crop the watermark strip, then resize to the real target height. */
async function stripWatermark(buf, targetW, targetH) {
  const { width, height } = await sharp(buf).metadata();
  const keep = Math.round(height * (1 - WATERMARK_CROP));
  return sharp(buf)
    .extract({ left: 0, top: 0, width, height: keep })
    .resize(targetW, targetH, { fit: 'cover', position: 'centre' })
    .toBuffer();
}

/**
 * Turn a black-on-white shape into a transparent PNG whose alpha follows
 * the shape. Gives us genuine parallax planes we can tint per depth layer
 * instead of stacking opaque rectangles.
 */
async function toAlphaLayer(buf, invert) {
  const grey = await sharp(buf).greyscale().normalise().toBuffer();
  // Opaque where the shape is: black shape -> negate; white shape -> as-is.
  const alpha = invert ? grey : await sharp(grey).negate().toBuffer();
  const { width, height } = await sharp(grey).metadata();

  return sharp({
    create: { width, height, channels: 3, background: { r: 255, g: 255, b: 255 } },
  })
    .joinChannel(alpha)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function emit(name, buf, kind) {
  const base = path.join(OUT, name);
  if (kind === 'silhouette') {
    // webp only. Alpha webp is universally supported, and the PNG twin was
    // twice the size with nothing referencing it.
    await sharp(buf).webp({ quality: 90, alphaQuality: 100 }).toFile(`${base}.webp`);
    return ['webp'];
  }
  await sharp(buf).avif({ quality: 52, effort: 6 }).toFile(`${base}.avif`);
  await sharp(buf).webp({ quality: 78 }).toFile(`${base}.webp`);
  return ['avif', 'webp'];
}

async function buildEnvironments() {
  await mkdir(OUT, { recursive: true });
  for (const a of ASSETS) {
    if (ONLY.size && !ONLY.has(a.name)) continue;
    const probe = path.join(OUT, `${a.name}.webp`);
    if (!FORCE && !ONLY.has(a.name) && (await exists(probe))) {
      console.log(`  ok ${a.name} (cached)`);
      continue;
    }
    // Over-request height so the watermark crop costs no composition.
    const reqH = Math.round(a.h / (1 - WATERMARK_CROP));
    const url =
      `https://image.pollinations.ai/prompt/${encodeURIComponent(a.prompt)}` +
      `?width=${a.w}&height=${reqH}&model=flux&seed=${a.seed}&nologo=true&private=true`;

    console.log(`  .. ${a.name} (${a.w}x${a.h}, seed ${a.seed})`);
    const raw = await fetchWithRetry(url);
    let out = await stripWatermark(raw, a.w, a.h);
    if (a.kind === 'silhouette') out = await toAlphaLayer(out, a.invert);
    const formats = await emit(a.name, out, a.kind);
    console.log(`     -> ${a.name}.{${formats.join(',')}}`);
  }
}

/**
 * The only cutout product asset is 282x772. That is ~140 CSS px at 2x DPR,
 * far too small to carry a cinematic hero, so we upscale with Lanczos and
 * let the design (haze, depth of field, grain, rim light) absorb the rest.
 */
async function buildProduct() {
  await mkdir(PRODUCT_OUT, { recursive: true });
  const src = path.join(SRC, 'Buena Vida Product Image-Photoroom.png');
  const raw = await readFile(src);
  const meta = await sharp(raw).metadata();
  console.log(`  source bottle: ${meta.width}x${meta.height} (${meta.channels}ch)`);

  const SCALE = 2.6;
  const w = Math.round(meta.width * SCALE);
  const h = Math.round(meta.height * SCALE);

  const up = await sharp(raw)
    .resize(w, h, { kernel: sharp.kernel.lanczos3, fit: 'fill' })
    // A touch of sharpening recovers edge definition Lanczos softens.
    .sharpen({ sigma: 0.8, m1: 0.5, m2: 0.7 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  // The intermediate PNG is deliberately NOT written into public/: it is
  // ~3MB, nothing references it, and `output: 'export'` ships all of public/.
  await sharp(up).webp({ quality: 94, alphaQuality: 100 }).toFile(path.join(PRODUCT_OUT, 'bottle@2x.webp'));
  await sharp(up).resize(Math.round(w / 2)).webp({ quality: 92, alphaQuality: 100 }).toFile(path.join(PRODUCT_OUT, 'bottle.webp'));
  console.log(`  -> bottle upscaled to ${w}x${h}`);

  // Tight crop of the label's engraved lake artwork - the Act 03 hand-off.
  // Inset horizontally so the bottle's own silver edges stay out of frame
  // when this fills the viewport.
  const inset = Math.round(meta.width * 0.11);
  await sharp(raw)
    .extract({
      left: inset,
      top: Math.round(meta.height * 0.73),
      width: meta.width - inset * 2,
      height: Math.round(meta.height * 0.16),
    })
    .resize((meta.width - inset * 2) * 5, null, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.7 })
    .webp({ quality: 93 })
    .toFile(path.join(PRODUCT_OUT, 'label-lake.webp'));

  // Logo for the nav / footer.
  await sharp(await readFile(path.join(SRC, 'buenavidalogo.jpg')))
    .resize(300, 300, { kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 92 })
    .toFile(path.join(PRODUCT_OUT, 'logo.webp'));
  console.log('  -> label-lake + logo');
}

console.log('\nBuena Vida asset pipeline\n');
console.log(`watermark crop: ${(WATERMARK_CROP * 100).toFixed(0)}%${TOKEN ? ' (token set)' : ' (anonymous tier)'}\n`);
console.log('product:');
await buildProduct();
console.log('\nenvironments:');
await buildEnvironments();
console.log('\ndone.\n');
