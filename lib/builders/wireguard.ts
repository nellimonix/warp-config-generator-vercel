import type { BuildParams } from '@/types';
import { MTU } from './shared';
import { awgInterfaceLines, normalizeAwgOptions } from '../awg';

export function buildWireguard(p: BuildParams): string {
  const awg = p.awg ?? normalizeAwgOptions();
  const address = p.includeIPv6 ? `${p.clientIPv4}, ${p.clientIPv6}` : p.clientIPv4;

  const iface = [
    '[Interface]',
    `PrivateKey = ${p.privateKey}`,
    `Address = ${address}`,
    `DNS = ${p.dns}`,
    `MTU = ${p.mtu ?? MTU}`,
    ...awgInterfaceLines(awg, p.i1),
  ];

  const peer = [
    '[Peer]',
    `PublicKey = ${p.publicKey}`,
    `AllowedIPs = ${p.allowedIPs}`,
    `Endpoint = ${p.endpoint}`,
  ];

  if (p.persistentKeepalive !== undefined) {
    peer.push(`PersistentKeepalive = ${p.persistentKeepalive}`);
  }

  return iface.join('\n') + '\n\n' + peer.join('\n');
}

export function buildWireguardForQR(p: BuildParams): string {
  return buildWireguard(p).replace(/^MTU = \d+\n?/gm, '');
}
