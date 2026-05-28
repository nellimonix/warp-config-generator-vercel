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
  skyTunnel: 'tg://resolve?domain=SkyTunnel_robot&start=limon-site',
  triBukvy: 'tg://resolve?domain=TriBukvyRoBot&start=warp_site',
  telegramMedia: 'https://mtproxy.cfd?utm_source=warp_generator&utm_medium=referral',
} as const;

export interface DonationPlatform {
  id: string;
  name: string;
  url: string;
  bg: string;
  bgHover: string;
  subColor: string;
}

export const DONATION_PLATFORMS: DonationPlatform[] = [
  {
    id: 'cloudtips',
    name: 'CloudTips',
    url: 'https://pay.cloudtips.ru/p/d6bf9f92',
    bg: '#1a73e8',
    bgHover: '#1f7ff5',
    subColor: '#cfe0fa',
  },
  {
    id: 'donationalerts',
    name: 'DonationAlerts',
    url: 'https://dalink.to/llimonix',
    bg: '#f5a623',
    bgHover: '#ffb83d',
    subColor: '#fde6c4',
  },
  {
    id: 'tribute',
    name: 'Tribute',
    url: 'https://t.me/tribute/app?startapp=dxSo',
    bg: '#229ed9',
    bgHover: '#2caee7',
    subColor: '#d1ecf8',
  },
];

export interface CryptoAddress {
  id: string;
  symbol: string;
  name: string;
  network?: string;
  address: string;
}

export const CRYPTO_ADDRESSES: CryptoAddress[] = [
  {
    id: 'usdt',
    symbol: 'usdt',
    name: 'USDT',
    network: 'TRC20',
    address: 'TEhKos71cczeZz69Bq2xgsggRFsrwA68yD',
  },
  {
    id: 'ton',
    symbol: 'ton',
    name: 'TON',
    address: 'UQB0hVsoCLSpUwD-Q5dHi4QwwBFWx-IK2GXvYBLZUtcXtFw-',
  },
  {
    id: 'btc',
    symbol: 'btc',
    name: 'Bitcoin',
    address: 'bc1qam3nmkhy0zjdrzrswh30d90rsyc8dgk4y0nt63',
  },
  {
    id: 'eth',
    symbol: 'eth',
    name: 'Ethereum',
    address: '0x91eD58d7e614D0f241F1537b879c1ce4cda4D023',
  },
  {
    id: 'trx',
    symbol: 'trx',
    name: 'TRX',
    network: 'Tron',
    address: 'TEhKos71cczeZz69Bq2xgsggRFsrwA68yD',
  },
];

export const HCAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '';
