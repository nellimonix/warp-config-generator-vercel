import { NextResponse } from 'next/server';
import { createCaptchaChallenge, getCaptchaSecret } from '@/lib/altcha';

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};

export async function POST() {
  const secret = getCaptchaSecret(process.env);
  if (!secret) return new Response(null, { status: 204, headers: HEADERS });

  const challenge = await createCaptchaChallenge(secret);
  return NextResponse.json(challenge, { headers: HEADERS });
}

export async function OPTIONS() {
  return new Response(null, { headers: HEADERS });
}
