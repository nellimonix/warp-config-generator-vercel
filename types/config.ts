export type ConfigFormat = 'wireguard' | 'clash' | 'wiresock';

export type DeviceType = 'awg15' | 'phone';

export type SiteMode = 'all' | 'specific';

export interface DeviceProfile {
  jc: number;
  jmin: number;
  jmax: number;
}

export interface ConfigFormatInfo {
  id: ConfigFormat;
  name: string;
  description: string;
  extension: string;
  supportsQR: boolean;
}

export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export interface BuildParams {
  privateKey: string;
  publicKey: string;
  clientIPv4: string;
  clientIPv6: string;
  allowedIPs: string;
  endpoint: string;
  deviceType: DeviceType;
  reserved: string;
}

export interface DNSConfig {
  primary: string[];
  secondary: string[];
}
