import { CONFIG_FORMATS } from '@/config/formats';

export function FormatsTab() {
  return (
    <div className="flex flex-col gap-2">
      {CONFIG_FORMATS.map((f) => (
        <div
          key={f.id}
          className="flex items-center gap-3 px-4 py-3.5 bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-md)]"
        >
          <span className="text-[14px] font-medium flex-1">{f.name}</span>
          <span className="text-[11px] text-[var(--text-dim)] bg-[var(--surface-2)] rounded px-2 py-0.5 font-mono">
            .{f.extension}
          </span>
          {f.supportsQR ? (
            <span className="text-[11px] text-[var(--success)]">QR ✓</span>
          ) : (
            <span className="text-[11px] text-[var(--text-dim)]">—</span>
          )}
        </div>
      ))}
    </div>
  );
}
