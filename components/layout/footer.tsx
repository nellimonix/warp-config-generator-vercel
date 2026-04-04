import { SITE } from '@/config/site';

export function Footer() {
  return (
    <footer className="mt-auto pt-5 pb-2 text-center text-[11px] text-[var(--text-dim)] font-light">
      © {SITE.year} ·{' '}
      <a href={`mailto:${SITE.email}`} className="hover:text-[var(--text-muted)] transition-colors">
        {SITE.email}
      </a>
    </footer>
  );
}
