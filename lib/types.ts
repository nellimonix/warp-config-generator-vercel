/**
 * Общие типы для всех модулей системы
 */

export type DeviceType = 'computer' | 'phone' | 'awg15';
export type SiteMode = 'all' | 'specific';
export type EndPointType = 'default' | 'default2' | 'input';

export interface WarpGenerationRequest {
  selectedServices: string[];
  siteMode: SiteMode;
  deviceType: DeviceType;
  endpoint: string;
}

export interface WarpGenerationResult {
  configBase64: string;
  qrCodeBase64: string;
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