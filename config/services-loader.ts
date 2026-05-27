/**
 * Server-only service loader.
 * 
 * Reads config/services/*.json once at import time.
 * Used by: API route, server components.
 * NOT importable from client components (uses fs).
 */

import 'server-only';
import fs from 'fs';
import path from 'path';

// ---------- Types ----------

export interface ServiceEntry {
  key: string;
  name: string;
  icon: string;
  iconLibrary: string;
  type?: 'new';
}

interface ServiceFileData {
  name: string;
  icon: string;
  iconLibrary: string;
  type?: 'new';
  ips: string;
}

// ---------- Load once ----------

const SERVICES_DIR = path.join(process.cwd(), 'config', 'services');

function loadAll() {
  const services: ServiceEntry[] = [];
  const ipRanges: Record<string, string> = {};

  let files: string[];
  try {
    files = fs.readdirSync(SERVICES_DIR).filter((f) => f.endsWith('.json'));
  } catch {
    console.warn(`[services-loader] Cannot read ${SERVICES_DIR}, using empty list`);
    return { services, ipRanges };
  }

  for (const file of files) {
    const key = file.replace(/\.json$/, '');
    try {
      const raw = fs.readFileSync(path.join(SERVICES_DIR, file), 'utf-8');
      const data: ServiceFileData = JSON.parse(raw);

      services.push({
        key,
        name: data.name,
        icon: data.icon,
        iconLibrary: data.iconLibrary,
        ...(data.type ? { type: data.type } : {}),
      });

      if (data.ips) {
        ipRanges[key] = data.ips;
      }
    } catch (err) {
      console.warn(`[services-loader] Failed to parse ${file}:`, err);
    }
  }

  services.sort((a, b) => a.name.localeCompare(b.name));
  return { services, ipRanges };
}

const loaded = loadAll();

// ---------- Exports ----------

export const SERVICES: ServiceEntry[] = loaded.services;
export const IP_RANGES: Record<string, string> = loaded.ipRanges;

export function isServiceSupported(key: string): boolean {
  return key in IP_RANGES;
}

export function getServiceRanges(key: string): string[] {
  const raw = IP_RANGES[key];
  if (!raw) return [];
  return raw.split(',').map((r) => r.trim()).filter(Boolean);
}

export function getCombinedRanges(keys: string[]): string[] {
  const unique = new Set<string>();
  for (const key of keys) {
    for (const range of getServiceRanges(key)) unique.add(range);
  }
  return Array.from(unique);
}

/**
 * Exclude-LAN AllowedIPs: full IPv4/IPv6 space minus private/reserved LAN ranges.
 * Mirrors the reference getSelectedSites() — IPv6 ranges are kept verbatim.
 */
export const LAN_EXCLUDE_IPS =
  '1.0.0.0/8, 2.0.0.0/7, 4.0.0.0/6, 8.0.0.0/7, 11.0.0.0/8, 12.0.0.0/6, 16.0.0.0/4, 32.0.0.0/3, 64.0.0.0/3, 96.0.0.0/4, 112.0.0.0/5, 120.0.0.0/6, 124.0.0.0/7, 126.0.0.0/8, 128.0.0.0/3, 160.0.0.0/5, 168.0.0.0/8, 169.0.0.0/9, 169.128.0.0/10, 169.192.0.0/11, 169.224.0.0/12, 169.240.0.0/13, 169.248.0.0/14, 169.252.0.0/15, 169.255.0.0/16, 170.0.0.0/7, 172.0.0.0/12, 172.32.0.0/11, 172.64.0.0/10, 172.128.0.0/9, 173.0.0.0/8, 174.0.0.0/7, 176.0.0.0/4, 192.0.0.0/9, 192.128.0.0/11, 192.160.0.0/13, 192.169.0.0/16, 192.170.0.0/15, 192.172.0.0/14, 192.176.0.0/12, 192.192.0.0/10, 193.0.0.0/8, 194.0.0.0/7, 196.0.0.0/6, 200.0.0.0/5, 208.0.0.0/4, 224.0.0.0/4, ::/1, 8000::/2, c000::/3, e000::/4, f000::/5, f800::/6, fe00::/9, fec0::/10, ff00::/8';

export interface AllowedIPsOptions {
  excludeLan?: boolean;
  ipv6?: boolean;
}

export function resolveAllowedIPs(
  keys: string[],
  siteMode: 'all' | 'specific',
  opts: AllowedIPsOptions = {},
): string {
  const ipv6 = opts.ipv6 ?? true;
  const defaultAll = ipv6 ? '0.0.0.0/0, ::/0' : '0.0.0.0/0';

  if (siteMode === 'all') {
    if (opts.excludeLan) return LAN_EXCLUDE_IPS;
    return defaultAll;
  }
  const supported = keys.filter((k) => k in IP_RANGES);
  if (supported.length === 0) return defaultAll;
  return getCombinedRanges(supported).join(', ');
}
