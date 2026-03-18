# ⚡ Quick Start Guide

**Быстрый старт для Quantum Horizon после Phase 1**

---

## 🎯 Что готово

✅ **6 новых компонентов:**
1. NASA APOD Viewer — картинка дня от NASA
2. Satellite Tracker — МКС онлайн
3. Exoplanet Explorer — 3D планеты
4. Space Weather Dashboard — космическая погода
5. User Profile — кабинет пользователя
6. Achievements Panel — достижения

✅ **Установлены зависимости:**
- react-leaflet, leaflet (карты)
- @react-three/fiber, three (3D графика)

---

## 🚀 Как использовать

### 1️⃣ Быстрая интеграция (5 минут)

Добавьте на главную страницу:

```tsx
// src/app/page.tsx

import { NASAAPODViewer } from "@/components/api/nasa-apod-viewer"
import { SatelliteTracker } from "@/components/api/satellite-tracker"
import { ExoplanetExplorer } from "@/components/api/exoplanet-explorer"
import { SpaceWeatherDashboard } from "@/components/api/space-weather-dashboard"
import { UserProfile } from "@/components/user/user-profile"
import { AchievementsPanel } from "@/components/user/achievements-panel"

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      {/* Hero Section */}
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">🌌 Quantum Horizon</h1>
        <p className="text-muted-foreground">
          Образовательная платформа по астрофизике и космосу
        </p>
      </section>

      {/* API Components */}
      <div className="space-y-8">
        <NASAAPODViewer />
        <SatelliteTracker showMultipleSatellites />
        <ExoplanetExplorer />
        <SpaceWeatherDashboard />
        
        {/* User Section */}
        <section className="mt-12">
          <h2 className="text-3xl font-bold mb-6">👤 Your Progress</h2>
          <UserProfile />
          <AchievementsPanel className="mt-8" />
        </section>
      </div>
    </main>
  )
}
```

### 2️⃣ Запустить проект

```bash
# Установить зависимости (если ещё не сделали)
npm install

# Запустить dev сервер
npm run dev
```

Откройте http://localhost:3000

### 3️⃣ Протестировать в Storybook

```bash
npm run storybook
```

Ищите разделы:
- **API Integrations** — все 4 компонента
- **User** — профиль и достижения

---

## 📁 Структура файлов

```
src/
├── components/
│   ├── api/                    ← Космические API
│   │   ├── nasa-apod-viewer.tsx
│   │   ├── satellite-tracker.tsx
│   │   ├── exoplanet-explorer.tsx
│   │   └── space-weather-dashboard.tsx
│   │
│   └── user/                   ← Пользовательская система
│       ├── user-profile.tsx
│       └── achievements-panel.tsx
│
└── app/
    ├── page.tsx                ← Интегрируйте здесь
    └── layout.tsx
```

---

## 🔧 Настройка API

### NASA API (работает сразу!)

В `.env.local` или `.env.example`:

```bash
NEXT_PUBLIC_NASA_API_KEY="DEMO_KEY"
```

**DEMO_KEY** работает с лимитами:
- 50 запросов в час для APOD
- 1000 запросов в час для других API

**Получить свой ключ:** https://api.nasa.gov/

---

## 🎨 Кастомизация

### Изменить размеры

```tsx
<NASAAPODViewer className="max-w-4xl mx-auto" />
<SatelliteTracker className="h-[600px]" />
<ExoplanetExplorer className="min-h-[500px]" />
```

### Скрыть элементы

```tsx
<NASAAPODViewer showDateSelector={false} />
<SatelliteTracker showMultipleSatellites={false} />
```

### Свои спутники

```tsx
// МКС
<SatelliteTracker satelliteId={25544} />

// Китайская станция
<SatelliteTracker satelliteId={48274} />

// Hubble
<SatelliteTracker satelliteId={43013} />
```

---

## 📊 Возможности

### NASA APOD Viewer:
- 🌌 Картинка дня с описанием
- 📅 Выбор любой даты с 1995 года
- 📥 Скачать в HD
- ℹ️ Объяснения от астрономов

