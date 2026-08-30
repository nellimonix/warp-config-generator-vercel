'use client';
import Image from "next/image";
import { Info, SlidersHorizontal, SquaresFour } from '@phosphor-icons/react';

const TABS = [
  { id: 'generator', label: 'Генератор', hash: '/', icon: <SlidersHorizontal size={14} weight="duotone" /> },
  // { id: 'formats', label: 'Форматы' },
  { id: 'applications', label: 'Приложения', hash: '#apps', icon: <SquaresFour size={14} weight="duotone" /> },
  { id: 'about', label: 'О проекте', hash: '#about', icon: <Info size={14} weight="duotone" /> },
];

interface TopbarProps {
  activeTab: string;
}

export function Topbar({ activeTab }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-[var(--surface)] rounded-[var(--radius-lg)] mb-4 flex-wrap gap-2.5">
      <a href="/"
        className="flex items-center gap-2.5 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber-500)]"
        aria-label="Открыть генератор">
        <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--surface-2)] flex items-center justify-center">
          <Image src="/cloud.ico" alt="Logo" width={20} height={20} className="object-cover"
          />
        </div>
        <span className="text-[15px] font-semibold tracking-tight">WARP Generator by llimonix</span>
      </a>

      <nav className="flex gap-1 max-sm:w-full" aria-label="Разделы сайта">
        {TABS.map((tab) => (
          <a
            key={tab.id}
            href={tab.hash}
            className={`shrink-0 px-3.5 py-2 rounded-lg text-[13px] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber-500)] inline-flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-[var(--surface-3)] text-[var(--text)] font-medium'
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
