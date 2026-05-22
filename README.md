# WARP Configuration Generator

[Русский](README_ru.md) | **English**

Open-source generator for Cloudflare WARP configs (WireGuard / AmneziaWG / Clash / Throne / Nekoray / Husi / Karing / WireSock).
This is the **public** branch — no captcha, no analytics, no promo blocks. Deploy your own.

## 🚀 Quick Deployment

### Docker (recommended)

Pre-built image is published to GHCR on every push to `master`:

```bash
docker run -d --name warp-generator \
  -p 3000:3000 \
  --restart unless-stopped \
  ghcr.io/nellimonix/warp-config-generator-vercel-public:latest
```

Open http://localhost:3000.

### Docker — build locally

```bash
docker build -t warp-generator-public .
docker run -d -p 3000:3000 --name warp-generator warp-generator-public
```

### docker-compose

```yaml
services:
  warp-generator:
    image: ghcr.io/nellimonix/warp-config-generator-vercel-public:latest
    container_name: warp-generator
    ports:
      - "3000:3000"
    restart: unless-stopped
```

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nellimonix/warp-config-generator-vercel&repository-name=warp)
- Or via [CLI](https://vercel.com/docs/cli): `vercel deploy`
- Local dev: `vercel dev`

### Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/nellimonix/warp-config-generator-vercel&siteName=warp)
- Or via [CLI](https://docs.netlify.com/cli/get-started/): `netlify deploy`
- Local dev: `netlify dev`

### Cloudflare Workers

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/nellimonix/warp-config-generator-vercel)
- Or via [Wrangler](https://developers.cloudflare.com/workers/wrangler/): `wrangler deploy`
- Local dev: `wrangler dev`

### Cloudflare Pages

The same `wrangler.jsonc` deploys to Pages with the static export.

```bash
CLOUDFLARE_WORKERS=1 npm run build
npx wrangler pages deploy out --project-name=warp-generator
```

Or connect the repo in the Cloudflare dashboard:
- Build command: `CLOUDFLARE_WORKERS=1 npm run build`
- Output directory: `out`

## 🛠️ Local Development

```bash
npm install
npm run dev          # dev server on :3000
npm run build        # production build
npm run start        # serve production build
npm run lint
```

## ➕ Adding a new service (PR welcome)

The "specific sites" mode lets users select services to route through WARP.
To add one:

1. **Fork** the repo and create a branch (e.g. `feat/service-newsite`).
2. **Create** `config/services/<your-service-key>.json`:
   ```json
   {
     "name": "Display Name",
     "icon": "FaIconName",
     "iconLibrary": "fa",
     "type": "new",
     "ips": "1.2.3.0/24, 5.6.7.0/24, ..."
   }
   ```
   - `name` — user-visible service name.
   - `icon` — icon name from [react-icons](https://react-icons.github.io/react-icons/). Verify the name exists in the chosen library.
   - `iconLibrary` — one of: `fa`, `fa6`, `si`, `bi`, `md`, `ri`, etc. (matches react-icons sub-package).
   - `type` — optional. Set `"new"` to show a "NEW" badge.
   - `ips` — comma-separated CIDR ranges. Use a real ASN/IP lookup tool — Cloudflare's whois, BGP.tools, or `whois -h whois.cymru.com " -v <ip>"`.
3. **Do NOT edit** `worker/api-handler.js` or `functions/api/generate.js`. A GitHub Action (`build-ip-ranges`) rebuilds the `IP_RANGES` blocks in both files automatically on merge to `master`, and syncs the new service into the `production` branch.
4. **Open a PR** to `master`.

### Local preview of the rebuild

```bash
node scripts/build-ip-ranges.mjs
```

Runs against `config/services/*.json` and rewrites the `// IP_RANGES:BEGIN ... // IP_RANGES:END` block in both worker/functions files. Safe to run repeatedly — idempotent.

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx                 Root layout (Geist font, meta)
│   ├── page.tsx                   Server component — loads services
│   ├── not-found.tsx              404 page
│   └── api/generate/route.ts      POST endpoint (config generation)
│
├── components/
│   ├── home-client.tsx            Client shell (tabs, state)
│   ├── layout/
│   │   ├── topbar.tsx             Logo + tab navigation
│   │   ├── sidebar.tsx            GitHub link + server list (sticky)
│   │   └── footer.tsx
│   ├── generator/
│   │   ├── config-selectors.tsx   Custom dropdowns (format, device, etc.)
│   │   ├── service-picker.tsx     Service selection grid
│   │   ├── result-panel.tsx       Download / copy / QR result block
│   │   ├── formats-tab.tsx        Supported formats list
│   │   └── about-tab.tsx          About + compatible clients
│   └── icons/                     Icon resolver + flag icons
│
├── config/
│   ├── services/                  JSON files — one per service (IP ranges)
│   ├── services-loader.ts         Auto-loads all JSONs at startup
│   ├── endpoints.ts               Cloudflare WARP endpoints
│   └── formats.ts                 Config format definitions
│
├── lib/
│   ├── builders/                  One file per config format
│   │   ├── wireguard.ts
│   │   ├── throne.ts
│   │   ├── clash.ts
│   │   ├── nekoray.ts
│   │   ├── husi.ts
│   │   ├── karing.ts
│   │   ├── wiresock.ts
│   │   ├── shared.ts              Device profiles, DNS, constants
│   │   └── index.ts               Dispatcher — buildConfig(format, params)
│   ├── warp-service.ts            Orchestrator (keys → CF → build → QR)
│   ├── cloudflare-client.ts       Cloudflare WARP API registration
│   ├── crypto.ts                  Key generation (tweetnacl)
│   ├── qr-generator.ts            QR via external API + SVG fallback
│   └── ip-ranges.ts               Re-exports from services-loader
│
├── hooks/
│   ├── use-generator.ts           Client-side generation logic
│   └── use-mobile.ts              Responsive breakpoint hook
│
├── scripts/
│   └── build-ip-ranges.mjs        Regenerates IP_RANGES in worker + functions
│
├── worker/                        Cloudflare Workers runtime
├── functions/                     Netlify Functions runtime
├── types/                         TypeScript type definitions
├── styles/globals.css             Design tokens + dark theme
├── .github/workflows/             CI: Docker build, IP_RANGES rebuild
├── Dockerfile                     Standalone production build (public)
├── next.config.mjs
└── package.json
```

## 🔧 Configuration

No environment variables required for the public build. The generator runs anonymously
against the public Cloudflare WARP registration API.

### Build modes

`next.config.mjs` switches `output` based on environment:

| Env var                       | Output           | Used by                  |
|-------------------------------|------------------|--------------------------|
| `DOCKER_BUILD=1`              | `standalone`     | Docker / Dokploy         |
| `CLOUDFLARE_WORKERS` / `CF_PAGES` | `export`     | CF Workers / CF Pages    |
| _none_                        | default          | Vercel / Netlify         |

## 🌐 Supported Platforms

| Platform              | Support  | Notes                                    |
|-----------------------|----------|------------------------------------------|
| Docker (self-host)    | ✅ Full  | standalone Next.js server                |
| Vercel                | ✅ Full  | default runtime                          |
| Netlify               | ✅ Full  | Edge functions                           |
| Cloudflare Workers    | ✅ Full  | static export + worker                   |
| Cloudflare Pages      | ✅ Full  | static export                            |

## 📄 License

MIT License — see [LICENCE](LICENCE)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Open a Pull Request

## 🔗 Mirrors / Alternative Links

- Telegram Bot: [t.me/warp_generator_bot](https://t.me/warp_generator_bot)
- Main Site: [warp2.llimonix.pw](https://warp2.llimonix.pw)
- Vercel Mirror: [warply2.vercel.app](https://warply2.vercel.app)
- Netlify Mirror: [getwarp2.netlify.app](https://getwarp2.netlify.app)
- Cloudflare Mirror: [warp.llimonix.workers.dev](https://warp.llimonix.workers.dev)
- Telegram Channel: [ллимоникс </>](https://t.me/+PWiSh2qvtmphMjcy)
