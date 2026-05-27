/**
 * Faithful port of the reference quic.js (warp-generator.github.io).
 *
 * Builds a QUIC Initial packet carrying a TLS ClientHello (SNI only) and
 * returns it as the AmneziaWG `I1 = <b 0x...>` masking parameter, so the I1
 * mimics a QUIC handshake to the given domain.
 *
 * Difference from the browser original: `window.crypto` → `globalThis.crypto`
 * (Web Crypto is available in Node 20+ on Vercel and in Cloudflare Workers;
 * AES-GCM, AES-CBC, HMAC-SHA256 and getRandomValues are all supported), and
 * the `dataOffset` global is made a local. The algorithm is otherwise identical.
 */

// BufferSource (ArrayBuffer | ArrayBufferView) — matches what Web Crypto accepts,
// so values flow into subtle.sign/encrypt without per-call casts.
type Bytes = BufferSource;

let quicHmacKey: CryptoKey | null = null;

function quicStr8(data: string | Bytes | null): ArrayBuffer {
  if (!data) return new ArrayBuffer(1);
  const input = typeof data === 'string' ? new TextEncoder().encode(data) : quicU8a(data);
  const result = new Uint8Array(input.byteLength + 1);
  const view = new DataView(result.buffer);
  view.setUint8(0, input.byteLength);
  result.set(input, 1);
  return result.buffer;
}

function quicStr16(data: string | Bytes | null): ArrayBuffer {
  if (!data) return new ArrayBuffer(2);
  const input = typeof data === 'string' ? new TextEncoder().encode(data) : quicU8a(data);
  const result = new Uint8Array(input.byteLength + 2);
  const view = new DataView(result.buffer);
  view.setUint16(0, input.byteLength, false);
  result.set(input, 2);
  return result.buffer;
}

function quicVarint(x: number): ArrayBuffer {
  let result: Uint8Array<ArrayBuffer>;
  if (x < 0x40) {
    return new Uint8Array([x]).buffer;
  } else if (x < 0x4000) {
    result = new Uint8Array(2);
    new DataView(result.buffer).setUint16(0, x, false);
    result[0] = result[0] | 0x40;
  } else if (x < 0x40000000) {
    result = new Uint8Array(4);
    new DataView(result.buffer).setUint32(0, x, false);
    result[0] = result[0] | 0x80;
  } else {
    result = new Uint8Array(8);
    new DataView(result.buffer).setBigUint64(0, BigInt(x), false);
    result[0] = result[0] | 0xc0;
  }
  return result.buffer;
}

function quicVarintLength(x: number): number {
  if (x < 0x40) {
    return 1;
  } else if (x < 0x4000) {
    return 2;
  } else if (x < 0x40000000) {
    return 4;
  } else {
    return 8;
  }
}

function quicU8a(buffer: Bytes): Uint8Array {
  if (buffer instanceof Uint8Array) {
    return buffer;
  }
  // All call sites pass ArrayBuffer or Uint8Array (never another view).
  return new Uint8Array(buffer as ArrayBuffer);
}

function quicToHex(buffer: Bytes): string {
  const arr = quicU8a(buffer);
  return [...arr].map((x) => x.toString(16).padStart(2, '0')).join('');
}

function quicConcatBuffers(buffers: Bytes[], allocateBefore = 0, allocateAfter = 0): ArrayBuffer {
  const buffersU8a = buffers.map((buffer) => quicU8a(buffer));
  const totalLength = buffersU8a.reduce((a, buffer) => a + buffer.byteLength, allocateBefore + allocateAfter);
  const result = new Uint8Array(totalLength);
  let offset = allocateBefore;
  for (const buffer of buffersU8a) {
    result.set(buffer, offset);
    offset += buffer.byteLength;
  }
  return result.buffer;
}

function quicXorBuffer(dst: Bytes, src: Bytes, dstOffset: number, srcOffset: number, length: number): void {
  const dstU = quicU8a(dst);
  const srcU = quicU8a(src);
  for (let i = 0; i < length; i++) {
    dstU[dstOffset + i] ^= srcU[srcOffset + i];
  }
}

