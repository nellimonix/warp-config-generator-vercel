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

    // --- hCaptcha verification ---
    if (!body.captchaToken) {
      return json<ApiResponse>({ success: false, message: 'Капча не пройдена.' }, 400, headers);
    }

    const captchaOk = await verifyCaptcha(body.captchaToken);
    if (!captchaOk) {
      return json<ApiResponse>({ success: false, message: 'Неверная капча.' }, 400, headers);
    }

    // --- Generate config ---
    const result = await generateWarpConfig({
      selectedServices: normalizeServices(body),
      siteMode: body.siteMode || 'all',
      deviceType: body.deviceType || 'awg15',
      endpoint: body.endpoint || 'engage.cloudflareclient.com:4500',
      configFormat: body.configFormat || 'wireguard',
      captchaToken: body.captchaToken,
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

// --- Helpers ---

async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn('HCAPTCHA_SECRET_KEY not set, skipping verification');
    return true;
  }

  try {
    const res = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secret}&response=${token}`,
    });
    const data = await res.json() as { success: boolean };
    return data.success;
  } catch {
    return false;
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
