import type { ConfigFormat, DeviceType, BuildParams } from '@/types';
import type { GenerateRequest, GenerateResult, CloudflareWarpResponse } from '@/types';
import { generateKeyPair, toBase64 } from './crypto';
import { registerClient, enableWarp } from './cloudflare-client';
import { resolveAllowedIPs } from '@/config/services-loader';
import { buildDnsLine, isCommunityDns, DEFAULT_DNS_ID } from '@/config/dns';
import { buildConfig, buildConfigForQR } from './builders';
import { pickI1 } from './builders/shared';
import { generateI1Line } from './quic';
import { generateQR, unsupportedQR } from './qr-generator';
import { getFileName, getFormatInfo, supportsQR } from '@/config/formats';

export class WarpGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WarpGenerationError';
  }
}

export async function generateWarpConfig(req: GenerateRequest): Promise<GenerateResult> {
  try {
    validate(req);

    // Community DNS forbids split tunneling: force "all sites", drop services.
    const effectiveReq: GenerateRequest = isCommunityDns(req.dnsId ?? DEFAULT_DNS_ID)
      ? { ...req, siteMode: 'all', selectedServices: [] }
      : req;

    const format = effectiveReq.configFormat;

    // 1. Generate keys
    const keyPair = generateKeyPair();

    // 2. Register with Cloudflare
    const { id: clientId, token } = await registerClient(keyPair.publicKey);

    // 3. Enable WARP
    const warpResponse = await enableWarp(clientId, token);

    // 4. Extract params
    const params = await extractBuildParams(warpResponse, keyPair, effectiveReq);

    // 5. Build config text
    const configText = buildConfig(format, params);

    // 6. Generate QR
    let qrCodeBase64: string;
    if (supportsQR(format)) {
      const qrText = buildConfigForQR(format, params);
      qrCodeBase64 = await generateQR(qrText);
    } else {
      const info = getFormatInfo(format);
      qrCodeBase64 = unsupportedQR(info.name);
    }

    // 7. File name
    const fileName = getFileName(format);

    return {
      configBase64: toBase64(configText),
      qrCodeBase64,
      configFormat: format,
      fileName,
    };
  } catch (err) {
    if (err instanceof WarpGenerationError) throw err;
    const msg = err instanceof Error ? err.message : 'Unknown error';
    throw new WarpGenerationError(msg);
  }
}

function validate(req: GenerateRequest): void {
  if (!['all', 'specific'].includes(req.siteMode)) {
    throw new WarpGenerationError(`Invalid siteMode: ${req.siteMode}`);
  }
  if (!['phone', 'awg15'].includes(req.deviceType)) {
    throw new WarpGenerationError(`Invalid deviceType: ${req.deviceType}`);
  }
  if (!req.endpoint?.trim()) {
    throw new WarpGenerationError('Endpoint is required');
  }
  const validFormats: ConfigFormat[] = ['wireguard', 'throne', 'clash', 'nekoray', 'husi', 'karing', 'wiresock'];
  if (!validFormats.includes(req.configFormat)) {
    throw new WarpGenerationError(`Unsupported format: ${req.configFormat}`);
  }
}

async function extractBuildParams(
  warpRes: CloudflareWarpResponse,
  keyPair: { privateKey: string; publicKey: string },
  req: GenerateRequest
): Promise<BuildParams> {
  const peer = warpRes.result.config.peers[0];
  const iface = warpRes.result.config.interface;

  const ipv6 = req.ipv6 ?? true;
  const dnsId = req.dnsId ?? DEFAULT_DNS_ID;
  const domain = sanitizeDomain(req.customI1Domain);
  const i1 = domain ? await generateI1Line(domain) : pickI1();
  const keepalive = normalizeKeepalive(req.persistentKeepalive);

  return {
    privateKey: keyPair.privateKey,
    publicKey: peer.public_key,
    clientIPv4: iface.addresses.v4,
    clientIPv6: iface.addresses.v6,
    allowedIPs: resolveAllowedIPs(req.selectedServices, req.siteMode, { excludeLan: req.excludeLan, ipv6 }),
    endpoint: req.endpoint,
    deviceType: req.deviceType,
    reserved: warpRes.result.config.client_id || '',
    dns: buildDnsLine(dnsId, ipv6),
    includeIPv6: ipv6,
    persistentKeepalive: keepalive,
    i1,
    maskDomain: domain,
  };
}

/** Returns a clean SNI domain, or undefined when empty/invalid. */
function sanitizeDomain(raw?: string): string | undefined {
  const d = raw?.trim();
  if (!d) return undefined;
  if (d.length > 253 || /\s/.test(d)) return undefined;
  return d;
}

/** Returns a positive integer keepalive, or undefined to omit it. */
function normalizeKeepalive(value?: number | null): number | undefined {
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  const n = Math.floor(value);
  if (n <= 0 || n > 65535) return undefined;
  return n;
}
