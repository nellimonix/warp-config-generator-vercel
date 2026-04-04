import type { BuildParams } from '@/types';
import { parseEndpoint } from './shared';
import { reservedToBytes } from '../crypto';

export function buildKaring(p: BuildParams): string {
  const { server, port } = parseEndpoint(p.endpoint);

  return JSON.stringify({
    outbounds: [{
      tag: 'WARP',
      reserved: reservedToBytes(p.reserved),
      mtu: 1280,
      fake_packets: '5-10',
      fake_packets_size: '40-100',
      fake_packets_delay: '20-250',
      fake_packets_mode: 'm4',
      private_key: p.privateKey,
      type: 'wireguard',
      local_address: [`${p.clientIPv4}/32`, `${p.clientIPv6}/128`],
      peer_public_key: p.publicKey,
      server: server || 'engage.cloudflareclient.com',
      server_port: port,
    }],
  }, null, 2);
}
