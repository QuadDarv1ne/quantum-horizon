# Quantum Horizon — План улучшений

**Дата:** 2026-03-11
**Обновлено:** 2026-04-22 — v0.4.8: Fixed dialog accessibility in physics-tooltip, split-screen, and statistics-dashboard; added DialogDescription and adjusted DialogTitle placement; all tests passing; build successful; branches synchronized
**Статус:** ✅ v0.4.8 в main, готово к следующим улучшениям
**Версия:** 0.4.8

---

## 🔍 Аудит проекта (2026-04-20) — v0.4.7

**Дата проверки:** 2026-04-19
**Проверил:** Qwen Code

### ✅ Текущий статус

**Build:** ✅ успешен (4.9s)
**Lint:** ✅ 0 ошибок ESLint, 0 warnings
**TypeScript:** ✅ 0 ошибок
**Тесты:** ✅ 320 passing, 0 failing, 5 skipped, 2 todo

**Выполнено в v0.4.7:**
- ✅ **Lighthouse Performance Optimizations**
  - Cyrillic font subset — русский текст теперь корректно отображается
  - display: swap для шрифтов — предотвращает FOIT (Flash of Invisible Text)
  - preconnect для NASA APIs — уменьшает задержку при запросах к API
    - api.nasa.gov, images-assets.nasa.gov, apod.nasa.gov
  - dns-prefetch для внешних сервисов — whereTheISSat, CartoCDN
  - remotePatterns для Next.js Image — NASA изображения теперь оптимизируются (WebP/AVIF)
  - Убран unoptimized флаг из NASA APOD Image
  - Добавлен sizes prop для responsive image loading
  - Dynamic import AnimatedBackground — canvas анимация не блокирует initial paint
- ✅ **Security updates and dependency fixes**
  - Обновлены lodash, lodash-es, basic-ftp, vite для устранения высоких уязвимостей
  - Исправлены все высокие уязвимости (после обновления остались 11 low и 4 moderate)

**Остающиеся проблемы:**

**Средние:**
- ⚠️ 5 skipped тестов (canvas требует real context)
- ⚠️ 2 todo теста (auth protection — реализованы в E2E)
- ⚠️ Rate limiting зависит от Upstash Redis (без него in-memory fallback)

**Низкие:**
- ⚠️ 15 npm уязвимостей (11 low, 4 moderate) — транзитивные зависимости
- ⚠️ SQLite в development vs PostgreSQL в production
- ⚠️ Lighthouse Performance замер на production ещё не выполнен (цель: > 90)

## 📝 Примечания от Qwen Code (2026-04-22)

- Исправлены проблемы с доступностью в диалоговых компонентах (physics-tooltip, split-screen, statistics-dashboard):
  - Добавлены DialogDescription как прямой потомок DialogContent для улучшения доступности скринридеров.
  - Перемещены DialogTitle вне DialogHeader, чтобы быть прямым потомком DialogContent.
  - Удалены лишние обертки div, которые могли вызывать проблемы с JSX-трансформацией.
  - Все тесты проходят после исправлений (325 passed, 2 todo).
  - Линтинг и сборка проходят без ошибок.
- Ветка dev синхронизирована с origin/dev, изменения слиты в main и pushed в origin/main.
- Следующие шаги: продолжить улучшения в dev ветке перед следующим слиянием в main.

---

## 🔍 Аудит проекта (2026-03-29) — АРХИВ

**Дата проверки:** 2026-03-29
**Проверил:** Qwen Code

### ✅ Результаты проверок

**Build:**

- ✅ Сборка успешна
- ✅ TypeScript: 0 ошибок
- ✅ Service Worker собран
- ✅ Все страницы скомпилированы

**Lint:**

- ✅ 0 ошибок ESLint

**Format:**

- ✅ Prettier — все файлы отформатированы

**npm audit:**

- ✅ 0 high уязвимостей
- ✅ 0 moderate уязвимостей
- ⚠️ 6 low уязвимостей (elliptic — транзитивная, не критично)

**Git статус:**

- ✅ Ветка dev: синхронизирована с origin/dev
- ✅ Ветка main: синхронизирована с origin/main

### ✅ Статус проекта (2026-03-29)

**Метрики качества:**

- ✅ Build: успешно
- ✅ Lint: 0 ошибок — чисто
- ✅ TypeScript: 0 ошибок — строгая типизация
- ✅ Prettier: все файлы отформатированы

**Выполнено (2026-03-29):**

