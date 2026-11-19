import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requestOrigin, seoResponse, withIndexingPolicy } from '@/lib/seo-response';
import { SEO_ENABLED } from '@/config/seo';

export function middleware(request: NextRequest) {
  return withIndexingPolicy(
    seoResponse(request, SEO_ENABLED ? requestOrigin(request.headers) : undefined) || NextResponse.next(),
  );
}

export const config = {
  matcher: '/:path*',
};
