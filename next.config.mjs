let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

// Cloudflare Workers: static export is triggered by CF_PAGES env or CLOUDFLARE_WORKERS env
const isCloudflare = process.env.CF_PAGES || process.env.CF_PAGES_BRANCH || process.env.CLOUDFLARE_WORKERS
const isNetlify = process.env.NETLIFY || false

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

if (isCloudflare) {
  nextConfig.output = 'export'
  nextConfig.distDir = 'out'
  nextConfig.trailingSlash = true
} else if (isNetlify) {
  // Для Netlify используем стандартную сборку с поддержкой SSR
  nextConfig.experimental = {
    webpackBuildWorker: true,
  }
} else {
  // Для Vercel
  nextConfig.experimental = {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  }
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig