# Buena Vida — Spring Water

A single-page, scroll-driven brand film for one product.

## Running it

```
npm install
npm run dev        # http://localhost:3210
npm run build      # static export to ./out
```

## How it is put together

**Nine acts.** `app/page.tsx` composes `components/acts/Act01…Act09` and does
nothing else. Each act owns its own scene: its markup, its CSS module, and the
GSAP timeline that drives it.

**One product, many moments.** There is exactly one bottle element on the page
(`components/product/BottleStage.tsx`), fixed to the viewport and never
re-mounted. Acts do not animate it. Each act drops a `<BottlePose>` marker
declaring where the bottle should be while that act is on screen, and the
stage builds a single scrubbed timeline across all of them. One timeline, not
one tween per pose — a timeline's state is a pure function of its progress, so
the bottle is correct from any scroll position, including deep links and
mid-page reloads.

**One colour system.** Every surface reads `--bg` / `--fg` / `--muted` /
`--accent` / `--rule`. `components/atmos/ThemeMorph.tsx` scrubs those tokens on
`:root` as a section passes, so the whole page changes temperature at once
instead of each section ending and the next beginning.

**One motion vocabulary.** `lib/motion.ts` holds the easings, durations,
staggers and matchMedia queries. Every act registers its animations inside a
`gsap.matchMedia()` with three branches: desktop, mobile and reduced.

## Content

`content/product.ts` is the single source of truth and every factual claim on
the site comes from it — all transcribed from the supplied label, product sheet
and marketing creative. Nothing is invented. Facts the assets do not state
(price, stockists) live in `UNVERIFIED` and render as visible placeholders in
Act 07 rather than plausible-looking guesses.

## Assets

`npm run assets` regenerates the environment art via the Pollinations API,
then crops, resizes and re-encodes it into `public/env`. Output is committed;
the site never calls Pollinations at runtime.

- `node scripts/generate-assets.mjs` — only what is missing
- `node scripts/generate-assets.mjs --force` — everything
- `node scripts/generate-assets.mjs palomar spring` — named assets only

Two things are deliberately *not* generated, because drawing them beat
prompting them: the hero's mountain ridge planes (`lib/ridge.ts`) and the
water caustics (`components/atmos/Caustics.tsx`).

The anonymous Pollinations tier ignores `nologo=true`, so the script
over-requests height and crops the watermark strip off the bottom. Set
`POLLINATIONS_TOKEN` to skip that crop.

**Product image.** The only supplied cutout is 282×772, which is about 140 CSS
px at 2× DPR — too small to carry a cinematic hero. The script upscales it
2.6× with Lanczos plus light sharpening, and the design leans on haze, depth of
field, grain and rim light to absorb the rest. A higher-resolution cutout would
drop straight in: replace the source and re-run `npm run assets`.
