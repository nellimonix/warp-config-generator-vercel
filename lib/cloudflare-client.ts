import type { CloudflareRegisterResponse, CloudflareWarpResponse } from '@/types';

const BASE_URL = 'https://api.cloudflareclient.com/v0i1909051800';

const DEFAULT_HEADERS = {
  'User-Agent': 'okhttp/3.12.1',
  'Content-Type': 'application/json',
};

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
