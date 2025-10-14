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

### 3. Cloudflare Pages

- Вы можете выполнить развертывание вручную, связав свой репозиторий с информационной панелью [Cloudflare Pages dashboard](https://dash.cloudflare.com/?to=/:account/pages).
- Framework preset: `Next.js (Static HTML Export)`
- Build command: `npm run build`
- Build output directory: `out`
- Root directory: `оставьте пустым`
- _Pages_ [ограничения](https://developers.cloudflare.com/pages/platform/limits/)

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
├── app/                              # Next.js App Router
│   ├── api/warp/route.ts             # API endpoint для генерации конфигураций
│   ├── globals.css                   # Глобальные стили
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Главная страница
├── components/                       # React компоненты
│   ├── icons/
│   │   └── custom-icons.tsx          # Кастомные иконки сервисов
│   ├── ui/                           # shadcn/ui компоненты
│   ├── config-options.tsx            # Компонент настроек конфигурации
│   ├── theme-provider.tsx            # Провайдер темы (dark/light mode)
│   └── warp-generator.tsx            # Основной компонент генератора
├── data/                             # Статические данные
│   ├── services-config.json          # Конфигурация доступных сервисов
│   └── ip-ranges.json                # IP диапазоны для каждого сервиса
├── functions/
│   └── api/warp.js                   # Cloudflare Pages функция
├── hooks/                            # React hooks
│   ├── use-mobile.tsx                # Hook для определения мобильного устройства
│   └── use-toast.ts                  # Hook для toast уведомлений
├── lib/                              # Основная бизнес-логика
│   ├── builder/
│   │   └── warp-config-builder.ts    # Построитель WireGuard конфигураций
│   ├── cloudflare-api.ts             # Клиент для Cloudflare WARP API
│   ├── crypto-utils.ts               # Криптографические утилиты
│   ├── ip-ranges.ts                  # Менеджер IP диапазонов
│   ├── qr-generator.ts               # Генератор QR кодов
│   ├── types.ts                      # TypeScript типы и интерфейсы
│   ├── utils.ts                      # Общие утилиты (cn и др.)
│   ├── warp-service.ts               # Главный сервис генерации WARP
│   └── warpConfig.ts                 # Legacy совместимость
├── public/                           # Статические файлы
│   ├── logo.svg                      # Логотип приложения
│   └── cloud.ico                     # Favicon
├── types/
│   └── services.ts                   # Типы для сервисов
├── utils/
│   └── services.ts                   # Менеджер сервисов (ServicesManager)
├── .gitignore                        # Git ignore правила
├── components.json                   # Конфигурация shadcn/ui
├── LICENSE                           # MIT лицензия
├── netlify.toml                      # Конфигурация для Netlify
├── next.config.mjs                   # Конфигурация Next.js
├── package.json                      # Зависимости проекта
├── postcss.config.mjs                # Конфигурация PostCSS
├── tailwind.config.ts                # Конфигурация Tailwind CSS
├── tsconfig.json                     # Конфигурация TypeScript
├── vercel.json                       # Конфигурация для Vercel
├── README_ru.md                      # Документация проекта на русском
└── README.md                         # Документация проекта на английском
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
| Cloudflare | ⚠️ Статический | 🟡 Средняя | ~5 минут |

## 📄 Лицензия

MIT License

## 🤝 Вклад в развитие

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request

## Зеркала / Альтернативные ссылки

- Telegram Bot: [t.me/warp_generator_bot](https://t.me/warp_generator_bot)  
- Основной сайт: [warp.llimonix.dev](https://warp.llimonix.dev)  
- Vercel Mirror: [warply.vercel.app](https://warply.vercel.app)  
- Netlify Mirror: [getwarp.netlify.app](https://getwarp.netlify.app)  
- Cloudflare Pages Mirror: [getwarp.pages.dev](https://getwarp.pages.dev)
- Telegram канал: [ллимоникс </>](https://t.me/+PWiSh2qvtmphMjcy)