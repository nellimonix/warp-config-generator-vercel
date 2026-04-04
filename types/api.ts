import type { ConfigFormat, DeviceType, SiteMode } from './config';

export interface GenerateRequest {
  selectedServices: string[];
  siteMode: SiteMode;
  deviceType: DeviceType;
  endpoint: string;
  configFormat: ConfigFormat;
  captchaToken: string;
}

export interface GenerateResult {
  configBase64: string;
  qrCodeBase64: string;
  configFormat: ConfigFormat;
  fileName: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  content?: T;
  message?: string;
}

export interface CloudflareRegisterResponse {
  result: {
    id: string;
    token: string;
    config?: {
      client_id?: string;
    };
  };
}

export interface CloudflareWarpResponse {
  result: {
    config: {
      peers: Array<{
        public_key: string;
        endpoint: { host: string };
      }>;
      interface: {
        addresses: { v4: string; v6: string };
      };
      client_id?: string;
    };
  };
}
