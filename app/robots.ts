import type { MetadataRoute } from 'next';
import { STATIC_SITE_ORIGIN } from '@/lib/seo-response';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/',
    },
    sitemap: `${STATIC_SITE_ORIGIN}/sitemap.xml`,
  };
}
