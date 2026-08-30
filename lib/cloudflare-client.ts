import type { CloudflareRegisterResponse, CloudflareWarpResponse } from '@/types';
import { Buffer } from 'buffer';

const BASE_URL = 'https://api.cloudflareclient.com/v0i1909051800';
const MASQUE_BASE_URL = 'https://api.cloudflareclient.com/v0a4471';

const DEFAULT_HEADERS = {
  'User-Agent': 'okhttp/3.12.1',
  'Content-Type': 'application/json',
};

const MASQUE_HEADERS = {
  'User-Agent': 'WARP for Android',
  'CF-Client-Version': 'a-6.35-4471',
  'Content-Type': 'application/json; charset=UTF-8',
};

export interface MasqueRegistration {
  clientIPv4: string;
  clientIPv6: string;
  publicKey: string;
}

export async function registerClient(
  publicKey: string
): Promise<{ id: string; token: string }> {
  const body = {
    install_id: '',
    tos: new Date().toISOString(),
    key: publicKey,
    fcm_token: '',
    type: 'ios',
    locale: 'en_US',
  };

  const res = await fetch(`${BASE_URL}/reg`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Registration failed: HTTP ${res.status}`);

  const data = (await res.json()) as CloudflareRegisterResponse;

  if (!data.result?.id || !data.result?.token) {
    throw new Error('Invalid registration response');
  }

  return { id: data.result.id, token: data.result.token };
}

export async function enableWarp(
  clientId: string,
  token: string
): Promise<CloudflareWarpResponse> {
  const res = await fetch(`${BASE_URL}/reg/${clientId}`, {
    method: 'PATCH',
    headers: { ...DEFAULT_HEADERS, Authorization: `Bearer ${token}` },
    body: JSON.stringify({ warp_enabled: true }),
  });

  if (!res.ok) throw new Error(`Enable WARP failed: HTTP ${res.status}`);

  const data = (await res.json()) as CloudflareWarpResponse;

  if (!data.result?.config?.peers?.[0] || !data.result?.config?.interface) {
    throw new Error('Invalid WARP config response');
  }

  return data;
}

export async function registerMasqueClient(publicKey: string): Promise<MasqueRegistration> {
  const initial = await masqueRequest('reg', 'POST', undefined, {
    key: randomBase64(32),
    install_id: '',
    fcm_token: '',
    os_version: '',
    tos: new Date().toISOString(),
    model: 'PC',
    serial_number: randomHex(8),
    key_type: 'curve25519',
    tunnel_type: 'wireguard',
    locale: 'en_US',
  });

  if (!initial.id || !initial.token) {
    throw new Error('Invalid MASQUE registration response');
  }

  const enrolled = await masqueRequest(`reg/${initial.id}`, 'PATCH', initial.token, {
    key: publicKey,
    key_type: 'secp256r1',
    tunnel_type: 'masque',
    name: 'warp-site',
  });
  const config = enrolled.config || (await masqueRequest(`reg/${initial.id}`, 'GET', initial.token)).config;
  const peer = config?.peers?.[0];
  const addresses = config?.interface?.addresses;

  if (!peer?.public_key || !addresses?.v4) {
    throw new Error('Invalid MASQUE configuration response');
  }

  return {
    clientIPv4: stripMask(addresses.v4),
    clientIPv6: stripMask(addresses.v6 || ''),
    publicKey: stripPem(peer.public_key),
  };
}

async function masqueRequest(
  path: string,
  method: 'GET' | 'POST' | 'PATCH',
  token?: string,
  body?: Record<string, unknown>,
): Promise<any> {
  const res = await fetch(`${MASQUE_BASE_URL}/${path}`, {
    method,
    headers: token ? { ...MASQUE_HEADERS, Authorization: `Bearer ${token}` } : MASQUE_HEADERS,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`MASQUE registration failed: HTTP ${res.status}`);
  const data = await res.json();
  return data.result || data;
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function randomBase64(length: number): string {
  return Buffer.from(randomBytes(length)).toString('base64');
}

function randomHex(length: number): string {
  return Buffer.from(randomBytes(length)).toString('hex');
}

function stripMask(address: string): string {
  return address.split('/', 1)[0];
}

function stripPem(value: string): string {
  return value.split(/\r?\n/).filter((line) => line && !line.startsWith('-----')).join('');
}
