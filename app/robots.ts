import type { MetadataRoute } from 'next';
import { STATIC_SITE_ORIGIN } from '@/lib/seo-response';
import { SEO_ENABLED } from '@/config/seo';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  if (!SEO_ENABLED) return { rules: { userAgent: '*', allow: '/' } };

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${STATIC_SITE_ORIGIN}/sitemap.xml`,
  };
}
