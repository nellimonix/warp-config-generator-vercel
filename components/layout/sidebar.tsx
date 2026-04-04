'use client';

import { useState, useEffect } from 'react';
import { LINKS } from '@/config/site';
import { ENDPOINTS } from '@/config/endpoints';
import { FlagIcon } from '@/components/icons/flag-icon';
import { RiRobot2Fill } from "react-icons/ri";
import { BsTelegram } from "react-icons/bs";
import { FaGithub, FaHeart } from "react-icons/fa";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[11px] text-[var(--text-dim)] tracking-wider uppercase mt-4 mb-1.5 px-1 first:mt-0">
      {children}
    </p>
  );
}

function SidebarLink({ href, icon, children, badge }: {
  href: string; icon: React.ReactNode; children: React.ReactNode; badge?: React.ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text)] transition-all">
      <div className="w-8 h-8 rounded-lg bg-[var(--surface-3)] flex items-center justify-center shrink-0 text-[var(--text-muted)]">
        {icon}
      </div>
      <span className="flex-1 text-[13px]">{children}</span>
      {badge}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[var(--text-dim)]">
        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" />
      </svg>
    </a>
  );
}

function GitHubStars() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch(`https://api.github.com/repos/${LINKS.githubRepo}`)
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setCount(d.stargazers_count))
      .catch(() => {});
  }, []);

  return (
    <span className="text-[11px] text-[var(--amber-300)] bg-[var(--amber-900)] rounded px-1.5 py-0.5 font-medium">
      ★ {count !== null ? count : '...'}
    </span>
  );
}

export function Sidebar() {
  const servers = ENDPOINTS.filter((e) => e.flag);

  return (
    <aside className="flex flex-col gap-1.5 lg:bg-[var(--surface)] lg:rounded-[var(--radius-lg)] lg:p-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">

      <SectionLabel>Инструменты</SectionLabel>
      <SidebarLink href={LINKS.telegramBot} icon={<RiRobot2Fill />}>
        Warp Generator Bot
      </SidebarLink>

      <SectionLabel>Сообщество</SectionLabel>
      <SidebarLink href={LINKS.telegramChannel} icon={<BsTelegram />}>
        Telegram канал
      </SidebarLink>
      <SidebarLink href={LINKS.github} icon={<FaGithub />} badge={<GitHubStars />}>
        GitHub
      </SidebarLink>
      <div className="px-3 py-2 rounded-[var(--radius-md)] bg-[var(--surface-2)] text-center">
        <span className="text-[11px] text-[var(--text-dim)]">
          Поставьте звезду на GitHub
        </span>
      </div>

      {servers.length > 0 && (
        <>
          <SectionLabel>Серверы</SectionLabel>
          {servers.map((s) => (
            <a key={s.id} href={s.externalUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[var(--radius-md)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[var(--text)] transition-all">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-3)] flex items-center justify-center shrink-0">
                <FlagIcon code={s.flag!} />
              </div>
              <span className="flex-1 text-[13px]">{s.label}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[var(--text-dim)]">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </a>
          ))}
        </>
      )}

      <div className="flex-1 min-h-[16px]" />

      <a
        href={LINKS.donate}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 mt-2 px-3 py-3 rounded-[var(--radius-md)] bg-[var(--amber-900)] hover:bg-[var(--amber-700)] transition-all"
      >
        <div className="flex items-center justify-center w-5 h-5 shrink-0">
          <FaHeart className="text-[var(--amber-300)] text-[14px]" />
        </div>
        <span className="text-[13px] font-medium text-[var(--amber-300)] leading-none">
          Поддержать проект
        </span>
      </a>
    </aside>
  );
}