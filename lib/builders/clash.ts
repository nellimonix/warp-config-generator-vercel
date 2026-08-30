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

  const includeAwg = !p.clashProtocol || p.clashProtocol === 'awg' || p.clashProtocol === 'awg_masque';
  const includeMasque = (p.clashProtocol === 'masque' || p.clashProtocol === 'awg_masque') && p.masque;
  const proxies: string[] = [];
  const names: string[] = [];

  if (includeAwg) {
    names.push('[WARP-AWG] Default');
    proxies.push(`- name: "[WARP-AWG] Default"
  type: wireguard
  private-key: ${p.privateKey}
  server: ${server}
  port: ${port}
  ip: ${p.clientIPv4}
${p.includeIPv6 ? `  ipv6: ${p.clientIPv6}\n` : ''}  public-key: ${p.publicKey}
  allowed-ips: ${p.includeIPv6 ? "['0.0.0.0/0', '::/0']" : "['0.0.0.0/0']"}
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
   h3: 3
   h4: 4`);
  }

  if (includeMasque && p.masque) {
    const masque = p.masque;
    names.push('[WARP-MASQUE] QUIC', '[WARP-MASQUE] H2');
    const common = `  type: masque
  sni: ${masque.sni}
  private-key: ${masque.privateKey}
  public-key: ${masque.publicKey}
  ip: ${masque.clientIPv4}
${p.includeIPv6 && masque.clientIPv6 ? `  ipv6: ${masque.clientIPv6}\n` : ''}  server: ${masque.server}
  port: ${masque.port}
  udp: true
  remote-dns-resolve: true
  dns: [${dnsList}]`;
    proxies.push(`- name: "[WARP-MASQUE] QUIC"
${common}
- name: "[WARP-MASQUE] H2"
${common}
  network: h2`);
  }

  return `proxies:
${proxies.join('\n')}

proxy-groups:
- name: Cloudflare
  type: select
  icon: https://developers.cloudflare.com/_astro/logo.p_ySeMR1.svg
  proxies:
${names.map((name) => `    - "${name}"`).join('\n')}
  url: 'http://speed.cloudflare.com/'
  interval: 300`;
}
