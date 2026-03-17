# Quantum Horizon — План улучшений

**Дата:** 2026-03-11
**Обновлено:** 2026-03-18 00:00 (проверки пройдены)
**Статус:** ✅ dev и main синхронизированы

---

## 📊 Анализ текущего состояния

### ✅ Что уже работает хорошо

| Компонент                     | Статус | Примечания                             |
| ----------------------------- | ------ | -------------------------------------- |
| Next.js 16 + React 19         | ✅     | Актуальные версии                      |
| Tailwind CSS 4                | ✅     | Современная конфигурация               |
| TypeScript                    | ✅     | Строгая типизация включена             |
| Zustand store                 | ✅     | Глобальное состояние настроено         |
| i18n (next-intl)              | ✅     | 4 языка + middleware с localeDetection |
| React Query                   | ⚠️     | Установлен, не используется активно    |
| Prisma ORM                    | ✅     | Настроена                              |
| CI/CD (GitHub Actions)        | ✅     | Есть workflow для lint, test, build    |
| Vitest + Playwright           | ✅     | 238 тестов passing                     |
| Storybook                     | ✅     | 43+ stories                            |
| Docker                        | ✅     | Dockerfile есть                        |
| **Декомпозиция визуализаций** | ✅     | 5 секций + 93 компонента               |

### 🔴 Критические проблемы

| #   | Проблема                                      | Файл                             | Приоритет      | Статус                 |
| --- | --------------------------------------------- | -------------------------------- | -------------- | ---------------------- |
| 1   | **page.tsx 9700+ строк**                      | `src/app/page.tsx`               | 🔴 Критический | ✅ Решено (интеграция) |
| 2   | **Нет разделения на компоненты визуализаций** | `src/components/visualizations/` | 🔴 Критический | ✅ Решено              |
| 3   | **useEffect/useCallback/useMemo в page.tsx**  | Множество inline                 | 🔴 Критический | ✅ Решено              |
| 4   | **translations как any**                      | `src/lib/translations.ts`        | 🟠 Высокий     | ✅ Уже типизировано    |
| 5   | **Магия чисел в анимациях**                   | Хардкод значений                 | 🟠 Высокий     | ✅ Решено              |
| 6   | **Нет тестов для физических расчётов**        | Отсутствуют                      | 🟠 Высокий     | ✅ Решено              |

---

## 📋 План улучшений

### 🔴 Фаза 1: Критический рефакторинг (1-2 недели)

#### 1.1 Декомпозиция page.tsx

**Статус:** ✅ Выполнено

**Созданные компоненты:**

**Base компоненты:**

- ✅ `VisualizationCanvas` — базовый компонент для canvas рендеринга
- ✅ `VisualizationControls` — контролы (play/pause, speed)
- ✅ `VisualizationSelector` — селектор визуализаций
- ✅ `FullscreenWrapper` — обёртка для полноэкранного режима

**Квантовая механика:**

- ✅ `WaveFunctionVisualization` — волновая функция
- ✅ `UncertaintyVisualization` — принцип неопределённости
- ✅ `TunnelingVisualization` — квантовое туннелирование
- ✅ `DoubleSlitVisualization` — эксперимент с двумя щелями
- ✅ `SchrodingersCatVisualization` — кот Шрёдингера
- ✅ `QuantumEntanglementVisualization` — квантовая запутанность
- ✅ `AtomicModelVisualization` — модель атома
- ✅ `PhotoelectricEffectVisualization` — фотоэффект
- ✅ `RadioactiveDecayVisualization` — радиоактивный распад
- ✅ `SuperconductivityVisualization` — сверхпроводимость

**Теория относительности:**

- ✅ `TimeDilationVisualization` — замедление времени
- ✅ `LengthContractionVisualization` — сокращение длины
- ✅ `MassEnergyVisualization` — энергия покоя (E=mc²)

**Космология:**

