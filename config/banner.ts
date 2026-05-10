/**
 * Banner config — set enabled: false to hide.
 * Image should be placed in /public/banners/
 */
export interface BannerConfig {
  enabled: boolean;
  href: string;
  imageUrl: string;
  alt: string;
}

export const BANNER: BannerConfig = {
  enabled: false,
  href: 'tg://resolve?domain=findllimonix&direct',
  imageUrl: '/ads.png',
  alt: 'Рекламный баннер',
};

/**
 * Notice plate config — set enabled: false to hide.
 * Supports inline links via [text](url) markdown-like syntax.
 */
export type NoticeVariant = 'warning' | 'info' | 'error';

export interface NoticeConfig {
  enabled: boolean;
  variant: NoticeVariant;
  text: string;
}

export const NOTICE: NoticeConfig = {
  enabled: true,
  variant: 'warning',
  text: 'На генератор выросла нагрузка, конфиги могут не генерироваться. Подключитесь к [прокси Telegram](https://mtproxy.cfd?utm_source=warp_generator&utm_medium=referral) и попробуйте свою попытку в [боте](tg://resolve?domain=warp_generator_bot).',
};