async function quicHmac(key: CryptoKey | ArrayBuffer, buffer: BufferSource): Promise<ArrayBuffer> {
  const cryptoKey =
    key instanceof CryptoKey
      ? key
      : await globalThis.crypto.subtle.importKey('raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return globalThis.crypto.subtle.sign('HMAC', cryptoKey, buffer);
}

async function quicInitHmacKey(): Promise<void> {
  const quicSalt = new Uint8Array([
    0x38, 0x76, 0x2c, 0xf7, 0xf5, 0x59, 0x34, 0xb3, 0x4d, 0x17,
    0x9a, 0xe6, 0xa4, 0xc8, 0x0c, 0xad, 0xcc, 0xbb, 0x7f, 0x0a,
  ]);
  quicHmacKey = await globalThis.crypto.subtle.importKey('raw', quicSalt, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
}

async function quicDeriveSecret(key: CryptoKey | ArrayBuffer, length: number, label: string, context = ''): Promise<ArrayBuffer> {
  const dataBuffer = quicConcatBuffers([quicStr8('tls13 ' + label), quicStr8(context), new Uint8Array([0x01])], 2);
  const view = new DataView(dataBuffer);
  // note: length here is not buffer length, but external one
  view.setUint16(0, length, false);
  const hmac = await quicHmac(key, dataBuffer);
  return hmac.slice(0, length);
}

async function quicEncryptPayload(key: CryptoKey | ArrayBuffer, payload: BufferSource, iv: BufferSource, aad: BufferSource): Promise<ArrayBuffer> {
  const cryptoKey =
    key instanceof CryptoKey ? key : await globalThis.crypto.subtle.importKey('raw', key, { name: 'AES-GCM', length: 128 }, false, ['encrypt']);
  return globalThis.crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: aad, tagLength: 128 }, cryptoKey, payload);
}

async function quicDeriveHpMask(key: CryptoKey | ArrayBuffer, sample: BufferSource): Promise<ArrayBuffer> {
  // ECB is not implemented in Subtle, so we just use single block with zero IV
  const cryptoKey =
    key instanceof CryptoKey ? key : await globalThis.crypto.subtle.importKey('raw', key, { name: 'AES-CBC', length: 128 }, false, ['encrypt']);
  return globalThis.crypto.subtle.encrypt({ name: 'AES-CBC', iv: new ArrayBuffer(16) }, cryptoKey, sample);
}

interface QuicLengths {
  total: number;
  header: number;
  padding: number;
}

function quicMeasureLengths(
  dcidLength: number,
  scidLength: number,
  tokenLength: number,
  pknLength: number,
  payloadLength: number,
  padto = 0,
): QuicLengths {
  const baseHeaderLength = 8 + dcidLength + scidLength + tokenLength + pknLength;
  const tagLength = 16;
  let paddingLength = 0;

  const getLengthByteSize = () => quicVarintLength(pknLength + payloadLength + paddingLength + tagLength);
  const getOverallLength = () => baseHeaderLength + getLengthByteSize() + payloadLength + paddingLength + tagLength;

  let overallLength = getOverallLength();
  if (overallLength < padto) {
    paddingLength = padto - overallLength;
    // Adjust padding down if it's too big due to length byte got bigger
    while (paddingLength && getOverallLength() > padto) {
      paddingLength--;
    }
    // But it can accidentaly underflow, just nudge 1 step back
    if (getOverallLength() < padto) {
      paddingLength++;
    }
    overallLength = getOverallLength();
  }
  // extra safety (tail starting from pkn must be at least 20 bytes for hp key derivation)
  if (pknLength + payloadLength + paddingLength + tagLength < 20) {
    paddingLength = 20 - pknLength - payloadLength - tagLength;
    overallLength = getOverallLength();
  }
  const headerLength = baseHeaderLength + getLengthByteSize();

  return { total: overallLength, header: headerLength, padding: paddingLength };
}

async function quicInitial(dcid: Bytes, scid: Bytes, token: Bytes, pkn: Uint8Array<ArrayBuffer>, payload: ArrayBuffer, padto: number): Promise<ArrayBuffer> {
  const lengths = quicMeasureLengths(dcid.byteLength, scid.byteLength, token.byteLength, pkn.byteLength, payload.byteLength, padto);
  // Create header buffer
  const header = quicConcatBuffers([
    new Uint8Array([0xc0 | (pkn.byteLength - 1), 0, 0, 0, 1]),
    quicStr8(dcid),
    quicStr8(scid),
    quicStr8(token),
    quicVarint(pkn.byteLength + payload.byteLength + lengths.padding + 16),
    pkn,
  ]);
  // Derive keys
  if (!quicHmacKey) await quicInitHmacKey();
  const initSecret = await quicHmac(quicHmacKey as CryptoKey, dcid);
  const clientSecret = await quicDeriveSecret(initSecret, 32, 'client in');
  const quicKey = await quicDeriveSecret(clientSecret, 16, 'quic key');
  const quicIv = await quicDeriveSecret(clientSecret, 12, 'quic iv');
  const quicHp = await quicDeriveSecret(clientSecret, 16, 'quic hp');
  // Xor nonce with PKN
  quicXorBuffer(quicIv, pkn, 12 - pkn.byteLength, 0, pkn.byteLength);
  // Create padded payload buffer and encrypt it
  const paddedPayload = quicConcatBuffers([payload], 0, lengths.padding);
  const encryptedPayload = await quicEncryptPayload(quicKey, paddedPayload, quicIv, header);
  // Header Protection
  const mask = new Uint8Array(await quicDeriveHpMask(quicHp, encryptedPayload.slice(4 - pkn.byteLength, 20 - pkn.byteLength)));
  mask[0] &= 0x0f;
  quicXorBuffer(header, mask, 0, 0, 1);
  quicXorBuffer(header, mask, header.byteLength - pkn.byteLength, 1, pkn.byteLength);
  // Generate resulting buffer
  return quicConcatBuffers([header, encryptedPayload]);
}

