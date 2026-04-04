'use client';

import { useState, useRef, useEffect } from 'react';
import { CONFIG_FORMATS } from '@/config/formats';
import { ENDPOINTS } from '@/config/endpoints';
import { FlagIcon } from '@/components/icons/flag-icon';
import type { ConfigFormat, DeviceType, SiteMode } from '@/types';

interface DropdownOption {
  id: string;
  label: string;
  flag?: string;
}

interface DropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  onChange: (id: string) => void;
}

function Dropdown({ label, value, options, onChange }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.id === value);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)}
        className={`w-full text-left bg-[var(--surface-2)] rounded-[var(--radius-md)] px-3.5 py-2.5 transition-colors hover:bg-[var(--surface-3)] cursor-pointer ${open ? 'bg-[var(--surface-3)]' : ''}`}>
        <p className="text-[11px] text-[var(--text-dim)] font-light mb-0.5">{label}</p>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-medium text-[var(--text)] flex items-center gap-2 truncate">
            {current?.flag && <FlagIcon code={current.flag} />}
            {current?.label || value}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            className={`shrink-0 text-[var(--text-dim)] transition-transform ${open ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-[var(--surface)] rounded-[var(--radius-md)] py-1 max-h-[220px] overflow-y-auto"
          style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
          {options.map((opt) => (
            <button key={opt.id} onClick={() => { onChange(opt.id); setOpen(false); }}
              className={`w-full text-left px-3.5 py-2 text-[13px] flex items-center gap-2 transition-colors ${
                opt.id === value
                  ? 'text-[var(--amber-300)] bg-[var(--amber-900)]/50'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
              }`}>
              {opt.flag && <FlagIcon code={opt.flag} />}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface ConfigSelectorsProps {
  configFormat: ConfigFormat;
  deviceType: DeviceType;
  siteMode: SiteMode;
  endpointId: string;
  customEndpoint: string;
  onFormatChange: (v: ConfigFormat) => void;
  onDeviceChange: (v: DeviceType) => void;
  onSiteModeChange: (v: SiteMode) => void;
  onEndpointChange: (id: string) => void;
  onCustomEndpointChange: (v: string) => void;
}

export function ConfigSelectors({
  configFormat, deviceType, siteMode, endpointId, customEndpoint,
  onFormatChange, onDeviceChange, onSiteModeChange, onEndpointChange, onCustomEndpointChange,
}: ConfigSelectorsProps) {
  return (
    <div className="space-y-2 mb-3.5">
      <div className="grid grid-cols-2 gap-2 max-[500px]:grid-cols-1">
        <Dropdown label="Формат конфигурации" value={configFormat}
          options={CONFIG_FORMATS.map((f) => ({ id: f.id, label: f.name }))}
          onChange={(v) => onFormatChange(v as ConfigFormat)} />
        <Dropdown label="Настройки соединения" value={deviceType}
          options={[{ id: 'awg15', label: 'AmneziaWG 1.5' }]}
          onChange={(v) => onDeviceChange(v as DeviceType)} />
        <Dropdown label="Тип конфигурации" value={siteMode}
          options={[{ id: 'all', label: 'Все сайты' }, { id: 'specific', label: 'Определенные сайты' }]}
          onChange={(v) => onSiteModeChange(v as SiteMode)} />
        <Dropdown label="Конечная точка" value={endpointId}
          options={ENDPOINTS.map((e) => ({ id: e.id, label: e.label, flag: e.flag }))}
          onChange={onEndpointChange} />
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
    </div>
  );
}