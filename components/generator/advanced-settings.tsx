'use client';

import { useId, useState, type ReactNode } from 'react';
import { Toggle } from './toggle';
import { AWG30_PARAMETERS, AWG_JUNK_PRESETS } from '@/lib/awg';
import type { AwgJunkKey, AwgOptions, ConfigFormat } from '@/types';

interface AdvancedSettingsProps {
  awg: AwgOptions;
  onAwgChange: (value: AwgOptions) => void;
  configFormat: ConfigFormat;
  mtu: string;
  onMtuChange: (value: string) => void;
  wireGuardOptions?: boolean;
  ipv6: boolean;
  onIpv6Change: (v: boolean) => void;
  keepaliveEnabled: boolean;
  onKeepaliveEnabledChange: (v: boolean) => void;
  keepaliveValue: string;
  onKeepaliveValueChange: (v: string) => void;
  customI1Enabled: boolean;
  onCustomI1EnabledChange: (v: boolean) => void;
  customI1Domain: string;
  onCustomI1DomainChange: (v: string) => void;
}

const inputClass = 'min-w-0 w-full h-10 bg-[var(--surface-3)] rounded-[var(--radius-sm)] px-3 text-base sm:text-[13px] text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber-700)]';
const sectionClass = 'group/awg border-t border-[var(--gray-600)] pt-3';

function AwgSummary({ children }: { children: ReactNode }) {
  return (
    <summary className="flex min-h-9 cursor-pointer list-none items-center justify-between gap-3 py-1 text-[13px] text-[var(--text)] [&::-webkit-details-marker]:hidden">
      <span className="min-w-0">{children}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"
        className="shrink-0 text-[var(--text-dim)] transition-transform group-open/awg:rotate-180 motion-reduce:transition-none">
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
      </svg>
    </summary>
  );
}

