export type ConfigFormat = 'wireguard' | 'throne' | 'clash' | 'nekoray' | 'husi' | 'karing' | 'wiresock' | 'xray';

export type AwgProtocol = 'awg10' | 'awg20' | 'awg30' | 'awg31';
export type AwgJunkKey = 'jc' | 'jmin' | 'jmax';
export type Awg30Key = 'contentPaddingAddition' | 'rekeyAfterTime' | 'rekeyTimeout' | 'rejectAfterTime' | 'keepaliveTimeout' | 'maxHandshakeAttempts';

export interface AwgOptions {
  protocols: AwgProtocol[];
  junkPreset: 'default' | '30_10_30';
  junk: Partial<Record<AwgJunkKey, string | number>>;
  ranges: Partial<Record<Awg30Key, string>>;
  randomTrailers: boolean;
  disableCookies: boolean;
}

export interface ResolvedAwgOptions extends Omit<AwgOptions, 'junk' | 'ranges'> {
  junk: Record<AwgJunkKey, number>;
  ranges: Record<Awg30Key, string>;
}

export type DeviceType = 'awg15' | 'phone';

export type ClashProtocol = 'awg' | 'masque' | 'awg_masque';

export type SiteMode = 'all' | 'specific';

export interface DeviceProfile {
  jc: number;
  jmin: number;
  jmax: number;
}

export interface ConfigFormatInfo {
  id: ConfigFormat;
  name: string;
  image?: string;
  description: string;
  extension: string;
  supportsQR: boolean;
}

export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export interface BuildParams {
  mtu?: number;
  awg?: ResolvedAwgOptions;
  privateKey: string;
  publicKey: string;
  clientIPv4: string;
  clientIPv6: string;
  allowedIPs: string;
  endpoint: string;
  deviceType: DeviceType;
  reserved: string;
  /** Resolved `DNS = ...` value (IPv6 entries already dropped when disabled). */
  dns: string;
  /** Whether the client IPv6 address is kept in `Address`. */
  includeIPv6: boolean;
  /** WireGuard `PersistentKeepalive` value; omitted from output when undefined. */
  persistentKeepalive?: number;
  /** Full `I1 = <b 0x...>` line — default constant or generated from a custom domain. */
  i1: string;
  /** Raw domain from "custom I1" — used as WireSock `Id` verbatim (no crypto). */
  maskDomain?: string;
  clashProtocol?: ClashProtocol;
  masque?: {
    privateKey: string;
    publicKey: string;
    clientIPv4: string;
    clientIPv6: string;
    server: string;
    port: number;
    sni: string;
  };
}

export interface DNSConfig {
  primary: string[];
  secondary: string[];
}
