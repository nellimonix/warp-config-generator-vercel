import Image from 'next/image';
import { ArrowSquareOut as ExternalLink, Check, DownloadSimple as Download } from '@phosphor-icons/react';
import { RiRobot2Fill } from 'react-icons/ri';

const BOT_URL = 'tg://resolve?domain=warp_generator_bot';
const CLASH_DOWNLOAD_URL = 'https://github.com/clash-verge-rev/clash-verge-rev/releases/latest';

const PROXY_GROUPS = [
  { name: 'Cloudflare', description: 'Собирательная группа: выберите одну рабочую точку и используйте Cloudflare в остальных группах.', icon: '/proxy-groups/cloudflare.svg' },
  { name: 'Relay-сервера', description: 'Собирательная группа для relay-точек, доступных только в конфиге из бота.', icon: '/proxy-groups/relay.svg' },
  { name: 'LOCAL-PROXY', description: 'Определяет, какая точка используется локальным SOCKS-прокси.', icon: '/proxy-groups/proxy.svg' },
  { name: 'Обход качества Twitch', description: 'Меняет определение региона для нужных доменов, не направляя через прокси основной трафик Twitch.', icon: '/proxy-groups/twitch.svg' },
  { name: 'Игры', description: 'Сервисы игровых платформ, включая EA и Blizzard.', icon: '/proxy-groups/games.svg' },
  { name: 'YouTube', description: 'Маршрутизация YouTube через выбранную точку.', icon: '/proxy-groups/youtube.svg' },
  { name: 'Discord', description: 'Отдельные правила маршрутизации для Discord.', icon: '/proxy-groups/discord.svg' },
  { name: 'Telegram', description: 'Отдельные правила маршрутизации для Telegram.', icon: '/proxy-groups/telegram.svg' },
  { name: 'Meta', description: 'Instagram, Facebook и другие сервисы Meta.', icon: '/proxy-groups/meta.svg' },
  { name: 'Геоблок', description: 'Сайты, которые ограничили доступ пользователям из вашего региона.', icon: '/proxy-groups/geoblock.svg' },
  { name: 'AI', description: 'Популярные ИИ-сервисы, включая Grok и Claude.', icon: '/proxy-groups/ai.svg' },
  { name: 'Torrent', description: 'Сайты RuTracker, RuTor и похожие. Трафик торрент-клиента можно отдельно направить через LOCAL-PROXY.', icon: '/proxy-groups/torrent.svg' },
  { name: 'Все остальное', description: 'Маршрутизация трафика, который не попал в отдельные правила.', icon: '/proxy-groups/global.svg' },
];

function Step({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[28px_1fr] gap-3">
      <span className="w-7 h-7 rounded-lg bg-[var(--surface-3)] text-[12px] font-semibold text-[var(--amber-300)] flex items-center justify-center">
        {number}
      </span>
      <div>
        <h3 className="text-[13px] font-medium">{title}</h3>
        <div className="text-[12px] text-[var(--text-muted)] leading-relaxed mt-1">{children}</div>
      </div>
    </li>
  );
}

