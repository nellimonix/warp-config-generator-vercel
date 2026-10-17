'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { CONFIG_FORMATS } from '@/config/formats';
import { ENDPOINTS } from '@/config/endpoints';
import { DNS_PROVIDERS } from '@/config/dns';
import { FlagIcon } from '@/components/icons/flag-icon';
import { Check, DiceFive, Globe } from '@phosphor-icons/react';
import { Toggle } from './toggle';
import type { AwgProtocol, ClashProtocol, ConfigFormat, DeviceType, SiteMode } from '@/types';
import { AWG_PROTOCOLS, awgLabel } from '@/lib/awg';

interface DropdownOption {
  id: string;
  label: string;
  flag?: string;
  image?: string;
  icon?: 'dice' | 'globe';
  disabled?: boolean;
}

interface DropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (id: string) => void;
  selectedValues?: string[];
}

function Dropdown({ label, value, options, onChange, selectedValues }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const current = options.find((o) => o.id === value);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} className="relative min-w-0" onKeyDown={(event) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }}>
      <button ref={triggerRef} type="button" onClick={() => setOpen(!open)} aria-expanded={open}
        aria-controls={menuId} aria-haspopup={selectedValues ? 'menu' : undefined}
        className={`w-full text-left bg-[var(--surface-2)] rounded-[var(--radius-md)] px-3.5 py-2.5 transition-colors hover:bg-[var(--surface-3)] cursor-pointer ${open ? 'bg-[var(--surface-3)]' : ''}`}>
        <p className="text-[11px] text-[var(--text-dim)] font-light mb-0.5">{label}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="min-w-0 text-[13px] font-medium text-[var(--text)] flex items-center gap-2">
            {current?.flag && <FlagIcon code={current.flag} />}
            {current?.image && <img src={current.image} alt="" width={16} height={16} className="h-4 w-4 shrink-0 object-contain" />}
            {current?.icon === 'dice' && <DiceFive size={16} weight="duotone" className="text-[var(--amber-300)]" />}
            {current?.icon === 'globe' && <Globe size={16} weight="duotone" aria-label="Community DNS" className="shrink-0 text-[var(--amber-300)]" />}
            <span className="truncate">{current?.label || value}</span>
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            className={`shrink-0 text-[var(--text-dim)] transition-transform ${open ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </button>
      {open && (
        <div id={menuId} role={selectedValues ? 'menu' : undefined} aria-label={label}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-[var(--surface)] rounded-[var(--radius-md)] py-1 max-h-[260px] overflow-y-auto"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          {options.map((opt) => {
            const selected = selectedValues ? selectedValues.includes(opt.id) : opt.id === value;
            if (opt.disabled) {
              return (
                <div key={opt.id}
                  className="w-full text-left px-3.5 py-2 text-[13px] flex items-center gap-2 text-[var(--text-dim)] opacity-50 cursor-not-allowed">
                  {opt.flag && <FlagIcon code={opt.flag} />}
                  {opt.image && <img src={opt.image} alt="" width={16} height={16} className="h-4 w-4 shrink-0 object-contain" />}
                  {opt.icon === 'dice' && <DiceFive size={16} weight="duotone" className="text-[var(--amber-300)]" />}
                  {opt.label}
                </div>
              );
            }
            return (
              <button key={opt.id} type="button" role={selectedValues ? 'menuitemcheckbox' : undefined}
                aria-checked={selectedValues ? selected : undefined}
                onClick={() => { onChange(opt.id); if (!selectedValues) setOpen(false); }}
                className={`w-full min-h-10 text-left px-3.5 py-2 text-[13px] flex items-center gap-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--amber-700)] ${
                  selected
                    ? 'text-[var(--amber-300)] bg-[var(--amber-900)]/50'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
                }`}>
                {opt.flag && <FlagIcon code={opt.flag} />}
                {opt.image && <img src={opt.image} alt="" width={16} height={16} className="h-4 w-4 shrink-0 object-contain" />}
                {opt.icon === 'dice' && <DiceFive size={16} weight="duotone" className="text-[var(--amber-300)]" />}
                {opt.icon === 'globe' && <Globe size={16} weight="duotone" aria-label="Community DNS" className="shrink-0 text-[var(--amber-300)]" />}
                {opt.label}
                {selectedValues && selected && <Check size={16} weight="bold" aria-hidden="true" className="ml-auto shrink-0 text-[var(--amber-300)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ConfigSelectorsProps {
  awgProtocols: AwgProtocol[];
  onAwgToggle: (v: AwgProtocol | 'wireguard') => void;
  configFormat: ConfigFormat;
  deviceType: DeviceType;
  clashProtocol: ClashProtocol;
  siteMode: SiteMode;
  endpointId: string;
  customEndpoint: string;
  dnsId: string;
  communityDns: boolean;
  excludeLan: boolean;
  onFormatChange: (v: ConfigFormat) => void;
  onDeviceChange: (v: DeviceType) => void;
  onClashProtocolChange: (v: ClashProtocol) => void;
  onSiteModeChange: (v: SiteMode) => void;
  onEndpointChange: (id: string) => void;
  onCustomEndpointChange: (v: string) => void;
  onDnsChange: (id: string) => void;
  onExcludeLanChange: (v: boolean) => void;
}

export function ConfigSelectors({
  awgProtocols, onAwgToggle,
  configFormat, deviceType, clashProtocol, siteMode, endpointId, customEndpoint, dnsId, communityDns, excludeLan,
  onFormatChange, onDeviceChange, onSiteModeChange, onEndpointChange, onCustomEndpointChange,
  onClashProtocolChange, onDnsChange, onExcludeLanChange,
}: ConfigSelectorsProps) {
  return (
    <div className="space-y-2 mb-3.5">
      <div className="grid grid-cols-2 gap-2 max-[500px]:grid-cols-1 min-[501px]:[&>*:last-child:nth-child(odd)]:col-span-2">
        <Dropdown label="Формат конфигурации" value={configFormat}
          options={CONFIG_FORMATS.map((f) => ({ id: f.id, label: f.name, image: f.image }))}
          onChange={(v) => onFormatChange(v as ConfigFormat)} />
        {configFormat === 'clash' ? (
          <Dropdown label="Протокол Clash" value={clashProtocol}
            options={[
              { id: 'awg', label: 'WireGuard / AWG' },
              { id: 'masque', label: 'MASQUE' },
              { id: 'awg_masque', label: 'WireGuard / AWG + MASQUE' },
            ]}
            onChange={(v) => onClashProtocolChange(v as ClashProtocol)} />
        ) : null}
        {configFormat !== 'xray' && (configFormat !== 'clash' || clashProtocol !== 'masque') && (
          <Dropdown label="Параметры протокола" value={awgProtocols.length ? `AWG ${awgLabel(awgProtocols)}` : 'WireGuard'}
            options={[{ id: 'wireguard', label: 'WireGuard' }, ...AWG_PROTOCOLS.map(({ id, label }) => ({ id, label }))]}
            selectedValues={awgProtocols.length ? awgProtocols : ['wireguard']}
            onChange={(id) => onAwgToggle(id as AwgProtocol | 'wireguard')} />
        )}
        <Dropdown label="DNS" value={dnsId}
          options={DNS_PROVIDERS.map((d) => ({
            id: d.id,
            label: d.label,
            icon: d.isCommunity ? 'globe' : undefined,
          }))}
          onChange={onDnsChange} />
        <Dropdown label="Конечная точка" value={endpointId}
          options={ENDPOINTS.map((e) => ({
            id: e.id,
            label: e.label,
            flag: e.flag,
            icon: e.icon,
            disabled: configFormat === 'clash' && clashProtocol === 'masque'
              && !e.externalUrl && !['default', 'random'].includes(e.id),
          }))}
          onChange={onEndpointChange} />
        {configFormat !== 'xray' && <Dropdown label="Тип конфигурации" value={siteMode}
          options={[
            { id: 'all', label: 'Все сайты' },
            { id: 'specific', label: 'Определенные сайты', disabled: communityDns },
          ]}
          onChange={(v) => onSiteModeChange(v as SiteMode)} />}
      </div>

      {endpointId === 'custom' && (
        <input
          type="text"
          value={customEndpoint}
          onChange={(e) => onCustomEndpointChange(e.target.value)}
          placeholder="host:port (например 162.159.192.1:4500)"
          className="w-full h-10 bg-[var(--surface-2)] rounded-[var(--radius-md)] px-3.5 text-[13px] text-[var(--text)] placeholder:text-[var(--text-dim)] outline-none focus:bg-[var(--surface-3)] transition-colors"
        />
      )}

      {configFormat !== 'xray' && siteMode === 'all' && (
        <div className="pt-1">
          <Toggle checked={excludeLan} onChange={onExcludeLanChange} label="Исключить LAN" />
        </div>
      )}
    </div>
  );
}
