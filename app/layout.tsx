import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'WARP Generator',
  description: 'Генератор конфигураций Cloudflare WARP',
  keywords: 'WARP, Cloudflare, конфигуратор, генератор, VPN, WireGuard, AmneziaWG',
  openGraph: {
    title: 'WARP Generator',
    description: 'Генератор конфигураций Cloudflare WARP',
    type: 'website',
    locale: 'ru_RU',
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