export function UltimateGuideTab() {
  return (
    <div className="space-y-3 animate-in">
      <section className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-[19px] font-semibold tracking-tight">Ультимативный конфиг для Clash</h2>
            <p className="text-[13px] text-[var(--text-muted)] leading-relaxed mt-2 max-w-[68ch]">
              Расширенный Clash-профиль с готовыми правилами и большим набором endpoints.
            </p>
          </div>
          <span className="shrink-0 text-[11px] text-[var(--amber-300)] bg-[var(--amber-900)] rounded-lg px-2.5 py-1.5">
            Только в боте
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-2 mt-5">
          <a href={BOT_URL} target="_blank" rel="noopener noreferrer"
            className="h-11 px-4 rounded-[var(--radius-md)] bg-[var(--amber-900)] hover:bg-[var(--amber-700)] text-[13px] font-medium text-[var(--amber-300)] flex items-center justify-center gap-2 transition-colors">
            <RiRobot2Fill size={18} /> Открыть WARP Generator Bot <ExternalLink size={14} />
          </a>
          <a href={CLASH_DOWNLOAD_URL} target="_blank" rel="noopener noreferrer"
            className="h-11 px-4 rounded-[var(--radius-md)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] text-[13px] font-medium text-[var(--text)] flex items-center justify-center gap-2 transition-colors">
            <Download size={16} /> Скачать Clash Verge Rev
          </a>
        </div>
      </section>

      <section className="bg-[var(--surface)] rounded-[var(--radius-lg)] overflow-hidden">
        <div className="p-5 pb-3">
          <h2 className="text-[17px] font-medium">Видеоинструкция</h2>
        </div>
        <video className="block w-full aspect-video bg-black" controls playsInline preload="none" poster="/ultimate-clash-guide.webp">
          <source src="/ultimate-clash-guide.mp4" type="video/mp4" />
          Ваш браузер не поддерживает воспроизведение видео.
        </video>
      </section>

      <section className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
        <h2 className="text-[17px] font-medium mb-5">Настройка</h2>
        <ol className="space-y-5">
          <Step number="1" title="Сгенерируйте конфиг в боте">
            Откройте <a href={BOT_URL} target="_blank" rel="noopener noreferrer" className="text-[var(--amber-300)] hover:underline underline-offset-4">@warp_generator_bot</a>,
            нажмите «Сгенерировать конфиг» → «Ультимативный конфиг» → «Clash» и скачайте файл <code>.yaml</code>.
          </Step>
          <Step number="2" title="Импортируйте профиль">
            В Clash Verge Rev откройте «Профили / Profiles», создайте профиль типа Local и выберите скачанный файл.
            Также можно перетащить файл в окно приложения.
          </Step>
          <Step number="3" title="Выберите рабочие точки">
            В каждой прокси-группе выберите подходящую точку. Чтобы не повторять выбор, настройте одну точку в группе Cloudflare,
            а затем выбирайте Cloudflare в остальных группах.
          </Step>
          <Step number="4" title="Включите TUN">
            На главной странице включите режим TUN. При первом запуске откройте кнопку с гаечным ключом рядом с TUN и установите службу Clash.
          </Step>
        </ol>
      </section>

      <section className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
        <details className="group" open>
          <summary className="list-none cursor-pointer flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--amber-500)] rounded-lg">
            <h2 className="text-[17px] font-medium flex-1">Что делает каждая прокси-группа</h2>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[var(--text-dim)] transition-transform group-open:rotate-180">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </summary>
          <div className="grid sm:grid-cols-2 gap-1.5 mt-4">
            {PROXY_GROUPS.map((group) => (
              <div key={group.name} className="flex gap-3 bg-[var(--surface-2)] rounded-[var(--radius-md)] px-3.5 py-2.5">
                <Image src={group.icon} alt="" width={32} height={32}
                  className="w-8 h-8 rounded-lg object-cover shrink-0" />
                <div>
                  <h3 className="text-[13px] font-medium">{group.name}</h3>
                  <p className="text-[11px] text-[var(--text-dim)] leading-relaxed mt-0.5">{group.description}</p>
                </div>
              </div>
            ))}
          </div>
        </details>
      </section>

      <section className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-5">
        <h2 className="text-[17px] font-medium">Что включено</h2>
        <ul className="grid sm:grid-cols-2 gap-2 mt-3 text-[12px] text-[var(--text-muted)]">
          {['Готовые правила для популярных сайтов', 'Множество Cloudflare endpoints', 'Раздельные прокси-группы', 'Быстрая настройка в рабочий режим'].map((item) => (
            <li key={item} className="flex items-center gap-2"><Check size={14} className="text-[var(--success)]" />{item}</li>
          ))}
        </ul>
        <details className="group mt-4 bg-[var(--surface-2)] rounded-[var(--radius-md)] px-3.5 py-3">
          <summary className="list-none cursor-pointer text-[13px] font-medium flex items-center justify-between gap-3">
            Автозапуск Clash Verge Rev
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[var(--text-dim)] transition-transform group-open:rotate-180">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </summary>
          <p className="text-[12px] text-[var(--text-muted)] leading-relaxed mt-2">
            Откройте «Настройки» → «Настройки системы» и включите «Автозапуск» или «Тихий запуск».
          </p>
        </details>
      </section>
    </div>
  );
}
