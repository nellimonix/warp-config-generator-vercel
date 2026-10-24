import type { MetadataRoute } from 'next';
import { STATIC_SITE_ORIGIN } from '@/lib/seo-response';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${STATIC_SITE_ORIGIN}/` }];
}
