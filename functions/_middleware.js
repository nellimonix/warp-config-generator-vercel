import { replaceStaticOrigin, seoResponse, withIndexingPolicy } from '../lib/seo-response';
import { SEO_ENABLED } from '../config/seo';

export async function onRequest(context) {
  const { request } = context;
  const seo = seoResponse(request);
  if (seo) return seo;
  const response = await context.next();
  return withIndexingPolicy(SEO_ENABLED ? replaceStaticOrigin(response, new URL(request.url).origin) : response);
}