- ✅ Middleware исправлен — `src/middleware.ts` работает
- ✅ Удалён `src/proxy.ts` (не работал)
- ✅ npm audit fix --force — устранены 3 high уязвимости
- ✅ Prisma обновлена до v7.6.0 (breaking changes)
- ✅ @storybook/nextjs обновлён до v10.3.3
- ✅ @storybook/react обновлён до v10.3.3
- ✅ storybook обновлён до v10.3.3
- ✅ lucide-react обновлён до v1.7.0
- ✅ logger.ts — утилита логгирования (production-safe)
- ✅ .gitattributes — контроль CRLF/LF
- ✅ console.log заменены на logger (36→0)
- ✅ tsconfig.json — убраны лишние исключения
- ✅ vitest.config.ts — обновлён для Vitest v4
- ✅ src/test/setup.ts — исправлены полифилы для тестов
- ✅ Rate limiting для всех API endpoints
- ✅ src/middleware.test.ts — тесты для rate limiting
- ✅ CSP headers усилены — конкретные домены API
- ✅ src/security-headers.test.ts — тесты для CSP headers
- ✅ Удалена неиспользуемая зависимость @reactuses/core
- ✅ Обновлены зависимости (next, react-query, eslint)
- ✅ Улучшена архитектура middleware (DRY)
- ✅ Исправлены иконки Twitter/Facebook/Linkedin (SVG)

**Архитектура:**

- ✅ 93 компонента визуализаций
- ✅ 5 компонентов секций
- ✅ Middleware architecture (Next.js 16)
- ✅ Zustand store + React Query
- ✅ PWA поддержка
- ✅ Rate limiting (@upstash/ratelimit)

**Инфраструктура:**

- ✅ Docker (dev + prod)
- ✅ CI/CD (GitHub Actions)
- ✅ CSP headers
- ✅ i18n (4 языка)

### 🔴 Проблемы (требуют решения)

**Критические (Security):**

1. ✅ **npm уязвимости (high)** — решено 2026-03-29
   - ~~`elliptic` — криптография (транзитивные Storybook)~~
   - ~~`effect` / `prisma` — AsyncLocalStorage contamination~~
   - ✅ Решение: `npm audit fix --force` выполнено
   - ✅ Prisma v7.6.0, @storybook/nextjs v10.3.3

2. ✅ **npm уязвимости (moderate)** — решено 2026-03-29
   - ~~`esbuild` — уязвимость в dev-сервере Storybook~~
   - ✅ Решение: Storybook обновлён до v10.3.3

3. ⚠️ **npm уязвимости (6 low)** — elliptic криптография
   - `elliptic` — транзитивная зависимость Storybook
   - Не критично для development
   - Решение: ждать обновления @storybook/nextjs

4. ✅ **Rate limiting** — реализован для всех API endpoints 2026-03-29
   - ✅ `/api/auth/*` — 5 попыток входа в минуту, 3 регистрации в час, 2 сброса пароля в час
   - ✅ `/api/visualizations/*` — 100 запросов в минуту
   - ✅ `/api/activity/*` — 60 запросов в минуту
   - ✅ `/api/achievements/*` — 60 запросов в минуту
   - ✅ Тесты: `src/middleware.test.ts`

5. ✅ **CSP headers** — усилены 2026-03-29
   - ✅ `img-src` — конкретные домены (NASA, WhereTheISSat, CartoCDN)
   - ✅ `connect-src` — конкретные API домены (NASA, WhereTheISSat, Open Notify)
   - ✅ `style-src` — `'unsafe-inline'` для Leaflet карт
   - ✅ `script-src` — `'wasm-unsafe-eval'` для WebAssembly
   - ✅ Тесты: `src/security-headers.test.ts`

**Высокий приоритет:**

4. 🟠 **Зависимости требуют обновления:**
   - `eslint-plugin-react-hooks` v7 — не поддерживает eslint v10
   - `nodemailer` v8 — breaking change для next-auth v4
   - Решение: обновить next-auth до v5 (breaking changes)
   - **Срок:** Q3 2026
   - **Статус:** Принято решение отложить (не критично для development)

5. ✅ **Storybook уязвимости** — решено 2026-03-29
   - ✅ Обновлён до v10.3.3
   - ✅ Транзитивные зависимости обновлены

**Средний приоритет:**

6. ✅ **Тесты безопасности** — решено 2026-03-29
   - ✅ src/middleware.test.ts — тесты для rate limiting
   - ✅ src/security-headers.test.ts — тесты для CSP headers
   - ⚠️ Остальные тесты требуют настройки next-intl mock

7. ✅ **Мониторинг уязвимостей** — решено 2026-03-29
   - ✅ .github/dependabot.yml — настроен Dependabot
   - ✅ Security updates еженедельно

**Низкий приоритет:**

8. ✅ **Lighthouse замеры** — выполнено 2026-03-29
   - 🟢 Accessibility: 100 (цель 90+ ✅)
   - 🟢 SEO: 90 (цель 90+ ✅)
   - 🟡 Best Practices: 79 (требует улучшений)
   - 🔴 Performance: 33 (localhost замеры, не репрезентативно)
   - **Срок:** Q4 2026 — замеры на production

9. 🟢 **Bundle size** — анализ 2026-03-29
   - Текущий: ~1.9 MB total JS
   - Initial загрузка: ~219KB (оценка)
   - Цель: <200KB initial
   - Решение: code splitting, tree-shaking для тяжёлых компонентов
   - **Срок:** Q4 2026