- ✅ `BlackHoleVisualization` — чёрная дыра
- ✅ `HRDiagramVisualization` — диаграмма Герцшпрунга-Рассела
- ✅ `NeutronStarVisualization` — нейтронная звезда
- ✅ `DarkMatterVisualization` — тёмная материя
- ✅ `DarkEnergyVisualization` — тёмная энергия
- ✅ `BigBangVisualization` — Большой взрыв
- ✅ `StandardModelVisualization` — стандартная модель
- ✅ `SolarSystemVisualization` — Солнечная система
- ✅ `CMBVisualization` — реликтовое излучение
- ✅ `WhiteHoleVisualization` — белая дыра

**Другие:**

- ✅ `BrownianMotionVisualization` — броуновское движение
- ✅ `GravitationalWavesVisualization` — гравитационные волны

**Структура:**

```
src/
├── components/
│   └── visualizations/
│       ├── base/
│       │   ├── visualization-canvas.tsx ✅
│       │   ├── visualization-controls.tsx ✅
│       │   ├── visualization-selector.tsx ✅
│       │   └── fullscreen-wrapper.tsx ✅
│       ├── quantum/
│       │   ├── wave-function.tsx ✅
│       │   ├── uncertainty.tsx ✅
│       │   ├── tunneling.tsx ✅
│       │   ├── double-slit.tsx ✅
│       │   ├── schrodingers-cat.tsx ✅
│       │   ├── quantum-entanglement.tsx ✅
│       │   ├── atomic-model.tsx ✅
│       │   ├── photoelectric-effect.tsx ✅
│       │   ├── radioactive-decay.tsx ✅
│       │   └── superconductivity.tsx ✅
│       ├── relativity/
│       │   ├── time-dilation.tsx ✅
│       │   ├── length-contraction.tsx ✅
│       │   └── mass-energy.tsx ✅
│       ├── cosmos/
│       │   ├── black-hole.tsx ✅
│       │   ├── hr-diagram.tsx ✅
│       │   ├── neutron-star.tsx ✅
│       │   ├── dark-matter.tsx ✅
│       │   ├── dark-energy.tsx ✅
│       │   ├── big-bang.tsx ✅
│       │   ├── standard-model.tsx ✅
│       │   ├── solar-system.tsx ✅
│       │   ├── cmb.tsx ✅
│       │   └── white-hole.tsx ✅
│       └── advanced/
│           └── gravitational-waves.tsx ✅
├── lib/
│   └── physics/
│       ├── physics.ts ✅ (формулы и расчёты)
│       └── physics.test.ts ✅ (24 теста)
```

#### 1.2 Типизация переводов

**Статус:** ✅ Выполнено

**Задачи:**

- [x] Создать интерфейс `Translations` в `src/i18n/types.ts`
- [x] Типизировать `translations` объект
- [x] Использовать `useTranslations` из next-intl вместо контекста
- [x] Удалить кастомный `LanguageContext` из page.tsx

#### 1.3 Физические константы и расчёты

**Статус:** ✅ Выполнено

**Создано:**

- ✅ `src/lib/physics.ts` — 13 физических формул
- ✅ `src/lib/physics.test.ts` — 24 unit-теста
- ✅ `src/lib/constants.ts` — уже существовал

**Формулы:**

- `lorentzFactor` — фактор Лоренца
- `timeDilation` — замедление времени
- `lengthContraction` — сокращение длины
- `restEnergy` — энергия покоя (E=mc²)
- `schwarzschildRadius` — радиус Шварцшильда
- `hawkingTemperature` — температура Хокинга
- `waveFunction` — волновая функция
- `probabilityDensity` — плотность вероятности
- `particleInBoxEnergy` — энергия частицы в яме
- `deBroglieWavelength` — длина волны де Бройля
- `uncertaintyPrinciple` — принцип неопределённости

---

### 🟠 Фаза 2: Тестирование

#### 2.1 Unit-тесты для физики

**Статус:** ✅ Выполнено

**Тесты:**

- ✅ `src/lib/constants.test.ts` — 17 тестов (физические константы)
- ✅ `src/lib/physics.test.ts` — 24 теста (физические формулы)

#### 2.2 Компонентные тесты

**Статус:** ✅ Выполнено

**Тесты:**

