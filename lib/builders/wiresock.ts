import type { BuildParams } from '@/types';
import { DEVICE_PROFILES, MTU, formatDNS } from './shared';

const MASKING_DOMAINS = [
  'ozon.ru', 'apteka.ru', 'mail.ru', 'psbank.ru', 'lenta.ru',
  'www.pochta.ru', 'rzd.ru', 'rutube.ru', 'gosuslugi.ru',
];

function randomDomain(): string {
  return MASKING_DOMAINS[Math.floor(Math.random() * MASKING_DOMAINS.length)];
}

export function buildWiresock(p: BuildParams): string {
  const prof = DEVICE_PROFILES[p.deviceType];

  const lines = [
    '[Interface]',
    `PrivateKey = ${p.privateKey}`,
    `Address = ${p.clientIPv4}, ${p.clientIPv6}`,
    `DNS = ${formatDNS()}`,
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
    '# Protocol masking',
    `Id = ${randomDomain()}`,
    'Ip = quic',
    'Ib = firefox',
    '',
    '[Peer]',
    `PublicKey = ${p.publicKey}`,
    `AllowedIPs = ${p.allowedIPs}`,
    `Endpoint = ${p.endpoint}`,
  ];

  return lines.join('\n');
}
