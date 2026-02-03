let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

const isCloudflarePages = process.env.CF_PAGES || process.env.CF_PAGES_BRANCH
const isNetlify = process.env.NETLIFY || false

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

if (isCloudflarePages) {
  // Для Cloudflare Pages - статическая генерация
  nextConfig.output = 'export'
  nextConfig.distDir = 'out'
  nextConfig.trailingSlash = true
  
  // Пустой turbopack config чтобы избежать warning
  nextConfig.turbopack = {}
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