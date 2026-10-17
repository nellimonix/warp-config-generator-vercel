import type { BuildParams } from '@/types';
import { MTU } from './shared';
import { awgInterfaceLines, normalizeAwgOptions } from '../awg';

const MASKING_DOMAINS = [
  'ozon.ru', 'apteka.ru', 'mail.ru', 'psbank.ru', 'lenta.ru',
  'www.pochta.ru', 'rzd.ru', 'rutube.ru', 'gosuslugi.ru',
];

function randomDomain(): string {
  return MASKING_DOMAINS[Math.floor(Math.random() * MASKING_DOMAINS.length)];
}

export function buildWiresock(p: BuildParams): string {
  const address = p.includeIPv6 ? `${p.clientIPv4}, ${p.clientIPv6}` : p.clientIPv4;
  const maskDomain = p.maskDomain?.trim() || randomDomain();

  const lines = [
    '[Interface]',
    `PrivateKey = ${p.privateKey}`,
    `Address = ${address}`,
    `DNS = ${p.dns}`,
    `MTU = ${p.mtu ?? MTU}`,
    ...awgInterfaceLines(p.awg ?? normalizeAwgOptions(), p.i1, maskDomain),
    '',
    '[Peer]',
    `PublicKey = ${p.publicKey}`,
    `AllowedIPs = ${p.allowedIPs}`,
    `Endpoint = ${p.endpoint}`,
  ];

  if (p.persistentKeepalive !== undefined) {
    lines.push(`PersistentKeepalive = ${p.persistentKeepalive}`);
  }

  return lines.join('\n');
}
