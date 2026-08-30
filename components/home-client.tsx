'use client';

import { Topbar } from '@/components/layout/topbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { ResultPanel } from '@/components/generator/result-panel';
import { FormatsTab } from '@/components/generator/formats-tab';
import { AboutTab } from '@/components/generator/about-tab';
import { ApplicationsTab } from '@/components/generator/applications-tab';
import { ConfigSelectors } from '@/components/generator/config-selectors';
import { ServicePicker } from '@/components/generator/service-picker';
import { AdvancedSettings } from '@/components/generator/advanced-settings';
import { useGenerator } from '@/hooks/use-generator';
import { useHashTabs } from '@/hooks/use-hash-tabs';
import { isCommunityDns } from '@/config/dns';
import type { ServiceEntry } from '@/types';
import { ArrowClockwise, CheckCircle, SlidersHorizontal } from '@phosphor-icons/react';

interface HomeClientProps {
  services: ServiceEntry[];
}

const AVAILABLE_TABS = ['generator', 'applications', 'about'] as const;

export function HomeClient({ services }: HomeClientProps) {
  const { activeTab } = useHashTabs(AVAILABLE_TABS);
  const gen = useGenerator();
  const { state } = gen;

  return (
    <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-4 lg:py-6 min-h-screen flex flex-col">
      <Topbar activeTab={activeTab} />

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_260px] gap-4 flex-1 lg:items-start">
        <div className="flex flex-col gap-3">

          {/* Generator tab — always mounted */}
          <div className={activeTab === 'generator' ? '' : 'hidden'}>
            {/* Generator card */}
            <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-medium flex items-center gap-2">
                  <SlidersHorizontal size={18} weight="duotone" className="text-[var(--text-muted)]" />
                  Настройки конфигурации
                </h2>
              </div>

              <div className={state.isGenerated ? 'opacity-50 pointer-events-none' : ''}>
                <ConfigSelectors
                  configFormat={state.configFormat}
                  deviceType={state.deviceType}
                  clashProtocol={state.clashProtocol}
                  siteMode={state.siteMode}
                  endpointId={state.endpointId}
                  customEndpoint={state.customEndpoint}
                  dnsId={state.dnsId}
                  communityDns={isCommunityDns(state.dnsId)}
                  excludeLan={state.excludeLan}
                  onFormatChange={(v) => gen.set('configFormat', v)}
                  onDeviceChange={(v) => gen.set('deviceType', v)}
                  onClashProtocolChange={gen.setClashProtocol}
                  onSiteModeChange={gen.setSiteMode}
                  onEndpointChange={gen.setEndpoint}
                  onCustomEndpointChange={(v) => gen.set('customEndpoint', v)}
                  onDnsChange={gen.setDnsId}
                  onExcludeLanChange={(v) => gen.set('excludeLan', v)}
                />

                {state.siteMode === 'specific' && !isCommunityDns(state.dnsId) && (
                  <ServicePicker services={services} selected={state.selectedServices} onToggle={gen.toggleService} />
                )}

                <AdvancedSettings
                  wireGuardOptions={state.configFormat !== 'clash' || state.clashProtocol !== 'masque'}
                  ipv6={state.ipv6}
                  onIpv6Change={(v) => gen.set('ipv6', v)}
                  keepaliveEnabled={state.keepaliveEnabled}
                  onKeepaliveEnabledChange={(v) => gen.set('keepaliveEnabled', v)}
                  keepaliveValue={state.keepaliveValue}
                  onKeepaliveValueChange={(v) => gen.set('keepaliveValue', v)}
                  customI1Enabled={state.customI1Enabled}
                  onCustomI1EnabledChange={(v) => gen.set('customI1Enabled', v)}
                  customI1Domain={state.customI1Domain}
                  onCustomI1DomainChange={(v) => gen.set('customI1Domain', v)}
                />
              </div>

              {!state.isGenerated ? (
                <button onClick={gen.handleGenerate} disabled={state.isLoading}
                  className="w-full h-12 bg-[var(--amber-900)] hover:bg-[var(--amber-700)] active:scale-[0.985] disabled:opacity-50 disabled:cursor-wait rounded-[var(--radius-md)] text-[14px] font-medium text-[var(--amber-300)] flex items-center justify-center gap-2 transition-all">
                  {state.isLoading ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31 31" />
                      </svg>
                      Генерация...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={17} weight="fill" />
                      Сгенерировать конфигурацию
                    </>
                  )}
                </button>
              ) : (
                <button onClick={gen.reset}
                  className="w-full h-12 bg-[var(--surface-2)] hover:bg-[var(--surface-3)] active:scale-[0.985] rounded-[var(--radius-md)] text-[14px] text-[var(--text-muted)] flex items-center justify-center gap-2 transition-all">
                  <ArrowClockwise size={15} />
                  Сгенерировать заново
                </button>
              )}

              {state.error && (
                <div className="mt-3 p-3 bg-[var(--error)]/10 rounded-[var(--radius-md)] text-[13px] text-[var(--error)]">
                  {state.error}
                </div>
              )}
            </div>

            {/* Result — separate block */}
            {state.isGenerated && state.result && (
              <div className="mt-3">
                <ResultPanel result={state.result} onDownload={gen.downloadConfig} onCopy={gen.copyConfig} />
              </div>
            )}
          </div>

          {activeTab === 'formats' && <FormatsTab />}
          {activeTab === 'about'  && <AboutTab />}
          {activeTab === 'applications' && <ApplicationsTab />}
        </div>

        <Sidebar />
      </div>

      <Footer />
    </div>
  );
}
