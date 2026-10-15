import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter_Tight } from 'next/font/google';
import { brand, taglines, origin } from '@/content/product';
import SmoothScroll from '@/components/chrome/SmoothScroll';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['SOFT', 'WONK', 'opsz'],
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: `${brand.name} — ${brand.descriptor}`,
  description: `${taglines.label} Spring water from ${origin.place}, ${origin.region}. Naturally alkaline, electrolytes for taste.`,
  openGraph: {
    title: `${brand.name} — ${brand.descriptor}`,
    description: taglines.drop,
    siteName: brand.name,
    type: 'website',
  },
  icons: { icon: '/product/logo.webp' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#070c10',
  // Never disable zoom.
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${interTight.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
