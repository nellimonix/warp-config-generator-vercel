import type { MetadataRoute } from 'next';
import { STATIC_SITE_ORIGIN } from '@/lib/seo-response';
import { SEO_ENABLED } from '@/config/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  if (!SEO_ENABLED) return [];

  return [{ url: `${STATIC_SITE_ORIGIN}/` }];
}
