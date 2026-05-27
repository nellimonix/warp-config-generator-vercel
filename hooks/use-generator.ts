'use client';

import { useState, useCallback } from 'react';
import type { ConfigFormat, DeviceType, SiteMode } from '@/types';
import type { GenerateResult, ApiResponse } from '@/types';
import { getEndpointValue, isExternalEndpoint } from '@/config/endpoints';
import { DEFAULT_DNS_ID, isCommunityDns } from '@/config/dns';
import { trackEvent } from '@/lib/analytics';

export interface GeneratorState {
  configFormat: ConfigFormat;
  deviceType: DeviceType;
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
  showCaptcha: boolean;
}

export function useGenerator() {
  const [state, setState] = useState<GeneratorState>({
    configFormat: 'wireguard',
    deviceType: 'awg15',
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
    showCaptcha: false,
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
      // Block "specific" while a community DNS is selected.
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
      // Any selected service disables Exclude LAN.
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

  const handleGenerate = useCallback(() => {
    setState((prev) => ({ ...prev, showCaptcha: true, error: '' }));
  }, []);

  const onCaptchaVerify = useCallback(async (token: string) => {
    setState((prev) => ({
      ...prev,
      showCaptcha: false,
      isLoading: true,
      error: '',
    }));

    try {
      const endpoint = getEndpointValue(state.endpointId, state.customEndpoint);
      const persistentKeepalive = state.keepaliveEnabled
        ? (parseInt(state.keepaliveValue, 10) || 25)
        : null;
      const customI1Domain = state.customI1Enabled ? state.customI1Domain.trim() : '';

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          captchaToken: token,
          selectedServices: state.selectedServices,
          siteMode: state.siteMode,
          deviceType: state.deviceType,
          endpoint,
          configFormat: state.configFormat,
          dnsId: state.dnsId,
          ipv6: state.ipv6,
          excludeLan: state.excludeLan,
          persistentKeepalive,
          customI1Domain,
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
        trackEvent('WARP_GEN');
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
    state.deviceType, state.configFormat, state.dnsId, state.ipv6, state.excludeLan,
    state.keepaliveEnabled, state.keepaliveValue, state.customI1Enabled, state.customI1Domain,
  ]);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isGenerated: false,
      result: null,
      error: '',
      showCaptcha: false,
    }));
  }, []);

  const copyConfig = useCallback(async (): Promise<boolean> => {
    if (!state.result) return false;
    try {
      await navigator.clipboard.writeText(atob(state.result.configBase64));
      trackEvent('WARP_COPY');
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
    trackEvent('WARP_DOWNLOAD');
  }, [state.result]);

  return {
    state, set, toggleService, setEndpoint, setDnsId, setSiteMode,
    handleGenerate, onCaptchaVerify, reset, copyConfig, downloadConfig,
  };
}
