type ApiHandler = (request: Request, headers: Headers) => Response | Promise<Response>;

const allowedOrigins = new Set(process.env.API_ALLOWED_ORIGINS?.split(',').map(origin => origin.trim()).filter(Boolean));

export function withApiHeaders(handler: ApiHandler) {
  return async (request: Request): Promise<Response> => {
    const headers = new Headers({
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
    });

    const origin = request.headers.get('origin');
    if (!allowedOrigins.size || allowedOrigins.has('*')) {
      headers.set('Access-Control-Allow-Origin', '*');
    } else {
      headers.set('Vary', 'Origin');
      if (origin) {
        if (!allowedOrigins.has(origin)) return new Response(null, { status: 403, headers });
        headers.set('Access-Control-Allow-Origin', origin);
      }
    }

    return handler(request, headers);
  };
}

export const apiOptions = withApiHeaders((_request, headers) => new Response(null, { headers }));
