'use client';

import type { ReactNode } from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: ReactNode;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <label className={`flex items-center gap-2.5 select-none ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-[var(--amber-700)]' : 'bg-[var(--surface-3)]'
        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </button>
      <span className="text-[13px] text-[var(--text-muted)]">{label}</span>
    </label>
  );
}
