'use client';

import { BANNER } from '@/config/banner';

export function Banner() {
  if (!BANNER.enabled) return null;

  return (
    <a
      href={BANNER.href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-[var(--radius-lg)] overflow-hidden hover:brightness-110 transition-all mb-3"
    >
      <img
        src={BANNER.imageUrl}
        alt={BANNER.alt}
        className="w-full h-auto block"
        loading="lazy"
      />
    </a>
  );
}
