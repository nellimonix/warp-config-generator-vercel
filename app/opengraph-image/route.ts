import { SEO_ENABLED } from '@/config/seo';
import OpenGraphImage from '@/lib/opengraph-image';

export const dynamic = 'force-static';

export function GET() {
  if (!SEO_ENABLED) return new Response(null, { status: 404 });
  return OpenGraphImage();
}
