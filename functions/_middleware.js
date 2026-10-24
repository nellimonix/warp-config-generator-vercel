import { replaceStaticOrigin, seoResponse } from '../lib/seo-response';

export async function onRequest(context) {
  const { request } = context;
  const seo = seoResponse(request);
  if (seo) return seo;
  return replaceStaticOrigin(await context.next(), new URL(request.url).origin);
}
