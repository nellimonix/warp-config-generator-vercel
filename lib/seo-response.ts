export const STATIC_SITE_ORIGIN = 'https://request-origin.invalid';

export function requestOrigin(headers: Pick<Headers, 'get'>): string {
  const host = (headers.get('x-forwarded-host') || headers.get('host') || '').split(',')[0].trim();
  const forwardedProto = headers.get('x-forwarded-proto')?.split(',')[0].trim();
  const protocol = forwardedProto === 'http' || forwardedProto === 'https'
    ? forwardedProto
    : /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host) ? 'http' : 'https';

  if (!/^(?:[a-z0-9.-]+|\[[a-f0-9:]+\])(?::\d+)?$/i.test(host)) {
    throw new TypeError('Invalid request host');
  }

  return new URL(`${protocol}://${host}`).origin;
}

export function seoResponse(request: Request, origin = new URL(request.url).origin): Response | null {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;

  const pathname = new URL(request.url).pathname;
  let body: string;
  let contentType: string;

  if (pathname === '/robots.txt') {
    body = `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`;
    contentType = 'text/plain; charset=utf-8';
  } else if (pathname === '/sitemap.xml') {
    body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`;
    contentType = 'application/xml; charset=utf-8';
  } else {
    return null;
  }

  return new Response(request.method === 'HEAD' ? null : body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=0, must-revalidate',
      Vary: 'Host, X-Forwarded-Host, X-Forwarded-Proto',
    },
  });
}

export function replaceStaticOrigin(response: Response, origin: string): Response {
  if (!response.body || !/^text\/(html|plain|x-component)\b/i.test(response.headers.get('content-type') || '')) {
    return response;
  }

  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let pending = '';
  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      pending += decoder.decode(chunk, { stream: true });
      const parts = pending.split(STATIC_SITE_ORIGIN);
      pending = parts.pop() || '';
      if (parts.length) controller.enqueue(encoder.encode(parts.join(origin) + origin));

      let completeLength = pending.length - STATIC_SITE_ORIGIN.length + 1;
      const lastCodeUnit = pending.charCodeAt(completeLength - 1);
      if (lastCodeUnit >= 0xd800 && lastCodeUnit <= 0xdbff) completeLength--;
      if (completeLength > 0) {
        controller.enqueue(encoder.encode(pending.slice(0, completeLength)));
        pending = pending.slice(completeLength);
      }
    },
    flush(controller) {
      controller.enqueue(encoder.encode((pending + decoder.decode()).replaceAll(STATIC_SITE_ORIGIN, origin)));
    },
  });
  const headers = new Headers(response.headers);
  headers.delete('Content-Length');
  headers.delete('ETag');
  headers.delete('Content-MD5');

  return new Response(response.body.pipeThrough(transform), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
