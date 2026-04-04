import type { ConfigFormat, DeviceType, BuildParams } from '@/types';
import type { GenerateRequest, GenerateResult, CloudflareWarpResponse } from '@/types';
import { generateKeyPair, toBase64 } from './crypto';
import { registerClient, enableWarp } from './cloudflare-client';
import { resolveAllowedIPs } from '@/config/services-loader';
import { buildConfig, buildConfigForQR } from './builders';
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

    const format = req.configFormat;

    // 1. Generate keys
    const keyPair = generateKeyPair();

    // 2. Register with Cloudflare
    const { id: clientId, token } = await registerClient(keyPair.publicKey);

    // 3. Enable WARP
    const warpResponse = await enableWarp(clientId, token);

    // 4. Extract params
    const params = extractBuildParams(warpResponse, keyPair, req);

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

function extractBuildParams(
  warpRes: CloudflareWarpResponse,
  keyPair: { privateKey: string; publicKey: string },
  req: GenerateRequest
): BuildParams {
  const peer = warpRes.result.config.peers[0];
  const iface = warpRes.result.config.interface;

  return {
    privateKey: keyPair.privateKey,
    publicKey: peer.public_key,
    clientIPv4: iface.addresses.v4,
    clientIPv6: iface.addresses.v6,
    allowedIPs: resolveAllowedIPs(req.selectedServices, req.siteMode),
    endpoint: req.endpoint,
    deviceType: req.deviceType,
    reserved: warpRes.result.config.client_id || '',
  };
}
