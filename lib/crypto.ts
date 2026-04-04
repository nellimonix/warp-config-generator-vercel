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
