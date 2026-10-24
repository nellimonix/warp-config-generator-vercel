import type { Metadata } from 'next';
import { SERVICES } from '@/config/services-loader';
import { HomeClient } from '@/components/home-client';
import { HOME_SEO } from '@/config/seo';
import { LINKS, SITE } from '@/config/site';

const canonicalUrl = `${SITE.url}/`;

export const metadata: Metadata = {
  title: HOME_SEO.title,
  description: HOME_SEO.description,
  alternates: { canonical: canonicalUrl },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    url: canonicalUrl,
    siteName: SITE.name,
    type: 'website',
    locale: SITE.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_SEO.title,
    description: HOME_SEO.description,
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${canonicalUrl}#website`,
      url: canonicalUrl,
      name: SITE.name,
      description: HOME_SEO.description,
      inLanguage: 'ru',
      author: { '@type': 'Person', name: 'llimonix', url: LINKS.github },
    },
    {
      '@type': 'WebApplication',
      '@id': `${canonicalUrl}#application`,
      url: canonicalUrl,
      name: SITE.name,
      description: HOME_SEO.description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      isAccessibleForFree: true,
      inLanguage: 'ru',
      isPartOf: { '@id': `${canonicalUrl}#website` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <HomeClient services={SERVICES} />
    </>
  );
}
