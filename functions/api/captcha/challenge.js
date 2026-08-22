import { createCaptchaChallenge, getCaptchaSecret } from '../../../lib/altcha.js';

const HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json',
};

export async function onRequestPost({ env }) {
  const secret = getCaptchaSecret(env);
  if (!secret) return new Response(null, { status: 204, headers: HEADERS });

  const challenge = await createCaptchaChallenge(secret);
  return new Response(JSON.stringify(challenge), { headers: HEADERS });
}

export async function onRequestOptions() {
  return new Response(null, { headers: HEADERS });
}
