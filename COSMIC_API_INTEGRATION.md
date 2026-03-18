# 🔭 Интеграция с космическими API

**Пошаговое руководство по подключению реальных космических данных**

---

## 📡 Доступные API

### 1. NASA APIs (Бесплатно)

#### APOD (Astronomy Picture of the Day)
```typescript
// API: https://api.nasa.gov/planetary/apod
interface APOD {
  date: string;
  explanation: string;
  hdurl: string;
  media_type: "image" | "video";
  service_version: string;
  title: string;
  url: string;
}

// Использование:
const response = await fetch(
  'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2026-03-18'
);
const data: APOD = await response.json();
```

**Применение в Quantum Horizon:**
- daily cosmic wallpaper
- интерактивная галерея
- образовательные карточки дня

---

#### EPIC (Earth Polychromatic Imaging Camera)
```typescript
// API: https://api.nasa.gov/epic/api/natural/images
interface EPICImage {
  identifier: string;
  caption: string;
  date: string;
  image: string;
  centroid_coordinates: {
    lat: number;
    lon: number;
  };
}

// 3D визуализация Земли из точки L1
```

---

#### DONKI (Space Weather Database)
```typescript
// API: https://api.nasa.gov/DONKI/
interface SpaceWeatherEvent {
  id: string;
  eventID: string;
  activityID: string;
  startTime21_5: string;
  stopTime21_5: string;
  link: string;
  note: string;
  catalogURL: string | null;
}

// Применение:
// - Визуализация солнечных бурь
// - Предсказание полярных сияний
// - Образование по космической погоде
```

---

#### Exoplanet Archive
```typescript
// API: https://exoplanetarchive.ipac.caltech.edu/
interface Exoplanet {
  pl_name: string; // Planet name
  ra: number; // Right ascension
  dec: number; // Declination
  pl_massj: number; // Mass (Jupiter masses)
  pl_radj: number; // Radius (Jupiter radii)
  pl_orbper: number; // Orbital period (days)
  pl_eqt: number; // Equilibrium temperature (K)
  hostname: string; // Host star
}

// Визуализация:
// - 3D модели экзопланет
// - Сравнение с Солнечной системой
// - Обитаемая зона
```

---

### 2. ESA Gaia API

#### 3D карта Млечного Пути
```typescript
// API: https://gea.esac.esa.int/archive/
interface GaiaStar {
  source_id: string;
  ra: number; // Right ascension
  dec: number; // Declination
  parallax: number; // mas
  pmra: number; // Proper motion in RA
  pmdec: number; // Proper motion in Dec
  radial_velocity: number; // km/s
  phot_g_mean_mag: number; // G magnitude
}

// Применение:
// - Интерактивная 3D галактика
// - Анимация движения звёзд
// - Расчёт расстояний
```

---

### 3. Hubble Space Telescope

#### MAST Archive
```typescript
// API: https://mast.stsci.edu/api/v0.1/Download/
interface HubbleObservation {
  obs_id: string;
  target_name: string;
  instrument: string;
  filters: string[];
  exposure_time: number;
  date_obs: string;
  ra: number;
  dec: number;
}

// Реальные данные:
// - Туманности
// - Галактики
// - Звёздные скопления
// - Сверхновые
```

---

### 4. Роскосмос / Спецтр

#### Спектр-РГ (eROSITA)
```typescript
// Рентгеновские наблюдения
interface XRaySource {
  name: string;
  ra: number;
  dec: number;
  flux: number; // erg/cm²/s
  hardness_ratio: number;
  observation_date: string;
}

// Визуализация:
// - Чёрные дыры
// - Нейтронные звёзды
// - Сверхновые остатки
// - Скопления галактик
```

---

## 🎨 Примеры компонентов

### 1. NASA APOD Viewer

