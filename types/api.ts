import type { ConfigFormat, DeviceType, SiteMode } from './config';

export interface GenerateRequest {
  selectedServices: string[];
  siteMode: SiteMode;
  deviceType: DeviceType;
  endpoint: string;
  configFormat: ConfigFormat;
  /** DNS provider id (see config/dns.ts). Defaults to 'cf'. */
  dnsId?: string;
  /** Include IPv6 in Address / DNS / default AllowedIPs. Defaults to true. */
  ipv6?: boolean;
  /** Exclude LAN ranges (only honored when siteMode='all'). Defaults to false. */
  excludeLan?: boolean;
  /** PersistentKeepalive value; null/undefined disables it. */
  persistentKeepalive?: number | null;
  /** Custom domain for the I1 mask; empty/undefined uses the default I1. */
  customI1Domain?: string;
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
