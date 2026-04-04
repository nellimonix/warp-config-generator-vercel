import { SITE } from '@/config/site';
import { FaAndroid, FaWindows, FaAppStoreIos, FaApple } from "react-icons/fa";
import { MdRouter } from "react-icons/md";

const TECH = ['Next.js', 'TypeScript', 'Tailwind CSS', 'Docker', 'WireGuard', 'hCaptcha'];

interface ClientApp {
  name: string;
  description?: string;
  url?: string;
  downloadUrl?: string;
  note?: string;
  noteUrl?: string;
}

interface PlatformSection {
  platform: string;
  icon: React.ReactNode;
  apps: ClientApp[];
}

const CLIENTS: PlatformSection[] = [
  {
    platform: 'Android',
    icon: <FaAndroid />,
    apps: [
      { name: 'WG Tunnel', description: 'WireGuard-клиент с поддержкой AWG', url: 'https://github.com/zaneschepke/wgtunnel', downloadUrl: 'https://github.com/wgtunnel/wgtunnel/releases/latest' },
      { name: 'AmneziaWG', description: 'Официальный клиент AmneziaWG', url: 'https://github.com/amnezia-vpn/amneziawg-android', downloadUrl: 'https://github.com/amnezia-vpn/amneziawg-android/releases/latest' },
      { name: 'AmneziaVPN', description: 'Полнофункциональный VPN-клиент', url: 'https://github.com/amnezia-vpn/amnezia-client', downloadUrl: 'https://github.com/amnezia-vpn/amnezia-client/releases/latest' },
    ],
  },
  {
    platform: 'Windows',
    icon: <FaWindows />,
    apps: [
      { name: 'AmneziaWG (Мод)', description: 'Модифицированный клиент с AWG 1.5', url: 'https://github.com/RomikB/amneziawg-windows-client', downloadUrl: 'https://github.com/RomikB/amneziawg-windows-client/releases/latest', note: 'Есть патч для Windows 7', noteUrl: 'https://github.com/stunndard/golangwin7patch/releases/latest' },
      { name: 'WireSock', description: 'WireGuard-клиент для Windows', url: 'https://www.wiresock.net/', downloadUrl: 'https://www.wiresock.net/wiresock-secure-connect/download' },
      { name: 'Clash', description: 'Прокси-клиент с поддержкой WireGuard', url: 'https://github.com/clash-verge-rev/clash-verge-rev', downloadUrl: 'https://github.com/clash-verge-rev/clash-verge-rev/releases/latest' },
      { name: 'AmneziaVPN', description: 'Полнофункциональный VPN-клиент', url: 'https://github.com/amnezia-vpn/amnezia-client', downloadUrl: 'https://github.com/amnezia-vpn/amnezia-client/releases/latest' },
    ],
  },
  {
    platform: 'iOS',
    icon: <FaAppStoreIos />,

    apps: [
      { name: 'AmneziaWG', description: 'Официальный клиент для iOS', url: 'https://apps.apple.com/app/amneziawg/id6478942365' },
      { name: 'DefaultVPN', description: 'VPN-клиент с поддержкой AWG', url: 'https://apps.apple.com/app/defaultvpn/id6744577928' },
      { name: 'Clash Mi', description: 'Clash для iOS', url: 'https://apps.apple.com/app/clash-mi/id6744321968' },
      { name: 'AmneziaVPN', description: 'Полнофункциональный клиент', url: 'https://apps.apple.com/app/amnezia-vpn/id1600529900', note: 'Недоступен в RU регионе' },
    ],
  },
  {
    platform: 'macOS',
    icon: <FaApple />,
    apps: [
      { name: 'AmneziaWG', description: 'Клиент для macOS', url: 'https://apps.apple.com/app/amneziawg/id6478942365' },
      { name: 'Clash', description: 'Clash для macOS', url: 'https://github.com/clash-verge-rev/clash-verge-rev', downloadUrl: 'https://github.com/clash-verge-rev/clash-verge-rev/releases/latest' },
    ],
  },
  {
    platform: 'Роутеры',
    icon: <MdRouter />,
    apps: [
      { name: 'Keenetic', description: 'Требуется entware или прошивка 5.1 alpha 3', url: 'https://gitlab.com/ShidlaSGC/keenetic-entware-awg-go/-/blob/main/README.md' },
      { name: 'OpenWRT #1', url: 'tg://resolve?domain=itdogchat&post=44512&comment=755535' },
      { name: 'OpenWRT #2', url: 'tg://resolve?domain=itdogchat&post=44512&comment=759893' },
    ],
  },
];

export function AboutTab() {
  return (
    <div className="space-y-3">
      {/* About */}
      <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
        <h2 className="text-[17px] font-medium mb-3">О проекте</h2>
        <p className="text-[14px] text-[var(--text-muted)] leading-relaxed mb-4">
          {SITE.description}. Создавайте конфиги для оптимизации сетевого подключения,
          повышения безопасности и защиты трафика. Поддержка множества форматов и платформ.
        </p>
        <div className="flex flex-wrap gap-2">
          {TECH.map((t) => (
            <span key={t} className="text-[12px] px-2.5 py-1 bg-[var(--surface-2)] rounded-md text-[var(--text-muted)]">
              {t}
            </span>
          ))}
        </div>
        <p className="text-[13px] text-[var(--text-dim)] mt-4">MIT License · nellimonix</p>
      </div>

      {/* Clients */}
      <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
        <h2 className="text-[17px] font-medium mb-1">Совместимые клиенты</h2>
        <p className="text-[12px] text-[var(--text-dim)] mb-4">
          Приложения с поддержкой AmneziaWG 1.5
        </p>

        <div className="space-y-5">
          {CLIENTS.map((section) => (
            <div key={section.platform}>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[var(--text-muted)]">{section.icon}</span>
                <h3 className="text-[14px] font-medium">{section.platform}</h3>
              </div>
              <div className="grid gap-1.5">
                {section.apps.map((app) => (
                  <div key={app.name} className="flex items-center gap-3 px-3.5 py-2.5 bg-[var(--surface-2)] rounded-[var(--radius-md)] group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-[var(--text)]">{app.name}</span>
                        {app.note && (
                          app.noteUrl ? (
                            <a
                              href={app.noteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-[var(--amber-300)] bg-[var(--amber-900)]/50 rounded px-1.5 py-0.5 shrink-0"
                            >
                              {app.note}
                            </a>
                          ) : (
                            <span className="text-[10px] text-[var(--amber-300)] bg-[var(--amber-900)]/50 rounded px-1.5 py-0.5 shrink-0">
                              {app.note}
                            </span>
                          )
                        )}
                      </div>
                      {app.description && (
                        <p className="text-[11px] text-[var(--text-dim)] mt-0.5 truncate">{app.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      {app.url && (
                        <a href={app.url} target="_blank" rel="noopener noreferrer"
                          className="w-7 h-7 rounded-md bg-[var(--surface-3)] flex items-center justify-center hover:bg-[var(--surface)] transition-colors"
                          title="GitHub / Сайт">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </a>
                      )}
                      {app.downloadUrl && (
                        <a href={app.downloadUrl} target="_blank" rel="noopener noreferrer"
                          className="w-7 h-7 rounded-md bg-[var(--amber-900)] flex items-center justify-center hover:bg-[var(--amber-700)] transition-colors"
                          title="Скачать">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="var(--amber-300)" strokeWidth="1.5" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
