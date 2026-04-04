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

export function resolveAllowedIPs(keys: string[], siteMode: 'all' | 'specific'): string {
  if (siteMode === 'all') return '0.0.0.0/0, ::/0';
  const supported = keys.filter((k) => k in IP_RANGES);
  if (supported.length === 0) return '0.0.0.0/0, ::/0';
  return getCombinedRanges(supported).join(', ');
}
