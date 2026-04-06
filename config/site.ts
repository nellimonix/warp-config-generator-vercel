export const SITE = {
  name: 'WARP Generator by llimonix',
  description: 'Генератор конфигураций Cloudflare WARP',
  locale: 'ru_RU',
  email: 'llimonix@protonmail.com',
  year: 2026,
} as const;

export const LINKS = {
  telegramBot: 'tg://resolve?domain=warp_generator_bot',
  telegramChannel: 'tg://join?invite=fDYczngHDFplZDli',
  github: 'https://github.com/nellimonix/warp-config-generator-vercel',
  githubRepo: 'nellimonix/warp-config-generator-vercel',
  donate: 'tg://resolve?domain=warp_generator_bot&start=donate',
  skyTunnel: 'tg://resolve?domain=SkyTunnel_robot&start=limon-site',
  telegramMedia: 'https://mtproxy.tg?utm_source=warp_generator&utm_medium=referral',
} as const;

export const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '';
