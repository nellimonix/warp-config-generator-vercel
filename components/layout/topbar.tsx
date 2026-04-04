'use client';
import Image from "next/image";

const TABS = [
  { id: 'generator', label: 'Генератор' },
  // { id: 'formats', label: 'Форматы' },
  { id: 'applications', label: 'Приложения' },
  { id: 'about', label: 'О проекте' },
];

interface TopbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Topbar({ activeTab, onTabChange }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-5 py-2.5 bg-[var(--surface)] rounded-[var(--radius-lg)] mb-4 flex-wrap gap-2.5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--surface-2)] flex items-center justify-center">
          <Image src="/cloud.ico" alt="Logo" width={20} height={20} className="object-cover"
          />
        </div>
        <span className="text-[15px] font-semibold tracking-tight">WARP Generator by llimonix</span>
      </div>

      <nav className="flex gap-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] transition-all ${
              activeTab === tab.id
                ? 'bg-[var(--surface-3)] text-[var(--text)] font-medium'
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
