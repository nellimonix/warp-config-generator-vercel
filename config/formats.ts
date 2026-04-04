import type { ConfigFormat, ConfigFormatInfo } from '@/types';

export const CONFIG_FORMATS: ConfigFormatInfo[] = [
  {
    id: 'wireguard',
    name: 'AmneziaWG',
    description: 'Стандартный формат WireGuard (.conf)',
    extension: 'conf',
    supportsQR: false,
  },
  {
    id: 'clash',
    name: 'Clash',
    description: 'Конфигурация для Clash Meta (.yaml)',
    extension: 'yaml',
    supportsQR: false,
  },
  {
    id: 'wiresock',
    name: 'WireSock',
    description: 'WireGuard с маскировкой протокола (.conf)',
    extension: 'conf',
    supportsQR: true,
  },
];

export function getFormatInfo(format: ConfigFormat): ConfigFormatInfo {
  const info = CONFIG_FORMATS.find((f) => f.id === format);
  if (!info) throw new Error(`Unknown format: ${format}`);
  return info;
}

export function getFileName(format: ConfigFormat): string {
  const info = getFormatInfo(format);
  const id = Math.floor(Math.random() * 9_000_000) + 1_000_000;
  const prefix = format === 'wireguard' ? 'WARP' : format.toUpperCase();
  return `${prefix}${id}.${info.extension}`;
}

export function supportsQR(format: ConfigFormat): boolean {
  return getFormatInfo(format).supportsQR;
}
