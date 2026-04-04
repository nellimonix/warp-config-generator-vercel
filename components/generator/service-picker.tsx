'use client';

import type { ServiceEntry } from '@/types';
import { ServiceIcon } from '@/components/icons/icon-resolver';

interface ServicePickerProps {
  services: ServiceEntry[];
  selected: string[];
  onToggle: (key: string) => void;
}

export function ServicePicker({ services, selected, onToggle }: ServicePickerProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5 mb-3.5 max-h-[260px] overflow-y-auto pr-1">
      {services.map((service) => {
        const isActive = selected.includes(service.key);
        return (
          <button
            key={service.key}
            onClick={() => onToggle(service.key)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-md)] text-[13px] transition-all text-left ${
              isActive
                ? 'bg-[var(--amber-900)] text-[var(--amber-300)] font-medium'
                : 'bg-[var(--surface-2)] text-[var(--text-muted)] hover:bg-[var(--surface-3)] hover:text-[var(--text)]'
            }`}
          >
            <ServiceIcon icon={service.icon} className="w-4 h-4 shrink-0" />
            <span className="truncate">{service.name}</span>
            {service.type === 'new' && (
              <span className="relative flex h-1.5 w-1.5 ml-auto shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--accent)]" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
