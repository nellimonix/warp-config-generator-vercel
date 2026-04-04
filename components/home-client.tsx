'use client';

import { useState, useRef } from 'react';
import { Topbar } from '@/components/layout/topbar';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { ResultPanel } from '@/components/generator/result-panel';
import { PromoCards } from '@/components/promo/promo-cards';
import { Banner } from '@/components/promo/banner';
import { FormatsTab } from '@/components/generator/formats-tab';
import { AboutTab } from '@/components/generator/about-tab';
import { ConfigSelectors } from '@/components/generator/config-selectors';
import { ServicePicker } from '@/components/generator/service-picker';
import { useGenerator } from '@/hooks/use-generator';
import { HCAPTCHA_SITE_KEY } from '@/config/site';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import type { ServiceEntry } from '@/types';
import { FaCircleCheck } from "react-icons/fa6";

interface HomeClientProps {
  services: ServiceEntry[];
}

export function HomeClient({ services }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState('generator');
  const gen = useGenerator();
  const { state } = gen;
  const captchaRef = useRef<HCaptcha>(null);

  return (
    <div className="max-w-[1100px] mx-auto px-4 lg:px-8 py-4 lg:py-6 min-h-screen flex flex-col">
      <Topbar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_260px] gap-4 flex-1 lg:items-start">
        <div className="flex flex-col gap-3">

          {/* Generator tab — always mounted */}
          <div className={activeTab === 'generator' ? '' : 'hidden'}>
            <Banner />

            {/* Generator card */}
            <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-medium">Настройки конфигурации</h2>
              </div>

              <div className={state.isGenerated ? 'opacity-50 pointer-events-none' : ''}>
                <ConfigSelectors
                  configFormat={state.configFormat}
                  deviceType={state.deviceType}
                  siteMode={state.siteMode}
                  endpointId={state.endpointId}
                  customEndpoint={state.customEndpoint}
                  onFormatChange={(v) => gen.set('configFormat', v)}
                  onDeviceChange={(v) => gen.set('deviceType', v)}
                  onSiteModeChange={(v) => gen.set('siteMode', v)}
                  onEndpointChange={gen.setEndpoint}
                  onCustomEndpointChange={(v) => gen.set('customEndpoint', v)}
                />

                {state.siteMode === 'specific' && (
                  <ServicePicker services={services} selected={state.selectedServices} onToggle={gen.toggleService} />
                )}
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
                      <FaCircleCheck />
                      Сгенерировать конфигурацию
                    </>
                  )}
                </button>
              ) : (
                <button onClick={gen.reset}
                  className="w-full h-12 bg-[var(--surface-2)] hover:bg-[var(--surface-3)] active:scale-[0.985] rounded-[var(--radius-md)] text-[14px] text-[var(--text-muted)] flex items-center justify-center gap-2 transition-all">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M1 4v6h6M23 20v-6h-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
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

            <div className="mt-3">
              <PromoCards />
            </div>
          </div>

          {activeTab === 'formats' && <FormatsTab />}
          {activeTab === 'about' && <AboutTab />}
        </div>

        <Sidebar />
      </div>

      {/* Captcha modal overlay */}
      {state.showCaptcha && HCAPTCHA_SITE_KEY && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center"
          onClick={(e) => { if (e.target === e.currentTarget) gen.set('showCaptcha', false); }}>
          <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-6 flex flex-col items-center gap-4">
            <p className="text-[14px] text-[var(--text)]">Подтвердите, что вы не робот</p>
            <HCaptcha
              sitekey={HCAPTCHA_SITE_KEY}
              onVerify={gen.onCaptchaVerify}
              ref={captchaRef}
              theme="dark"
            />
            <button onClick={() => gen.set('showCaptcha', false)}
              className="text-[12px] text-[var(--text-dim)] hover:text-[var(--text-muted)] transition-colors">
              Отмена
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}