```tsx
// src/components/api/nasa-apod-viewer.tsx
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface APODData {
  date: string
  explanation: string
  hdurl: string
  media_type: "image" | "video"
  title: string
  url: string
}

export function NASAAPODViewer() {
  const [data, setData] = useState<APODData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAPOD() {
      try {
        const response = await fetch(
          `https://api.nasa.gov/planetary/apod?api_key=${process.env.NEXT_PUBLIC_NASA_API_KEY}`
        )
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Failed to fetch APOD:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAPOD()
  }, [])

  if (loading) return <SkeletonLoader />

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 text-2xl font-bold">{data?.title}</h3>
      
      {data?.media_type === "image" ? (
        <Image
          src={data.url}
          alt={data.title}
          width={800}
          height={600}
          className="rounded-lg"
        />
      ) : (
        <iframe
          src={data.url}
          title={data.title}
          className="aspect-video w-full rounded-lg"
        />
      )}

      <p className="mt-4 text-muted-foreground">{data?.explanation}</p>
      
      <div className="mt-4 flex gap-2">
        <a
          href={data?.hdurl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-purple-400 hover:underline"
        >
          HD Version →
        </a>
      </div>
    </div>
  )
}
```

---

### 2. Interactive Exoplanet Explorer

```tsx
// src/components/api/exoplanet-explorer.tsx
"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

interface Exoplanet {
  pl_name: string
  pl_massj: number
  pl_radj: number
  pl_orbper: number
  pl_eqt: number
  hostname: string
}

export function ExoplanetExplorer() {
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null)

  // Загрузка данных из NASA Exoplanet Archive
  const planets: Exoplanet[] = [...] // fetched data

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Список планет */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold">Экзопланеты</h3>
        <div className="max-h-[600px] overflow-y-auto space-y-2">
          {planets.map((planet) => (
            <button
              key={planet.pl_name}
              onClick={() => setSelectedPlanet(planet)}
              className="w-full p-3 text-left rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="font-semibold">{planet.pl_name}</div>
              <div className="text-sm text-muted-foreground">
                ⭐ {planet.hostname} | 
                🌡️ {planet.pl_eqt}K | 
                ⏱️ {planet.pl_orbper} days
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3D визуализация */}
      <div className="rounded-xl border bg-card overflow-hidden">
        {selectedPlanet ? (
          <>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              
              {/* Планета */}
              <mesh>
                <sphereGeometry args={[selectedPlanet.pl_radj * 10, 32, 32]} />
                <meshStandardMaterial color="#4f46e5" />
              </mesh>
              
              {/* Орбита */}
              <OrbitControls enableZoom={true} />
            </Canvas>
            
            <div className="p-4 border-t">
              <h4 className="font-bold">{selectedPlanet.pl_name}</h4>
              <ul className="mt-2 space-y-1 text-sm">
                <li>🪐 Масса: {(selectedPlanet.pl_massj * 317.8).toFixed(2)} M⊕</li>
                <li>📏 Радиус: {(selectedPlanet.pl_radj * 11.2).toFixed(2)} R⊕</li>
                <li>🌡️ Температура: {selectedPlanet.pl_eqt}K</li>
                <li>⏱️ Период: {(selectedPlanet.pl_orbper / 365).toFixed(2)} лет</li>
              </ul>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Выберите планету для просмотра
          </div>
        )}
      </div>
    </div>
  )
}
```

---

### 3. Real-time Satellite Tracker

```tsx
// src/components/api/satellite-tracker.tsx
"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

interface Satellite {
  id: number
  name: string
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  timestamp: string
}

