import type { BuildParams } from '@/types';
import { parseEndpoint } from './shared';
import { reservedToBytes } from '../crypto';

export function buildNekoray(p: BuildParams): string {
  const { server, port } = parseEndpoint(p.endpoint);

  return JSON.stringify({
    mtu: 1280,
    reserved: reservedToBytes(p.reserved),
    private_key: p.privateKey,
    type: 'wireguard',
    local_address: [`${p.clientIPv4}/32`, `${p.clientIPv6}/128`],
    peer_public_key: p.publicKey,
    server,
    server_port: port,
  }, null, 2);
}
