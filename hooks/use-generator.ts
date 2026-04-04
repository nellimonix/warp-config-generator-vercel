'use client';

import { useState, useCallback } from 'react';
import type { ConfigFormat, DeviceType, SiteMode } from '@/types';
import type { GenerateResult, ApiResponse } from '@/types';
import { getEndpointValue, isExternalEndpoint } from '@/config/endpoints';
import { trackEvent } from '@/lib/analytics';

export interface GeneratorState {
  configFormat: ConfigFormat;
  deviceType: DeviceType;
  siteMode: SiteMode;
  endpointId: string;
  customEndpoint: string;
  selectedServices: string[];
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

  const toggleService = useCallback((key: string) => {
    setState((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(key)
        ? prev.selectedServices.filter((s) => s !== key)
        : [...prev.selectedServices, key],
    }));
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
  }, [state.endpointId, state.customEndpoint, state.selectedServices, state.siteMode, state.deviceType, state.configFormat]);

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
    state, set, toggleService, setEndpoint,
    handleGenerate, onCaptchaVerify, reset, copyConfig, downloadConfig,
  };
}