import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SITE } from '@/config/site';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: SITE.name,
  description: SITE.description,
  keywords: 'WARP, Cloudflare, конфигуратор, генератор, VPN, WireGuard, AmneziaWG',
  authors: [{ name: 'llimonix' }],
  openGraph: {
    title: SITE.name,
    description: SITE.description,
    type: 'website',
    locale: SITE.locale,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="icon" href="/cloud.ico" type="image/x-icon" />
      </head>
      <body className="font-sans">
        {children}
      </body>
    </html>
  );
}
