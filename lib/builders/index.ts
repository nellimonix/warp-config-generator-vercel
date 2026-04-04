import type { ConfigFormat, BuildParams } from '@/types';
import { buildWireguard, buildWireguardForQR } from './wireguard';
import { buildThrone } from './throne';
import { buildClash } from './clash';
import { buildNekoray } from './nekoray';
import { buildHusi } from './husi';
import { buildKaring } from './karing';
import { buildWiresock } from './wiresock';

const BUILDERS: Record<ConfigFormat, (p: BuildParams) => string> = {
  wireguard: buildWireguard,
  throne: buildThrone,
  clash: buildClash,
  nekoray: buildNekoray,
  husi: buildHusi,
  karing: buildKaring,
  wiresock: buildWiresock,
};

export function buildConfig(format: ConfigFormat, params: BuildParams): string {
  const builder = BUILDERS[format];
  if (!builder) throw new Error(`No builder for format: ${format}`);
  return builder(params);
}

export function buildConfigForQR(format: ConfigFormat, params: BuildParams): string {
  if (format === 'throne') return buildThrone(params);
  if (format === 'wireguard') return buildWireguardForQR(params);
  if (format === 'wiresock') return buildWiresock(params).replace(/^MTU = \d+\n?/gm, '');
  return buildConfig(format, params);
}