function quicCryptoFrame(data: ArrayBuffer, offset = 0): ArrayBuffer {
  return quicConcatBuffers([new Uint8Array([0x06]), quicVarint(offset), quicVarint(data.byteLength), data]);
}

function quicTlsExt(code: number, content: ArrayBuffer): ArrayBuffer {
  const length = content.byteLength;
  const result = quicConcatBuffers([content], 4);
  const view = new DataView(result);
  view.setUint16(0, code, false);
  view.setUint16(2, length, false);
  return result;
}

function quicTlsExtSni(sni: string): ArrayBuffer {
  const sniBuffer = quicStr16(sni);
  const extBuffer = quicConcatBuffers([sniBuffer], 3);
  const view = new DataView(extBuffer);
  view.setUint16(0, sniBuffer.byteLength + 1, false);
  view.setUint8(2, 0);
  return quicTlsExt(0, extBuffer);
}

function quicTlsClientHelloSniOnly(sni: string, predefinedRandom: ArrayBuffer | null = null): ArrayBuffer {
  const randomBytes = new Uint8Array(predefinedRandom ?? new ArrayBuffer(32));
  if (!predefinedRandom) globalThis.crypto.getRandomValues(randomBytes);
  const payload = quicConcatBuffers(
    [new Uint8Array([0x03, 0x03]), randomBytes, new Uint8Array([0, 0, 0, 0]), quicStr16(quicTlsExtSni(sni))],
    4,
  );
  const view = new DataView(payload);
  view.setUint32(0, payload.byteLength - 4, false);
  view.setUint8(0, 0x01);
  return payload;
}

type CutPreset = [number, number, number, number, number, boolean];

function quicTlsClientHelloToFrames(clientHello: ArrayBuffer, level = 0): [ArrayBuffer, number[]] {
  let payload: ArrayBuffer;
  let cutSettings: number[];
  if (!level) {
    // legacy cut (no reorder, cut in the middle)
    payload = quicCryptoFrame(clientHello);
    const dataOffset = payload.byteLength - clientHello.byteLength;
    cutSettings = [dataOffset + 6, 32, clientHello.byteLength - 38, 16];
  } else {
    const cutPresets: Record<number, CutPreset> = {
      1: [38, Infinity, 0, 38, 32, false],
      2: [38, Infinity, 0, 38, 37, false],
      3: [0, 1, 38, Infinity, 0, false],
      4: [0, 1, 38, Infinity, 0, true],
    };
    // eslint-disable-next-line prefer-const
    let [p1s, p1e, p2s, p2e, dropTail, skipZeroes] = cutPresets[level];
    if (skipZeroes) {
      const h8u = new Uint8Array(clientHello);
      while (h8u[p2s] === 0) p2s++;
    }
    payload = quicConcatBuffers([
      quicCryptoFrame(clientHello.slice(p1s, p1e), p1s),
      quicCryptoFrame(clientHello.slice(p2s, p2e), p2s),
    ]);
    cutSettings = [payload.byteLength - dropTail, 16 + dropTail];
  }
  return [payload, cutSettings];
}

function quicFixCutSettings(cutSettings: number[], packetLength: number, pknLength: number, payloadLength: number): void {
  // fix first chunk if too short for header protection
  if (cutSettings[0] < 20 - pknLength) {
    const toAdd = 20 - pknLength - cutSettings[0];
    cutSettings[0] += toAdd;
    cutSettings[1] -= toAdd;
  }
  // include header to first chunk (!fragile code, assumes padto is zero)
  cutSettings[0] += packetLength - payloadLength - 16;
}

/**
 * Generates the AmneziaWG `I1 = <b 0x...>` parameter for the given SNI domain.
 * Mirrors the reference generateQuicMask() (level 4, full packet hex).
 */
export async function generateI1Line(domain: string): Promise<string> {
  const sni = domain.trim();
  const level = 4;
  const dcid = new Uint8Array(1);
  globalThis.crypto.getRandomValues(dcid);
  const scid = new Uint8Array(0);
  const token = new Uint8Array(0);
  const pkn = new Uint8Array([0]);

  const clientHello = quicTlsClientHelloSniOnly(sni);
  const [payload, cutSettings] = quicTlsClientHelloToFrames(clientHello, level);
  const packet = await quicInitial(dcid, scid, token, pkn, payload, 0);
  quicFixCutSettings(cutSettings, packet.byteLength, pkn.byteLength, payload.byteLength);

  return `I1 = <b 0x${quicToHex(packet)}>`;
}
