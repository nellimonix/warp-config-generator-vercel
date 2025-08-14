
# WARP Configuration Generator

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
├── app/                           # Next.js App Router
│   ├── api/warp/route.ts          # API для генерации конфигураций
│   ├── globals.css                # Глобальные стили
│   ├── layout.tsx                 # Layout с Yandex Metrika
│   └── page.tsx                   # Главная страница
├── components/                    # React компоненты
│   ├── ui/                        # UI компоненты (shadcn/ui)
│   ├── config-options.tsx         # Опции конфигурации
│   ├── theme-provider.tsx         # Провайдер темы
│   └── warp-generator.tsx         # Основной компонент
├── functions/api/warp.js          # Cloudflare Pages функция
├── lib/                          # Утилиты и конфигурации
│   ├── ipRanges.ts               # IP диапазоны сервисов
│   ├── utils.ts                  # Общие утилиты
│   └── warpConfig.ts             # Логика генерации
├── public/                       # Статические файлы
└── utils/ym.ts                   # Yandex Metrika
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
- Основной сайт: [warp.llimonix.pw](https://warp.llimonix.pw)  
- Vercel Mirror: [warply.vercel.app](https://warply.vercel.app)  
- Netlify Mirror: [getwarp.netlify.app](https://getwarp.netlify.app)  
- Cloudflare Pages Mirror: [getwarp.pages.dev](https://getwarp.pages.dev)
- Telegram канал: [ллимоникс </>](https://t.me/+PWiSh2qvtmphMjcy)