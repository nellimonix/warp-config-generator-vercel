'use client';

import { NOTICE, type NoticeVariant } from '@/config/banner';
import { FaTriangleExclamation, FaCircleInfo, FaCircleExclamation } from 'react-icons/fa6';

const VARIANT_STYLES: Record<NoticeVariant, { wrap: string; icon: string; link: string; Icon: React.ComponentType<{ className?: string }> }> = {
  warning: {
    wrap: 'bg-[var(--amber-300)] text-black',
    icon: 'text-black',
    link: 'text-black underline decoration-black/50 hover:decoration-black',
    Icon: FaTriangleExclamation,
  },
  info: {
    wrap: 'bg-blue-500/10 border border-blue-500/40 text-blue-200',
    icon: 'text-blue-300',
    link: 'text-blue-200 underline decoration-blue-500/60 hover:decoration-blue-200',
    Icon: FaCircleInfo,
  },
  error: {
    wrap: 'bg-[var(--error)]/10 border border-[var(--error)]/40 text-[var(--error)]',
    icon: 'text-[var(--error)]',
    link: 'text-[var(--error)] underline decoration-[var(--error)]/60 hover:decoration-[var(--error)]',
    Icon: FaCircleExclamation,
  },
};

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

function renderText(text: string, linkClass: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const [, label, href] = m;
    const external = !href.startsWith('tg:');
    nodes.push(
      <a
        key={`l-${i++}`}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={linkClass}
      >
        {label}
      </a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Notice() {
  if (!NOTICE.enabled) return null;

  const styles = VARIANT_STYLES[NOTICE.variant];
  const { Icon } = styles;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 px-4 py-3 mb-3 rounded-[var(--radius-lg)] ${styles.wrap}`}
    >
      <Icon className={`shrink-0 mt-0.5 text-[16px] ${styles.icon}`} />
      <p className="text-[13px] leading-[1.5]">
        {renderText(NOTICE.text, styles.link)}
      </p>
    </div>
  );
}
