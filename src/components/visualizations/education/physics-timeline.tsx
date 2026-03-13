"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useVisualizationCanvas } from "@/hooks/use-visualization-canvas"

interface TimelineEvent {
  year: number
  era: string
  title: string
  desc: string
  detail: string
  color: string
}

interface Era {
  id: string
  name: string
  range: string
  color: string
}

export function PhysicsTimeline() {
  const [selectedEra, setSelectedEra] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bgGradientRef = useRef<CanvasGradient | null>(null)
  const timelineGradientRef = useRef<CanvasGradient | null>(null)

  const events: TimelineEvent[] = [
    {
      year: -300,
      era: "ancient",
      title: "Аристотель",
      desc: "Физика античности",
      detail: "Основы механики и космологии",
      color: "#8B5CF6",
    },
    {
      year: -250,
      era: "ancient",
      title: "Архимед",
      desc: "Закон рычага",
      detail: "Eureka! Закон гидростатики",
      color: "#8B5CF6",
    },
    {
      year: 1543,
      era: "renaissance",
      title: "Коперник",
      desc: "Гелиоцентризм",
      detail: "Революция в астрономии",
      color: "#F59E0B",
    },
    {
      year: 1609,
      era: "renaissance",
      title: "Кеплер",
      desc: "Законы планет",
      detail: "Эллиптические орбиты планет",
      color: "#F59E0B",
    },
    {
      year: 1666,
      era: "classical",
      title: "Ньютон",
      desc: "Классическая механика",
      detail: "Законы движения, гравитация",
      color: "#EF4444",
    },
    {
      year: 1687,
      era: "classical",
      title: "Principia",
      desc: "Математические начала",
      detail: "Величайший труд Ньютона",
      color: "#EF4444",
    },
    {
      year: 1800,
      era: "classical",
      title: "Вольта",
      desc: "Электрическая батарея",
      detail: "Первый источник тока",
      color: "#3B82F6",
    },
    {
      year: 1820,
      era: "classical",
      title: "Эрстед",
      desc: "Электромагнетизм",
      detail: "Связь электричества и магнетизма",
      color: "#3B82F6",
    },
    {
      year: 1831,
      era: "classical",
      title: "Фарадей",
      desc: "Электромагнитная индукция",
      detail: "Основы электротехники",
      color: "#3B82F6",
    },
    {
      year: 1865,
      era: "classical",
      title: "Максвелл",
      desc: "Уравнения Максвелла",
      detail: "Теория электромагнетизма",
      color: "#3B82F6",
    },
    {
      year: 1887,
      era: "modern",
      title: "Микельсон",
      desc: "Опыт Микельсона",
      detail: "Постоянство скорости света",
      color: "#10B981",
    },
    {
      year: 1895,
      era: "modern",
      title: "Рентген",
      desc: "Рентгеновские лучи",
      detail: "Открытие ионизирующего излучения",
      color: "#10B981",
    },
    {
      year: 1896,
      era: "modern",
      title: "Беккерель",
      desc: "Радиоактивность",
      detail: "Явление самопроизвольного распада",
      color: "#10B981",
    },
    {
      year: 1897,
      era: "modern",
      title: "Томсон",
      desc: "Открытие электрона",
      detail: "Первая элементарная частица",
      color: "#10B981",
    },
    {
      year: 1900,
      era: "quantum",
      title: "Планк",
      desc: "Квантовая гипотеза",
      detail: "Рождение квантовой физики",
      color: "#EC4899",
    },
    {
      year: 1905,
      era: "relativity",
      title: "Эйнштейн",
      desc: "Специальная относительность",
      detail: "E = mc², 4 статьи за год чудес",
      color: "#F97316",
    },
    {
      year: 1911,
      era: "quantum",
      title: "Оннес",
      desc: "Сверхпроводимость",
      detail: "Нулевое сопротивление при низких T",
      color: "#EC4899",
    },
    {
      year: 1911,
      era: "quantum",
      title: "Резерфорд",
      desc: "Ядерная модель атома",
      detail: "Планетарная модель",
      color: "#EC4899",
    },
    {
      year: 1913,
      era: "quantum",
      title: "Бор",
      desc: "Модель атома Бора",
      detail: "Квантовые орбиты электронов",
      color: "#EC4899",
    },
    {
      year: 1915,
      era: "relativity",
      title: "Эйнштейн",
      desc: "Общая относительность",
      detail: "Искривление пространства-времени",
      color: "#F97316",
    },
    {
      year: 1924,
      era: "quantum",
      title: "де Бройль",
      desc: "Волновой дуализм",
      detail: "Волны материи λ = h/p",
      color: "#EC4899",
    },
    {
      year: 1925,
      era: "quantum",
      title: "Гейзенберг",
      desc: "Матричная механика",
      detail: "Принцип неопределённости",
      color: "#EC4899",
    },
    {
      year: 1926,
      era: "quantum",
      title: "Шрёдингер",
      desc: "Волновое уравнение",
      detail: "Уравнение Шрёдингера",
      color: "#EC4899",
    },
    {
      year: 1927,
      era: "quantum",
      title: "Леметр",
      desc: "Большой взрыв",
      detail: "Теория расширяющейся Вселенной",
      color: "#EC4899",
    },
    {
      year: 1928,
      era: "quantum",
      title: "Дирак",
      desc: "Релятивистское уравнение",
      detail: "Предсказание античастиц",
      color: "#EC4899",
    },
    {
      year: 1929,
      era: "cosmology",
      title: "Хаббл",
      desc: "Расширение Вселенной",
      detail: "Закон Хаббла: галактики разлетаются",
      color: "#A855F7",
    },
    {
      year: 1932,
      era: "quantum",
      title: "Чедвик",
      desc: "Открытие нейтрона",
      detail: "Структура ядра атома",
      color: "#EC4899",
    },
    {
      year: 1938,
      era: "nuclear",
      title: "Ган и Штрассман",
      desc: "Деление ядра",
      detail: "Основа ядерной энергетики",
      color: "#FBBF24",
    },
    {
      year: 1947,
      era: "quantum",
      title: "Лэмб",
      desc: "Сдвиг Лэмба",
      detail: "Квантовая электродинамика",
      color: "#EC4899",
    },
    {
      year: 1964,
      era: "quantum",
      title: "Гелл-Манн",
      desc: "Кварки",
      detail: "Стандартная модель зарождается",
      color: "#EC4899",
    },
    {
      year: 1965,
      era: "cosmology",
      title: "Пензиас и Вилсон",
      desc: "Реликтовое излучение",
      detail: "Доказательство Большого взрыва",
      color: "#A855F7",
    },
    {
      year: 1967,
      era: "unified",
      title: "Вайнберг",
      desc: "Электрослабая теория",
      detail: "Объединение сил природы",
      color: "#14B8A6",
    },
    {
      year: 1970,
      era: "quantum",
      title: "Стандартная модель",
      desc: "Кварки и лептоны",
      detail: "Современная теория частиц",
      color: "#EC4899",
    },
    {
      year: 1980,
      era: "cosmology",
      title: "Гут",
      desc: "Инфляция",
      detail: "Теория экспоненциального расширения",
      color: "#A855F7",
    },
    {
      year: 1998,
      era: "cosmology",
      title: "Тёмная энергия",
      desc: "Ускорение расширения",
      detail: "70% Вселенной — тёмная энергия",
      color: "#A855F7",
    },
    {
      year: 2012,
      era: "quantum",
      title: "CERN",
      desc: "Бозон Хиггса",
      detail: "Последний элемент Стандартной модели",
      color: "#EC4899",
    },
    {
      year: 2015,
      era: "relativity",
      title: "LIGO",
      desc: "Гравитационные волны",
      detail: "Подтверждение общей относительности",
      color: "#F97316",
    },
    {
      year: 2019,
      era: "cosmology",
      title: "EHT",
      desc: "Фото чёрной дыры",
      detail: "M87* — первое изображение",
      color: "#A855F7",
    },
  ]

  const eras: Era[] = [
    { id: "ancient", name: "Античность", range: "-300 — 0", color: "#8B5CF6" },
    { id: "renaissance", name: "Ренессанс", range: "1500 — 1600", color: "#F59E0B" },
    { id: "classical", name: "Классика", range: "1600 — 1900", color: "#3B82F6" },
    { id: "modern", name: "Современность", range: "1900 — 1930", color: "#10B981" },
    { id: "quantum", name: "Кванты", range: "1900 — 2020", color: "#EC4899" },
    { id: "relativity", name: "Относительность", range: "1905 — 2020", color: "#F97316" },
    { id: "cosmology", name: "Космология", range: "1920 — 2020", color: "#A855F7" },
    { id: "nuclear", name: "Ядерная физика", range: "1930 — 1950", color: "#FBBF24" },
    { id: "unified", name: "Великие теории", range: "1960 — 2020", color: "#14B8A6" },
  ]

  const filteredEvents = selectedEra ? events.filter((e) => e.era === selectedEra) : events

  const yearToX = (year: number, width: number): number => ((year - -300) / (2025 - -300)) * width

  // Используем новый хук для анимации canvas
  useVisualizationCanvas(
    canvasRef,
    (ctx, width, height) => {
      const centerY = height / 2

      ctx.clearRect(0, 0, width, height)

      // Background gradient with caching
      if (!bgGradientRef.current) {
        bgGradientRef.current = ctx.createLinearGradient(0, 0, width, height)
        bgGradientRef.current.addColorStop(0, "#0a0a18")
        bgGradientRef.current.addColorStop(1, "#151530")
      }
      ctx.fillStyle = bgGradientRef.current
      ctx.fillRect(0, 0, width, height)

      // Timeline gradient with caching
      if (!timelineGradientRef.current) {
        timelineGradientRef.current = ctx.createLinearGradient(0, 0, width, 0)
        timelineGradientRef.current.addColorStop(0, "#8B5CF6")
        timelineGradientRef.current.addColorStop(0.25, "#3B82F6")
        timelineGradientRef.current.addColorStop(0.5, "#10B981")
        timelineGradientRef.current.addColorStop(0.75, "#EC4899")
        timelineGradientRef.current.addColorStop(1, "#F97316")
      }
      ctx.strokeStyle = timelineGradientRef.current
      ctx.lineWidth = 3

      // Timeline line
      const lineY = centerY
      ctx.beginPath()
      ctx.moveTo(0, lineY)
      ctx.lineTo(width, lineY)
      ctx.stroke()

      // Era labels
      eras.forEach((era, i) => {
        ctx.fillStyle = era.color + "40"
        ctx.font = "9px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(era.name, 10, 15 + i * 12)
      })

      // Event markers
      filteredEvents.forEach((event, i) => {
        const x = yearToX(event.year, width)
        const y = lineY + (i % 2 === 0 ? -30 : 30)
        const radius = 5
        const glow = ctx.createRadialGradient(x, lineY, 0, x, lineY, radius * 3)
        glow.addColorStop(0, event.color)
        glow.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, lineY, radius * 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = event.color
        ctx.beginPath()
        ctx.arc(x, lineY, radius, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = event.color + "80"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, lineY)
        ctx.lineTo(x, y)
        ctx.stroke()

        ctx.fillStyle = "#AAAAAA"
        ctx.font = "9px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(event.year.toString(), x, y + (i % 2 === 0 ? -8 : 15))
        ctx.fillText(event.title, x, y + (i % 2 === 0 ? -18 : 25))
      })

      // Year markers
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.font = "8px sans-serif"
      ctx.textAlign = "center"
      for (let year = -300; year <= 2025; year += 200) {
        const x = yearToX(year, width)
        ctx.fillText(year.toString(), x, height - 5)
      }
    },
    {
      dependencies: [filteredEvents],
      pauseWhenHidden: true,
      respectReducedMotion: true,
    }
  )

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        className="h-56 w-full rounded-lg"
        aria-label="История физики: временная шкала открытий"
        role="img"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setSelectedEra(null)
          }}
          variant={selectedEra === null ? "default" : "outline"}
          size="sm"
          className={`text-xs ${selectedEra === null ? "bg-purple-600" : ""}`}
        >
          Все эпохи
        </Button>
        {eras.slice(2, 7).map((era) => (
          <Button
            key={era.id}
            onClick={() => {
              setSelectedEra(selectedEra === era.id ? null : era.id)
            }}
            variant={selectedEra === era.id ? "default" : "outline"}
            size="sm"
            className="text-xs"
            style={{
              borderColor: era.color + "80",
              color: selectedEra === era.id ? "white" : era.color,
            }}
          >
            {era.name}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border border-purple-500/20 bg-purple-900/20 p-2 text-xs">
        <div className="font-semibold text-purple-300">📅 История физики</div>
        <p className="mt-1 text-gray-400">
          От Архимеда до Хокинга — более 2300 лет открытий. Каждая эпоха приносила революционные
          идеи, менявшие наше понимание Вселенной.
        </p>
      </div>
    </div>
  )
}
