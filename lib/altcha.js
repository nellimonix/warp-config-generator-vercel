import { createChallenge, randomInt, verifySolution } from 'altcha-lib';
import { deriveKey } from 'altcha-lib/algorithms/web/pbkdf2';

const CHALLENGE_TTL_MS = 2 * 60 * 1000;
const PBKDF2_COST = 5_000;
const MIN_COUNTER = 2_500;
const MAX_COUNTER = 5_000;
const MAX_PAYLOAD_LENGTH = 32_768;

export function getCaptchaSecret(env = {}) {
  return env.ALTCHA_HMAC_SECRET || env.HCAPTCHA_SECRET_KEY || '';
}

export async function createCaptchaChallenge(secret) {
  if (!secret) throw new Error('ALTCHA_HMAC_SECRET is not configured');

  return createChallenge({
    algorithm: 'PBKDF2/SHA-256',
    cost: PBKDF2_COST,
    counter: randomInt(MAX_COUNTER, MIN_COUNTER),
    deriveKey,
    expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS),
    hmacSignatureSecret: secret,
    hmacKeySignatureSecret: `${secret}:altcha-key`,
  });
}

export async function verifyCaptchaPayload(payload, secret) {
  if (!secret) return true;
  if (typeof payload !== 'string' || !payload || payload.length > MAX_PAYLOAD_LENGTH) return false;

  try {
    const decoded = JSON.parse(atob(payload));
    if (!decoded?.challenge || !decoded?.solution) return false;

    const result = await verifySolution({
      challenge: decoded.challenge,
      solution: decoded.solution,
      deriveKey,
      hmacSignatureSecret: secret,
      hmacKeySignatureSecret: `${secret}:altcha-key`,
    });

    return result.verified;
  } catch {
    return false;
  }
}
