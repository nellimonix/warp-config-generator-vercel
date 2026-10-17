'use client';

import { useState, useCallback } from 'react';
import type { AwgOptions, AwgProtocol, ClashProtocol, ConfigFormat, DeviceType, SiteMode } from '@/types';
import type { GenerateResult, ApiResponse } from '@/types';
import { getEndpointValue, isExternalEndpoint } from '@/config/endpoints';
import { DEFAULT_DNS_ID, isCommunityDns } from '@/config/dns';
import { defaultAwgOptions, normalizeAwgOptions, normalizeMtu } from '@/lib/awg';

export interface GeneratorState {
  awg: AwgOptions;
  mtu: string;
  configFormat: ConfigFormat;
  deviceType: DeviceType;
  clashProtocol: ClashProtocol;
  siteMode: SiteMode;
  endpointId: string;
  customEndpoint: string;
  selectedServices: string[];
  dnsId: string;
  ipv6: boolean;
  excludeLan: boolean;
  keepaliveEnabled: boolean;
  keepaliveValue: string;
  customI1Enabled: boolean;
  customI1Domain: string;
  isLoading: boolean;
  isGenerated: boolean;
  error: string;
  result: GenerateResult | null;
}

export function useGenerator() {
  const [state, setState] = useState<GeneratorState>({
    awg: defaultAwgOptions(),
    mtu: '',
    configFormat: 'wireguard',
    deviceType: 'awg15',
    clashProtocol: 'awg',
    siteMode: 'all',
    endpointId: 'default',
    customEndpoint: '',
    selectedServices: [],
    dnsId: DEFAULT_DNS_ID,
    ipv6: true,
    excludeLan: false,
    keepaliveEnabled: false,
    keepaliveValue: '',
    customI1Enabled: false,
    customI1Domain: '',
    isLoading: false,
    isGenerated: false,
    error: '',
    result: null,
  });

  const set = useCallback(<K extends keyof GeneratorState>(
    key: K, value: GeneratorState[K]
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Community DNS forbids split tunneling: selecting one forces "all sites" and
  // clears any selected services (the picker is hidden / "specific" disabled in UI).
  const setDnsId = useCallback((id: string) => {
    setState((prev) => {
      if (isCommunityDns(id)) {
        return { ...prev, dnsId: id, siteMode: 'all', selectedServices: [] };
      }
      return { ...prev, dnsId: id };
    });
  }, []);

  // "Exclude LAN" only applies to "all sites"; switching to "specific" turns it off.
  const setSiteMode = useCallback((mode: SiteMode) => {
    setState((prev) => {
      if (mode === 'specific' && isCommunityDns(prev.dnsId)) return prev;
      if (mode === 'specific') return { ...prev, siteMode: mode, excludeLan: false };
      return { ...prev, siteMode: mode };
    });
  }, []);

  const toggleService = useCallback((key: string) => {
    setState((prev) => {
      if (isCommunityDns(prev.dnsId)) return prev;
      const selectedServices = prev.selectedServices.includes(key)
        ? prev.selectedServices.filter((s) => s !== key)
        : [...prev.selectedServices, key];
      return { ...prev, selectedServices, excludeLan: selectedServices.length ? false : prev.excludeLan };
    });
  }, []);

  const setEndpoint = useCallback((id: string) => {
    const externalUrl = isExternalEndpoint(id);
    if (externalUrl) {
      window.open(externalUrl, '_blank');
      return;
    }
    setState((prev) => ({
      ...prev,
      endpointId: id,
      customEndpoint: id === 'custom' ? '' : prev.customEndpoint,
    }));
  }, []);

  const setClashProtocol = useCallback((clashProtocol: ClashProtocol) => {
    setState((prev) => ({
      ...prev,
      clashProtocol,
      endpointId: clashProtocol === 'masque' && !['default', 'random'].includes(prev.endpointId)
        ? 'default'
        : prev.endpointId,
    }));
  }, []);

  const setAwg = useCallback((awg: AwgOptions) => {
    setState((prev) => ({ ...prev, awg: {
      ...awg, protocols: awg.protocols.filter((id) => id !== 'awg31' || awg.randomTrailers || awg.disableCookies),
    } }));
  }, []);

  const toggleAwg = useCallback((protocol: AwgProtocol | 'wireguard') => {
    setState((prev) => {
      const enabled = prev.awg.protocols.includes(protocol as AwgProtocol);
      const protocols = protocol === 'wireguard' ? [] : enabled
        ? prev.awg.protocols.filter((id) => id !== protocol)
        : [...prev.awg.protocols, protocol];
      const update31 = protocol === 'wireguard' || protocol === 'awg31';
      return { ...prev, awg: {
        ...prev.awg, protocols,
        randomTrailers: update31 ? protocol !== 'wireguard' && !enabled : prev.awg.randomTrailers,
        disableCookies: update31 ? protocol !== 'wireguard' && !enabled : prev.awg.disableCookies,
      } };
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    try {
      normalizeMtu(state.mtu === '' ? undefined : Number(state.mtu), state.ipv6);
      const wireGuardOptions = state.configFormat !== 'clash' || state.clashProtocol !== 'masque';
      if (wireGuardOptions && state.keepaliveEnabled && state.keepaliveValue !== ''
        && (Number(state.keepaliveValue) < 1 || Number(state.keepaliveValue) > 65535)) {
        throw new Error('PersistentKeepalive: введите число от 1 до 65535 секунд.');
      }
      if (state.configFormat !== 'xray' && wireGuardOptions) normalizeAwgOptions(state.awg);
      const usesMask = wireGuardOptions && (state.configFormat === 'xray' || state.awg.protocols.includes('awg20'));
      if (usesMask && state.customI1Enabled && !state.customI1Domain.trim()) throw new Error('Введите домен для собственной маски I1.');
    } catch (error) {
      setState((prev) => ({ ...prev, error: error instanceof Error ? error.message : 'Проверьте дополнительные настройки.' }));
      return;
    }
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: '',
    }));

    try {
      const endpoint = getEndpointValue(state.endpointId, state.customEndpoint);
      const persistentKeepalive = state.keepaliveEnabled
        ? (parseInt(state.keepaliveValue, 10) || 25)
        : null;
      const usesMask = state.configFormat === 'xray' || state.awg.protocols.includes('awg20');
      const customI1Domain = state.customI1Enabled && usesMask ? state.customI1Domain.trim() : '';

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedServices: state.configFormat === 'xray' ? [] : state.selectedServices,
          siteMode: state.configFormat === 'xray' ? 'all' : state.siteMode,
          deviceType: state.deviceType,
          endpoint,
          endpointRandom: state.endpointId === 'random',
          configFormat: state.configFormat,
          clashProtocol: state.clashProtocol,
          dnsId: state.dnsId,
          ipv6: state.ipv6,
          excludeLan: state.configFormat === 'xray' ? false : state.excludeLan,
          persistentKeepalive,
          customI1Domain,
          awg: state.configFormat === 'xray' || (state.configFormat === 'clash' && state.clashProtocol === 'masque') ? undefined : state.awg,
          mtu: state.mtu === '' ? undefined : Number(state.mtu),
        }),
      });

      const data = (await res.json()) as ApiResponse<GenerateResult>;

      if (data.success && data.content) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          isGenerated: true,
          result: data.content!,
        }));
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: data.message || 'Ошибка генерации',
        }));
      }
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Ошибка сети. Попробуйте ещё раз.',
      }));
    }
  }, [
    state.endpointId, state.customEndpoint, state.selectedServices, state.siteMode,
    state.deviceType, state.clashProtocol, state.configFormat, state.dnsId, state.ipv6, state.excludeLan,
    state.keepaliveEnabled, state.keepaliveValue, state.customI1Enabled, state.customI1Domain,
    state.awg, state.mtu,
  ]);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isGenerated: false,
      result: null,
      error: '',
    }));
  }, []);

  const copyConfig = useCallback(async (): Promise<boolean> => {
    if (!state.result) return false;
    try {
      await navigator.clipboard.writeText(atob(state.result.configBase64));
      return true;
    } catch {
      return false;
    }
  }, [state.result]);

  const downloadConfig = useCallback(() => {
    if (!state.result) return;
    const a = document.createElement('a');
    a.href = 'data:application/octet-stream;base64,' + state.result.configBase64;
    a.download = state.result.fileName;
    a.click();
  }, [state.result]);

  return {
    state, set, setAwg, toggleAwg, toggleService, setEndpoint, setClashProtocol, setDnsId, setSiteMode,
    handleGenerate, reset, copyConfig, downloadConfig,
  };
}
