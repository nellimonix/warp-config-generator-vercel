/**
 * Cloudflare Worker entry point
 * Routes API requests to the WARP handler, serves static assets for everything else
 */

// NOTE: wrangler resolves paths relative to the worker file location (worker/)
// so we need to go up one level to reach functions/
import { onRequestPost, onRequestOptions } from '../functions/api/warp_captcha.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle API routes
    if (url.pathname === '/api/warp_captcha' || url.pathname === '/api/warp/') {
      if (request.method === 'OPTIONS') {
        return onRequestOptions();
      }

      if (request.method === 'POST') {
        const context = {
          request,
          env,
          ctx,
          params: {},
        };
        return onRequestPost(context);
      }

      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // For all other requests, serve static assets
    return env.ASSETS.fetch(request);
  },
};