# Quantum Horizon — План улучшений

**Дата:** 2026-03-11  
**Статус:** Анализ проекта

---

## 📊 Анализ текущего состояния

### ✅ Что уже работает хорошо

| Компонент | Статус | Примечания |
|-----------|--------|------------|
| Next.js 16 + React 19 | ✅ | Актуальные версии |
| Tailwind CSS 4 | ✅ | Современная конфигурация |
| TypeScript | ✅ | Строгая типизация включена |
| Zustand store | ✅ | Глобальное состояние настроено |
| i18n (next-intl) | ⚠️ | Установлен, но используется частично |
| React Query | ⚠️ | Установлен, но не используется активно |
| Prisma ORM | ✅ | Настроена |
| CI/CD (GitHub Actions) | ✅ | Есть workflow для lint, test, build |
| Vitest + Playwright | ⚠️ | Настроены, но мало тестов |
| Storybook | ⚠️ | Настроен, но нет stories |
| Docker | ✅ | Dockerfile есть |

### 🔴 Критические проблемы

| # | Проблема | Файл | Приоритет |
|---|----------|------|-----------|
| 1 | **page.tsx 9700+ строк** | `src/app/page.tsx` | 🔴 Критический |
| 2 | **Нет разделения на компоненты визуализаций** | `src/components/visualizations/` (пусто) | 🔴 Критический |
| 3 | **useEffect/useCallback/useMemo в page.tsx** | Множество inline | 🔴 Критический |
| 4 | **translations как any** | `src/lib/translations.ts` | 🟠 Высокий |
| 5 | **Магия чисел в анимациях** | Хардкод значений | 🟠 Высокий |
| 6 | **Нет тестов для физических расчётов** | Отсутствуют | 🟠 Высокий |

---

## 📋 План улучшений

### 🔴 Фаза 1: Критический рефакторинг (1-2 недели)

#### 1.1 Декомпозиция page.tsx
```
Приоритет: Критический
Сложность: Высокая
Время: ~40 часов
```

**Задачи:**
- [ ] Создать базовый компонент `VisualizationCanvas` для общих операций
- [ ] Выделить каждую визуализацию в отдельный компонент:
  - [ ] `WaveFunctionVisualization`
  - [ ] `UncertaintyPrincipleVisualization`
  - [ ] `QuantumTunnelingVisualization`
  - [ ] `TimeDilationVisualization`
  - [ ] `LengthContractionVisualization`
  - [ ] `MassEnergyVisualization`
  - [ ] `HRDiagramVisualization`
  - [ ] `NeutronStarVisualization`
  - [ ] `BlackHoleVisualization`
  - [ ] `DoubleSlitVisualization`
  - [ ] `DarkMatterVisualization`
  - [ ] `SchrodingersCatVisualization`
  - [ ] `BigBangVisualization`
  - [ ] `PhotoelectricEffectVisualization`
  - [ ] `BrownianMotionVisualization`
  - [ ] `GravitationalWavesVisualization`
  - [ ] `QuantumEntanglementVisualization`
  - [ ] `AtomicModelVisualization`
  - [ ] `RadioactiveDecayVisualization`
  - [ ] `SuperconductivityVisualization`
  - [ ] `StandardModelVisualization`
- [ ] Создать `VisualizationSelector` для переключения между визуализациями
- [ ] Создать `VisualizationControls` для общих контролов
- [ ] Вынести физику расчётов в `src/lib/physics/`

**Структура после:**
```
src/
├── components/
│   └── visualizations/
│       ├── base/
│       │   ├── visualization-canvas.tsx
│       │   ├── visualization-controls.tsx
│       │   └── visualization-selector.tsx
│       ├── quantum/
│       │   ├── wave-function.tsx
│       │   ├── uncertainty.tsx
│       │   ├── tunneling.tsx
│       │   └── ...
│       ├── relativity/
│       │   ├── time-dilation.tsx
│       │   ├── length-contraction.tsx
│       │   └── ...
│       └── cosmos/
│           ├── hr-diagram.tsx
│           ├── black-hole.tsx
│           └── ...
├── lib/
│   └── physics/
│       ├── wave-function.ts
│       ├── relativity.ts
│       ├── cosmology.ts
│       └── ...
```

