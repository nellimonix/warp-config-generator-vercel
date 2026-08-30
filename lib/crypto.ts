import nacl from 'tweetnacl';
import { Buffer } from 'buffer';
import type { KeyPair } from '@/types';

export function generateKeyPair(): KeyPair {
  const kp = nacl.box.keyPair();
  return {
    privateKey: Buffer.from(kp.secretKey).toString('base64'),
    publicKey: Buffer.from(kp.publicKey).toString('base64'),
  };
}

export async function generateMasqueKeyPair(): Promise<KeyPair> {
  const pair = await crypto.subtle.generateKey(
    { name: 'ECDSA', namedCurve: 'P-256' },
    true,
    ['sign', 'verify'],
  ) as CryptoKeyPair;
  const [jwk, spki] = await Promise.all([
    crypto.subtle.exportKey('jwk', pair.privateKey),
    crypto.subtle.exportKey('spki', pair.publicKey),
  ]);

  if (!jwk.d || !jwk.x || !jwk.y) {
    throw new Error('Failed to export MASQUE key pair');
  }

  const privateKey = buildSec1PrivateKey(
    decodeBase64Url(jwk.d),
    decodeBase64Url(jwk.x),
    decodeBase64Url(jwk.y),
  );

  return {
    privateKey: Buffer.from(privateKey).toString('base64'),
    publicKey: Buffer.from(spki).toString('base64'),
  };
}

function decodeBase64Url(value: string): Uint8Array {
  return new Uint8Array(Buffer.from(value.replace(/-/g, '+').replace(/_/g, '/'), 'base64'));
}

function buildSec1PrivateKey(d: Uint8Array, x: Uint8Array, y: Uint8Array): Uint8Array {
  const oidPrime256v1 = new Uint8Array([0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07]);
  const publicPoint = concatBytes(new Uint8Array([0x04]), x, y);
  return der(0x30, concatBytes(
    new Uint8Array([0x02, 0x01, 0x01]),
    der(0x04, d),
    der(0xa0, oidPrime256v1),
    der(0xa1, der(0x03, concatBytes(new Uint8Array([0x00]), publicPoint))),
  ));
}

function der(tag: number, content: Uint8Array): Uint8Array {
  if (content.length >= 128) throw new Error('Unsupported DER length');
  return concatBytes(new Uint8Array([tag, content.length]), content);
}

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const output = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

export function toBase64(str: string): string {
  return Buffer.from(str).toString('base64');
}

export function fromBase64(b64: string): string {
  return Buffer.from(b64, 'base64').toString('utf8');
}

export function reservedToBytes(reserved: string): number[] {
  if (!reserved) return [0, 0, 0];
  try {
    return Array.from(Buffer.from(reserved, 'base64'));
  } catch {
    return [0, 0, 0];
  }
}

export function reservedToDashed(reserved: string): string {
  return reservedToBytes(reserved).join('-');
}

export function reservedToCommaSeparated(reserved: string): string {
  return reservedToBytes(reserved).join(', ');
}
