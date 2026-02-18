/**
 * Расширенные типы для поддержки различных форматов конфигураций
 */

export type DeviceType = 'awg15' | 'phone' | 'computer';
export type SiteMode = 'all' | 'specific';
export type EndPointType = 'default' | 'default2' | 'input';
export type ConfigFormat = 'wireguard' | 'throne' | 'clash' | 'nekoray' | 'husi' | 'karing';

export interface WarpGenerationRequest {
  selectedServices: string[];
  siteMode: SiteMode;
  deviceType: DeviceType;
  endpoint: string;
  configFormat?: ConfigFormat; // Новое поле для выбора формата
}

export interface WarpGenerationResult {
  configBase64: string;
  qrCodeBase64: string;
  configFormat: ConfigFormat;
  fileName?: string; // Предлагаемое имя файла
}

export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export interface WarpConfigParams {
  privateKey: string;
  publicKey: string;
  clientIPv4: string;
  clientIPv6: string;
  allowedIPs: string;
  endpoint: string;
  deviceType: DeviceType;
  reserved?: string; // Добавлено для форматов, которым нужен reserved
}

export interface ExtendedWarpConfigParams extends WarpConfigParams {
  configFormat: ConfigFormat;
}

export interface DNSConfig {
  primary: string[];
  secondary: string[];
}

export interface QRCodeOptions {
  size?: number;
  format?: 'png' | 'svg';
}

export interface WarpRegistrationRequest {
  install_id: string;
  tos: string;
  key: string;
  fcm_token: string;
  type: string;
  locale: string;
}

export interface WarpRegistrationResponse {
  result: {
    id: string;
    token: string;
  };
}

export interface WarpConfigResponse {
  result: {
    config: {
      peers: Array<{
        public_key: string;
        endpoint: {
          host: string;
        };
      }>;
      interface: {
        addresses: {
          v4: string;
          v6: string;
        };
      };
      client_id?: string; // Добавлено для reserved
    };
  };
}

export interface IPRange {
  service: string;
  ranges: string[];
}

export interface RangesStats {
  totalServices: number;
  totalRanges: number;
  uniqueRanges: number;
}

// Конфигурационные опции для каждого формата
export interface ConfigFormatInfo {
  id: ConfigFormat;
  name: string;
  description: string;
  extension: string;
  supportsQR: boolean;
  requiresReserved: boolean;
}

export const CONFIG_FORMATS: ConfigFormatInfo[] = [
  {
    id: 'wireguard',
    name: 'AmneziaWG',
    description: 'Стандартный формат WireGuard (.conf)',
    extension: 'conf',
    supportsQR: true,
    requiresReserved: false
  },
  {
    id: 'throne',
    name: 'Throne',
    description: 'Формат для клиента Throne (URL)',
    extension: 'txt',
    supportsQR: true,
    requiresReserved: true
  },
  {
    id: 'clash',
    name: 'Clash',
    description: 'Конфигурация для Clash Meta (.yaml)',
    extension: 'yaml',
    supportsQR: false,
    requiresReserved: true
  },
  {
    id: 'nekoray',
    name: 'NekoRay/Exclave',
    description: 'JSON конфигурация для NekoRay/Exclave',
    extension: 'json',
    supportsQR: false,
    requiresReserved: true
  },
  {
    id: 'husi',
    name: 'Husi',
    description: 'JSON конфигурация для Husi',
    extension: 'json',
    supportsQR: false,
    requiresReserved: true
  },
  {
    id: 'karing',
    name: 'Karing/Hiddify',
    description: 'Конфигурация для Karing и Hiddify',
    extension: 'json',
    supportsQR: false,
    requiresReserved: true
  }
];

// Хелпер функции для работы с форматами
export const getConfigFormatInfo = (format: ConfigFormat): ConfigFormatInfo | undefined => {
  return CONFIG_FORMATS.find(f => f.id === format);
};

export const getSupportedFormats = (): ConfigFormat[] => {
  return CONFIG_FORMATS.map(f => f.id);
};

export const getFormatsWithQRSupport = (): ConfigFormat[] => {
  return CONFIG_FORMATS.filter(f => f.supportsQR).map(f => f.id);
};

export const getFileName = (format: ConfigFormat, randomId?: number): string => {
  const formatInfo = getConfigFormatInfo(format);
  const extension = formatInfo?.extension || 'conf';
  const suffix = randomId || Math.floor(Math.random() * 9000000) + 1000000;
  
  switch (format) {
    case 'throne':
      return `THRONE${suffix}.txt`;
    case 'clash':
      return `CLASH${suffix}.yaml`;
    case 'nekoray':
      return `NEKORAY${suffix}.json`;
    case 'husi':
      return `HUSI${suffix}.json`;
    case 'karing':
      return `KARING${suffix}.json`;
    default:
      return `WARP${suffix}.${extension}`;
  }
};