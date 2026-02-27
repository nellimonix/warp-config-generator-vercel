# WARP Configuration Generator

[Русский](README_ru.md) | **English**

Configuration generator for WARP with support for various deployment platforms.

## 🚀 Quick Deployment

### 1. Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nellimonix/warp-config-generator-vercel&repository-name=warp)
- Alternatively, can be deployed via [cli](https://vercel.com/docs/cli):
  `vercel deploy`
- Run locally: `vercel dev`
- Vercel _Functions_ [limitations](https://vercel.com/docs/functions/limitations) (with _Edge_ runtime)

### 2. Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](
https://app.netlify.com/start/deploy?repository=https://github.com/nellimonix/warp-config-generator-vercel&siteName=warp
)
- Alternatively, can be deployed via [cli](https://docs.netlify.com/cli/get-started/):
  `netlify deploy`
- Run locally: `netlify dev`
- _Functions_ [limitations](https://docs.netlify.com/functions/get-started/?fn-language=js#synchronous-function-2)
- _Edge functions_ [limitations](https://docs.netlify.com/edge-functions/limits/)

### Deploy to Cloudflare

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/nellimonix/warp-config-generator-vercel)
- Alternatively can be deployed with [cli](https://developers.cloudflare.com/workers/wrangler/):
  `wrangler deploy`
- Serve locally: `wrangler dev`
- _Worker_ [limits](https://developers.cloudflare.com/workers/platform/limits/#worker-limits)

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Linting
npm run lint
```

## 📁 Project Structure

```
├── app/                              # Next.js App Router
│   ├── api/warp_captcha/route.ts     # API endpoint for config generation
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Main page
├── components/                       # React components
│   ├── icons/
│   │   └── custom-icons.tsx          # Custom service icons
│   ├── ui/                           # shadcn/ui components
│   ├── config-options.tsx            # Configuration settings component
│   ├── theme-provider.tsx            # Theme provider (dark/light mode)
│   └── warp-generator.tsx            # Main generator component
├── data/                             # Static data
│   ├── services-config.json          # Available services configuration
│   └── ip-ranges.json                # IP ranges for each service
├── functions/
│   └── api/warp_captcha.js           # Cloudflare Workers API function
├── worker/
│   └── index.js                      # Cloudflare Worker entry point
├── hooks/                            # React hooks
├── lib/                              # Core business logic
│   ├── builder/
│   │   └── warp-config-builder.ts    # WireGuard config builder
│   ├── cloudflare-api.ts             # Cloudflare WARP API client
│   ├── crypto-utils.ts               # Cryptographic utilities
│   ├── ip-ranges.ts                  # IP ranges manager
│   ├── qr-generator.ts               # QR code generator
│   ├── types.ts                      # TypeScript types and interfaces
│   ├── utils.ts                      # Common utilities (cn, etc.)
│   ├── warp-service.ts               # Main WARP generation service
│   └── warpConfig.ts                 # Legacy compatibility
├── public/                           # Static files
├── types/
│   └── services.ts                   # Service types
├── utils/
│   └── services.ts                   # Services manager (ServicesManager)
├── .gitignore                        # Git ignore rules
├── components.json                   # shadcn/ui configuration
├── LICENSE                           # MIT license
├── netlify.toml                      # Netlify configuration
├── next.config.mjs                   # Next.js configuration
├── package.json                      # Project dependencies
├── postcss.config.mjs                # PostCSS configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── vercel.json                       # Vercel configuration
├── wrangler.jsonc                    # Cloudflare Workers configuration
├── README_ru.md                      # Project documentation in Russian
└── README.md                         # Project documentation in English
```

## 🔧 Configuration

### Next.js

The project uses Next.js 14 with App Router and the following setup:

- TypeScript
- Tailwind CSS
- ESLint
- Radix UI components
- Automatic image optimization

### Build

The project is configured for static generation with server-side rendering capability for API routes.

## 🌐 Supported Platforms

| Platform | Support | Complexity | Deployment Time |
|----------|---------|------------|----------------|
| Vercel | ✅ Full | 🟢 Low | ~3 minutes |
| Netlify | ✅ Full | 🟡 Medium | ~5 minutes |
| Cloudflare Workers | ✅ Full | 🟡 Medium | ~5 minutes |

## 📄 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Create a Pull Request

## Mirrors / Alternative Links

- Telegram Bot: [t.me/warp_generator_bot](https://t.me/warp_generator_bot)  
- Main Site: [warp2.llimonix.pw](https://warp2.llimonix.pw)  
- Vercel Mirror: [warply2.vercel.app](https://warply2.vercel.app)  
- Netlify Mirror: [getwarp2.netlify.app](https://getwarp2.netlify.app)  
- Cloudflare Mirror: [warp.llimonix.workers.dev](https://warp.llimonix.workers.dev)  
- Telegram Channel: [ллимоникс </>](https://t.me/+PWiSh2qvtmphMjcy)