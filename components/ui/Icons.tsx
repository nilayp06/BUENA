/**
 * Line icons drawn to match the three symbols printed on the Buena Vida
 * marketing creative (mountain / droplet / leaf). One stroke weight, one
 * geometry language, no icon library and no emoji.
 */

const common = {
  viewBox: '0 0 40 40',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function MountainIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path d="M3 30 14 13l6.5 9.5L24.5 17 37 30Z" />
      <path d="M10.5 22.5 14 19.5l3 4" opacity="0.55" />
      <path d="M3 34.5h34" opacity="0.35" />
    </svg>
  );
}

export function DropIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path d="M20 4.5c5.5 7.4 10 12.3 10 17.2a10 10 0 0 1-20 0C10 16.8 14.5 11.9 20 4.5Z" />
      <path d="M15.5 22.8a4.6 4.6 0 0 0 4.3 4.5" opacity="0.55" />
    </svg>
  );
}

export function LeafIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path d="M32.5 7.5c2 12.5-4.5 22-15 22a9 9 0 0 1-9-9c0-9 9-12.5 24-13Z" />
      <path d="M8.5 33.5C13 25 20.5 18.5 28 14.5" opacity="0.55" />
    </svg>
  );
}

export const ICONS = {
  mountain: MountainIcon,
  drop: DropIcon,
  leaf: LeafIcon,
} as const;

export type IconName = keyof typeof ICONS;