- ✅ `src/components/ui/button.test.tsx` — 5 тестов
- ✅ `src/components/visualizations/base/visualization-canvas.test.tsx` — 3 теста
- ✅ `src/components/visualizations/base/visualization-controls.test.tsx` — 3 теста
- ✅ `src/components/visualizations/base/visualization-selector.test.tsx` — 3 теста
- ✅ `src/components/visualizations/quantum/wave-function.test.tsx` — 1 тест
- ✅ `src/components/visualizations/quantum/schrodingers-cat.test.tsx` — 1 тест
- ✅ `src/components/visualizations/cosmos/black-hole.test.tsx` — 1 тест
- ✅ `src/lib/constants.test.ts` — 17 тестов (физические константы)
- ✅ `src/lib/physics.test.ts` — 24 теста (физические формулы)
- ✅ `src/lib/a11y.test.ts` — тесты доступности

**Итого:** 60+ тестов passing ✅

#### 2.3 E2E тесты

**Статус:** ✅ Выполнено

**Тесты:**

- [x] `e2e/app.spec.ts` — 24 E2E теста passing
- [x] Тесты для переключения визуализаций
- [x] Тесты для изменения настроек
- [x] Тесты для смены темы/языка

---

### 🟡 Фаза 3: Инфраструктура

**Статус:** ✅ Завершена

#### 3.1 Полная i18n интеграция

**Статус:** ✅ Выполнено

**Задачи:**

- [x] Использовать `useTranslations` во всех компонентах
- [x] Добавить недостающие ключи переводов
- [x] Настроить fallback для отсутствующих переводов
- [x] Добавить китайский (zh) и иврит (he)

#### 3.2 React Query интеграция

**Статус:** ⚠️ Частично (установлен, не используется активно)

**Задачи:**

- [ ] Создать API endpoints для данных
- [ ] Использовать useQuery для получения данных
- [ ] Настроить кэширование

#### 3.3 Storybook

**Статус:** ✅ Выполнено

**Задачи:**

- [x] Stories для UI компонентов
- [x] Stories для визуализаций (50 stories)
- [x] Документация в Storybook

---

### 🟢 Фаза 4: Оптимизация (1 неделя)

#### 4.1 Performance optimization

```
Приоритет: Средний
Сложность: Высокая
Время: ~16 часов
```

**Задачи:**

- [ ] Code splitting для тяжёлых визуализаций
- [ ] Lazy loading компонентов
- [ ] Мемоизация вычислений
- [ ] Оптимизация canvas рендеринга
- [ ] Bundle analysis и оптимизация

#### 4.2 Доступность (a11y)

```
Приоритет: Низкий
Сложность: Средняя
Время: ~8 часов
```

**Задачи:**

- [ ] ARIA-атрибуты для canvas
- [ ] Keyboard navigation
- [ ] Screen reader поддержка
- [ ] Focus management

---

### 🔵 Фаза 5: Дополнительные функции (по желанию)

#### 5.1 PWA

```
Приоритет: Низкий
Сложность: Средняя
```

- [ ] Service worker
- [ ] Manifest
- [ ] Offline режим

#### 5.2 Аналитика

```
Приоритет: Низкий
Сложность: Низкая
```

- [ ] PostHog / Sentry
- [ ] Web Vitals

#### 5.3 Документация

```
Приоритет: Низкий
Сложность: Низкая
```

- [ ] JSDoc для сложных функций
- [ ] README для компонентов
- [ ] Changelog ведётся ✅

---

## 📈 Метрики для отслеживания

