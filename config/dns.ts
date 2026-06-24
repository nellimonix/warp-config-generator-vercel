/**
 * DNS providers.
 *
 * Plain data module — no `fs`, safe to import from both client (picker) and
 * server (config resolution). IP values mirror the reference getSelectedDNS().
 *
 * `isCommunity: true` providers forbid split tunneling (specific sites): when
 * selected, the UI/server force siteMode='all' and clear selected services.
 */

export interface DnsProvider {
  id: string;
  label: string;
  ipv4: string[];
  ipv6: string[];
  isCommunity: boolean;
}

export const DNS_PROVIDERS: DnsProvider[] = [
  {
    id: 'cf',
    label: '1.1.1.1',
    ipv4: ['1.1.1.1', '1.0.0.1'],
    ipv6: ['2606:4700:4700::1111', '2606:4700:4700::1001'],
    isCommunity: false,
  },
  {
    id: 'google',
    label: '8.8.8.8',
    ipv4: ['8.8.8.8', '8.8.4.4'],
    ipv6: ['2001:4860:4860::8888', '2001:4860:4860::8844'],
    isCommunity: false,
  },
  {
    id: 'quad9',
    label: 'dns.quad9.net',
    ipv4: ['9.9.9.9', '149.112.112.112'],
    ipv6: ['2620:fe::fe', '2620:fe::9'],
    isCommunity: false,
  },
  {
    id: 'malw',
    label: 'dns.malw.link',
    ipv4: ['84.21.189.133', '193.23.209.189'],
    ipv6: ['2a12:bec4:1460:294::2', '2a01:ecc0:680:120::2'],
    isCommunity: true,
  },
  {
    id: 'xbox',
    label: 'xbox-dns.ru',
    ipv4: ['111.88.96.50', '111.88.96.51'],
    ipv6: ['2a00:ab00:1233:26::50', '2a00:ab00:1233:26::51'],
    isCommunity: true,
  },
  {
    id: 'geohide',
    label: 'dns.geohide.ru',
    ipv4: ['45.155.204.190', '37.230.192.51'],
    ipv6: [],
    isCommunity: true,
  },
  {
    id: 'comss',
    label: 'dns.comss.one',
    ipv4: ['83.220.169.155', '212.109.195.93', '195.133.25.16'],
    ipv6: ['2a01:230:4:915::2', '2a01:230:4:306::2'],
    isCommunity: true,
  },
  {
    id: 'mafioznik',
    label: 'dns.mafioznik.xyz',
    ipv4: ['103.27.157.38', '103.27.157.100'],
    ipv6: [],
    isCommunity: true,
  },
];

export const DEFAULT_DNS_ID = 'cf';

export function getDnsProvider(id: string): DnsProvider {
  return DNS_PROVIDERS.find((p) => p.id === id) ?? DNS_PROVIDERS[0];
}

export function isCommunityDns(id: string): boolean {
  return getDnsProvider(id).isCommunity;
}

/** Builds the `DNS = ...` line value. IPv6 entries are dropped when `includeIPv6` is false. */
export function buildDnsLine(id: string, includeIPv6: boolean): string {
  const p = getDnsProvider(id);
  const ips = includeIPv6 ? [...p.ipv4, ...p.ipv6] : p.ipv4;
  return ips.join(', ');
}
