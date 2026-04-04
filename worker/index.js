/**
 * Cloudflare Worker entry point.
 * Handles API requests, serves static assets for everything else.
 */

import { onRequestPost, onRequestOptions, onRequestGet } from './api-handler.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // API routes
    if (url.pathname === '/api/generate' || url.pathname === '/api/generate/') {
      if (request.method === 'OPTIONS') return onRequestOptions();
      if (request.method === 'POST') return onRequestPost({ request, env, ctx });
      if (request.method === 'GET') return onRequestGet();

      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Static assets
    return env.ASSETS.fetch(request);
  },
};