#### 1.2 Типизация переводов
```
Приоритет: Высокий
Сложность: Средняя
Время: ~8 часов
```

**Задачи:**
- [ ] Создать интерфейс `Translations` в `src/i18n/types.ts`
- [ ] Типизировать `translations` объект
- [ ] Использовать `useTranslations` из next-intl вместо контекста
- [ ] Удалить кастомный `LanguageContext` из page.tsx

#### 1.3 Физические константы и расчёты
```
Приоритет: Высокий
Сложность: Средняя
Время: ~12 часов
```

**Задачи:**
- [ ] Создать `src/lib/physics/constants.ts` с типами
- [ ] Вынести все формулы в отдельные функции
- [ ] Покрыть unit-тестами физические расчёты

---

### 🟠 Фаза 2: Тестирование (1-2 недели)

#### 2.1 Unit-тесты для физики
```
Приоритет: Высокий
Сложность: Средняя
Время: ~16 часов
```

**Задачи:**
- [ ] Тесты для волновой функции
- [ ] Тесты для уравнений СТО
- [ ] Тесты для космологических расчётов
- [ ] Тесты для физических констант

#### 2.2 Компонентные тесты
```
Приоритет: Средний
Сложность: Средняя
Время: ~20 часов
```

**Задачи:**
- [ ] Тесты для UI компонентов
- [ ] Тесты для визуализаций (mock canvas)
- [ ] Тесты для хуков

#### 2.3 E2E тесты
```
Приоритет: Средний
Сложность: Низкая
Время: ~8 часов
```

**Задачи:**
- [ ] Расширить существующие e2e тесты
- [ ] Тесты для переключения визуализаций
- [ ] Тесты для изменения настроек
- [ ] Тесты для смены темы/языка

---

### 🟡 Фаза 3: Инфраструктура (1 неделя)

#### 3.1 Полная i18n интеграция
```
Приоритет: Средний
Сложность: Средняя
Время: ~8 часов
```

**Задачи:**
- [ ] Использовать `useTranslations` во всех компонентах
- [ ] Добавить недостающие ключи переводов
- [ ] Настроить fallback для отсутствующих переводов
- [ ] Добавить китайский (zh) и иврит (he)

#### 3.2 React Query интеграция
```
Приоритет: Средний
Сложность: Средняя
Время: ~6 часов
```

**Задачи:**
- [ ] Создать API endpoints для данных
- [ ] Использовать useQuery для получения данных
- [ ] Настроить кэширование

#### 3.3 Storybook
```
Приоритет: Низкий
Сложность: Средняя
Время: ~12 часов
```

**Задачи:**
- [ ] Stories для UI компонентов
- [ ] Stories для визуализаций
- [ ] Документация в Storybook

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

| Метрика | Текущее | Цель |
|---------|---------|------|
| Строк в page.tsx | 9709 | < 200 |
| Компонентов визуализаций | 0 | 20+ |
| Unit тестов | ~0 | 50+ |
| E2E тестов | 5 | 15+ |
| Storybook stories | 0 | 30+ |
| Bundle size | ? | < 500KB initial |
| Lighthouse Performance | ? | > 90 |
| Lighthouse Accessibility | ? | > 90 |

---

## 🎯 Ближайшие шаги (эта неделя)

1. **Начать декомпозицию page.tsx** — создать базовый компонент `VisualizationCanvas`
2. **Выделить 2-3 простые визуализации** — например, `TimeDilation`, `MassEnergy`
3. **Создать типы для переводов** — типизировать `translations`
4. **Написать первые unit-тесты** — для физических констант

---

## 📝 Заметки

### Технические долги
- `eslint` игнорирует `src/app/page.tsx` — нужно исправить после рефакторинга
- `ignoreBuildErrors: true` в next.config.ts — убрать после исправления типов
- `reactStrictMode: false` — включить после рефакторинга

### Хорошие практики (уже есть)
- ✅ Zustand store с persist middleware
- ✅ Хук `useCanvasAnimation` для общей логики
- ✅ Физические константы вынесены в `constants.ts`
- ✅ CI/CD pipeline настроен
- ✅ Docker поддержка

### Проблемные места
- Все визуализации в одном файле
- Глобальный контекст вместо next-intl
- Нет разделения ответственности
- Сложность тестирования из-за монолита

---

**Следующее обновление:** После завершения Фазы 1
