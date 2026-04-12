# 📝 Changelog

Все заметные изменения в проекте Quantum Horizon.

Формат ведётся в соответствии с [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/),
версии следуют [Semantic Versioning](https://semver.org/lang/ru/).

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

## [Unreleased]

### Добавлено

- Docker поддержка (Dockerfile, .dockerignore)
- Prettier для форматирования кода
- SECURITY.md — политика безопасности
- CODE_OF_CONDUCT.md — кодекс поведения
- LICENSE — полная MIT лицензия
- Скрипты: `lint:fix`, `format`, `format:check`

### Изменено

- Обновлён README.md с улучшенной структурой
- Обновлён .env.example до современного формата
- Обновлён .gitignore (prisma/migrations/ теперь коммитятся)
- Настроен ESLint v9 с конфигурацией для проекта
- Оптимизированы хуки (use-canvas-animation, use-toast, use-mobile)

### Исправлено

- Merge конфликты в src/app/page.tsx
- Типы в src/hooks/use-mobile.ts
- Типы в src/lib/db.ts
- Async/await warnings в API routes

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
