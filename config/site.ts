export const SITE = {
  name: 'WARP Generator by llimonix',
  url: 'https://warp3.llimonix.pw',
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
  continental: 'tg://resolve?domain=ContinentalVPN_bot&start=LS',
  telegramMedia: 'https://mtproxy.tg/?utm_source=warp_generator&utm_medium=referral',
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
    symbol: 'trx',
    name: 'USDT (TRC20) / TRX',
    address: 'TAYUHFzVR8AJkFAPLHAUQ2fUS8Zvj6nK8K',
  },
  {
    id: 'ton',
    symbol: 'gram',
    name: 'USDT (TON) / Gram',
    address: 'UQDPPzAlL8vSQauPgyd0T2kqyaa5bRAZEVRj1iP4QZCeBqym',
  },
  {
    id: 'bnb',
    symbol: 'bnb',
    name: 'USDT BEP20 / BNB',
    address: '0xd7553Dd7B3625F1bDd79D7B0B74D7Fd2ea77e66A',
  },
  {
    id: 'sol',
    symbol: 'sol',
    name: 'USDT Solana / Solana',
    address: '7j7gL5AuybqSCdNfKLLEEUUPh6yRvQ8x6NEswDX3b8Nn',
  },
  {
    id: 'btc',
    symbol: 'btc',
    name: 'Bitcoin',
    address: 'bc1qv0ysqhemeev6964sls23v70mmlzgn4jhp0t90y',
  },
  {
    id: 'eth',
    symbol: 'eth',
    name: 'Ethereum',
    address: '0xd7553Dd7B3625F1bDd79D7B0B74D7Fd2ea77e66A',
  },
];
