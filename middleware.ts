import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { requestOrigin, seoResponse } from '@/lib/seo-response';

export function middleware(request: NextRequest) {
  return seoResponse(request, requestOrigin(request.headers)) || NextResponse.next();
}

export const config = {
  matcher: ['/robots.txt', '/sitemap.xml'],
};
