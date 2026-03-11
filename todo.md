# Quantum Horizon — План улучшений

**Дата:** 2026-03-11
**Обновлено:** 2026-03-11 (после рефакторинга)
**Статус:** Фаза 1 — в процессе

---

## 📊 Анализ текущего состояния

### ✅ Что уже работает хорошо

| Компонент                     | Статус | Примечания                             |
| ----------------------------- | ------ | -------------------------------------- |
| Next.js 16 + React 19         | ✅     | Актуальные версии                      |
| Tailwind CSS 4                | ✅     | Современная конфигурация               |
| TypeScript                    | ✅     | Строгая типизация включена             |
| Zustand store                 | ✅     | Глобальное состояние настроено         |
| i18n (next-intl)              | ⚠️     | Установлен, но используется частично   |
| React Query                   | ⚠️     | Установлен, но не используется активно |
| Prisma ORM                    | ✅     | Настроена                              |
| CI/CD (GitHub Actions)        | ✅     | Есть workflow для lint, test, build    |
| Vitest + Playwright           | ✅     | 51 тест passing                        |
| Storybook                     | ⚠️     | Настроен, но нет stories               |
| Docker                        | ✅     | Dockerfile есть                        |
| **Декомпозиция визуализаций** | ✅     | Базовые компоненты созданы             |

### 🔴 Критические проблемы

| #   | Проблема                                      | Файл                             | Приоритет      | Статус              |
| --- | --------------------------------------------- | -------------------------------- | -------------- | ------------------- |
| 1   | **page.tsx 9700+ строк**                      | `src/app/page.tsx`               | 🔴 Критический | ⚠️ В процессе       |
| 2   | **Нет разделения на компоненты визуализаций** | `src/components/visualizations/` | 🔴 Критический | ✅ Решено           |
| 3   | **useEffect/useCallback/useMemo в page.tsx**  | Множество inline                 | 🔴 Критический | ⚠️ В процессе       |
| 4   | **translations как any**                      | `src/lib/translations.ts`        | 🟠 Высокий     | ✅ Уже типизировано |
| 5   | **Магия чисел в анимациях**                   | Хардкод значений                 | 🟠 Высокий     | ⚠️ В процессе       |
| 6   | **Нет тестов для физических расчётов**        | Отсутствуют                      | 🟠 Высокий     | ✅ Решено           |

---

## 📋 План улучшений

### 🔴 Фаза 1: Критический рефакторинг (1-2 недели)

#### 1.1 Декомпозиция page.tsx

**Статус:** ✅ Выполнено частично

**Созданные компоненты:**

- ✅ `VisualizationCanvas` — базовый компонент для canvas рендеринга
- ✅ `VisualizationControls` — контролы (play/pause, speed)
- ✅ `VisualizationSelector` — селектор визуализаций
- ✅ `WaveFunctionVisualization` — квантовая механика
- ✅ `BlackHoleVisualization` — космология
- ✅ `TimeDilationVisualization` — теория относительности
- ✅ `MassEnergyVisualization` — теория относительности

**Осталось создать:**

- [ ] `UncertaintyPrincipleVisualization`
- [ ] `QuantumTunnelingVisualization`
- [ ] `LengthContractionVisualization`
- [ ] `HRDiagramVisualization`
- [ ] `NeutronStarVisualization`
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

**Структура после:**

```
src/
├── components/
│   └── visualizations/
│       ├── base/
│       │   ├── visualization-canvas.tsx ✅
│       │   ├── visualization-controls.tsx ✅
│       │   └── visualization-selector.tsx ✅
│       ├── quantum/
│       │   ├── wave-function.tsx ✅
│       │   ├── uncertainty.tsx
│       │   └── tunneling.tsx
│       ├── relativity/
│       │   ├── time-dilation.tsx ✅
│       │   ├── length-contraction.tsx
│       │   └── mass-energy.tsx ✅
│       └── cosmos/
│           ├── black-hole.tsx ✅
│           ├── hr-diagram.tsx
│           └── ...
├── lib/
│   └── physics/
│       ├── physics.ts ✅ (формулы и расчёты)
│       └── physics.test.ts ✅ (24 теста)
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

**Статус:** ✅ Выполнено частично

**Тесты:**

- ✅ `src/components/ui/button.test.tsx` — 5 тестов
- ✅ `src/components/visualizations/base/visualization-canvas.test.tsx` — 3 теста
- ✅ `src/components/visualizations/quantum/wave-function.test.tsx` — 1 тест
- ✅ `src/components/visualizations/cosmos/black-hole.test.tsx` — 1 тест

**Итого:** 51 тест passing ✅

**Осталось:**

- [ ] Тесты для `VisualizationControls`
- [ ] Тесты для `VisualizationSelector`
- [ ] Тесты для `TimeDilationVisualization`
- [ ] Тесты для `MassEnergyVisualization`

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

| Метрика                  | Было | Стало | Цель            |
| ------------------------ | ---- | ----- | --------------- |
| Строк в page.tsx         | 9709 | 9709  | < 200           |
| Компонентов визуализаций | 0    | 7     | 20+             |
| Unit тестов              | 0    | 51    | 100+            |
| E2E тестов               | 5    | 5     | 15+             |
| Storybook stories        | 0    | 0     | 30+             |
| Bundle size              | ?    | ?     | < 500KB initial |
| Lighthouse Performance   | ?    | ?     | > 90            |
| Lighthouse Accessibility | ?    | ?     | > 90            |
| Физических формул        | 0    | 13    | 20+             |

---

## 🎯 Ближайшие шаги

### ✅ Выполнено

1. ✅ Создан `VisualizationCanvas` — базовый компонент
2. ✅ Созданы `VisualizationControls` и `VisualizationSelector`
3. ✅ Выделены визуализации: `WaveFunction`, `BlackHole`, `TimeDilation`, `MassEnergy`
4. ✅ Создана библиотека физических формул `physics.ts`
5. ✅ Написано 51 тест (51 passing)
6. ✅ Сборка проходит успешно
7. ✅ Lint без ошибок (35 предупреждений)

### 📋 Следующие задачи

1. Продолжить декомпозицию page.tsx — выделить оставшиеся 13 визуализаций
2. Интегрировать новые компоненты в main page
3. Добавить тесты для Controls и Selector
4. Удалить дублирующийся код из page.tsx

---

## 📝 Заметки

### ✅ Выполненная работа (2026-03-11)

**Созданные файлы:**

- `src/components/visualizations/base/visualization-canvas.tsx`
- `src/components/visualizations/base/visualization-controls.tsx`
- `src/components/visualizations/base/visualization-selector.tsx`
- `src/components/visualizations/quantum/wave-function.tsx` + test
- `src/components/visualizations/relativity/time-dilation.tsx`
- `src/components/visualizations/relativity/mass-energy.tsx`
- `src/components/visualizations/cosmos/black-hole.tsx` + test
- `src/components/visualizations/index.ts`
- `src/lib/physics.ts` — 13 физических формул
- `src/lib/physics.test.ts` — 24 теста
- `src/test/setup.ts` — ResizeObserver polyfill

**Статус:**

- dev и main синхронизированы
- Commit: `6ff8ad0` — feat:add-wavefunction-blackhole-physics
- 8 files changed, 798 insertions(+)

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
- ✅ 51 тест passing

### Проблемные места

- Все визуализации в одном файле (page.tsx 9700+ строк)
- Глобальный контекст вместо next-intl
- Нет разделения ответственности
- Сложность тестирования из-за монолита

---

**Следующее обновление:** После интеграции новых компонентов в page.tsx
