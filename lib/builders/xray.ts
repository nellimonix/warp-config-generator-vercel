import type { BuildParams } from '../../types/config';
import { reservedToBytes } from '../crypto';

export function buildXray(p: BuildParams): string {
  const addresses = [p.clientIPv4, ...(p.includeIPv6 ? [p.clientIPv6] : [])]
    .map((ip) => ip.includes('/') ? ip : `${ip}/${ip.includes(':') ? 128 : 32}`);
  const dns = p.dns.split(',').map((ip) => ip.trim()).filter(Boolean);
  const packet = p.i1.match(/<b 0x([\da-f]+)>/i)?.[1];
  if (!packet || packet.length % 2) throw new Error('Неверный формат QUIC-маски Xray.');
  const allowedIPs = ['0.0.0.0/0', ...(p.includeIPv6 ? ['::/0'] : [])];
  return JSON.stringify({
    log: { loglevel: 'warning' },
    dns: { servers: dns },
    inbounds: [
      { tag: 'socks-in', listen: '127.0.0.1', port: 10808, protocol: 'socks', settings: { auth: 'noauth', udp: true }, sniffing: { enabled: true, destOverride: ['http', 'tls'] } },
      { tag: 'http-in', listen: '127.0.0.1', port: 10809, protocol: 'http', settings: {}, sniffing: { enabled: true, destOverride: ['http', 'tls'] } },
    ],
    outbounds: [
      { tag: 'warp', protocol: 'wireguard', settings: {
        secretKey: p.privateKey, address: addresses, mtu: p.mtu ?? 1280,
        reserved: reservedToBytes(p.reserved), remoteDNS: dns,
        peers: [{ endpoint: p.endpoint, publicKey: p.publicKey, allowedIPs,
          ...(p.persistentKeepalive !== undefined ? { keepAlive: p.persistentKeepalive } : {}),
        }],
      }, streamSettings: { sockopt: { dialerProxy: 'noise-out' } } },
      { tag: 'noise-out', protocol: 'freedom', settings: {
        noises: [{ type: 'hex', packet, delay: '1-2' }, ...Array.from({ length: 8 }, () => ({ type: 'rand', packet: '23-911', delay: '1-3' }))],
      } },
      { tag: 'direct', protocol: 'freedom', settings: {} },
    ],
    routing: { domainStrategy: 'IPIfNonMatch', rules: [
      { type: 'field', port: '53', outboundTag: 'direct' },
      { type: 'field', network: 'tcp,udp', outboundTag: 'warp' },
    ] },
  }, null, 2);
}
