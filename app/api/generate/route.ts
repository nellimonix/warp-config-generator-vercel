import { NextResponse } from 'next/server';
import { generateWarpConfig, WarpGenerationError } from '@/lib/warp-service';
import type { GenerateRequest, ApiResponse, GenerateResult } from '@/types';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new Response(null, { headers: CORS });
}

export async function POST(req: Request) {
  const headers = { ...CORS, 'Content-Type': 'application/json' };

  try {
    const body = await req.json() as GenerateRequest;

    const result = await generateWarpConfig({
      selectedServices: normalizeServices(body),
      siteMode: body.siteMode || 'all',
      deviceType: body.deviceType || 'awg15',
      endpoint: body.endpoint || 'engage.cloudflareclient.com:4500',
      configFormat: body.configFormat || 'wireguard',
      dnsId: body.dnsId,
      ipv6: body.ipv6,
      excludeLan: body.excludeLan,
      persistentKeepalive: body.persistentKeepalive,
      customI1Domain: body.customI1Domain,
    });

    return json<ApiResponse<GenerateResult>>({ success: true, content: result }, 200, headers);

  } catch (err) {
    console.error('Generate API error:', err);

    const message = err instanceof WarpGenerationError
      ? `Ошибка генерации: ${err.message}`
      : err instanceof Error
        ? `Ошибка: ${err.message}`
        : 'Произошла неизвестная ошибка.';

    const status = err instanceof WarpGenerationError ? 400 : 500;

    return json<ApiResponse>({ success: false, message }, status, headers);
  }
}

function normalizeServices(body: GenerateRequest): string[] {
  if (body.siteMode === 'specific' && (!body.selectedServices || body.selectedServices.length === 0)) {
    return ['all'];
  }
  return body.selectedServices || [];
}

function json<T>(data: T, status: number, headers: Record<string, string>) {
  return NextResponse.json(data, { status, headers });
}
