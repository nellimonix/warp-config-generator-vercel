# WARP Configuration Generator

**Русский** | [English](README.md)

Генератор конфигураций для WARP с поддержкой различных платформ развертывания.

## 🚀 Быстрое развертывание

### 1. Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nellimonix/warp-config-generator-vercel&repository-name=warp)
- В качестве альтернативы может быть развернут с [cli](https://vercel.com/docs/cli):
  `vercel deploy`
- Запустить локально: `vercel dev`
- Vercel _Functions_ [ограничения](https://vercel.com/docs/functions/limitations) (с средой выполнения _Edge_)

### 2. Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](
https://app.netlify.com/start/deploy?repository=https://github.com/nellimonix/warp-config-generator-vercel&siteName=warp
)
- В качестве альтернативы может быть развернут с [cli](https://docs.netlify.com/cli/get-started/):
  `netlify deploy`
- Запустить локально: `netlify dev`
- _Functions_ [ограничения](https://docs.netlify.com/functions/get-started/?fn-language=js#synchronous-function-2)
- _Edge functions_ [ограничения](https://docs.netlify.com/edge-functions/limits/)

### 3. Cloudflare Workers

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/nellimonix/warp-config-generator-vercel)
- В качестве альтернативы может быть развернут с [cli](https://developers.cloudflare.com/workers/wrangler/):
  `wrangler deploy`
- Запустить локально: `wrangler dev`
- _Worker_ [ограничения](https://developers.cloudflare.com/workers/platform/limits/#worker-limits)

## 🛠️ Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для production
npm run build

# Запуск production сборки
npm run start

# Линтинг
npm run lint
```

## 📁 Структура проекта

```
├── app/
│   ├── layout.tsx                 Корневой layout (шрифт Geist, мета)
│   ├── page.tsx                   Серверный компонент — загрузка сервисов
│   └── api/generate/route.ts      POST endpoint (hCaptcha + генерация)
│
├── components/
│   ├── home-client.tsx            Клиентская оболочка (табы, состояние, капча)
│   ├── layout/
│   │   ├── topbar.tsx             Логотип + навигация по табам
│   │   ├── sidebar.tsx            Ссылки, серверы, донат (sticky)
│   │   └── footer.tsx
│   ├── generator/
│   │   ├── config-selectors.tsx   Кастомные дропдауны (формат, тип и пр.)
│   │   ├── service-picker.tsx     Сетка выбора сервисов
│   │   ├── result-panel.tsx       Блок результата (скачать / копировать / QR)
│   │   ├── formats-tab.tsx        Список поддерживаемых форматов
│   │   └── about-tab.tsx          О проекте + совместимые клиенты
│   └── promo/
│       ├── promo-cards.tsx        Промо-карточки (SkyTunnel и др.)
│       └── banner.tsx             Опциональный рекламный баннер
│
├── config/
│   ├── services/                  27 JSON-файлов — по одному на сервис
│   │   ├── discord.json
│   │   ├── telegram.json
│   │   └── ...
│   ├── services-loader.ts         Автозагрузка всех JSON при старте
│   ├── endpoints.ts               Реальные + фейковые endpoint-ы серверов
│   ├── formats.ts                 6 определений форматов конфигов
│   ├── banner.ts                  Вкл/выкл баннера + URL картинки
│   └── site.ts                    Метаданные сайта + внешние ссылки
│
├── lib/
│   ├── builders/                  По одному файлу на формат конфига
│   │   ├── wireguard.ts
│   │   ├── throne.ts
│   │   ├── clash.ts
│   │   ├── nekoray.ts
│   │   ├── husi.ts
│   │   ├── karing.ts
│   │   ├── shared.ts              Профили устройств, DNS, константы
│   │   └── index.ts               Диспетчер — buildConfig(format, params)
│   ├── warp-service.ts            Оркестратор (ключи → CF → сборка → QR)
│   ├── cloudflare-client.ts       Регистрация через Cloudflare WARP API
│   ├── crypto.ts                  Генерация ключей (tweetnacl)
│   ├── qr-generator.ts            QR через внешний API + SVG-заглушка
│   └── ip-ranges.ts               Реэкспорт из services-loader
│
├── hooks/
│   ├── use-generator.ts           Вся клиентская логика генерации
│   └── use-mobile.ts              Хук для адаптивности
│
├── types/                         TypeScript типы
├── styles/globals.css             Дизайн-токены + тёмная тема
├── Dockerfile                     Standalone production-сборка
└── package.json
```

## 🔧 Конфигурация

### Next.js

Проект использует Next.js 14 с App Router и следующими настройками:

- TypeScript
- Tailwind CSS
- ESLint
- Radix UI компоненты
- Автоматическая оптимизация изображений

### Сборка

Проект настроен для статической генерации с возможностью серверного рендеринга API маршрутов.

## 🌐 Поддерживаемые платформы

| Платформа | Поддержка | Сложность | Время развертывания |
|-----------|-----------|-----------|-------------------|
| Vercel | ✅ Полная | 🟢 Низкая | ~3 минуты |
| Netlify | ✅ Полная | 🟡 Средняя | ~5 минут |
| Cloudflare Workers | ✅ Полная | 🟡 Средняя | ~5 минут |

## 📄 Лицензия

MIT License

## 🤝 Вклад в развитие

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## Зеркала / Альтернативные ссылки

- Telegram Bot: [t.me/warp_generator_bot](https://t.me/warp_generator_bot)  
- Основной сайт: [warp2.llimonix.pw](https://warp2.llimonix.pw)  
- Vercel Mirror: [warply2.vercel.app](https://warply2.vercel.app)  
- Netlify Mirror: [getwarp2.netlify.app](https://getwarp2.netlify.app)
- Cloudflare Mirror: [warp.llimonix.workers.dev](https://warp.llimonix.workers.dev)    
- Telegram канал: [ллимоникс </>](https://t.me/+PWiSh2qvtmphMjcy)