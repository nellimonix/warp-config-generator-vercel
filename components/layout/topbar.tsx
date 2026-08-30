'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Heart, Info, SlidersHorizontal, Sparkle, SquaresFour } from '@phosphor-icons/react';

const TABS = [
  { id: 'generator', label: 'Генератор', hash: '/', icon: <SlidersHorizontal size={14} weight="duotone" /> },
  // { id: 'formats', label: 'Форматы' },
  { id: 'applications', label: 'Приложения', hash: '#apps', icon: <SquaresFour size={14} weight="duotone" /> },
  { id: 'ultimate', label: 'Ультимативный', hash: '#ultimate', icon: <Sparkle size={14} weight="duotone" /> },
  { id: 'about', label: 'О проекте', hash: '#about', icon: <Info size={14} weight="duotone" /> },
  { id: 'support', label: 'Поддержать', hash: '#support', icon: <Heart size={14} weight="duotone" /> },
];

interface TopbarProps {
  activeTab: string;
}

export function Topbar({ activeTab }: TopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeLabel = TABS.find((t) => t.id === activeTab)?.label ?? '';

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className="relative flex items-center justify-between gap-2.5 px-4 sm:px-5 py-2.5 bg-[var(--surface)] rounded-[var(--radius-lg)] mb-4">
      <a href="/"
        className="flex items-center gap-2.5 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber-500)]"
        aria-label="Открыть генератор">
        <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--surface-2)] flex items-center justify-center shrink-0">
          <Image src="/cloud.ico" alt="Logo" width={20} height={20} className="object-cover" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight truncate">
          WARP Generator by llimonix
        </span>
      </a>

      {/* Desktop tabs */}
      <nav className="hidden sm:flex gap-1">
        {TABS.map((tab) => (
          <a
            key={tab.id}
            href={tab.hash}
            className={`px-3.5 py-1.5 rounded-lg text-[13px] transition-all inline-flex items-center gap-1.5 ${
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

      {/* Mobile burger */}
      <button
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Меню"
        aria-expanded={menuOpen}
        className="sm:hidden flex items-center gap-2 h-9 px-2.5 rounded-[var(--radius-md)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-colors shrink-0"
      >
        <span className="text-[12px] text-[var(--text-muted)] max-w-[90px] truncate">{activeLabel}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[var(--text-muted)]">
          {menuOpen ? (
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <>
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <>
          <div
            className="sm:hidden fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <nav className="sm:hidden absolute right-3 top-[calc(100%+6px)] z-50 min-w-[180px] p-1 rounded-[var(--radius-md)] bg-[var(--surface-2)] shadow-lg flex flex-col gap-0.5 animate-in">
            {TABS.map((tab) => (
              <a
                key={tab.id}
                href={tab.hash}
                onClick={() => setMenuOpen(false)}
                className={`text-left px-3 py-2 rounded-md text-[13px] transition-colors flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[var(--surface-3)] text-[var(--text)] font-medium'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-3)]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </a>
            ))}
          </nav>
        </>
      )}
    </header>
  );
}
