'use client';

import * as Flags from 'country-flag-icons/react/3x2';
import type { ComponentType, SVGProps } from 'react';

interface FlagIconProps {
  code: string;
  size?: number;
}

export function FlagIcon({ code, size = 20 }: FlagIconProps) {
  const upperCode = code.toUpperCase();
  const FlagComponent = (Flags as Record<string, ComponentType<SVGProps<SVGSVGElement>>>)[upperCode];
  const h = Math.round(size * 0.67);

  if (!FlagComponent) {
    return (
      <span
        style={{
          display: 'inline-block',
          width: size,
          height: h,
          background: 'var(--surface-3)',
          borderRadius: 3,
        }}
      />
    );
  }

  return (
    <FlagComponent
      style={{
        width: size,
        height: h,
        borderRadius: 3,
        display: 'block',
      }}
    />
  );
}