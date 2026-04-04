# ── Stage 1: Dependencies ──
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps

# ── Stage 2: Build ──
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars must be present at build time — Next.js inlines them into the client JS bundle
ARG NEXT_PUBLIC_HCAPTCHA_SITE_KEY=""
ENV NEXT_PUBLIC_HCAPTCHA_SITE_KEY=$NEXT_PUBLIC_HCAPTCHA_SITE_KEY

ENV DOCKER_BUILD=1
ENV NODE_OPTIONS="--max-old-space-size=2048"
RUN npm run build

# ── Stage 3: Production ──
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs
# Standalone server
COPY --from=builder /app/.next/standalone ./
# Static assets
COPY --from=builder /app/.next/static ./.next/static
# Public files
COPY --from=builder /app/public ./public
# Service JSON configs (needed by services-loader at runtime)
COPY --from=builder /app/config ./config
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]