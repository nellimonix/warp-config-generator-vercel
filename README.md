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
├── app/
│   ├── layout.tsx                 Root layout (Geist font, meta)
│   ├── page.tsx                   Server component — loads services
│   └── api/generate/route.ts      POST endpoint (hCaptcha + generation)
│
├── components/
│   ├── home-client.tsx            Client shell (tabs, state, captcha modal)
│   ├── layout/
│   │   ├── topbar.tsx             Logo + tab navigation
│   │   ├── sidebar.tsx            Links, servers, donate (sticky)
│   │   └── footer.tsx
│   ├── generator/
│   │   ├── config-selectors.tsx   Custom dropdowns (format, device, etc.)
│   │   ├── service-picker.tsx     Service selection grid
│   │   ├── result-panel.tsx       Download / copy / QR result block
│   │   ├── formats-tab.tsx        Supported formats list
│   │   └── about-tab.tsx          About + compatible clients
│   └── promo/
│       ├── promo-cards.tsx        Promotional cards (SkyTunnel, etc.)
│       └── banner.tsx             Optional ad banner
│
├── config/
│   ├── services/                  27 JSON files — one per service
│   │   ├── discord.json
│   │   ├── telegram.json
│   │   └── ...
│   ├── services-loader.ts         Auto-loads all JSONs at startup
│   ├── endpoints.ts               Real + fake server endpoints
│   ├── formats.ts                 6 config format definitions
│   ├── banner.ts                  Banner on/off + image URL
│   └── site.ts                    Site metadata + external links
│
├── lib/
│   ├── builders/                  One file per config format
│   │   ├── wireguard.ts
│   │   ├── throne.ts
│   │   ├── clash.ts
│   │   ├── nekoray.ts
│   │   ├── husi.ts
│   │   ├── karing.ts
│   │   ├── shared.ts              Device profiles, DNS, constants
│   │   └── index.ts               Dispatcher — buildConfig(format, params)
│   ├── warp-service.ts            Orchestrator (keys → CF → build → QR)
│   ├── cloudflare-client.ts       Cloudflare WARP API registration
│   ├── crypto.ts                  Key generation (tweetnacl)
│   ├── qr-generator.ts            QR via external API + SVG fallback
│   └── ip-ranges.ts               Re-exports from services-loader
│
├── hooks/
│   ├── use-generator.ts           All client-side generation logic
│   └── use-mobile.ts              Responsive breakpoint hook
│
├── types/                         TypeScript type definitions
├── styles/globals.css             Design tokens + dark theme
├── Dockerfile                     Standalone production build
└── package.json
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
- Main Site: [warp3.llimonix.pw](https://warp3.llimonix.pw)  
- Vercel Mirror: [warply3.vercel.app](https://warply3.vercel.app)
- Netlify Mirror: [getwarp3.netlify.app](https://getwarp3.netlify.app)
- Cloudflare Mirror: [warp.llimonix.workers.dev](https://warp.llimonix.workers.dev)
- Telegram Channel: [ллимоникс </>](https://t.me/+PWiSh2qvtmphMjcy)

## Star History

[![Star History Chart](https://api.star-history.com/chart?repos=nellimonix/warp-config-generator-vercel&type=date&legend=bottom-right&sealed_token=239JRz1TCX2p0ksZ8FDfmV9rtt4mTaU88UCtljMUhAEtzLx3IE7A7souoN6aCO4BD9Io76Jg-9Zrk_vaT3pB2cVwSfcUCf8RqLS1z2pLcjvxTTBmwcFIoA)](https://www.star-history.com/?repos=nellimonix%2Fwarp-config-generator-vercel&type=date&legend=bottom-right)
