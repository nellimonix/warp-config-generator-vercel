import type { BuildParams } from '@/types';
import { parseEndpoint } from './shared';
import { reservedToCommaSeparated } from '../crypto';

export function buildClash(p: BuildParams): string {
  const { server, port } = parseEndpoint(p.endpoint);
  const reserved = reservedToCommaSeparated(p.reserved);
  const dnsList = p.dns
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(', ');

  return `proxies:
- name: "WARP"
  type: wireguard
  private-key: ${p.privateKey}
  server: ${server}
  port: ${port}
  ip: ${p.clientIPv4}
  public-key: ${p.publicKey}
  allowed-ips: ['0.0.0.0/0']
  reserved: [${reserved}]
  udp: true
  mtu: 1280
  remote-dns-resolve: true
  dns: [${dnsList}]
  amnezia-wg-option:
   jc: 4
   jmin: 40
   jmax: 70
   s1: 0
   s2: 0
   h1: 1
   h2: 2
   h4: 3
   h3: 4

proxy-groups:
- name: Cloudflare
  type: select
  icon: https://developers.cloudflare.com/_astro/logo.p_ySeMR1.svg
  proxies:
    - WARP
  url: 'http://speed.cloudflare.com/'
  interval: 300`;
}