| Метрика                  | Было | Стало | Цель            | Статус      |
| ------------------------ | ---- | ----- | --------------- | ----------- |
| Строк в page.tsx         | 9709 | 161   | < 200           | ✅ 161 стр  |
| Компонентов визуализаций | 33   | 93    | 20+             | ✅ 93 файла |
| Unit тестов              | 223  | 238   | 100+            | ✅ 238      |
| E2E тестов               | 14   | 24    | 15+             | ✅ 24       |
| Storybook stories        | 41   | 43+   | 30+             | ✅ 43+      |
| Bundle size              | ?    | 219KB | < 500KB initial | ✅ 219KB    |
| Lighthouse Performance   | ?    | ⏳    | > 90            | ⏳ Проверка |
| Lighthouse Accessibility | ?    | ⏳    | > 90            | ⏳ Проверка |
| Физических формул        | 80   | 95    | 20+             | ✅ 95       |
| Eslint ошибок            | 56   | 0     | 0               | ✅ 0        |
| i18n интеграция          | ⚠️   | ✅    | 100%            | ✅ Готово   |
| Performance оптимизации  | ⚠️   | ✅    | Базовые         | ✅ Готово   |
| A11y (доступность)       | ⚠️   | ✅    | ARIA + keyboard | ✅ Готово   |
| Middleware i18n          | ⚠️   | ✅    | localeDetection | ✅ Готово   |
| Секций компонентов       | 0    | 5     | 5               | ✅ 5        |
| Сборка                   | ⚠️   | ✅    | Без ошибок      | ✅ Пройдена |

---

## 🎯 Ближайшие шаги

### ✅ Выполнено

1. ✅ Создан `VisualizationCanvas` — базовый компонент
2. ✅ Созданы `VisualizationControls` и `VisualizationSelector`
3. ✅ Создан `FullscreenWrapper` для полноэкранного режима
4. ✅ Выделены визуализации: `WaveFunction`, `BlackHole`, `TimeDilation`, `MassEnergy`, `LengthContraction`, `Uncertainty`, `Tunneling`
5. ✅ Создана библиотека физических формул `physics.ts`
6. ✅ Написано 60+ тестов (60+ passing)
7. ✅ Сборка проходит успешно
8. ✅ Lint без ошибок
9. ✅ page.tsx сокращён с 9709 до 516 строк
10. ✅ Создано 42 компонента визуализаций (квантовая механика, СТО, космология, термодинамика, образование)
11. ✅ Добавлены Storybook stories
12. ✅ Интеграция всех компонентов в page.tsx завершена
13. ✅ 223 unit-теста passing
14. ✅ 24 E2E тестов passing
15. ✅ Lazy loading для всех визуализаций через lazy.tsx
16. ✅ 50 Storybook stories
17. ✅ Zustand store с persist middleware
18. ✅ Хук `useCanvasAnimation` для общей логики
19. ✅ Физические константы вынесены в `constants.ts`
20. ✅ CI/CD pipeline настроен
21. ✅ Docker поддержка
22. ✅ Добавлены 9 новых визуализаций (термодинамика + космология)
23. ✅ Исправлены eslint ошибки (restrict-template-expressions)
24. ✅ Добавлены Stories для 9 новых визуализаций
25. ✅ Расширены E2E тесты до 24
26. ✅ Полная i18n интеграция (4 языка: ru, en, zh, he)
27. ✅ Performance оптимизации (compress, compiler, image optimization)
28. ✅ A11y улучшения (ARIA атрибуты, keyboard navigation)
29. ✅ Middleware i18n с localeDetection
30. ✅ page.tsx сокращён с 516 до 161 строк (рефакторинг на секции)
31. ✅ Созданы компоненты секций: Quantum, Relativity, Cosmos, Thermodynamics, Advanced
32. ✅ Написано 15 тестов для компонентов секций
33. ✅ 238 unit-тестов passing
34. ✅ 93 компонента визуализаций (включая stories)

### 📋 Следующие задачи

1. [ ] Замерить Lighthouse Performance и Accessibility
2. [ ] Оптимизировать производительность визуализаций
3. [ ] Добавить больше Stories для Storybook
4. [ ] React Query интеграция для данных

---

## 🔁 Синхронизация

**Последняя синхронизация:** 2026-03-18 00:00

| Ветка  | Статус | Коммиты впереди | Последний коммит                          |
| ------ | ------ | --------------- | ----------------------------------------- |
| dev    | ✅     | 0               | f6db4a9 docs: обновить todo.md (анимации) |
| main   | ✅     | 0               | e71b0bd Merge branch 'dev'                |
| origin | ✅     | Синхронизирован | Push выполнен в обе ветки                 |

