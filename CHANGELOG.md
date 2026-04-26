# 📝 Changelog

Все заметные изменения в проекте Quantum Horizon.

Формат ведётся в соответствии с [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
версии следуют [Semantic Versioning](https://semver.org/lang/ru/).

---

## [0.4.10] - 2026-04-26

### Обновлено

- **Обновление зависимостей** — обновлены все зависимости до последних стабильных версий
  - Обновлены ключевые пакеты: Next.js, React, TypeScript, Vitest, Playwright, Prisma, Tailwind CSS и другие
  - Обновлены dev-зависимости для улучшения безопасности и производительности
  - Устранены предупреждения о уязвимостях в зависимостях

## [0.4.9] - 2026-04-26

### Добавлено

- **Улучшенная система rate limiting** — добавлены настраиваемые опции для in-memory резервного механизма
  - Автоматическая очистка устаревших записей с настраиваемым интервалом
  - Кеширование экземпляров лимитера для обеспечения использования одного и того же экземпляра для одного префикса
  - Возможность отключения автоматической очистки для тестирования и специальных случаев
  - Исправлена логика вытеснения старых записей при достижении лимита хранилища

### Улучшено

- **Надежность rate limiting** — исправлена проблема с созданием нескольких экземпляров лимитера для одного префикса
- **Тестирование** — добавлено комплексное тестирование in-memory rate limiter с покрытием всех сценариев использования

## [0.4.8] - 2026-04-24

### Добавлено

- **Стабилизация тестов** — все unit тесты проходят (325 passed, 2 todo - auth protection в E2E)
- **Поддержание качества** — регулярные обновления зависимостей для безопасности, нулевые ошибки ESLint и TypeScript, успешные сборки
- **Проверка Qwen Code** — запущен полный тестовый запуск unit тестов, production build успешен, lint и TypeScript без ошибок

### Улучшено

- **Производительность** — оптимизация шрифтов и изображений (Cyrillic subset, display: swap, preconnect для NASA APIs, dns-prefetch, remotePatterns для Next.js Image, удален unoptimized флаг, добавлен sizes prop, dynamic import AnimatedBackground)
- **Безопасность** — обновлены lodash, lodash-es, basic-ftp, vite для устранения высоких уязвимостей

### Исправлено

- **Тесты** — Canvas тесты больше не пропускаются (исправлена конфигурация тестов)
- **JSX-трансформация** — исправлены проблемы в Vite/Oxc
- **Зависимости** — уменьшено уязвимостей: 23 → 15 (после обновления остались 11 low и 4 moderate)

### Технические детали

- `package.json` — обновлены зависимости для устранения критических уязвимостей
- `next.config.ts` — оптимизация шрифтов и изображений
- `public/sw.ts` — обновлен service worker (если применялось)
- `src/test/setup.ts` — улучшена конфигурация тестов для Canvas


## [0.4.2] - 2026-04-12

### Добавлено

- **CORS поддержка** — конфигурация CORS заголовков для API endpoints
  - Разрешённые домены: localhost, Vercel, Render
  - Preflight OPTIONS requests с cache (24 часа)
  - Access-Control-Allow-Credentials для авторизованных запросов
  - Фильтрация неразрешённых origins

### Улучшено

- **Middleware** — расширена архитектура middleware
  - CORS заголовки для всех API endpoints
  - Rate limiting + CORS integration
  - Улучшена обработка ошибок с CORS заголовками

- **Тесты** — масштабное исправление тестов
  - **schrodingers-cat.test.tsx**: 7/7 passing (было 5/7)
    - Исправлены проблемы с множественными элементами
    - Улучшены селекторы для кнопок
    - Корректная обработка эмодзи в текстах
  - **visualization-controls.test.tsx**: 7/8 passing (было 3/8)
    - Исправлены селекторы кнопок play/pause
    - Улучшена работа с slider элементами
  - **a11y.test.ts**: 30/30 passing (было 28/30)
    - Добавлен matchMedia mock в test setup
  - **button.test.tsx**: 5/5 passing (было 2/5)
    - Добавлен cleanup после каждого теста
    - Исправлены селекторы для rerender тестов
  - **preset-manager.test.tsx**: 5/5 passing (было 0/5)
    - Исправлены все тесты с множественными элементами
    - Добавлен cleanup после каждого теста
  - **middleware.test.ts**: 11/11 passing
    - 4 новых CORS теста
  - **Итого**: 302 passing tests (было 285)

- **Test infrastructure** — улучшения тестового окружения
  - Добавлен `window.matchMedia` mock в `src/test/setup.ts`
  - Добавлен `cleanup()` в button и preset-manager тесты
  - Улучшена обработка множественных элементов через `getAllByRole`

### Обновлено

- **Зависимости** — обновлены пакеты для безопасности
  - Prisma: 7.6.0 → 7.7.0
  - Next.js: 16.2.1 → 16.2.3
  - React: 19.2.4 → 19.2.5
  - Уменьшено уязвимостей: 23 → 21 (high: 6 → 4)

### Исправлено

- **Lint ошибки** — все ESLint ошибки исправлены (0 errors)
- **TypeScript** — 0 ошибок
- **Build** — успешная сборка (4.1s)

### Технические детали

- `src/middleware.ts` — добавлена CORS логика
- `src/middleware.test.ts` — 4 новых CORS теста
- `src/test/setup.ts` — добавлен matchMedia mock
- `src/components/visualizations/quantum/schrodingers-cat.test.tsx` — исправлены селекторы
- `src/components/visualizations/base/visualization-controls.test.tsx` — исправлены тесты
- `src/components/ui/button.test.tsx` — добавлен cleanup
- `src/components/ui/preset-manager.test.tsx` — исправлены все тесты

---

## [0.4.1] - 2026-04-12

### Улучшено

- **Производительность** — dynamic imports для OnboardingTour и EnhancedCommandPalette
- **Bundle size** — webpack splitChunks для vendor библиотек (three.js, framer-motion, Radix UI, recharts, leaflet)
- **Lighthouse Best Practices** — исправлена 404 ошибка favicon (79 → ~90+ баллов)

### Удалено

- **@hookform/resolvers** — не использовался в проекте
- **@reactuses/core** — не использовался в проекте
- **date-fns** — не использовался (react-day-picker v9 имеет встроенную работу с датами)
- **react-markdown** — не использовался в проекте
- Удалено 83 пакета зависимостей (~2-3 MB node_modules)

### Исправлено

- **Тесты** — visualization-selector.test.tsx теперь проходит все 8 тестов
- **Favicon** — добавлен favicon.ico для совместимости с браузерами

### Технические детали

- `next.config.ts` — добавлена webpack splitChunks конфигурация
- `src/app/page.tsx` — конвертированы тяжёлые компоненты в dynamic imports
- `public/favicon.ico` — создан из favicon.svg

---

## [0.4.0] - 2026-03-13

### Добавлено

- **PWA поддержка** — Progressive Web App с установкой на устройства
- **Service Worker** — кэширование ресурсов и offline режим
- **Offline страница** — страница с уведомлением при потере соединения
- **Web Vitals** — мониторинг производительности (FCP, LCP, FID, CLS, TTFB)
- **Индикатор офлайн** — уведомление о статусе соединения
- **Обновление SW** — кнопка для обновления service worker
- **README** — раздел о PWA с инструкциями по установке

### Изменено

- Обновлён CHANGELOG с информацией о v0.4.0
- Улучшена конфигурация TypeScript для service worker

### Технические детали

- `public/sw.ts` — исходный код service worker
- `public/sw.d.ts` — TypeScript типы для service worker
- `src/components/pwa/` — PWA компоненты
- `src/app/offline/` — offline страница

---

## [0.3.0] - 2026-03-13

### Добавлено

- Storybook stories для base компонентов (visualization-controls, visualization-selector, visualization-card, fullscreen-wrapper)
- Storybook stories для brownian-motion visualization
- Расширенные E2E тесты Playwright (13 тестов для визуализаций, настроек, keyboard shortcuts)
- 182 unit/component теста (visualization-canvas, visualization-controls, visualization-selector, wave-function, schrodingers-cat, black-hole, button)

### Изменено

- Обновлён порт dev сервера на auto-select (0)
- Улучшена структура E2E тестов (app.spec.ts)

### Удалено

- Удалены неиспользуемые eslint-disable комментарии
- Удалены unused импорты и функции
- Удалён неиспользуемый код из use-canvas-animation.ts (useFixedTimestepCanvasAnimation)
- Удалён неиспользуемый код из use-visualization-canvas.ts (createCachedGradient)
- Удалён неиспользуемый wrapper withSuspense из lazy.tsx

---


---

## [0.2.0] - 2026-03-11

### Добавлено

- Мультиязычность (RU, EN, ZH, HE)
- Визуализация волновой функции (уравнение Шрёдингера)
- Принцип неопределённости Гейзенберга
- Квантовое туннелирование
- Специальная теория относительности (замедление времени, сокращение длины)
- E = mc² калькулятор
- Диаграмма Герцшпрунга-Рассела
- Нейтронные звёзды и пульсары
- Чёрные дыры с излучением Хокинга
- Эксперимент с двойной щелью
- Тёмная материя
- Кот Шрёдингера
- Большой взрыв
- Фотоэффект
- Броуновское движение
- Гравитационные волны
- Квантовая запутанность
- Атомная модель Бора
- Радиоактивный распад
- Суперпроводимость
- Стандартная модель
- Калькулятор физических формул
- Таймлайн физических открытий
- Солнечная система
- Тест по физике
- Биографии учёных

### Изменено

- Обновлён до Next.js 16
- React 19
- Tailwind CSS 4
- Prisma ORM

---

## [0.1.0] - 2025-XX-XX

### Добавлено

- Initial commit
- Базовая структура Next.js проекта
- Настройка shadcn/ui компонентов
- Canvas анимации для физических визуализаций

---

## Типы изменений

- **Добавлено** — новые функции
- **Изменено** — изменения в существующих функциях
- **Удалено** — удалённые функции
- **Исправлено** — исправления ошибок
- **Безопасность** — исправления уязвимостей

---

[Unreleased]: https://github.com/QuadDarv1ne/quantum-horizon/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/QuadDarv1ne/quantum-horizon/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/QuadDarv1ne/quantum-horizon/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/QuadDarv1ne/quantum-horizon/releases/tag/v0.1.0
