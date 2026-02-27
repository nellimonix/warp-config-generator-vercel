/**
 * Cloudflare Worker entry point
 * Routes API requests to the WARP handler, serves static assets for everything else
 */

import { onRequestPost, onRequestOptions } from '../functions/api/warp.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle API routes
    if (url.pathname === '/api/warp' || url.pathname === '/api/warp/') {
      if (request.method === 'OPTIONS') {
        return onRequestOptions();
      }

      if (request.method === 'POST') {
        // Create a context object similar to Pages Functions context
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

    // For all other requests, serve static assets via the ASSETS binding
    return env.ASSETS.fetch(request);
  },
};