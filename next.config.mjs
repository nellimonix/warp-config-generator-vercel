import { fileURLToPath } from 'node:url';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  outputFileTracingExcludes: {
    '/api/captcha/challenge': ['.next/server/app/api/captcha/challenge/route_client-reference-manifest.js'],
    '/api/generate': ['.next/server/app/api/generate/route_client-reference-manifest.js'],
  },
};

const isCloudflare = process.env.CLOUDFLARE_WORKERS || process.env.CF_PAGES;
const isDocker = process.env.DOCKER_BUILD === '1';
const isApiOnly = process.env.DOCKER_API_BUILD === '1';
const isStatic = process.env.STATIC_EXPORT === '1';
const siteExtensions = ['tsx', 'ts', 'jsx', 'js'];

if (isStatic) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl || !URL.canParse(baseUrl)) {
    throw new Error('STATIC_EXPORT requires an absolute NEXT_PUBLIC_API_BASE_URL');
  }
  const url = new URL(baseUrl);
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL must be an HTTP(S) URL without credentials, query or fragment');
  }
}

if (isApiOnly) {
  nextConfig.pageExtensions = ['api.ts'];
  nextConfig.output = 'standalone';
  nextConfig.outputFileTracingRoot = fileURLToPath(new URL('.', import.meta.url));
} else if (isStatic || isCloudflare) {
  nextConfig.pageExtensions = siteExtensions;
  nextConfig.output = 'export';
  if (isCloudflare) nextConfig.distDir = 'out';
  nextConfig.trailingSlash = true;
} else {
  nextConfig.pageExtensions = ['api.ts', 'server.ts', ...siteExtensions];
  if (isDocker) nextConfig.output = 'standalone';
}

export default nextConfig;
