import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@/styles/globals.css';
import { SITE } from '@/config/site';
import AnalyticsLoader from '@/components/rybbit-analytics';
import { siteOrigin } from '@/lib/site-origin';

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL(await siteOrigin()),
    title: SITE.name,
    description: SITE.description,
    keywords: 'WARP, Cloudflare, конфигуратор, генератор, VPN, WireGuard, AmneziaWG',
    authors: [{ name: 'llimonix' }],
    applicationName: SITE.name,
    openGraph: {
      title: SITE.name,
      description: SITE.description,
      type: 'website',
      locale: SITE.locale,
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <AnalyticsLoader />
        <link rel="icon" href="/cloud.ico" type="image/x-icon" />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