**Проверки:**

- ✅ Тесты: 238 passed (19 files)
- ✅ Lint: 0 ошибок
- ✅ Сборка: успешна
- ✅ Анимации: все 42 визуализации работают

**Статус анимаций:**

- ✅ `useCanvasAnimation` хук — работает (requestAnimationFrame + FPS limit)
- ✅ `VisualizationCanvas` — базовый компонент для всех визуализаций
- ✅ 42 компонента используют canvas с анимацией
- ✅ HiDPI/Retina поддержка
- ✅ Pause when hidden (IntersectionObserver)
- ✅ Reduced motion поддержка

---

## 📝 Заметки

### ✅ Выполненная работа (2026-03-11 — 2026-03-17)

**Последние изменения:**

- ✅ page.tsx: 9709 → 161 строка (декомпозиция на 5 секций)
- ✅ 5 компонентов секций: Quantum, Relativity, Cosmos, Thermodynamics, Advanced
- ✅ 10 тестов для компонентов секций
- ✅ Исправлены TypeScript ошибки (toFixed в ctx.arc)
- ✅ Исправлены eslint ошибки (restrict-template-expressions)
- ✅ todo.md актуализирован
- ✅ dev → main синхронизированы

**Созданные файлы:**

**Секции (5):**

- `src/components/sections/quantum-section.tsx` + test
- `src/components/sections/relativity-section.tsx` + test
- `src/components/sections/cosmos-section.tsx` + test
- `src/components/sections/thermodynamics-section.tsx` + test
- `src/components/sections/advanced-section.tsx` + test
- `src/components/sections/index.ts` — экспорт

**Base компоненты:**

- `src/components/visualizations/base/visualization-canvas.tsx` + test + stories
- `src/components/visualizations/base/visualization-controls.tsx` + test + stories
- `src/components/visualizations/base/visualization-selector.tsx` + test + stories
- `src/components/visualizations/base/fullscreen-wrapper.tsx` + stories
- `src/components/visualizations/base/visualization-card.tsx` + stories

**Квантовая механика (11):**

- `src/components/visualizations/quantum/wave-function.tsx` + test + stories
- `src/components/visualizations/quantum/uncertainty.tsx` + stories
- `src/components/visualizations/quantum/tunneling.tsx` + stories
- `src/components/visualizations/quantum/double-slit.tsx` + stories
- `src/components/visualizations/quantum/schrodingers-cat.tsx` + test + stories
- `src/components/visualizations/quantum/quantum-entanglement.tsx` + stories
- `src/components/visualizations/quantum/atomic-model.tsx` + stories
- `src/components/visualizations/quantum/photoelectric-effect.tsx` + stories
- `src/components/visualizations/quantum/radioactive-decay.tsx` + stories
- `src/components/visualizations/quantum/superconductivity.tsx` + stories
- `src/components/visualizations/quantum/brownian-motion.tsx` + stories

**Теория относительности (3):**

- `src/components/visualizations/relativity/time-dilation.tsx` + stories
- `src/components/visualizations/relativity/length-contraction.tsx` + stories
- `src/components/visualizations/relativity/mass-energy.tsx` + stories

**Космология (15):**

- `src/components/visualizations/cosmos/black-hole.tsx` + test + stories
- `src/components/visualizations/cosmos/hr-diagram.tsx` + stories
- `src/components/visualizations/cosmos/neutron-star.tsx` + stories
- `src/components/visualizations/cosmos/dark-matter.tsx` + stories
- `src/components/visualizations/cosmos/dark-energy.tsx` + stories
- `src/components/visualizations/cosmos/big-bang.tsx` + stories
- `src/components/visualizations/cosmos/standard-model.tsx` + stories
- `src/components/visualizations/cosmos/solar-system.tsx` + stories
- `src/components/visualizations/cosmos/cmb.tsx` + stories
- `src/components/visualizations/cosmos/white-hole.tsx` + stories
- `src/components/visualizations/cosmos/wormhole.tsx` ✨ НОВОЕ
- `src/components/visualizations/cosmos/pulsar.tsx` ✨ НОВОЕ
- `src/components/visualizations/cosmos/quasar.tsx` ✨ НОВОЕ
- `src/components/visualizations/cosmos/protoplanetary-disk.tsx` ✨ НОВОЕ

