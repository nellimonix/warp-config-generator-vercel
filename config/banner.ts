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
  enabled: true,
  href: 'tg://resolve?domain=findllimonix&direct',
  imageUrl: '/ads.png',
  alt: 'Рекламный баннер',
};
