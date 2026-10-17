import type { Awg30Key, AwgJunkKey, AwgOptions, AwgProtocol, ResolvedAwgOptions } from '../types/config';

export const AWG_PROTOCOLS: { id: AwgProtocol; label: string }[] = [
  { id: 'awg10', label: 'AWG 1.0' },
  { id: 'awg20', label: 'AWG 2.0' },
  { id: 'awg30', label: 'AWG 3.0' },
  { id: 'awg31', label: 'AWG 3.1' },
];

export const AWG30_PARAMETERS: { key: Awg30Key; name: string; yaml: string; default: string }[] = [
  { key: 'contentPaddingAddition', name: 'ContentPaddingAddition', yaml: 'content-padding-addition', default: '27-97' },
  { key: 'rekeyAfterTime', name: 'RekeyAfterTime', yaml: 'rekey-after-time', default: '116-131' },
  { key: 'rekeyTimeout', name: 'RekeyTimeout', yaml: 'rekey-timeout', default: '6-9' },
  { key: 'rejectAfterTime', name: 'RejectAfterTime', yaml: 'reject-after-time', default: '171-196' },
  { key: 'keepaliveTimeout', name: 'KeepaliveTimeout', yaml: 'keepalive-timeout', default: '9-16' },
  { key: 'maxHandshakeAttempts', name: 'MaxHandshakeAttempts', yaml: 'max-handshake-attempts', default: '18-26' },
];

export const AWG_JUNK_PRESETS = {
  default: { jc: 4, jmin: 40, jmax: 70 },
  '30_10_30': { jc: 30, jmin: 10, jmax: 30 },
};

export function defaultAwgOptions(): AwgOptions {
  return { protocols: ['awg10', 'awg20'], junkPreset: 'default', junk: {}, ranges: {}, randomTrailers: true, disableCookies: true };
}

export function normalizeAwgOptions(input?: AwgOptions): ResolvedAwgOptions {
  const value = input ?? defaultAwgOptions();
  if (!value || typeof value !== 'object' || !Array.isArray(value.protocols)
    || value.protocols.some((id) => !AWG_PROTOCOLS.some((protocol) => protocol.id === id))) {
    throw new Error('Выберите допустимые версии AWG.');
  }
  const protocols = AWG_PROTOCOLS.filter(({ id }) => value.protocols.includes(id)).map(({ id }) => id);
  const preset = value.junkPreset ?? 'default';
  if (!Object.hasOwn(AWG_JUNK_PRESETS, preset)) throw new Error('Неизвестный пресет AWG 1.0.');
  const junk = { ...AWG_JUNK_PRESETS[preset] };
  if (protocols.includes('awg10')) {
    for (const key of Object.keys(junk) as AwgJunkKey[]) {
      const custom = value.junk?.[key];
      if (custom === undefined || custom === '') continue;
      if (!/^\d+$/.test(String(custom)) || !Number.isSafeInteger(Number(custom)) || Number(custom) > 2_147_483_647) {
        throw new Error(`${key}: введите целое число от 0 до 2147483647.`);
      }
      junk[key] = Number(custom);
    }
    if (junk.jmin > junk.jmax) throw new Error('Jmin не должен превышать Jmax.');
  }
  const ranges = {} as Record<Awg30Key, string>;
  for (const parameter of AWG30_PARAMETERS) {
    const raw = protocols.includes('awg30') ? value.ranges?.[parameter.key] : undefined;
    const range = raw === undefined || raw === '' ? parameter.default : raw;
    if (typeof range !== 'string' || !/^\d+-\d+$/.test(range)) {
      throw new Error(`${parameter.name}: введите диапазон, например ${parameter.default}.`);
    }
    const [min, max] = range.split('-').map(Number);
    if (min > max || max > 2_147_483_647) throw new Error(`${parameter.name}: диапазон должен возрастать и не превышать 2147483647.`);
    ranges[parameter.key] = `${min}-${max}`;
  }
  for (const key of ['randomTrailers', 'disableCookies'] as const) {
    if (value[key] !== undefined && typeof value[key] !== 'boolean') throw new Error('Неверное значение настройки AWG 3.1.');
  }
  const randomTrailers = protocols.includes('awg31') && (value.randomTrailers ?? true);
  const disableCookies = protocols.includes('awg31') && (value.disableCookies ?? true);
  return { protocols: protocols.filter((id) => id !== 'awg31' || randomTrailers || disableCookies), junkPreset: preset, junk, ranges, randomTrailers, disableCookies };
}

export function normalizeMtu(value?: number, ipv6 = true): number {
  const mtu = value ?? 1280;
  const minimum = ipv6 ? 1280 : 576;
  if (!Number.isInteger(mtu) || mtu < minimum || mtu > 9000) throw new Error(`MTU: введите целое число от ${minimum} до 9000.`);
  return mtu;
}

export function awgLabel(protocols: AwgProtocol[]): string {
  return protocols.length ? AWG_PROTOCOLS.filter(({ id }) => protocols.includes(id)).map(({ label }) => label.replace('AWG ', '')).join(' + ') : 'WireGuard';
}

export function awgInterfaceLines(awg: ResolvedAwgOptions, i1: string, wiresockDomain?: string): string[] {
  const selected = new Set(awg.protocols);
  const lines: string[] = [];
  if (selected.has('awg10')) lines.push('S1 = 0', 'S2 = 0', 'S3 = 0', 'S4 = 0', `Jc = ${awg.junk.jc}`, `Jmin = ${awg.junk.jmin}`, `Jmax = ${awg.junk.jmax}`, 'H1 = 1', 'H2 = 2', 'H3 = 3', 'H4 = 4');
  if (selected.has('awg20')) {
    if (wiresockDomain) lines.push(`Id = ${wiresockDomain}`, 'Ip = quic', 'Ib = firefox');
    else lines.push(i1);
  }
  if (selected.has('awg30')) lines.push(...AWG30_PARAMETERS.map(({ key, name }) => `${name} = ${awg.ranges[key]}`));
  if (selected.has('awg31')) {
    if (awg.randomTrailers) lines.push('RandomTrailers = on');
    if (awg.disableCookies) lines.push('DisableCookies = on');
  }
  return lines;
}

export function awgClashLines(awg: ResolvedAwgOptions, i1: string): string[] {
  const names: Record<string, string> = { RandomTrailers: 'random-trailers', DisableCookies: 'disable-cookies' };
  return awgInterfaceLines(awg, i1).map((line) => {
    const separator = line.indexOf(' = ');
    const name = line.slice(0, separator);
    const value = line.slice(separator + 3);
    const parameter = AWG30_PARAMETERS.find((item) => item.name === name);
    const key = parameter?.yaml ?? names[name] ?? name.toLowerCase();
    return `    ${key}: ${value === 'on' ? 'true' : value}`;
  });
}
