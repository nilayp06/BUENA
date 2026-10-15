/**
 * SINGLE SOURCE OF TRUTH for every factual claim on this site.
 *
 * Every value below is transcribed from the supplied Buena Vida assets
 * (bottle label, product information sheet, marketing creative, logo).
 * NOTHING here may be invented. If a fact is not printed on the assets it
 * belongs in `UNVERIFIED` below and must render as a visible placeholder.
 */

export const brand = {
  name: 'Buena Vida',
  wordmark: ['BUENA', 'VIDA'] as const,
  descriptor: 'Spring Water',
  site: 'buenavidawater.com',
  siteUrl: 'https://buenavidawater.com',
  instagram: '@buenavidawater',
  instagramUrl: 'https://instagram.com/buenavidawater',
  facebookUrl: 'https://facebook.com/buenavidawater',
} as const;

/** Lines printed verbatim on the packaging / creative. */
export const taglines = {
  label: 'Pure. Refreshing. Natural.',
  seal: "Nature's Purity. Perfected.",
  drop: 'The good life in every drop.',
  liveWell: 'Live well. Look good. Buena Vida.',
  byNature: 'Pure by nature. Better by choice.',
  perfected: 'Pure by nature. Perfected for you.',
  hydrate: 'Stay hydrated. Live the good life.',
  crisp: 'Pure, crisp, refreshing.',
} as const;

export const origin = {
  place: 'Palomar Mountain',
  region: 'California',
  statement: 'Premium, locally sourced from Palomar Mountain, California.',
  /** Verbatim from the product sheet. */
  minerals:
    'A superbly balanced natural mineral content, with naturally occurring salts and metals absorbed as it flows through underground rock.',
} as const;

export const award = {
  title: 'Gold Medal Winner',
  body: 'Berkeley Springs International Water Tasting Awards',
} as const;

/** Total Dissolved Solids — the differentiator the product sheet leads with. */
export const tds = {
  value: 100,
  unit: 'PPM',
  label: 'Total Dissolved Solids',
  claim:
    'Notably low TDS of around 100 PPM — a part of what sets it apart from mineral waters with far higher levels, and what gives it its crisp, refreshing taste.',
} as const;

/** Nutrition panel, per 500 mL bottle. Serving size 1 bottle, 1 serving per container. */
export const nutrition = [
  { name: 'Calories', amount: '0', dv: null },
  { name: 'Total Fat', amount: '0g', dv: '0%' },
  { name: 'Sodium', amount: '0mg', dv: '0%' },
  { name: 'Total Carbohydrate', amount: '0g', dv: '0%' },
  { name: 'Protein', amount: '0g', dv: null },
  { name: 'Calcium', amount: '10mg', dv: '0%' },
  { name: 'Magnesium', amount: '5mg', dv: '2%' },
  { name: 'Potassium', amount: '1mg', dv: '0%' },
] as const;

/** The four naturally occurring minerals named on the product sheet. */
export const mineralProfile = [
  { symbol: 'Ca', name: 'Calcium', amount: '10', unit: 'mg' },
  { symbol: 'Mg', name: 'Magnesium', amount: '5', unit: 'mg' },
  { symbol: 'K', name: 'Potassium', amount: '1', unit: 'mg' },
  { symbol: 'Na', name: 'Sodium', amount: '0', unit: 'mg' },
] as const;

export const dietary = ['Non-carbonated', 'Kosher', 'Gluten-free'] as const;

export const spec = {
  volume: '500 mL',
  volumeImperial: '16.9 FL OZ (1.05 PT)',
  ingredients: 'Natural spring water',
  container: 'Aluminium bottle',
  servings: '1 serving per container',
  /** Material fact about aluminium, not a brand certification claim. */
  recycling: 'Aluminium is infinitely recyclable. Please recycle.',
} as const;

/** The three pillars printed on the marketing creative. */
export const pillars = [
  {
    index: '01',
    title: 'Natural Spring Water',
    body: 'Drawn from Palomar Mountain in California, carrying the minerals it gathers on the way up.',
    icon: 'mountain',
  },
  {
    index: '02',
    title: 'Clean. Refreshing. Pure.',
    body: 'Around 100 PPM of dissolved solids. Low enough to taste like almost nothing at all.',
    icon: 'drop',
  },
  {
    index: '03',
    title: 'Premium Quality',
    body: 'A Gold Medal at the Berkeley Springs International Water Tasting Awards.',
    icon: 'leaf',
  },
] as const;

export const naturallyAlkaline = {
  title: 'Naturally Alkaline',
  sub: 'Electrolytes for taste',
} as const;

/**
 * NOT PRINTED ON ANY SUPPLIED ASSET.
 * These render as visible placeholders until the client supplies real values.
 * Do not replace with guesses.
 */
export const UNVERIFIED = {
  price: null as string | null,
  retailers: [] as string[],
  phLevel: null as string | null,
} as const;
