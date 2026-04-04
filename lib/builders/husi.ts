import type { BuildParams } from '@/types';
import { parseEndpoint } from './shared';
import { reservedToCommaSeparated } from '../crypto';

export function buildHusi(p: BuildParams): string {
  const { server, port } = parseEndpoint(p.endpoint);

  return JSON.stringify({
    type: 'wireguard',
    tag: 'proxy',
    mtu: 1280,
    address: [`${p.clientIPv4}/32`, `${p.clientIPv6}/128`],
    private_key: p.privateKey,
    listen_port: 0,
    peers: [{
      address: server,
      port,
      public_key: p.publicKey,
      pre_shared_key: '',
      allowed_ips: p.allowedIPs.split(', '),
      persistent_keepalive_interval: 600,
      reserved: reservedToCommaSeparated(p.reserved),
    }],
    detour: 'direct',
  }, null, 2);
}
