const WG_ENDPOINT_HOSTS = [
  'engage.cloudflareclient.com',
  '162.159.192', '162.159.195',
  '8.6.112', '8.34.70', '8.34.146', '8.35.211',
  '8.39.125', '8.39.204', '8.39.214', '8.47.69',
  '188.114.96', '188.114.97', '188.114.98',
];

const WG_ENDPOINT_PORTS = [
  500, 854, 859, 864, 878, 880, 890, 891, 894, 903, 908, 928, 934, 939, 942,
  943, 945, 946, 955, 968, 987, 988, 1002, 1010, 1014, 1018, 1070, 1074, 1180,
  1387, 1701, 1843, 2371, 2408, 2506, 3138, 3476, 3581, 3854, 4177, 4198, 4233,
  4500, 5279, 5956, 7103, 7152, 7156, 7281, 7559, 8319, 8742, 8854, 8886,
];

const MASQUE_ENDPOINT_PREFIXES = ['162.159.198', '162.159.199'];
const MASQUE_ENDPOINT_PORTS = [443, 500, 1701, 4500, 4443, 8443, 8095];

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function generateRandomWireGuardEndpoint(): string {
  const base = pick(WG_ENDPOINT_HOSTS);
  const host = /^\d/.test(base) ? `${base}.${Math.floor(Math.random() * 256)}` : base;
  return `${host}:${pick(WG_ENDPOINT_PORTS)}`;
}

export function generateRandomMasqueEndpoint(): { server: string; port: number } {
  return {
    server: `${pick(MASQUE_ENDPOINT_PREFIXES)}.${Math.floor(Math.random() * 256)}`,
    port: pick(MASQUE_ENDPOINT_PORTS),
  };
}
