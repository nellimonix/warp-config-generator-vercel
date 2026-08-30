import { SITE } from '@/config/site';

const TECH = ['Next.js', 'TypeScript', 'Tailwind CSS', 'Docker', 'AmneziaWG', 'ALTCHA'];

export function AboutPanel() {
  return (
    <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
      <h2 className="text-[17px] font-medium mb-3">О проекте</h2>
      <p className="text-[14px] text-[var(--text-muted)] leading-relaxed mb-4">
        {SITE.description}. Создавайте конфиги для оптимизации сетевого подключения,
        повышения безопасности и защиты трафика. Поддержка множества форматов и платформ.
      </p>
      <div className="flex flex-wrap gap-2">
        {TECH.map((item) => (
          <span key={item} className="text-[12px] px-2.5 py-1 bg-[var(--surface-2)] rounded-md text-[var(--text-muted)]">
            {item}
          </span>
        ))}
      </div>
      <p className="text-[13px] text-[var(--text-dim)] mt-4">MIT License · nellimonix</p>
    </div>
  );
}

export function AboutTab() {
  return <AboutPanel />;
}