export function AdvancedSettings({
  awg, onAwgChange, configFormat, mtu, onMtuChange, wireGuardOptions = true,
  ipv6, onIpv6Change,
  keepaliveEnabled, onKeepaliveEnabledChange, keepaliveValue, onKeepaliveValueChange,
  customI1Enabled, onCustomI1EnabledChange, customI1Domain, onCustomI1DomainChange,
}: AdvancedSettingsProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const xray = configFormat === 'xray';
  const selected = new Set(wireGuardOptions && !xray ? awg.protocols : []);
  const customMask = wireGuardOptions && (xray || selected.has('awg20'));

  return (
    <div className="mb-3.5">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls={panelId}
        className="flex min-h-10 items-center gap-1.5 text-[13px] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--amber-300)]">
        Дополнительные настройки
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>
      <div id={panelId} hidden={!open} className="mt-2.5 space-y-4 bg-[var(--surface-2)] rounded-[var(--radius-md)] px-3.5 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <Toggle checked={ipv6} onChange={onIpv6Change} label="IPv6" />
          <label className="flex items-center gap-2 text-[13px] text-[var(--text-muted)]">MTU
            <input aria-label="MTU" type="text" inputMode="numeric" maxLength={4} value={mtu}
              onChange={(event) => onMtuChange(event.target.value.replace(/\D/g, ''))} placeholder="1280" className={`${inputClass} max-w-24`} />
          </label>
        </div>
        {wireGuardOptions && <div className="flex flex-wrap items-center gap-3">
          <Toggle checked={keepaliveEnabled} onChange={onKeepaliveEnabledChange} label="PersistentKeepalive" />
          {keepaliveEnabled && <input aria-label="Интервал PersistentKeepalive, секунд" type="text" inputMode="numeric" maxLength={5}
            value={keepaliveValue} onChange={(event) => onKeepaliveValueChange(event.target.value.replace(/\D/g, ''))}
            placeholder="25" className={`${inputClass} max-w-24`} />}
        </div>}

        {selected.has('awg10') && <details className={sectionClass}>
          <AwgSummary>AWG 1.0 — шумовые пакеты</AwgSummary>
          <div className="flex flex-wrap gap-2 mt-3 mb-3" role="group" aria-label="Пресет шумовых пакетов">
            {(['default', '30_10_30'] as const).map((preset) => <button key={preset} type="button" aria-pressed={awg.junkPreset === preset}
              onClick={() => onAwgChange({ ...awg, junkPreset: preset, junk: {} })}
              className={`min-h-10 rounded-[var(--radius-sm)] px-3 text-[13px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--amber-300)] ${awg.junkPreset === preset ? 'bg-[var(--amber-900)] text-[var(--amber-300)]' : 'bg-[var(--surface-3)] text-[var(--text-muted)]'}`}>
              {preset === 'default' ? '4 / 40 / 70' : '30 / 10 / 30'}
            </button>)}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['jc', 'jmin', 'jmax'] as AwgJunkKey[]).map((key) => <label key={key} className="min-w-0 text-[13px] text-[var(--text-muted)]">
              {{ jc: 'Jc', jmin: 'Jmin', jmax: 'Jmax' }[key]}
              <input type="text" inputMode="numeric" maxLength={10} value={awg.junk[key] ?? ''}
                placeholder={String(AWG_JUNK_PRESETS[awg.junkPreset][key])}
                onChange={(event) => onAwgChange({ ...awg, junk: { ...awg.junk, [key]: event.target.value.replace(/\D/g, '') } })}
                className={`${inputClass} mt-1.5`} />
            </label>)}
          </div>
        </details>}

        {customMask && <details className={sectionClass}>
          <AwgSummary>{xray ? 'QUIC-маска Xray' : 'AWG 2.0 — маскировка'}</AwgSummary>
          <div className="mt-3 space-y-2">
            <Toggle checked={customI1Enabled} onChange={onCustomI1EnabledChange} label={configFormat === 'wiresock' ? 'Собственный SNI' : 'Собственный I1'} />
            {customI1Enabled && <input aria-label="Домен маскировки" type="text" value={customI1Domain} maxLength={253}
              onChange={(event) => onCustomI1DomainChange(event.target.value)} placeholder="Домен, например www.cloudflare.com"
              spellCheck={false} className={inputClass} />}
            {xray && <p className="text-[12px] text-[var(--text-dim)]">QUIC-маска и 8 случайных пакетов. Локальные прокси: SOCKS 10808 и HTTP 10809.</p>}
          </div>
        </details>}

        {selected.has('awg30') && <details className={sectionClass}>
          <AwgSummary>AWG 3.0 — таймеры и padding</AwgSummary>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {AWG30_PARAMETERS.map((parameter) => <label key={parameter.key} className="min-w-0 text-[12px] text-[var(--text-muted)] break-words">
              {parameter.name}
              <input type="text" inputMode="text" maxLength={21} value={awg.ranges[parameter.key] ?? ''}
                placeholder={parameter.default}
                onChange={(event) => onAwgChange({ ...awg, ranges: { ...awg.ranges, [parameter.key]: event.target.value } })}
                className={`${inputClass} mt-1.5`} />
            </label>)}
          </div>
          <div className="mt-3 flex flex-wrap gap-4">
            <button type="button" className="min-h-10 text-[13px] text-[var(--amber-300)]" onClick={() => {
              const ranges = Object.fromEntries(AWG30_PARAMETERS.map(({ key, default: range }) => {
                const [min, max] = range.split('-').map(Number);
                const start = Math.floor(Math.random() * (max - min + 1)) + min;
                return [key, `${start}-${Math.floor(Math.random() * (max - start + 1)) + start}`];
              }));
              onAwgChange({ ...awg, ranges });
            }}>Случайно</button>
            <button type="button" className="min-h-10 text-[13px] text-[var(--text-muted)]" onClick={() => onAwgChange({ ...awg, ranges: {} })}>Сбросить диапазоны</button>
          </div>
        </details>}

        {selected.has('awg31') && <details className={sectionClass}>
          <AwgSummary>AWG 3.1 — дополнительные опции</AwgSummary>
          <div className="mt-3 space-y-3">
            <Toggle checked={awg.randomTrailers} onChange={(value) => onAwgChange({ ...awg, randomTrailers: value })} label="RandomTrailers" />
            <Toggle checked={awg.disableCookies} onChange={(value) => onAwgChange({ ...awg, disableCookies: value })} label="DisableCookies" />
          </div>
        </details>}
      </div>
    </div>
  );
}
