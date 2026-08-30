import type { ReactNode } from 'react';
import {
  AndroidLogo, AppleLogo, ArrowSquareOut, DeviceMobile, DownloadSimple,
  LinuxLogo, Network, WifiHigh, WindowsLogo,
} from '@phosphor-icons/react';

interface ClientApp {
  name: string;
  description: string;
  url: string;
  downloadUrl?: string;
  note?: string;
}

interface PlatformSection {
  id: string;
  platform: string;
  subtitle: string;
  icon: ReactNode;
  apps: ClientApp[];
}

const CLIENTS: PlatformSection[] = [
  {
    id: 'android', platform: 'Android', subtitle: 'Телефоны и планшеты', icon: <AndroidLogo size={16} weight="fill" />,
    apps: [
      { name: 'WG Tunnel', description: 'WireGuard-клиент с поддержкой AmneziaWG', url: 'https://github.com/wgtunnel/android', downloadUrl: 'https://github.com/wgtunnel/android/releases/latest' },
      { name: 'AmneziaWG', description: 'Официальный оптимизированный клиент Amnezia', url: 'https://play.google.com/store/apps/details?id=org.amnezia.awg' },
      { name: 'AmneziaVPN', description: 'Полнофункциональный VPN-клиент', url: 'https://play.google.com/store/apps/details?id=org.amnezia.vpn' },
      { name: 'Clash Mi', description: 'Упрощённый клиент на базе Clash', url: 'https://github.com/KaringX/clashmi', downloadUrl: 'https://github.com/KaringX/clashmi/releases/latest' },
      { name: 'Clash Meta', description: 'Клиент Clash Meta для Android', url: 'https://github.com/MetaCubeX/ClashMetaForAndroid', downloadUrl: 'https://github.com/MetaCubeX/ClashMetaForAndroid/releases/latest' },
      { name: 'FlClash', description: 'Кроссплатформенный клиент Clash', url: 'https://flclash.cc/en/' },
      { name: 'NekoBox+', description: 'Многофункциональный клиент', url: 'https://4pda.to/forum/index.php?showtopic=1121122', note: 'Для открытия страницы загрузки может потребоваться VPN' },
    ],
  },
  {
    id: 'windows', platform: 'Windows', subtitle: 'Компьютеры и ноутбуки', icon: <WindowsLogo size={16} weight="fill" />,
    apps: [
      { name: 'AmneziaWG 2.0', description: 'Актуальный официальный клиент', url: 'https://github.com/amnezia-vpn/amneziawg-windows-client', downloadUrl: 'https://github.com/amnezia-vpn/amneziawg-windows-client/releases/latest' },
      { name: 'AmneziaWG (RomikB)', description: 'Сборка с патчем для Windows 7', url: 'https://github.com/RomikB/amneziawg-windows-client', downloadUrl: 'https://github.com/RomikB/amneziawg-windows-client/releases/latest' },
      { name: 'WireSock', description: 'Системный WireGuard-клиент для Windows', url: 'https://www.wiresock.net/' },
      { name: 'Clash Mi', description: 'Упрощённый вариант Clash', url: 'https://github.com/KaringX/clashmi', downloadUrl: 'https://github.com/KaringX/clashmi/releases/latest' },
      { name: 'Clash Verge Rev', description: 'Современный клиент Clash с поддержкой TUN', url: 'https://github.com/clash-verge-rev/clash-verge-rev', downloadUrl: 'https://github.com/clash-verge-rev/clash-verge-rev/releases/latest' },
      { name: 'FlClash', description: 'Кроссплатформенная альтернатива', url: 'https://flclash.cc/en/' },
      { name: 'Throne', description: 'Продвинутый менеджер прокси-профилей', url: 'https://github.com/throneproj/Throne', downloadUrl: 'https://github.com/throneproj/Throne/releases/latest' },
      { name: 'AmneziaVPN', description: 'Официальный многоформатный клиент', url: 'https://github.com/amnezia-vpn/amnezia-client', downloadUrl: 'https://github.com/amnezia-vpn/amnezia-client/releases/latest' },
      { name: 'WG Tunnel', description: 'Клиент WG Tunnel для Windows', url: 'https://wgtunnel.com/download?platform=windows', note: 'Для Windows рекомендуется выбрать другой клиент' },
    ],
  },
  {
    id: 'ios', platform: 'iOS', subtitle: 'iPhone и iPad', icon: <DeviceMobile size={16} weight="duotone" />,
    apps: [
      { name: 'AmneziaWG', description: 'Официальный клиент в App Store', url: 'https://apps.apple.com/ru/app/amneziawg/id6478942365' },
      { name: 'DefaultVPN', description: 'Клиент с поддержкой AmneziaWG', url: 'https://apps.apple.com/us/app/defaultvpn/id6744725017' },
      { name: 'AmneziaVPN', description: 'Полнофункциональный клиент', url: 'https://apps.apple.com/us/app/amneziavpn/id1600529900', note: 'Недоступен в российском регионе App Store' },
      { name: 'Clash Mi', description: 'Упрощённый клиент Clash', url: 'https://apps.apple.com/us/app/clash-mi/id6744321968' },
      { name: 'Shadowrocket', description: 'Многофункциональный сетевой клиент', url: 'https://apps.apple.com/us/app/shadowrocket/id932747118' },
    ],
  },
  {
    id: 'macos', platform: 'macOS', subtitle: 'Компьютеры Apple', icon: <AppleLogo size={16} weight="fill" />,
    apps: [
      { name: 'AmneziaWG', description: 'Нативный клиент AmneziaWG', url: 'https://apps.apple.com/ru/app/amneziawg/id6478942365' },
      { name: 'Clash Mi', description: 'Упрощённый интерфейс Clash', url: 'https://clashmi.app/download' },
      { name: 'Clash Verge Rev', description: 'Полнофункциональный клиент Clash', url: 'https://github.com/clash-verge-rev/clash-verge-rev', downloadUrl: 'https://github.com/clash-verge-rev/clash-verge-rev/releases/latest' },
      { name: 'FlClash', description: 'Кроссплатформенная альтернатива', url: 'https://flclash.cc/en/' },
    ],
  },
  {
    id: 'linux', platform: 'Linux', subtitle: 'Десктопные дистрибутивы и серверы', icon: <LinuxLogo size={16} weight="fill" />,
    apps: [
      { name: 'AmneziaWG', description: 'Модуль ядра AmneziaWG для Linux', url: 'https://github.com/amnezia-vpn/amneziawg-linux-kernel-module', downloadUrl: 'https://github.com/amnezia-vpn/amneziawg-linux-kernel-module/releases/latest' },
      { name: 'Clash Verge Rev', description: 'Современный интерфейс для Clash', url: 'https://github.com/clash-verge-rev/clash-verge-rev', downloadUrl: 'https://github.com/clash-verge-rev/clash-verge-rev/releases/latest' },
      { name: 'Clash Mi', description: 'Минималистичный клиент Clash', url: 'https://clashmi.app/download' },
      { name: 'FlClash', description: 'Кроссплатформенная альтернатива', url: 'https://flclash.cc/en/' },
    ],
  },
  {
    id: 'openwrt', platform: 'OpenWRT', subtitle: 'Маршрутизаторы на OpenWRT', icon: <Network size={16} weight="duotone" />,
    apps: [
      { name: 'SSClash', description: 'Гибкий клиент Mihomo', url: 'https://ssclash.notion.site/Mihomo-SSClash-15989188f6b48051a97fc887adea736a' },
      { name: 'Nikki', description: 'Клиент Mihomo для OpenWRT', url: 'https://ssclash.notion.site/OpenWrt-Nikki-2e589188f6b4805a9830eee388f055b9' },
      { name: 'Mixomo', description: 'Маршрутизация на базе MagiTrickle', url: 'https://github.com/StressOzz/Zapret-Manager', downloadUrl: 'https://github.com/StressOzz/Zapret-Manager/releases/latest' },
      { name: 'NetShift', description: 'Клиент на базе XRay', url: 'https://github.com/StressOzz/Zapret-Manager', downloadUrl: 'https://github.com/StressOzz/Zapret-Manager/releases/latest' },
    ],
  },
  {
    id: 'keenetic', platform: 'Keenetic', subtitle: 'Роутеры Keenetic с Entware', icon: <WifiHigh size={16} weight="duotone" />,
    apps: [
      { name: 'AmneziaWG-GO', description: 'Клиент AmneziaWG для Keenetic', url: 'https://gitlab.com/ShidlaSGC/keenetic-entware-awg-go/-/blob/main/README.md' },
      { name: 'AWG-Manager', description: 'Менеджер подключений AmneziaWG', url: 'https://github.com/hoaxisr/awg-manager', downloadUrl: 'https://github.com/hoaxisr/awg-manager/releases/latest' },
      { name: 'Xkeen + Mihomo', description: 'Связка Xkeen и Mihomo', url: 'https://ssclash.notion.site/Keenetic-XKeen-Mihomo-27489188f6b4803cbc1ff95b090993e5' },
    ],
  },
];