### Satellite Tracker:
- 🛰️ МКС в реальном времени
- 🌍 Интерактивная карта
- 📊 Статистика полёта
- 🔄 Автообновление каждые 5 сек

### Exoplanet Explorer:
- 🪐 5 известных экзопланет
- 🎨 3D визуализация орбит
- 🌡️ Температурный режим
- ✅ Обитаемость

### Space Weather Dashboard:
- ☀️ Солнечные вспышки
- 💨 Солнечный ветер
- 🌌 Прогноз полярных сияний
- 📈 Kp-индекс

### User Profile:
- 👤 Уровень и XP
- 📚 Прогресс курсов
- 🏆 Достижения
- 📊 Статистика

### Achievements Panel:
- 🎯 12 достижений
- 🏅 4 категории
- 💎 Редкость (common/rare/epic/legendary)
- ⭐ XP награды

---

## 🐛 Troubleshooting

### Ошибка: "Cannot find module 'react-leaflet'"

```bash
npm install react-leaflet leaflet @types/leaflet --legacy-peer-deps
```

### Ошибка: "Cannot find module 'three'"

```bash
npm install @react-three/fiber @react-three/drei three --legacy-peer-deps
```

### Компоненты не отображаются

Проверьте импорты:
```tsx
import { NASAAPODViewer } from "@/components/api/nasa-apod-viewer"
```

### Не работает API

1. Проверьте `.env.local`:
```bash
NEXT_PUBLIC_NASA_API_KEY="DEMO_KEY"
```

2. Перезапустите сервер:
```bash
# Ctrl+C
npm run dev
```

---

## 📱 Mobile Testing

Компоненты адаптированы под мобильные:

```tsx
// Автоматически становится responsive
<NASAAPODViewer />
<SatelliteTracker />
```

Проверьте на устройстве или в DevTools (F12 → Toggle Device Toolbar)

---

## 🎓 Образовательное применение

### Урок 1: "Солнечная система"
- Используйте Satellite Tracker
- Найдите МКС над вашим городом
- Обсудите орбитальную механику

### Урок 2: "Экзопланеты"
- Exoplanet Explorer
- Сравните планеты с Землёй
- Обсудите обитаемость

### Урок 3: "Космическая погода"
- Space Weather Dashboard
- Влияние на Землю
- Полярные сияния

### Мотивация:
- User Profile для трекинга прогресса
- Achievements для вовлечения
- XP система

---

## 🚀 Следующие шаги

### Phase 2 (в разработке):
1. База данных (Prisma)
2. Реальные API запросы
3. Образовательные курсы
4. Мультиплеер
5. AR/VR режимы

### Сейчас можно:
- Тестировать на студентах
- Собирать обратную связь
- Предлагать улучшения

---

## 💡 Советы

### Для учителей:
1. Создайте аккаунты для студентов
2. Назначайте "домашние задания" через достижения
3. Отслеживайте прогресс в профиле

### Для студентов:
1. Проходите уроки последовательно
2. Собирайте достижения
3. Соревнуйтесь в рейтинге

### Для разработчиков:
1. Изучите код компонентов
2. Модифицируйте под свои нужды
3. Добавляйте новые API

---

## 📞 Support

**Документация:**
- `README.md` — общая информация
- `IMPLEMENTATION_REPORT_PHASE1.md` — детальный отчёт
- `ROADMAP_2026-2027.md` — планы развития

**GitHub Issues:**
- Баги → New Issue → Bug Report
- Фичи → New Issue → Feature Request

---

## 🎉 Готово!

Вы успешно интегрировали компоненты Quantum Horizon!

**Что дальше:**
1. ✅ Протестируйте каждый компонент
2. ✅ Покажите студентам/коллегам
3. ✅ Соберите обратную связь
4. ✅ Планируйте Phase 2

---

**Космос ждёт! 🚀✨**

*Последнее обновление: 2026-03-18*