export function SatelliteTracker() {
  const [satellites, setSatellites] = useState<Satellite[]>([])

  useEffect(() => {
    // Track ISS and other satellites
    async function fetchSatellites() {
      const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544')
      const data = await response.json()
      setSatellites([data])
    }

    fetchSatellites()
    const interval = setInterval(fetchSatellites, 5000) // Update every 5s
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="mb-4 text-xl font-bold">🛰️ Трекер спутников</h3>
      
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='© OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {satellites.map((sat) => (
          <Marker
            key={sat.id}
            position={[sat.latitude, sat.longitude]}
          >
            <Popup>
              <strong>{sat.name}</strong><br />
              Высота: {sat.altitude.toFixed(2)} км<br />
              Скорость: {sat.velocity.toFixed(2)} км/ч<br />
              Обновление: {new Date(sat.timestamp).toLocaleTimeString()}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="mt-4 grid grid-cols-2 gap-4">
        {satellites.map((sat) => (
          <div key={sat.id} className="p-3 rounded-lg bg-muted">
            <div className="font-semibold">{sat.name}</div>
            <div className="text-sm text-muted-foreground">
              📍 {sat.latitude.toFixed(4)}, {sat.longitude.toFixed(4)}<br />
              📈 {sat.altitude.toFixed(2)} км<br />
              ⚡ {sat.velocity.toFixed(2)} км/ч
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🔧 Настройка проекта

### 1. Добавление зависимостей

```bash
npm install @react-three/fiber @react-three/drei
npm install react-leaflet leaflet
npm install recharts
```

### 2. Переменные окружения

```bash
# .env.local
NEXT_PUBLIC_NASA_API_KEY=your_nasa_api_key_here
NEXT_PUBLIC_ESA_API_KEY=your_esa_api_key_here
NEXT_PUBLIC_ROSCOSMOS_API_KEY=your_roscosmos_api_key_here
```

### 3. Получение API ключей

**NASA:**
1. Перейти на https://api.nasa.gov/
2. Click "Get API Key"
3. Fill form (instant key)
4. Use immediately (rate limit: 1000/hr)

**ESA:**
1. https://www.cosmos.esa.int/web/esdc
2. Register account
3. Request API access
4. Wait for approval (~1 week)

**Роскосмос:**
1. Email: api@roscosmos.ru
2. Образовательный запрос
3. Договор о сотрудничестве
4. Индивидуальный доступ

---

## 📊 План интеграции

### Этап 1: Базовая интеграция (2 недели)

**Неделя 1:**
- ✅ NASA APOD компонент
- ✅ NASA EPIC Earth viewer
- ✅ Simple satellite tracker (ISS)

**Неделя 2:**
- ✅ Exoplanet explorer
- ✅ Space weather dashboard
- ✅ Error handling & loading states

### Этап 2: Продвинутые функции (1 месяц)

**Недели 3-4:**
- 3D Gaia star mapper
- Hubble image processor
- Multi-satellite tracking

**Недели 5-6:**
- Real-time data streaming
- User bookmarks & favorites
- Social sharing integration

### Этап 3: Российские API (1-2 месяца)

**Месяц 2:**
- Спектр-РГ данные
- Роскосмос миссии
- Локализация для RU

**Месяц 3:**
- Интеграция с планетариями
- Школьные программы
- Пилотное тестирование

---

## 🎓 Образовательные сценарии

### Урок 1: "Солнечная система в реальном времени"

**Цели:**
- Изучить планеты и их орбиты
- Понять масштабы системы
- Наблюдать движение тел

**Инструменты:**
- NASA Eyes on Solar System
- Real-time planet positions
- Interactive orrery

**Задание:**
1. Найти текущее положение Марса
2. Рассчитать время полёта к Юпитеру
3. Определить видимость Венеры сегодня

---

### Урок 2: "Экзопланеты и обитаемость"

**Цели:**
- Методы поиска экзопланет
- Параметры обитаемой зоны
- Сравнение с Землёй

**Инструменты:**
- NASA Exoplanet Archive
- Habitable zone calculator
- 3D planet models

**Задание:**
1. Найти планету земного типа
2. Оценить потенциал для жизни
3. Подготовить презентацию

---

### Урок 3: "Космическая погода"

**Цели:**
- Солнечная активность
- Влияние на Землю
- Полярные сияния

**Инструменты:**
- DONKI space weather DB
- Real-time solar wind data
- Aurora forecasts

**Задание:**
1. Отследить солнечную вспышку
2. Предсказать сияния через 2-3 дня
3. Объяснить физику явления

---

## 💡 Креативные идеи

### 1. "День в истории космоса"

```typescript
// On this day in space history
const historicalEvents = {
  "March 18": [
    { year: 1965, event: "Voskhod 2 - First spacewalk" },
    { year: 1990, event: "Hubble Space Telescope launched" },
    { year: 2016, event: "ExoMars TGO launched" }
  ]
}
```

### 2. "Космический календарь"

- Фазы Луны сегодня
- Ближайшие затмения
- Метеорные потоки
- Парады планет

### 3. "Живая Вселенная"

- Стримы с телескопов
- Citizen science проекты
- Поиск новых объектов
- Классификация галактик

---

## 🚀 Следующие шаги

1. **Создать API abstraction layer**
   - Unified interface для всех API
   - Caching strategy
   - Error boundaries

2. **Построить образовательный контент**
   - Lesson plans
   - Teacher guides
   - Student workbooks

3. **Тестировать с пользователями**
   - Фокус-группы студентов
   - Обратная связь учителей
   - Итерации на основе фидбека

4. **Масштабировать**
   - Добавить больше API
   - Локализация (EN/RU/ZH/HE)
   - Мобильное приложение

---

**Космос ближе, чем кажется! Давайте принесём его в каждый класс! 🌌🔭✨**
