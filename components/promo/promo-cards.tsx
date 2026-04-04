import { LINKS } from '@/config/site';
import { trackEvent } from '@/lib/analytics';

interface PromoItem {
  href: string;
  title: string;
  subtitle: string;
  image?: string;
  bg: string;
  hoverBg: string;
  textColor: string;
  subColor: string;
  fallbackIcon: React.ReactNode;
}

const PROMOS: PromoItem[] = [
  {
    href: LINKS.skyTunnel,
    title: 'Oбxoд бeлыx cпискoв',
    subtitle: 'Доступ к зaблoкиpoвaнным ресурсам',
    image: 'https://i.postimg.cc/MpmYtq3F/Logo.png',
    bg: 'bg-purple-900',
    hoverBg: 'hover:bg-purple-800',
    textColor: 'text-white',
    subColor: 'text-purple-200',
    fallbackIcon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="1.5" /></svg>,
  },
  {
    href: LINKS.telegramMedia,
    title: 'Ускорить Telegram медиа',
    subtitle: 'Быстрая загрузка контента',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/960px-Telegram_logo.svg.png',
    bg: 'bg-[#0056ae]',
    hoverBg: 'hover:bg-[#0067D0]',
    textColor: 'text-white',
    subColor: 'text-blue-200',
    fallbackIcon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="1.5" /></svg>,
  },
];

export function PromoCards() {
  return (
    <div className="grid grid-cols-2 gap-2 max-[500px]:grid-cols-1">
      {PROMOS.map((p) => (
        <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer"
          onClick={() => trackEvent('ads_click', p.title)}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-[var(--radius-md)] ${p.bg} ${p.hoverBg} transition-all`}>
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0 overflow-hidden">
            {p.image ? (
              <img src={p.image} alt="" className="w-6 h-6 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            ) : null}
            {!p.image && p.fallbackIcon}
          </div>
          <div>
            <p className={`text-[13px] font-medium ${p.textColor}`}>{p.title}</p>
            <p className={`text-[11px] font-light ${p.subColor}`}>{p.subtitle}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