function AppCard({ app }: { app: ClientApp }) {
  return (
    <div className="bg-[var(--surface-2)] rounded-[var(--radius-md)] px-3.5 py-2.5 group">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-[var(--text)] leading-snug">{app.name}</p>
          <p className="text-[11px] text-[var(--text-dim)] leading-relaxed mt-0.5">{app.description}</p>
          {app.note && <p className="text-[11px] text-[var(--amber-300)] leading-relaxed mt-1">{app.note}</p>}
        </div>
        <div className="flex items-center gap-1.5 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity max-sm:opacity-100">
          <a href={app.url} target="_blank" rel="noopener noreferrer"
            className="w-7 h-7 rounded-md bg-[var(--surface-3)] flex items-center justify-center hover:bg-[var(--surface)] transition-colors"
            title="Открыть сайт">
            <ArrowSquareOut size={13} className="text-[var(--text-muted)]" />
          </a>
          {app.downloadUrl && (
            <a href={app.downloadUrl} target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 rounded-md bg-[var(--amber-900)] flex items-center justify-center hover:bg-[var(--amber-700)] transition-colors"
              title="Скачать">
              <DownloadSimple size={13} weight="bold" className="text-[var(--amber-300)]" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export function ApplicationsTab() {
  return (
    <div className="space-y-3">
      <nav className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5" aria-label="Платформы">
        <h2 className="text-[15px] font-medium mb-3">Перейти к платформе</h2>
        <div className="flex flex-wrap gap-2">
          {CLIENTS.map((section) => (
            <a key={section.id} href={`#clients-${section.id}`}
              className="h-9 px-3 rounded-[var(--radius-md)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[12px] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center gap-2 transition-colors">
              <span className="text-[var(--text-dim)]">{section.icon}</span>
              {section.platform}
            </a>
          ))}
        </div>
      </nav>

      <section className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
        <h2 className="text-[17px] font-medium">Совместимые клиенты</h2>
        <p className="text-[12px] text-[var(--text-dim)] mt-1 mb-5">Приложения для обычных конфигов и Clash-профилей</p>

        <div className="space-y-5">
          {CLIENTS.map((section) => (
            <section key={section.id} id={`clients-${section.id}`} className="scroll-mt-4">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="text-[var(--text-muted)]">{section.icon}</span>
                <div>
                  <h3 className="text-[14px] font-medium">{section.platform}</h3>
                  <p className="text-[10px] text-[var(--text-dim)]">{section.subtitle}</p>
                </div>
              </div>
              <div className="grid gap-1.5">
                {section.apps.map((app) => <AppCard key={app.name} app={app} />)}
              </div>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
