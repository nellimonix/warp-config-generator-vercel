export function Footer() {
  return (
    <footer className="mt-auto pt-5 pb-2 text-center text-[11px] text-[var(--text-dim)] font-light">
      © {new Date().getFullYear()} · MIT License ·{' '}
      <a href="https://github.com/nellimonix/warp-config-generator-vercel" target="_blank" rel="noopener noreferrer"
         className="hover:text-[var(--text-muted)] transition-colors">
        GitHub
      </a>
    </footer>
  );
}
