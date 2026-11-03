export const SEO_ENABLED = false;

export const NO_INDEX_HEADER = 'noindex, nofollow, noarchive, nosnippet, noimageindex';

export const NO_INDEX_ROBOTS = {
  index: false,
  follow: false,
  noarchive: true,
  nosnippet: true,
  noimageindex: true,
} as const;

export const HOME_SEO = {
  title: 'Генератор WARP для AmneziaWG и WireGuard | llimonix',
  description: 'Создайте конфигурацию Cloudflare WARP для AmneziaWG, WireGuard, Clash, Xray или WireSock. Настройте DNS, конечную точку и маршруты, скачайте готовый файл.',
  heading: 'Генератор конфигураций Cloudflare WARP',
  introduction: 'Создавайте конфиги для AmneziaWG, WireGuard, Clash, Xray и WireSock. Выбирайте параметры подключения и скачивайте конфигурацию для своего клиента.',
} as const;