**Термодинамика (5):**

- `src/components/visualizations/thermodynamics/thermal-radiation.tsx` ✨ НОВОЕ
- `src/components/visualizations/thermodynamics/entropy.tsx` ✨ НОВОЕ
- `src/components/visualizations/thermodynamics/phase-transition.tsx` ✨ НОВОЕ
- `src/components/visualizations/thermodynamics/ideal-gas.tsx` ✨ НОВОЕ
- `src/components/visualizations/thermodynamics/carnot-engine.tsx` ✨ НОВОЕ

**Другие (1):**

- `src/components/visualizations/advanced/gravitational-waves.tsx` + stories

**Образовательные (4):**

- `src/components/visualizations/education/physics-quiz.tsx` + stories
- `src/components/visualizations/education/physics-timeline.tsx` + stories
- `src/components/visualizations/education/scientists-biographies.tsx` + stories
- `src/components/visualizations/education/formula-calculator.tsx` + stories

**Дополнительно:**

- `src/components/visualizations/lazy.tsx` — lazy loading для всех визуализаций
- `src/lib/physics.ts` — 95 физических формул
- `src/lib/physics.test.ts` — 80 тестов
- `src/lib/constants.test.ts` — 17 тестов (физические константы)
- `src/lib/a11y.test.ts` — 30 тестов доступности
- `src/test/setup.ts` — ResizeObserver polyfill
- `src/hooks/use-canvas-animation.ts` + test — хук для анимации canvas
- `src/stores/visualization-store.ts` + test — Zustand store

**Статус:**

- 238 тестов passing (unit)
- 24 E2E тестов passing
- 43+ Storybook stories
- 95 физических формул
- 93 компонента визуализаций (включая stories)
- 5 компонентов секций
- Сборка без ошибок
- Lint без ошибок ✅
- dev и main синхронизированы ✅

### Технические долги

- ✅ `reactStrictMode: true` — включён
- ⚠️ `eslint` игнорирует `src/components/ui/**` — необходимо для shadcn компонентов
- ⚠️ `eslint` игнорирует `.storybook/**` — допустимо для stories
- ⚠️ `eslint` игнорирует `src/lib/a11y.tsx` — требует проверки
- ⚠️ `eslint` игнорирует `public/sw.ts` — service worker

### Хорошие практики (уже есть)

- ✅ Zustand store с persist middleware
- ✅ Хук `useCanvasAnimation` для общей логики
- ✅ Физические константы вынесены в `constants.ts`
- ✅ CI/CD pipeline настроен
- ✅ Docker поддержка
- ✅ 238 unit-тестов passing
- ✅ 24 E2E тестов passing
- ✅ Lazy loading для визуализаций
- ✅ 43+ Storybook stories
- ✅ 95 физических формул
- ✅ 93 компонента визуализаций (включая stories)
- ✅ Security headers настроены
- ✅ TypeScript strict mode
- ✅ Eslint без ошибок
- ✅ i18n на 4 языках (ru, en, zh, he)
- ✅ Performance оптимизации (compress, compiler, image optimization)
- ✅ A11y: ARIA атрибуты на всех компонентах
- ✅ A11y: Keyboard navigation (Space, R, 1-5, стрелки)
- ✅ Middleware i18n с automatic locale detection
- ✅ Service Worker собран (sw.js)
- ✅ package.json фикс (node вместо bun)

### Проблемные места

- ⚠️ Мало тестов для отдельных визуализаций (только base компоненты + некоторые quantum/cosmos покрыты)
- ✅ page.tsx 161 строка (цель < 200 — **достигнута**)
- ⚠️ OneDrive синхронизация может блокировать lock-файлы
- ⚠️ React Query не используется активно

---

**Следующее обновление:** После замеров Lighthouse и Bundle size
