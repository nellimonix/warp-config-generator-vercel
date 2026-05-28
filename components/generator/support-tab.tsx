'use client';

import { useState } from 'react';
import { DONATION_PLATFORMS, CRYPTO_ADDRESSES, type CryptoAddress } from '@/config/site';
import { trackEvent } from '@/lib/analytics';
import { FaHeart } from 'react-icons/fa';
import { FaArrowUpRightFromSquare } from 'react-icons/fa6';
import { TokenIcon } from '@token-icons/react';
import {
  CloudTipsIcon,
  DonationAlertsIcon,
  TributeIcon,
} from '@/components/icons/custom-icons';

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  cloudtips: <CloudTipsIcon />,
  donationalerts: <DonationAlertsIcon />,
  tribute: <TributeIcon />,
};

function CopyIcon({ copied }: { copied: boolean }) {
  if (copied) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17l-5-5" stroke="var(--success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function CryptoRow({ crypto }: { crypto: CryptoAddress }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(crypto.address);
      setCopied(true);
      trackEvent('crypto_copy', crypto.id);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-[var(--surface-2)] rounded-[var(--radius-md)] p-3 group">
      <div className="flex items-center gap-2 mb-1.5">
        <TokenIcon symbol={crypto.symbol} variant="branded" size={20} className="shrink-0" />
        <span className="text-[13px] font-medium text-[var(--text)]">{crypto.name}</span>
        {crypto.network && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-3)] text-[var(--text-dim)]">
            {crypto.network}
          </span>
        )}
      </div>

      <button
        onClick={handleCopy}
        title="Скопировать адрес"
        className="w-full flex items-center gap-2 px-2.5 py-2 bg-[var(--surface-3)] hover:bg-[var(--surface)] rounded-[var(--radius-sm)] transition-colors text-left"
      >
        <code className="flex-1 text-[11px] font-mono text-[var(--text-muted)] break-all leading-snug">
          {crypto.address}
        </code>
        <span className={`shrink-0 transition-colors ${copied ? 'text-[var(--success)]' : 'text-[var(--text-dim)] group-hover:text-[var(--text-muted)]'}`}>
          <CopyIcon copied={copied} />
        </span>
      </button>
    </div>
  );
}

export function SupportTab() {
  return (
    <div className="space-y-3">
      {/* Intro */}
      <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-[var(--radius-md)] bg-[var(--amber-900)] flex items-center justify-center">
            <FaHeart className="text-[var(--amber-300)] text-[15px]" />
          </div>
          <h2 className="text-[17px] font-medium">Поддержать проект</h2>
        </div>
        <p className="text-[14px] text-[var(--text-muted)] leading-relaxed">
          Этот сервис создаётся и поддерживается в свободное время. Проект развивается без платного доступа к основным функциям, а исходный код открыт на GitHub.
        </p>
        <p className="text-[14px] text-[var(--text-muted)] leading-relaxed mt-2">
          Если сервис оказался полезен и есть желание поддержать развитие проекта - буду благодарен любой помощи. Поддержка помогает оплачивать серверы, инфраструктуру и время, которое уходит на разработку и поддержку. Спасибо ❤️
        </p>
      </div>

      {/* Crypto */}
      <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
        <h2 className="text-[17px] font-medium mb-1">Криптовалюты</h2>
        <p className="text-[12px] text-[var(--text-dim)] mb-4">
          Нажмите на адрес, чтобы скопировать
        </p>

        <div className="grid gap-2">
          {CRYPTO_ADDRESSES.map((c) => (
            <CryptoRow key={c.id} crypto={c} />
          ))}
        </div>
      </div>

      {/* Donation platforms */}
      <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
        <h2 className="text-[17px] font-medium mb-1">Платёжные сервисы</h2>
        <p className="text-[12px] text-[var(--text-dim)] mb-4">
          Карты, СБП, Telegram Stars и другие способы
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {DONATION_PLATFORMS.map((p) => (
            <a
              key={p.id}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent('donate_click', p.id)}
              style={{ '--bg': p.bg, '--bg-hover': p.bgHover } as React.CSSProperties}
              className="flex items-center gap-2 px-3 py-2 rounded-[var(--radius-md)] bg-[var(--bg)] hover:bg-[var(--bg-hover)] active:scale-[0.985] shadow-[0_1px_0_rgba(255,255,255,0.08)_inset] transition-all group"
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                {PLATFORM_ICONS[p.id]}
              </div>
              <span className="flex-1 min-w-0 text-[12.5px] font-medium text-white truncate">
                {p.name}
              </span>
              <FaArrowUpRightFromSquare
                className="shrink-0 text-[10px] text-white/70 group-hover:text-white transition-colors"
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
