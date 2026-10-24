import 'server-only';
import { headers } from 'next/headers';
import { requestOrigin, STATIC_SITE_ORIGIN } from './seo-response';

export async function siteOrigin(): Promise<string> {
  if (process.env.CLOUDFLARE_WORKERS || process.env.CF_PAGES) return STATIC_SITE_ORIGIN;
  return requestOrigin(await headers());
}
