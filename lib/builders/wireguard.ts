import type { BuildParams } from '@/types';
import { DEVICE_PROFILES, MTU } from './shared';

export function buildWireguard(p: BuildParams): string {
  const prof = DEVICE_PROFILES[p.deviceType];
  const address = p.includeIPv6 ? `${p.clientIPv4}, ${p.clientIPv6}` : p.clientIPv4;

  const iface = [
    '[Interface]',
    `PrivateKey = ${p.privateKey}`,
    `Address = ${address}`,
    `DNS = ${p.dns}`,
    `MTU = ${MTU}`,
    'S1 = 0',
    'S2 = 0',
    `Jc = ${prof.jc}`,
    `Jmin = ${prof.jmin}`,
    `Jmax = ${prof.jmax}`,
    'H1 = 1',
    'H2 = 2',
    'H3 = 3',
    'H4 = 4',
  ];

  if (p.deviceType === 'awg15') iface.push(p.i1);

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
