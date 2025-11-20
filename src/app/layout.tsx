import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/lib/providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'MarketViz - Real-Time Market Intelligence',
    template: '%s | MarketViz',
  },
  description:
    'Professional-grade market visualization and analysis platform with real-time data, advanced charting, and personalized watchlists.',
  keywords: [
    'stock market',
    'trading',
    'market data',
    'financial analysis',
    'stock charts',
    'watchlist',
    'market news',
  ],
  authors: [{ name: 'MarketViz Team' }],
  creator: 'MarketViz',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'MarketViz',
    title: 'MarketViz - Real-Time Market Intelligence',
    description: 'Professional-grade market visualization and analysis platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MarketViz',
    description: 'Professional-grade market visualization and analysis platform',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
