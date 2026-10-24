import type { MetadataRoute } from 'next';
import { SITE } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${SITE.url}/` }];
}
