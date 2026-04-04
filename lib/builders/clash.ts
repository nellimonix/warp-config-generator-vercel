import type { BuildParams } from '@/types';
import { parseEndpoint } from './shared';
import { reservedToCommaSeparated } from '../crypto';

export function buildClash(p: BuildParams): string {
  const { server, port } = parseEndpoint(p.endpoint);
  const reserved = reservedToCommaSeparated(p.reserved);

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
  dns: [1.1.1.1, 1.0.0.1, 2606:4700:4700::1111, 2606:4700:4700::1001]
  amnezia-wg-option:
   jc: 120
   jmin: 23
   jmax: 911
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
