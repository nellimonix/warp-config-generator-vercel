import type { ClashProtocol, ConfigFormat, BuildParams } from '@/types';
import type { GenerateRequest, GenerateResult, CloudflareWarpResponse } from '@/types';
import { generateKeyPair, generateMasqueKeyPair, toBase64 } from './crypto';
import { registerClient, enableWarp, registerMasqueClient } from './cloudflare-client';
import { resolveAllowedIPs } from '@/config/services-loader';
import { buildDnsLine, isCommunityDns, DEFAULT_DNS_ID } from '@/config/dns';
import { buildConfig, buildConfigForQR } from './builders';
import { pickI1 } from './builders/shared';
import { generateI1Line } from './quic';
import { generateQR, unsupportedQR } from './qr-generator';
import { getFileName, getFormatInfo, supportsQR } from '@/config/formats';
import { generateRandomMasqueEndpoint, generateRandomWireGuardEndpoint } from './endpoint-pool';

const MASQUE_DEFAULT_ENDPOINT = { server: '162.159.198.2', port: 443 };
const MASQUE_DEFAULT_SNI = '4pda.to';

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
    const clashProtocol = resolveClashProtocol(effectiveReq);
    const requestWithEndpoint: GenerateRequest = {
      ...effectiveReq,
      endpoint: effectiveReq.endpointRandom
        ? generateRandomWireGuardEndpoint()
        : effectiveReq.endpoint,
    };
    const params = await createBuildParams(requestWithEndpoint, clashProtocol);

    if (format === 'clash' && (clashProtocol === 'masque' || clashProtocol === 'awg_masque')) {
      const keys = await generateMasqueKeyPair();
      const registration = await registerMasqueClient(keys.publicKey);
      const endpoint = effectiveReq.endpointRandom
        ? generateRandomMasqueEndpoint()
        : MASQUE_DEFAULT_ENDPOINT;
      params.masque = {
        privateKey: keys.privateKey,
        publicKey: registration.publicKey,
        clientIPv4: registration.clientIPv4,
        clientIPv6: registration.clientIPv6,
        server: endpoint.server,
        port: endpoint.port,
        sni: MASQUE_DEFAULT_SNI,
      };
    }

    const configText = buildConfig(format, params);

    let qrCodeBase64: string;
    if (supportsQR(format)) {
      const qrText = buildConfigForQR(format, params);
      qrCodeBase64 = await generateQR(qrText);
    } else {
      const info = getFormatInfo(format);
      qrCodeBase64 = unsupportedQR(info.name);
    }

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
  if (req.clashProtocol && !['awg', 'masque', 'awg_masque'].includes(req.clashProtocol)) {
    throw new WarpGenerationError(`Unsupported Clash protocol: ${req.clashProtocol}`);
  }
}

async function createBuildParams(req: GenerateRequest, clashProtocol: ClashProtocol): Promise<BuildParams> {
  const ipv6 = req.ipv6 ?? true;
  const dnsId = req.dnsId ?? DEFAULT_DNS_ID;
  const domain = sanitizeDomain(req.customI1Domain);
  const i1 = domain ? await generateI1Line(domain) : pickI1();
  const keepalive = normalizeKeepalive(req.persistentKeepalive);
  const base: BuildParams = {
    privateKey: '',
    publicKey: '',
    clientIPv4: '',
    clientIPv6: '',
    allowedIPs: resolveAllowedIPs(req.selectedServices, req.siteMode, { excludeLan: req.excludeLan, ipv6 }),
    endpoint: req.endpoint,
    deviceType: req.deviceType,
    reserved: '',
    dns: buildDnsLine(dnsId, ipv6),
    includeIPv6: ipv6,
    persistentKeepalive: keepalive,
    i1,
    maskDomain: domain,
    clashProtocol,
  };

  const needsWireGuard = req.configFormat !== 'clash' || clashProtocol !== 'masque';
  if (!needsWireGuard) return base;

  const keyPair = generateKeyPair();
  const { id: clientId, token } = await registerClient(keyPair.publicKey);
  const warpResponse = await enableWarp(clientId, token);
  return applyWireGuardResponse(base, warpResponse, keyPair);
}

function applyWireGuardResponse(
  params: BuildParams,
  warpRes: CloudflareWarpResponse,
  keyPair: { privateKey: string; publicKey: string },
): BuildParams {
  const peer = warpRes.result.config.peers[0];
  const iface = warpRes.result.config.interface;
  return {
    ...params,
    privateKey: keyPair.privateKey,
    publicKey: peer.public_key,
    clientIPv4: iface.addresses.v4,
    clientIPv6: iface.addresses.v6,
    reserved: warpRes.result.config.client_id || '',
  };
}

function resolveClashProtocol(req: GenerateRequest): ClashProtocol {
  return req.configFormat === 'clash' ? (req.clashProtocol || 'awg') : 'awg';
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
