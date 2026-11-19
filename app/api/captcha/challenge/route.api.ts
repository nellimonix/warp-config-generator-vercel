import { NextResponse } from 'next/server';
import { createCaptchaChallenge, getCaptchaSecret } from '@/lib/altcha';
import { withApiHeaders } from '@/lib/api-headers';

export { apiOptions as OPTIONS } from '@/lib/api-headers';

export const POST = withApiHeaders(async (_request, headers) => {
  const secret = getCaptchaSecret(process.env);
  if (!secret) return new Response(null, { status: 204, headers });

  const challenge = await createCaptchaChallenge(secret);
  return NextResponse.json(challenge, { headers });
});
