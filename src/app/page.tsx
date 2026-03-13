/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable no-irregular-whitespace */
"use client"

import { useState, useEffect, useRef } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { translations, type Language } from "@/lib/translations"
import { FullscreenWrapper } from "@/components/visualizations/base/fullscreen-wrapper"
import {
  WaveFunctionVisualization,
  UncertaintyVisualization,
  TimeDilationVisualization,
  MassEnergyVisualization,
  BlackHoleVisualization,
  TunnelingVisualization,
  LengthContractionVisualization,
  HRDiagramVisualization,
  NeutronStarVisualization,
  DoubleSlitVisualization,
  DarkMatterVisualization,
  WhiteHoleVisualization,
  GravitationalWavesVisualization,
  QuantumEntanglementVisualization,
  AtomicModelVisualization,
  RadioactiveDecayVisualization,
  SuperconductivityVisualization,
  StandardModelVisualization,
  SolarSystemVisualization,
  CMBVisualization,
  DarkEnergyVisualization,
} from "@/components/visualizations"

type Theme = "dark" | "light"

// ==================== QUANTUM MECHANICS ====================

// ==================== SPECIAL RELATIVITY ====================

// ==================== STELLAR EVOLUTION ====================

// ==================== DOUBLE-SLIT EXPERIMENT ====================

// ==================== DARK MATTER VISUALIZATION ====================

// ==================== WHITE HOLE ====================

// ==================== PHYSICS TIMELINE ====================
function PhysicsTimeline() {
  const [selectedEra, setSelectedEra] = useState<string | null>(null)

  const events = [
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

  const eras = [
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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const yearToX = (year: number, width: number): number => ((year - -300) / (2025 - -300)) * width

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let bgGradient: CanvasGradient | null = null
    let timelineGradient: CanvasGradient | null = null

    const resize = () => {
      setupCanvas(canvas, ctx)
      bgGradient = null
      timelineGradient = null
    }
    resize()
    window.addEventListener("resize", resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerY = height / 2

    const animate = () => {
      ctx.clearRect(0, 0, width, height)

      if (!bgGradient) {
        bgGradient = ctx.createLinearGradient(0, 0, width, height)
        bgGradient.addColorStop(0, "#0a0a18")
        bgGradient.addColorStop(1, "#151530")
      }
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      if (!timelineGradient) {
        timelineGradient = ctx.createLinearGradient(0, 0, width, 0)
        timelineGradient.addColorStop(0, "#8B5CF6")
        timelineGradient.addColorStop(0.25, "#3B82F6")
        timelineGradient.addColorStop(0.5, "#10B981")
        timelineGradient.addColorStop(0.75, "#EC4899")
        timelineGradient.addColorStop(1, "#F97316")
      }
      ctx.strokeStyle = timelineGradient
      ctx.lineWidth = 3

      const lineY = centerY
      ctx.beginPath()
      ctx.moveTo(0, lineY)
      ctx.lineTo(width, lineY)
      ctx.stroke()

      eras.forEach((era, i) => {
        ctx.fillStyle = era.color + "40"
        ctx.font = "9px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(era.name, 10, 15 + i * 12)
      })

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

      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.font = "8px sans-serif"
      ctx.textAlign = "center"
      for (let year = -300; year <= 2025; year += 200) {
        const x = yearToX(year, width)
        ctx.fillText(year.toString(), x, height - 5)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [filteredEvents])

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        className="w-full h-56 rounded-lg"
        aria-label="История физики: временная шкала открытий"
        role="img"
      />

      <div className="flex gap-2 flex-wrap">
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

      <div className="bg-purple-900/20 rounded-lg p-2 border border-purple-500/20 text-xs">
        <div className="text-purple-300 font-semibold">📅 История физики</div>
        <p className="text-gray-400 mt-1">
          От Архимеда до Хокинга — более 2300 лет открытий. Каждая эпоха приносила революционные
          идеи, менявшие наше понимание Вселенной.
        </p>
      </div>
    </div>
  )
}

// ==================== PHYSICS QUIZ ====================
function PhysicsQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [language, _setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("physics-lang") as Language
      return saved || "ru"
    }
    return "ru"
  })

  const questions = {
    ru: [
      {
        question: "Р§РµРјСѓ СЂР°РІРЅР° СЃРєРѕСЂРѕСЃС‚СЊ СЃРІРµС‚Р° РІ РІР°РєСѓСѓРјРµ?",
        options: ["3Г—10вЃ¶ Рј/СЃ", "3Г—10вЃё Рј/СЃ", "3Г—10В№вЃ° Рј/СЃ", "3Г—10вЃµ Рј/СЃ"],
        correct: 1,
        explanation: "РЎРєРѕСЂРѕСЃС‚СЊ СЃРІРµС‚Р° c в‰€ 299 792 458 Рј/СЃ в‰€ 3Г—10вЃё Рј/СЃ",
      },
      {
        question:
          "РљР°РєР°СЏ С‡Р°СЃС‚РёС†Р° СЏРІР»СЏРµС‚СЃСЏ РїРµСЂРµРЅРѕСЃС‡РёРєРѕРј СЌР»РµРєС‚СЂРѕРјР°РіРЅРёС‚РЅРѕРіРѕ РІР·Р°РёРјРѕРґРµР№СЃС‚РІРёСЏ?",
        options: ["Р“Р»СЋРѕРЅ", "Р¤РѕС‚РѕРЅ", "W-Р±РѕР·РѕРЅ", "Р“СЂР°РІРёС‚РѕРЅ"],
        correct: 1,
        explanation:
          "Р¤РѕС‚РѕРЅ вЂ” РєРІР°РЅС‚ СЌР»РµРєС‚СЂРѕРјР°РіРЅРёС‚РЅРѕРіРѕ РїРѕР»СЏ, РїРµСЂРµРЅРѕСЃС‡РёРє СЌР»РµРєС‚СЂРѕРјР°РіРЅРёС‚РЅРѕРіРѕ РІР·Р°РёРјРѕРґРµР№СЃС‚РІРёСЏ.",
      },
      {
        question: "Р§С‚Рѕ РѕРїРёСЃС‹РІР°РµС‚ СѓСЂР°РІРЅРµРЅРёРµ РЁСЂС‘РґРёРЅРіРµСЂР°?",
        options: [
          "Р”РІРёР¶РµРЅРёРµ РїР»Р°РЅРµС‚",
          "Р­РІРѕР»СЋС†РёСЋ РєРІР°РЅС‚РѕРІРѕРіРѕ СЃРѕСЃС‚РѕСЏРЅРёСЏ",
          "Р Р°СЃРїР°Рґ СЂР°РґРёРѕР°РєС‚РёРІРЅС‹С… СЏРґРµСЂ",
          "РўРµС‡РµРЅРёРµ Р¶РёРґРєРѕСЃС‚Рё",
        ],
        correct: 1,
        explanation:
          "РЈСЂР°РІРЅРµРЅРёРµ РЁСЂС‘РґРёРЅРіРµСЂР° РѕРїРёСЃС‹РІР°РµС‚ РёР·РјРµРЅРµРЅРёРµ РІРѕР»РЅРѕРІРѕР№ С„СѓРЅРєС†РёРё РєРІР°РЅС‚РѕРІРѕР№ СЃРёСЃС‚РµРјС‹ РІРѕ РІСЂРµРјРµРЅРё.",
      },
      {
        question:
          "РљР°РєРѕРІ РїРµСЂРёРѕРґ РїРѕР»СѓСЂР°СЃРїР°РґР° РѕРїСЂРµРґРµР»СЏРµС‚СЃСЏ Р·Р°РєРѕРЅРѕРј?",
        options: [
          "Tв‚Ѓ/в‚‚ = П„В·ln(2)",
          "Tв‚Ѓ/в‚‚ = П„/ln(2)",
          "Tв‚Ѓ/в‚‚ = ln(2)/П„",
          "Tв‚Ѓ/в‚‚ = 1/П„",
        ],
        correct: 0,
        explanation:
          "РџРµСЂРёРѕРґ РїРѕР»СѓСЂР°СЃРїР°РґР° СЃРІСЏР·Р°РЅ СЃРѕ РІСЂРµРјРµРЅРµРј Р¶РёР·РЅРё П„: Tв‚Ѓ/в‚‚ = П„В·ln(2) в‰€ 0.693П„",
      },
      {
        question:
          "Р§С‚Рѕ РїСЂРѕРёСЃС…РѕРґРёС‚ СЃ РјР°СЃСЃРѕР№ РѕР±СЉРµРєС‚Р° РїСЂРё РїСЂРёР±Р»РёР¶РµРЅРёРё Рє СЃРєРѕСЂРѕСЃС‚Рё СЃРІРµС‚Р°?",
        options: [
          "РЈРјРµРЅСЊС€Р°РµС‚СЃСЏ",
          "РќРµ РёР·РјРµРЅСЏРµС‚СЃСЏ",
          "РЈРІРµР»РёС‡РёРІР°РµС‚СЃСЏ",
          "РЎС‚Р°РЅРѕРІРёС‚СЃСЏ РѕС‚СЂРёС†Р°С‚РµР»СЊРЅРѕР№",
        ],
        correct: 2,
        explanation:
          "РЎРѕРіР»Р°СЃРЅРѕ РЎРўРћ, СЂРµР»СЏС‚РёРІРёСЃС‚СЃРєР°СЏ РјР°СЃСЃР° m = Оіmв‚Ђ СѓРІРµР»РёС‡РёРІР°РµС‚СЃСЏ РїСЂРё РїСЂРёР±Р»РёР¶РµРЅРёРё Рє c.",
      },
      {
        question: "РљР°РєРѕР№ РїСЂРёРЅС†РёРї СЃС„РѕСЂРјСѓР»РёСЂРѕРІР°Р» Р“РµР№Р·РµРЅР±РµСЂРі?",
        options: [
          "РџСЂРёРЅС†РёРї РѕС‚РЅРѕСЃРёС‚РµР»СЊРЅРѕСЃС‚Рё",
          "РџСЂРёРЅС†РёРї РЅРµРѕРїСЂРµРґРµР»С‘РЅРЅРѕСЃС‚Рё",
          "РџСЂРёРЅС†РёРї РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕСЃС‚Рё",
          "РџСЂРёРЅС†РёРї СЃСѓРїРµСЂРїРѕР·РёС†РёРё",
        ],
        correct: 1,
        explanation: "РџСЂРёРЅС†РёРї РЅРµРѕРїСЂРµРґРµР»С‘РЅРЅРѕСЃС‚Рё: О”xВ·О”p в‰Ґ в„Џ/2",
      },
      {
        question: "Р§С‚Рѕ С‚Р°РєРѕРµ СЃРёРЅРіСѓР»СЏСЂРЅРѕСЃС‚СЊ С‡С‘СЂРЅРѕР№ РґС‹СЂС‹?",
        options: [
          "РћР±Р»Р°СЃС‚СЊ РЅРёР·РєРѕР№ РїР»РѕС‚РЅРѕСЃС‚Рё",
          "РўРѕС‡РєР° Р±РµСЃРєРѕРЅРµС‡РЅРѕР№ РїР»РѕС‚РЅРѕСЃС‚Рё",
          "Р“РѕСЂРёР·РѕРЅС‚ СЃРѕР±С‹С‚РёР№",
          "РђРєРєСЂРµС†РёРѕРЅРЅС‹Р№ РґРёСЃРє",
        ],
        correct: 1,
        explanation:
          "РЎРёРЅРіСѓР»СЏСЂРЅРѕСЃС‚СЊ вЂ” С‚РѕС‡РєР°, РіРґРµ РїР»РѕС‚РЅРѕСЃС‚СЊ Рё РєСЂРёРІРёР·РЅР° РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІР°-РІСЂРµРјРµРЅРё СЃС‚СЂРµРјСЏС‚СЃСЏ Рє Р±РµСЃРєРѕРЅРµС‡РЅРѕСЃС‚Рё.",
      },
      {
        question:
          "РљР°РєР°СЏ СЃРёР»Р° РґРѕРјРёРЅРёСЂСѓРµС‚ РІРѕ Р’СЃРµР»РµРЅРЅРѕР№ РЅР° Р±РѕР»СЊС€РёС… РјР°СЃС€С‚Р°Р±Р°С…?",
        options: [
          "Р­Р»РµРєС‚СЂРѕРјР°РіРЅРёС‚РЅР°СЏ",
          "РЎРёР»СЊРЅР°СЏ СЏРґРµСЂРЅР°СЏ",
          "РЎР»Р°Р±Р°СЏ СЏРґРµСЂРЅР°СЏ",
          "Р“СЂР°РІРёС‚Р°С†РёРѕРЅРЅР°СЏ",
        ],
        correct: 3,
        explanation:
          "Р“СЂР°РІРёС‚Р°С†РёСЏ вЂ” РµРґРёРЅСЃС‚РІРµРЅРЅР°СЏ СЃРёР»Р°, РґРµР№СЃС‚РІСѓСЋС‰Р°СЏ РЅР° Р±РµСЃРєРѕРЅРµС‡РЅС‹С… СЂР°СЃСЃС‚РѕСЏРЅРёСЏС…, РґРѕРјРёРЅРёСЂСѓРµС‚ РІ РєРѕСЃРјРѕСЃРµ.",
      },
      {
        question:
          "РљР°РєРѕРІ РІРѕР·СЂР°СЃС‚ Р’СЃРµР»РµРЅРЅРѕР№ СЃРѕРіР»Р°СЃРЅРѕ СЃРѕРІСЂРµРјРµРЅРЅС‹Рј РѕС†РµРЅРєР°Рј?",
        options: [
          "4.5 РјР»СЂРґ Р»РµС‚",
          "10 РјР»СЂРґ Р»РµС‚",
          "13.8 РјР»СЂРґ Р»РµС‚",
          "20 РјР»СЂРґ Р»РµС‚",
        ],
        correct: 2,
        explanation:
          "Р’РѕР·СЂР°СЃС‚ Р’СЃРµР»РµРЅРЅРѕР№ ~13.8 РјР»СЂРґ Р»РµС‚, РѕРїСЂРµРґРµР»С‘РЅ РїРѕ РґР°РЅРЅС‹Рј СЃРїСѓС‚РЅРёРєР° Planck.",
      },
      {
        question: "Р§С‚Рѕ С‚Р°РєРѕРµ Р±РѕР·РѕРЅ РҐРёРіРіСЃР°?",
        options: [
          "РџРµСЂРµРЅРѕСЃС‡РёРє РіСЂР°РІРёС‚Р°С†РёРё",
          "Р§Р°СЃС‚РёС†Р°, РґР°СЋС‰Р°СЏ РјР°СЃСЃСѓ",
          "Р Р°Р·РЅРѕРІРёРґРЅРѕСЃС‚СЊ РєРІР°СЂРєР°",
          "РўРёРї РёР·Р»СѓС‡РµРЅРёСЏ",
        ],
        correct: 1,
        explanation:
          "Р‘РѕР·РѕРЅ РҐРёРіРіСЃР° вЂ” РєРІР°РЅС‚ РїРѕР»СЏ РҐРёРіРіСЃР°, РІР·Р°РёРјРѕРґРµР№СЃС‚РІРёРµ СЃ РєРѕС‚РѕСЂС‹Рј РїСЂРёРґР°С‘С‚ С‡Р°СЃС‚РёС†Р°Рј РјР°СЃСЃСѓ.",
      },
    ],
    en: [
      {
        question: "What is the speed of light in vacuum?",
        options: ["3Г—10вЃ¶ m/s", "3Г—10вЃё m/s", "3Г—10В№вЃ° m/s", "3Г—10вЃµ m/s"],
        correct: 1,
        explanation: "Speed of light c в‰€ 299,792,458 m/s в‰€ 3Г—10вЃё m/s",
      },
      {
        question: "Which particle carries the electromagnetic interaction?",
        options: ["Gluon", "Photon", "W-boson", "Graviton"],
        correct: 1,
        explanation:
          "Photon is the quantum of the electromagnetic field, carrier of electromagnetic interaction.",
      },
      {
        question: "What does the SchrГ¶dinger equation describe?",
        options: ["Planetary motion", "Quantum state evolution", "Radioactive decay", "Fluid flow"],
        correct: 1,
        explanation:
          "The SchrГ¶dinger equation describes how the wave function of a quantum system changes over time.",
      },
      {
        question: "What happens to mass as an object approaches the speed of light?",
        options: ["Decreases", "Remains unchanged", "Increases", "Becomes negative"],
        correct: 2,
        explanation:
          "According to special relativity, relativistic mass m = Оіmв‚Ђ increases as v approaches c.",
      },
      {
        question: "What principle did Heisenberg formulate?",
        options: [
          "Principle of relativity",
          "Uncertainty principle",
          "Complementarity principle",
          "Superposition principle",
        ],
        correct: 1,
        explanation: "Uncertainty principle: О”xВ·О”p в‰Ґ в„Џ/2",
      },
    ],
    zh: [
      {
        question: "зњџз©єдё­зљ„е…‰йЂџжЇе¤ље°‘пјџ",
        options: ["3Г—10вЃ¶ з±і/з§’", "3Г—10вЃё з±і/з§’", "3Г—10В№вЃ° з±і/з§’", "3Г—10вЃµ з±і/з§’"],
        correct: 1,
        explanation: "е…‰йЂџ c в‰€ 299,792,458 з±і/з§’ в‰€ 3Г—10вЃё з±і/з§’",
      },
      {
        question: "е“Єз§ЌзІ’е­ђдј йЂ’з”µзЈЃз›ёдє’дЅњз”Ёпјџ",
        options: ["иѓ¶е­ђ", "е…‰е­ђ", "WзЋ»и‰Іе­ђ", "еј•еЉ›е­ђ"],
        correct: 1,
        explanation: "е…‰е­ђжЇз”µзЈЃењєзљ„й‡Џе­ђпјЊжЇз”µзЈЃз›ёдє’дЅњз”Ёзљ„дј йЂ’иЂ…гЂ‚",
      },
      {
        question: "и–›е®љи°”ж–№зЁ‹жЏЏиї°д»Ђд№€пјџ",
        options: ["иЎЊжџиїђеЉЁ", "й‡Џе­ђжЂЃжј”еЊ–", "ж”ѕе°„жЂ§иЎ°еЏ", "жµЃдЅ“жµЃеЉЁ"],
        correct: 1,
        explanation: "и–›е®љи°”ж–№зЁ‹жЏЏиї°й‡Џе­ђзі»з»џзљ„жіўе‡Ѕж•°е¦‚дЅ•йљЏж—¶й—ґеЏеЊ–гЂ‚",
      },
      {
        question: "еЅ“з‰©дЅ“жЋҐиї‘е…‰йЂџж—¶пјЊиґЁй‡ЏдјљеЏ‘з”џд»Ђд№€еЏеЊ–пјџ",
        options: ["е‡Џе°Џ", "дїќжЊЃдёЌеЏ", "еўћеЉ ", "еЏдёєиґџж•°"],
        correct: 2,
        explanation:
          "ж №жЌ®з‹­д№‰з›ёеЇ№и®єпјЊз›ёеЇ№и®єиґЁй‡Џ m = Оіmв‚Ђ йљЏзќЂйЂџеє¦жЋҐиї‘е…‰йЂџиЂЊеўћеЉ гЂ‚",
      },
      {
        question: "жµ·жЈ®е ЎжЏђе‡єдє†д»Ђд№€еЋџзђ†пјџ",
        options: ["з›ёеЇ№жЂ§еЋџзђ†", "дёЌзЎ®е®љжЂ§еЋџзђ†", "дє’иЎҐеЋџзђ†", "еЏ еЉ еЋџзђ†"],
        correct: 1,
        explanation: "дёЌзЎ®е®љжЂ§еЋџзђ†пјљО”xВ·О”p в‰Ґ в„Џ/2",
      },
    ],
    he: [
      {
        question: "ЧћЧ”Ч™ ЧћЧ”Ч™ЧЁЧ•ЧЄ Ч”ЧђЧ•ЧЁ Ч‘ЧЁЧ™Ч§?",
        options: ["3Г—10вЃ¶ Чћ/Ч©", "3Г—10вЃё Чћ/Ч©", "3Г—10В№вЃ° Чћ/Ч©", "3Г—10вЃµ Чћ/Ч©"],
        correct: 1,
        explanation: "ЧћЧ”Ч™ЧЁЧ•ЧЄ Ч”ЧђЧ•ЧЁ c в‰€ 299,792,458 Чћ/Ч© в‰€ 3Г—10вЃё Чћ/Ч©",
      },
      {
        question:
          "ЧђЧ™Ч–Ч• Ч—ЧњЧ§Ч™Ч§ Ч Ч•Ч©Чђ ЧђЧЄ Ч”ЧђЧ™Ч ЧЧЁЧђЧ§Ч¦Ч™Ч” Ч”ЧђЧњЧ§ЧЧЁЧ•ЧћЧ’Ч ЧЧ™ЧЄ?",
        options: ["Ч’ЧњЧ•ЧђЧ•Чџ", "Ч¤Ч•ЧЧ•Чџ", "Ч‘Ч•Ч–Ч•Чџ W", "Ч’ЧЁЧ‘Ч™ЧЧ•Чџ"],
        correct: 1,
        explanation: "Ч¤Ч•ЧЧ•Чџ Ч”Ч•Чђ Ч§Ч•Ч•Ч ЧЧ•Чќ Ч©Чњ Ч”Ч©Ч“Ч” Ч”ЧђЧњЧ§ЧЧЁЧ•ЧћЧ’Ч ЧЧ™.",
      },
    ],
  }

  const currentQuestions = questions[language] || questions.ru
  const q = currentQuestions[currentQuestion]

  const handleAnswer = (index: number) => {
    if (answered) return
    setSelectedAnswer(index)
    setAnswered(true)
    if (index === q.correct) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setAnswered(false)
  }

  const resultText = {
    ru: {
      score: "Р’Р°С€ СЂРµР·СѓР»СЊС‚Р°С‚",
      of: "РёР·",
      restart: "РќР°С‡Р°С‚СЊ Р·Р°РЅРѕРІРѕ",
      next: "Р”Р°Р»РµРµ",
      correct: "РџСЂР°РІРёР»СЊРЅРѕ!",
      incorrect: "РќРµРїСЂР°РІРёР»СЊРЅРѕ",
    },
    en: {
      score: "Your score",
      of: "of",
      restart: "Restart",
      next: "Next",
      correct: "Correct!",
      incorrect: "Incorrect",
    },
    zh: {
      score: "ж‚Ёзљ„еѕ—е€†",
      of: "е…±",
      restart: "й‡Ќж–°ејЂе§‹",
      next: "дё‹дёЂйў",
      correct: "ж­ЈзЎ®пјЃ",
      incorrect: "й”™иЇЇ",
    },
    he: {
      score: "Ч”Ч¦Ч™Ч•Чџ Ч©ЧњЧљ",
      of: "ЧћЧЄЧ•Чљ",
      restart: "Ч”ЧЄЧ—Чњ ЧћЧ—Ч“Ч©",
      next: "Ч”Ч‘Чђ",
      correct: "Ч Ч›Ч•Чџ!",
      incorrect: "ЧњЧђ Ч Ч›Ч•Чџ",
    },
  }

  const text = resultText[language] || resultText.ru

  if (showResult) {
    const percentage = Math.round((score / currentQuestions.length) * 100)
    return (
      <div className="space-y-4 text-center">
        <div className="text-4xl font-bold text-purple-400">{text.score}</div>
        <div className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400">
          {score} {text.of} {currentQuestions.length}
        </div>
        <div className="text-2xl">
          {percentage >= 80
            ? "рџЏ†"
            : percentage >= 60
              ? "рџЊџ"
              : percentage >= 40
                ? "рџ“љ"
                : "рџ’Є"}
        </div>
        <div className={`text-sm ${percentage >= 60 ? "text-green-400" : "text-yellow-400"}`}>
          {percentage >= 80
            ? language === "ru"
              ? "РћС‚Р»РёС‡РЅРѕ!"
              : language === "en"
                ? "Excellent!"
                : language === "zh"
                  ? "е¤ЄжЈ’дє†пјЃ"
                  : "ЧћЧўЧ•ЧњЧ”!"
            : percentage >= 60
              ? language === "ru"
                ? "РҐРѕСЂРѕС€Рѕ!"
                : language === "en"
                  ? "Good!"
                  : language === "zh"
                    ? "дёЌй”™пјЃ"
                    : "ЧЧ•Ч‘!"
              : language === "ru"
                ? "РџРѕРїСЂРѕР±СѓР№С‚Рµ РµС‰С‘!"
                : language === "en"
                  ? "Try again!"
                  : language === "zh"
                    ? "е†ЌиЇ•дёЂж¬ЎпјЃ"
                    : "Ч ЧЎЧ” Ч©Ч•Ч‘!"}
        </div>
        <Button onClick={restartQuiz} className="bg-gradient-to-r from-purple-600 to-cyan-600">
          {text.restart}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-xs">
        <span className="text-purple-400">
          {language === "ru"
            ? "Р’РѕРїСЂРѕСЃ"
            : language === "en"
              ? "Question"
              : language === "zh"
                ? "й—®йў"
                : "Ч©ЧђЧњЧ”"}{" "}
          {currentQuestion + 1}/{currentQuestions.length}
        </span>
        <span className="text-green-400">
          {language === "ru"
            ? "РЎС‡С‘С‚"
            : language === "en"
              ? "Score"
              : language === "zh"
                ? "еѕ—е€†"
                : "Ч¦Ч™Ч•Чџ"}
          : {score}
        </span>
      </div>

      <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg p-4 border border-purple-500/30">
        <div className="text-white font-medium mb-4">{q.question}</div>

        <div className="space-y-2">
          {q.options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                handleAnswer(index)
              }}
              disabled={answered}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all text-sm ${
                answered
                  ? index === q.correct
                    ? "bg-green-600/50 border-2 border-green-400"
                    : index === selectedAnswer
                      ? "bg-red-600/50 border-2 border-red-400"
                      : "bg-gray-800/50 opacity-50"
                  : "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 hover:border-purple-500"
              }`}
            >
              <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {answered && (
        <div className="space-y-3">
          <div
            className={`p-3 rounded-lg text-sm ${selectedAnswer === q.correct ? "bg-green-900/30 border border-green-500/30" : "bg-red-900/30 border border-red-500/30"}`}
          >
            <div
              className={
                selectedAnswer === q.correct
                  ? "text-green-400 font-semibold"
                  : "text-red-400 font-semibold"
              }
            >
              {selectedAnswer === q.correct ? text.correct : text.incorrect}
            </div>
            <div className="text-gray-400 mt-1">{q.explanation}</div>
          </div>

          <Button
            onClick={nextQuestion}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
          >
            {text.next} в†’
          </Button>
        </div>
      )}
    </div>
  )
}

// ==================== SCIENTISTS BIOGRAPHIES ====================
function ScientistsBiographies() {
  const [selectedScientist, setSelectedScientist] = useState<number | null>(null)
  const [language, _setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("physics-lang") as Language
      if (saved && ["ru", "en", "zh", "he"].includes(saved)) {
        return saved
      }
    }
    return "ru"
  })

  const scientists = {
    ru: [
      {
        name: "РђР»СЊР±РµСЂС‚ Р­Р№РЅС€С‚РµР№РЅ",
        years: "1879-1955",
        field: "РўРµРѕСЂРµС‚РёС‡РµСЃРєР°СЏ С„РёР·РёРєР°",
        achievement: "РўРµРѕСЂРёСЏ РѕС‚РЅРѕСЃРёС‚РµР»СЊРЅРѕСЃС‚Рё, E=mcВІ",
        nobel: "1921 вЂ” Р¤РѕС‚РѕСЌС„С„РµРєС‚",
        quote:
          '"Р’РѕРѕР±СЂР°Р¶РµРЅРёРµ РІР°Р¶РЅРµРµ Р·РЅР°РЅРёСЏ. Р—РЅР°РЅРёРµ РѕРіСЂР°РЅРёС‡РµРЅРѕ, РІРѕРѕР±СЂР°Р¶РµРЅРёРµ РѕС…РІР°С‚С‹РІР°РµС‚ РІРµСЃСЊ РјРёСЂ."',
        bio: "Р Р°Р·СЂР°Р±РѕС‚Р°Р» СЃРїРµС†РёР°Р»СЊРЅСѓСЋ Рё РѕР±С‰СѓСЋ С‚РµРѕСЂРёСЋ РѕС‚РЅРѕСЃРёС‚РµР»СЊРЅРѕСЃС‚Рё, РѕР±СЉСЏСЃРЅРёР» Р±СЂРѕСѓРЅРѕРІСЃРєРѕРµ РґРІРёР¶РµРЅРёРµ Рё С„РѕС‚РѕСЌС„С„РµРєС‚. Р•РіРѕ СѓСЂР°РІРЅРµРЅРёРµ E=mcВІ СЃС‚Р°Р»Рѕ СЃРёРјРІРѕР»РѕРј РІР·Р°РёРјРѕСЃРІСЏР·Рё РјР°СЃСЃС‹ Рё СЌРЅРµСЂРіРёРё.",
        color: "#FFD700",
      },
      {
        name: "РќРёР»СЊСЃ Р‘РѕСЂ",
        years: "1885-1962",
        field: "РљРІР°РЅС‚РѕРІР°СЏ С„РёР·РёРєР°",
        achievement: "РњРѕРґРµР»СЊ Р°С‚РѕРјР°, РїСЂРёРЅС†РёРї РґРѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕСЃС‚Рё",
        nobel: "1922 вЂ” РЎС‚СЂРѕРµРЅРёРµ Р°С‚РѕРјР°",
        quote:
          '"РџСЂРѕС‚РёРІРѕРїРѕР»РѕР¶РЅРѕСЃС‚Рё РЅРµ РїСЂРѕС‚РёРІРѕСЂРµС‡РёРІС‹, Р° РІР·Р°РёРјРѕРґРѕРїРѕР»РЅСЏРµРјС‹."',
        bio: "РЎРѕР·РґР°Р» РєРІР°РЅС‚РѕРІСѓСЋ РјРѕРґРµР»СЊ Р°С‚РѕРјР°, РѕР±СЉСЏСЃРЅРёР» СЃС‚СЂСѓРєС‚СѓСЂСѓ СЌР»РµРєС‚СЂРѕРЅРЅС‹С… РѕР±РѕР»РѕС‡РµРє. РћСЃРЅРѕРІР°С‚РµР»СЊ РљРѕРїРµРЅРіР°РіРµРЅСЃРєРѕР№ РёРЅС‚РµСЂРїСЂРµС‚Р°С†РёРё РєРІР°РЅС‚РѕРІРѕР№ РјРµС…Р°РЅРёРєРё.",
        color: "#4169E1",
      },
      {
        name: "Р РёС‡Р°СЂРґ Р¤РµР№РЅРјР°РЅ",
        years: "1918-1988",
        field: "РљРІР°РЅС‚РѕРІР°СЏ СЌР»РµРєС‚СЂРѕРґРёРЅР°РјРёРєР°",
        achievement: "Р”РёР°РіСЂР°РјРјС‹ Р¤РµР№РЅРјР°РЅР°, РїСѓС‚СЊ РёРЅС‚РµРіСЂР°Р»РѕРІ",
        nobel: "1965 вЂ” РљРІР°РЅС‚РѕРІР°СЏ СЌР»РµРєС‚СЂРѕРґРёРЅР°РјРёРєР°",
        quote:
          '"Р•СЃР»Рё РІС‹ РґСѓРјР°РµС‚Рµ, С‡С‚Рѕ РїРѕРЅРёРјР°РµС‚Рµ РєРІР°РЅС‚РѕРІСѓСЋ РјРµС…Р°РЅРёРєСѓ, С‚Рѕ РІС‹ РЅРµ РїРѕРЅРёРјР°РµС‚Рµ РєРІР°РЅС‚РѕРІСѓСЋ РјРµС…Р°РЅРёРєСѓ."',
        bio: 'Р Р°Р·СЂР°Р±РѕС‚Р°Р» С„РѕСЂРјСѓР»РёСЂРѕРІРєСѓ РєРІР°РЅС‚РѕРІРѕР№ РјРµС…Р°РЅРёРєРё С‡РµСЂРµР· РёРЅС‚РµРіСЂР°Р»С‹ РїРѕ РїСѓС‚СЏРј. РР·РІРµСЃС‚РµРЅ СЃРІРѕРёРјРё Р»РµРєС†РёСЏРјРё РїРѕ С„РёР·РёРєРµ Рё СѓС‡Р°СЃС‚РёРµРј РІ СЂР°СЃСЃР»РµРґРѕРІР°РЅРёРё РєР°С‚Р°СЃС‚СЂРѕС„С‹ "Р§РµР»Р»РµРЅРґР¶РµСЂР°".',
        color: "#32CD32",
      },
      {
        name: "РњР°РєСЃ РџР»Р°РЅРє",
        years: "1858-1947",
        field: "РљРІР°РЅС‚РѕРІР°СЏ С„РёР·РёРєР°",
        achievement: "РљРІР°РЅС‚РѕРІР°СЏ РіРёРїРѕС‚РµР·Р°, РїРѕСЃС‚РѕСЏРЅРЅР°СЏ РџР»Р°РЅРєР°",
        nobel: "1918 вЂ” РћС‚РєСЂС‹С‚РёРµ РєРІР°РЅС‚РѕРІ",
        quote:
          '"РќР°СѓРєР° РЅРµ РјРѕР¶РµС‚ СЂРµС€РёС‚СЊ С‚Р°Р№РЅСѓ РїРѕСЃР»РµРґРЅРµР№ РїСЂРёСЂРѕРґС‹. Р С‚Рѕ, С‡С‚Рѕ РѕРЅР° РЅРµ РјРѕР¶РµС‚ СЃРґРµР»Р°С‚СЊ СЌС‚Рѕ, РЅРµ РѕР·РЅР°С‡Р°РµС‚, С‡С‚Рѕ РЅР°СѓРєР° РЅРµ РґРѕР±РёР»Р°СЃСЊ СѓСЃРїРµС…Р°."',
        bio: "РћС‚РµС† РєРІР°РЅС‚РѕРІРѕР№ С„РёР·РёРєРё. Р’РІС‘Р» РїРѕРЅСЏС‚РёРµ РєРІР°РЅС‚Р° СЌРЅРµСЂРіРёРё РґР»СЏ РѕР±СЉСЏСЃРЅРµРЅРёСЏ СЃРїРµРєС‚СЂР° РёР·Р»СѓС‡РµРЅРёСЏ С‡С‘СЂРЅРѕРіРѕ С‚РµР»Р°. Р•РіРѕ РїРѕСЃС‚РѕСЏРЅРЅР°СЏ h вЂ” С„СѓРЅРґР°РјРµРЅС‚Р°Р»СЊРЅР°СЏ РєРѕРЅСЃС‚Р°РЅС‚Р° РїСЂРёСЂРѕРґС‹.",
        color: "#9370DB",
      },
      {
        name: "Р­СЂРІРёРЅ РЁСЂС‘РґРёРЅРіРµСЂ",
        years: "1887-1961",
        field: "РљРІР°РЅС‚РѕРІР°СЏ С„РёР·РёРєР°",
        achievement: "РЈСЂР°РІРЅРµРЅРёРµ РЁСЂС‘РґРёРЅРіРµСЂР°, РєРѕС‚ РЁСЂС‘РґРёРЅРіРµСЂР°",
        nobel: "1933 вЂ” Р’РѕР»РЅРѕРІР°СЏ РјРµС…Р°РЅРёРєР°",
        quote:
          '"РЇ РЅРµ Р»СЋР±Р»СЋ РµС‘, Рё РјРЅРµ Р¶Р°Р»СЊ, С‡С‚Рѕ СЏ РєРѕРіРґР°-Р»РёР±Рѕ РёРјРµР» Рє РЅРµР№ РѕС‚РЅРѕС€РµРЅРёРµ." (Рѕ РєРІР°РЅС‚РѕРІРѕР№ РјРµС…Р°РЅРёРєРµ)',
        bio: "РЎРѕР·РґР°Р» РІРѕР»РЅРѕРІСѓСЋ РјРµС…Р°РЅРёРєСѓ вЂ” РјР°С‚РµРјР°С‚РёС‡РµСЃРєРёР№ Р°РїРїР°СЂР°С‚ РєРІР°РЅС‚РѕРІРѕР№ С‚РµРѕСЂРёРё. Р—РЅР°РјРµРЅРёС‚ РјС‹СЃР»РµРЅРЅС‹Рј СЌРєСЃРїРµСЂРёРјРµРЅС‚РѕРј СЃ РєРѕС‚РѕРј, РёР»Р»СЋСЃС‚СЂРёСЂСѓСЋС‰РёРј РїР°СЂР°РґРѕРєСЃС‹ СЃСѓРїРµСЂРїРѕР·РёС†РёРё.",
        color: "#DC143C",
      },
      {
        name: "Р’РµСЂРЅРµСЂ Р“РµР№Р·РµРЅР±РµСЂРі",
        years: "1901-1976",
        field: "РљРІР°РЅС‚РѕРІР°СЏ РјРµС…Р°РЅРёРєР°",
        achievement:
          "РџСЂРёРЅС†РёРї РЅРµРѕРїСЂРµРґРµР»С‘РЅРЅРѕСЃС‚Рё, РјР°С‚СЂРёС‡РЅР°СЏ РјРµС…Р°РЅРёРєР°",
        nobel: "1932 вЂ” РљРІР°РЅС‚РѕРІР°СЏ РјРµС…Р°РЅРёРєР°",
        quote:
          '"РџРµСЂРІС‹Р№ РіР»РѕС‚РѕРє РёР· РєСѓР±РєР° РµСЃС‚РµСЃС‚РІРµРЅРЅС‹С… РЅР°СѓРє РґРµР»Р°РµС‚ Р°С‚РµРёСЃС‚РѕРј, РЅРѕ РЅР° РґРЅРµ РєСѓР±РєР° РІР°СЃ Р¶РґС‘С‚ Р‘РѕРі."',
        bio: "РЎС„РѕСЂРјСѓР»РёСЂРѕРІР°Р» РїСЂРёРЅС†РёРї РЅРµРѕРїСЂРµРґРµР»С‘РЅРЅРѕСЃС‚Рё вЂ” С„СѓРЅРґР°РјРµРЅС‚Р°Р»СЊРЅРѕРµ РѕРіСЂР°РЅРёС‡РµРЅРёРµ С‚РѕС‡РЅРѕСЃС‚Рё РёР·РјРµСЂРµРЅРёР№. РЎРѕР·РґР°Р» РјР°С‚СЂРёС‡РЅСѓСЋ С„РѕСЂРјСѓР»РёСЂРѕРІРєСѓ РєРІР°РЅС‚РѕРІРѕР№ РјРµС…Р°РЅРёРєРё.",
        color: "#FF6347",
      },
      {
        name: "РЎС‚РёРІРµРЅ РҐРѕРєРёРЅРі",
        years: "1942-2018",
        field: "РљРѕСЃРјРѕР»РѕРіРёСЏ",
        achievement: "РР·Р»СѓС‡РµРЅРёРµ РҐРѕРєРёРЅРіР°, СЃРёРЅРіСѓР»СЏСЂРЅРѕСЃС‚Рё",
        nobel: "вЂ” (РјРЅРѕРіРёРµ СЃС‡РёС‚Р°СЋС‚ СЌС‚Рѕ СѓРїСѓС‰РµРЅРёРµРј)",
        quote:
          '"РЎРјРѕС‚СЂРё РЅР° Р·РІС‘Р·РґС‹, Р° РЅРµ РїРѕРґ РЅРѕРіРё. РџС‹С‚Р°Р№СЃСЏ РїРѕРЅСЏС‚СЊ С‚Рѕ, С‡С‚Рѕ РІРёРґРёС€СЊ."',
        bio: 'Р”РѕРєР°Р·Р°Р» СЃСѓС‰РµСЃС‚РІРѕРІР°РЅРёРµ РёР·Р»СѓС‡РµРЅРёСЏ С‡С‘СЂРЅС‹С… РґС‹СЂ. РќР°РїРёСЃР°Р» "РљСЂР°С‚РєСѓСЋ РёСЃС‚РѕСЂРёСЋ РІСЂРµРјРµРЅРё", СЃРґРµР»Р°РІ РєРѕСЃРјРѕР»РѕРіРёСЋ РґРѕСЃС‚СѓРїРЅРѕР№ С€РёСЂРѕРєРѕР№ РїСѓР±Р»РёРєРµ. Р‘РѕР»РµР·РЅСЊ ALS РЅРµ РїРѕРјРµС€Р°Р»Р° РµРіРѕ РЅР°СѓС‡РЅРѕР№ СЂР°Р±РѕС‚Рµ.',
        color: "#00CED1",
      },
      {
        name: "РњР°СЂРёСЏ РљСЋСЂРё",
        years: "1867-1934",
        field: "Р Р°РґРёРѕР°РєС‚РёРІРЅРѕСЃС‚СЊ",
        achievement: "РћС‚РєСЂС‹С‚РёРµ РїРѕР»РѕРЅРёСЏ Рё СЂР°РґРёСЏ",
        nobel: "1903 (С„РёР·РёРєР°) Рё 1911 (С…РёРјРёСЏ)",
        quote:
          '"РќРёС‡РµРіРѕ РІ Р¶РёР·РЅРё РЅРµ РЅР°РґРѕ Р±РѕСЏС‚СЊСЃСЏ, РЅР°РґРѕ С‚РѕР»СЊРєРѕ РїРѕРЅРёРјР°С‚СЊ."',
        bio: "РџРµСЂРІР°СЏ Р¶РµРЅС‰РёРЅР° вЂ” Р»Р°СѓСЂРµР°С‚ РќРѕР±РµР»РµРІСЃРєРѕР№ РїСЂРµРјРёРё, РµРґРёРЅСЃС‚РІРµРЅРЅС‹Р№ СѓС‡С‘РЅС‹Р№, РїРѕР»СѓС‡РёРІС€РёР№ РќРѕР±РµР»РµРІСЃРєСѓСЋ РїСЂРµРјРёСЋ РІ РґРІСѓС… СЂР°Р·РЅС‹С… РЅР°СѓРєР°С…. РџРёРѕРЅРµСЂ РёСЃСЃР»РµРґРѕРІР°РЅРёР№ СЂР°РґРёРѕР°РєС‚РёРІРЅРѕСЃС‚Рё.",
        color: "#FF69B4",
      },
    ],
    en: [
      {
        name: "Albert Einstein",
        years: "1879-1955",
        field: "Theoretical Physics",
        achievement: "Theory of Relativity, E=mcВІ",
        nobel: "1921 вЂ” Photoelectric effect",
        quote:
          '"Imagination is more important than knowledge. Knowledge is limited. Imagination encircles the world."',
        bio: "Developed special and general relativity, explained Brownian motion and the photoelectric effect. His equation E=mcВІ became a symbol of mass-energy equivalence.",
        color: "#FFD700",
      },
      {
        name: "Niels Bohr",
        years: "1885-1962",
        field: "Quantum Physics",
        achievement: "Atomic model, complementarity principle",
        nobel: "1922 вЂ” Atomic structure",
        quote: '"Opposites are not contradictory, they are complementary."',
        bio: "Created the quantum model of the atom, explained the structure of electron shells. Founder of the Copenhagen interpretation of quantum mechanics.",
        color: "#4169E1",
      },
      {
        name: "Richard Feynman",
        years: "1918-1988",
        field: "Quantum Electrodynamics",
        achievement: "Feynman diagrams, path integrals",
        nobel: "1965 вЂ” Quantum electrodynamics",
        quote:
          '"If you think you understand quantum mechanics, you don\'t understand quantum mechanics."',
        bio: "Developed the path integral formulation of quantum mechanics. Known for his physics lectures and participation in the Challenger disaster investigation.",
        color: "#32CD32",
      },
      {
        name: "Stephen Hawking",
        years: "1942-2018",
        field: "Cosmology",
        achievement: "Hawking radiation, singularities",
        nobel: "вЂ” (many consider this an oversight)",
        quote: '"Look up at the stars, not down at your feet. Try to make sense of what you see."',
        bio: 'Proved the existence of black hole radiation. Wrote "A Brief History of Time," making cosmology accessible to the public. ALS disease did not stop his scientific work.',
        color: "#00CED1",
      },
      {
        name: "Marie Curie",
        years: "1867-1934",
        field: "Radioactivity",
        achievement: "Discovery of polonium and radium",
        nobel: "1903 (physics) and 1911 (chemistry)",
        quote: '"Nothing in life is to be feared, it is only to be understood."',
        bio: "First woman to win a Nobel Prize, only scientist to win Nobel Prizes in two different sciences. Pioneer of radioactivity research.",
        color: "#FF69B4",
      },
    ],
    zh: [
      {
        name: "йїе°”дјЇз‰№В·з€±е› ж–Їеќ¦",
        years: "1879-1955",
        field: "зђ†и®єз‰©зђ†",
        achievement: "з›ёеЇ№и®єпјЊE=mcВІ",
        nobel: "1921 вЂ” е…‰з”µж•€еє”",
        quote: '"жѓіи±ЎеЉ›жЇ”зџҐиЇ†ж›ґй‡Ќи¦ЃгЂ‚зџҐиЇ†жЇжњ‰й™ђзљ„пјЊжѓіи±ЎеЉ›зЋЇз»•ж•ґдёЄдё–з•ЊгЂ‚"',
        bio: "еЏ‘е±•дє†з‹­д№‰е’Ње№їд№‰з›ёеЇ№и®єпјЊи§Јй‡Љдє†еёѓжњ—иїђеЉЁе’Ње…‰з”µж•€еє”гЂ‚д»–зљ„ж–№зЁ‹E=mcВІж€ђдёєиґЁиѓЅз­‰д»·зљ„и±ЎеѕЃгЂ‚",
        color: "#FFD700",
      },
      {
        name: "е°је°”ж–ЇВ·зЋ»е°”",
        years: "1885-1962",
        field: "й‡Џе­ђз‰©зђ†",
        achievement: "еЋџе­ђжЁЎећ‹пјЊдє’иЎҐеЋџзђ†",
        nobel: "1922 вЂ” еЋџе­ђз»“жћ„",
        quote: '"еЇ№з«‹йќўе№¶дёЌзџ›з›ѕпјЊиЂЊжЇдє’иЎҐзљ„гЂ‚"',
        bio: "е€›е»єдє†еЋџе­ђзљ„й‡Џе­ђжЁЎећ‹пјЊи§Јй‡Љдє†з”µе­ђеЈіе±‚з»“жћ„гЂ‚е“Ґжњ¬е“€ж №й‡Џе­ђеЉ›е­¦и§Јй‡Љзљ„е€›е§‹дєєгЂ‚",
        color: "#4169E1",
      },
      {
        name: "ж–Їи’‚иЉ¬В·йњЌй‡‘",
        years: "1942-2018",
        field: "е®‡е®™е­¦",
        achievement: "йњЌй‡‘иѕђе°„пјЊеҐ‡з‚№",
        nobel: "вЂ”",
        quote: '"д»°жњ›жџз©єпјЊдёЌи¦ЃдЅЋе¤ґзњ‹и„љдё‹гЂ‚иЇ•зќЂзђ†и§ЈдЅ ж‰Ђзњ‹е€°зљ„гЂ‚"',
        bio: "иЇЃжЋдє†й»‘жґћиѕђе°„зљ„е­ењЁгЂ‚и‘—жњ‰гЂЉж—¶й—ґз®ЂеЏІгЂ‹пјЊдЅїе®‡е®™е­¦дёєе…¬дј—ж‰Ђзђ†и§ЈгЂ‚жёђе†»з—‡жІЎжњ‰й»ж­ўд»–зљ„з§‘е­¦з ”з©¶гЂ‚",
        color: "#00CED1",
      },
    ],
    he: [
      {
        name: "ЧђЧњЧ‘ЧЁЧ ЧђЧ™Ч™Ч Ч©ЧЧ™Ч™Чџ",
        years: "1879-1955",
        field: "Ч¤Ч™Ч–Ч™Ч§Ч” ЧЄЧ™ЧђЧ•ЧЁЧЧ™ЧЄ",
        achievement: "ЧЄЧ•ЧЁЧЄ Ч”Ч™Ч—ЧЎЧ•ЧЄ, E=mcВІ",
        nobel: "1921 вЂ” ЧђЧ¤Ч§Ч Ч¤Ч•ЧЧ•ЧђЧњЧ§ЧЧЁЧ™",
        quote:
          '"Ч“ЧћЧ™Ч•Чџ Ч—Ч©Ч•Ч‘ Ч™Ч•ЧЄЧЁ ЧћЧ™Ч“Чў. Ч™Ч“Чў ЧћЧ•Ч’Ч‘Чњ, Ч“ЧћЧ™Ч•Чџ ЧћЧ§Ч™ЧЈ ЧђЧЄ Ч”ЧўЧ•ЧњЧќ."',
        bio: "Ч¤Ч™ЧЄЧ— ЧђЧЄ ЧЄЧ•ЧЁЧЄ Ч”Ч™Ч—ЧЎЧ•ЧЄ Ч”Ч¤ЧЁЧЧ™ЧЄ Ч•Ч”Ч›ЧњЧњЧ™ЧЄ, Ч”ЧЎЧ‘Ч™ЧЁ ЧЄЧ Ч•ЧўЧ” Ч‘ЧЁЧђЧ•Ч Ч™ЧЄ Ч•Ч”ЧђЧ¤Ч§Ч Ч”Ч¤Ч•ЧЧ•ЧђЧњЧ§ЧЧЁЧ™.",
        color: "#FFD700",
      },
      {
        name: "ЧЎЧЧ™Ч‘Чџ Ч”Ч•Ч§Ч™Ч Ч’",
        years: "1942-2018",
        field: "Ч§Ч•ЧЎЧћЧ•ЧњЧ•Ч’Ч™Ч”",
        achievement: "Ч§ЧЁЧ™Ч ЧЄ Ч”Ч•Ч§Ч™Ч Ч’, ЧЎЧ™Ч Ч’Ч•ЧњЧЁЧ™Ч•ЧЄ",
        nobel: "вЂ”",
        quote:
          '"Ч”Ч‘Ч ЧњЧ›Ч•Ч›Ч‘Ч™Чќ, ЧњЧђ ЧњЧЁЧ’ЧњЧ™Ч™Чќ. Ч ЧЎЧ” ЧњЧ”Ч‘Ч™Чџ ЧђЧЄ ЧћЧ” Ч©ЧђЧЄЧ” ЧЁЧ•ЧђЧ”."',
        bio: 'Ч”Ч•Ч›Ч™Ч— ЧђЧЄ Ч§Ч™Ч•ЧћЧ” Ч©Чњ Ч§ЧЁЧ™Ч ЧЄ Ч—Ч•ЧЁЧ™Чќ Ч©Ч—Ч•ЧЁЧ™Чќ. Ч›ЧЄЧ‘ "Ч§Ч™Ч¦Ч•ЧЁ ЧЄЧ•ЧњЧ“Ч•ЧЄ Ч”Ч–ЧћЧџ".',
        color: "#00CED1",
      },
    ],
  }

  const currentScientists = scientists[language] || scientists.ru

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {currentScientists.map((scientist, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedScientist(selectedScientist === index ? null : index)
            }}
            className={`p-3 rounded-lg text-center transition-all ${
              selectedScientist === index
                ? "bg-gradient-to-br from-purple-600/50 to-cyan-600/50 border-2"
                : "bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700"
            }`}
            style={{ borderColor: selectedScientist === index ? scientist.color : undefined }}
          >
            <div
              className="w-12 h-12 mx-auto rounded-full flex items-center justify-center text-2xl font-bold mb-2"
              style={{ backgroundColor: scientist.color + "30", color: scientist.color }}
            >
              {scientist.name.charAt(0)}
            </div>
            <div className="text-xs font-medium text-white truncate">{scientist.name}</div>
            <div className="text-[10px] text-gray-500">{scientist.years}</div>
          </button>
        ))}
      </div>

      {selectedScientist !== null && (
        <div
          className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-xl p-4 border animate-fadeIn"
          style={{ borderColor: currentScientists[selectedScientist].color + "50" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0"
              style={{
                backgroundColor: currentScientists[selectedScientist].color + "20",
                color: currentScientists[selectedScientist].color,
              }}
            >
              {currentScientists[selectedScientist].name.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-white">
                {currentScientists[selectedScientist].name}
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: currentScientists[selectedScientist].color + "30",
                    color: currentScientists[selectedScientist].color,
                  }}
                >
                  {currentScientists[selectedScientist].years}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                  {currentScientists[selectedScientist].field}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {language === "ru"
                  ? "Р“Р»Р°РІРЅС‹Рµ РґРѕСЃС‚РёР¶РµРЅРёСЏ"
                  : language === "en"
                    ? "Key achievements"
                    : language === "zh"
                      ? "дё»и¦Ѓж€ђе°±"
                      : "Ч”Ч™Ч©Ч’Ч™Чќ ЧћЧЁЧ›Ч–Ч™Ч™Чќ"}
              </div>
              <div className="text-sm text-cyan-300">
                {currentScientists[selectedScientist].achievement}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">
                {language === "ru"
                  ? "РќРѕР±РµР»РµРІСЃРєР°СЏ РїСЂРµРјРёСЏ"
                  : language === "en"
                    ? "Nobel Prize"
                    : language === "zh"
                      ? "иЇєиґќе°”еҐ–"
                      : "Ч¤ЧЁЧЎ Ч Ч•Ч‘Чњ"}
              </div>
              <div className="text-sm text-yellow-400">
                {currentScientists[selectedScientist].nobel}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-3 border-l-2 border-purple-500">
              <p className="text-sm italic text-gray-300">
                {currentScientists[selectedScientist].quote}
              </p>
            </div>

            <div>
              <div className="text-xs text-gray-500 mb-1">
                {language === "ru"
                  ? "Р‘РёРѕРіСЂР°С„РёСЏ"
                  : language === "en"
                    ? "Biography"
                    : language === "zh"
                      ? "дј и®°"
                      : "Ч‘Ч™Ч•Ч’ЧЁЧ¤Ч™Ч”"}
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                {currentScientists[selectedScientist].bio}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20 text-xs">
        <div className="text-purple-300 font-semibold mb-1">
          {language === "ru"
            ? "рџ‘ЁвЂЌрџ”¬ Р’РµР»РёРєРёРµ С„РёР·РёРєРё"
            : language === "en"
              ? "рџ‘ЁвЂЌрџ”¬ Great Physicists"
              : language === "zh"
                ? "рџ‘ЁвЂЌрџ”¬ дјџе¤§з‰©зђ†е­¦е®¶"
                : "рџ‘ЁвЂЌрџ”¬ Ч¤Ч™Ч–Ч™Ч§ЧђЧ™Чќ Ч“Ч’Ч•ЧњЧ™Чќ"}
        </div>
        <p className="text-gray-400">
          {language === "ru"
            ? "Р­С‚Рё СѓС‡С‘РЅС‹Рµ СЃРѕРІРµСЂС€РёР»Рё СЂРµРІРѕР»СЋС†РёСЋ РІ РЅР°С€РµРј РїРѕРЅРёРјР°РЅРёРё Р’СЃРµР»РµРЅРЅРѕР№ вЂ” РѕС‚ Р°С‚РѕРјРѕРІ РґРѕ РєРѕСЃРјРѕСЃР°."
            : language === "en"
              ? "These scientists revolutionized our understanding of the Universe вЂ” from atoms to cosmos."
              : language === "zh"
                ? "иї™дє›з§‘е­¦е®¶еЅ»еє•ж”№еЏдє†ж€‘д»¬еЇ№е®‡е®™зљ„зђ†и§ЈвЂ”вЂ”д»ЋеЋџе­ђе€°е®‡е®™гЂ‚"
                : "ЧћЧ“ЧўЧ Ч™Чќ ЧђЧњЧ” Ч—Ч•ЧњЧњЧ• ЧћЧ”Ч¤Ч›Ч” Ч‘Ч”Ч‘Ч ЧЄЧ Ч• ЧђЧЄ Ч”Ч™Ч§Ч•Чќ."}
        </p>
      </div>
    </div>
  )
}

// ==================== FORMULA CALCULATOR ====================
function FormulaCalculator() {
  const [category, setCategory] = useState<
    "mechanics" | "electromagnetism" | "quantum" | "relativity"
  >("mechanics")
  const [formula, setFormula] = useState("kinetic_energy")
  const [inputs, setInputs] = useState<Record<string, string>>({})
  const [result, setResult] = useState<string | null>(null)
  const [resultUnit, setResultUnit] = useState("")

  const formulas = {
    mechanics: [
      {
        id: "kinetic_energy",
        name: "E = ВЅmvВІ",
        inputs: ["m", "v"],
        unit: "Р”Р¶",
        calc: (i: Record<string, number>) => 0.5 * i.m * i.v * i.v,
      },
      {
        id: "potential_energy",
        name: "E = mgh",
        inputs: ["m", "g", "h"],
        unit: "Р”Р¶",
        calc: (i: Record<string, number>) => i.m * i.g * i.h,
      },
      {
        id: "force",
        name: "F = ma",
        inputs: ["m", "a"],
        unit: "Рќ",
        calc: (i: Record<string, number>) => i.m * i.a,
      },
      {
        id: "momentum",
        name: "p = mv",
        inputs: ["m", "v"],
        unit: "РєРіВ·Рј/СЃ",
        calc: (i: Record<string, number>) => i.m * i.v,
      },
      {
        id: "work",
        name: "W = FВ·sВ·cos(Оё)",
        inputs: ["F", "s", "theta"],
        unit: "Р”Р¶",
        calc: (i: Record<string, number>) => i.F * i.s * Math.cos((i.theta * Math.PI) / 180),
      },
      {
        id: "power",
        name: "P = W/t",
        inputs: ["W", "t"],
        unit: "Р’С‚",
        calc: (i: Record<string, number>) => i.W / i.t,
      },
      {
        id: "pressure",
        name: "P = F/S",
        inputs: ["F", "S"],
        unit: "РџР°",
        calc: (i: Record<string, number>) => i.F / i.S,
      },
      {
        id: "velocity_freefall",
        name: "v = в€љ(2gh)",
        inputs: ["g", "h"],
        unit: "Рј/СЃ",
        calc: (i: Record<string, number>) => Math.sqrt(2 * i.g * i.h),
      },
    ],
    electromagnetism: [
      {
        id: "ohm_law",
        name: "U = IR",
        inputs: ["I", "R"],
        unit: "Р’",
        calc: (i: Record<string, number>) => i.I * i.R,
      },
      {
        id: "power_electric",
        name: "P = UI",
        inputs: ["U", "I"],
        unit: "Р’С‚",
        calc: (i: Record<string, number>) => i.U * i.I,
      },
      {
        id: "resistance",
        name: "R = ПЃL/S",
        inputs: ["rho", "L", "S"],
        unit: "РћРј",
        calc: (i: Record<string, number>) => (i.rho * i.L) / i.S,
      },
      {
        id: "coulomb",
        name: "F = kqв‚Ѓqв‚‚/rВІ",
        inputs: ["q1", "q2", "r"],
        unit: "Рќ",
        calc: (i: Record<string, number>) => (8.99e9 * i.q1 * i.q2) / (i.r * i.r),
      },
      {
        id: "capacitance",
        name: "C = Оµв‚ЂОµS/d",
        inputs: ["epsilon", "S", "d"],
        unit: "Р¤",
        calc: (i: Record<string, number>) => (8.85e-12 * i.epsilon * i.S) / i.d,
      },
      {
        id: "energy_capacitor",
        name: "E = ВЅCUВІ",
        inputs: ["C", "U"],
        unit: "Р”Р¶",
        calc: (i: Record<string, number>) => 0.5 * i.C * i.U * i.U,
      },
      {
        id: "magnetic_force",
        name: "F = BILsin(Оё)",
        inputs: ["B", "I", "L", "theta"],
        unit: "Рќ",
        calc: (i: Record<string, number>) => i.B * i.I * i.L * Math.sin((i.theta * Math.PI) / 180),
      },
    ],
    quantum: [
      {
        id: "photon_energy",
        name: "E = hf",
        inputs: ["f"],
        unit: "Р”Р¶",
        calc: (i: Record<string, number>) => 6.626e-34 * i.f,
      },
      {
        id: "de_broglie",
        name: "О» = h/p",
        inputs: ["p"],
        unit: "Рј",
        calc: (i: Record<string, number>) => 6.626e-34 / i.p,
      },
      {
        id: "de_broglie_mv",
        name: "О» = h/mv",
        inputs: ["m", "v"],
        unit: "Рј",
        calc: (i: Record<string, number>) => 6.626e-34 / (i.m * i.v),
      },
      {
        id: "uncertainty_xp",
        name: "О”xВ·О”p в‰Ґ в„Џ/2",
        inputs: ["delta_x"],
        unit: "РєРіВ·Рј/СЃ",
        calc: (i: Record<string, number>) => 1.055e-34 / (2 * i.delta_x),
      },
      {
        id: "energy_levels",
        name: "Eв‚™ = -13.6/nВІ СЌР’",
        inputs: ["n"],
        unit: "СЌР’",
        calc: (i: Record<string, number>) => -13.6 / (i.n * i.n),
      },
      {
        id: "photon_momentum",
        name: "p = h/О»",
        inputs: ["lambda"],
        unit: "РєРіВ·Рј/СЃ",
        calc: (i: Record<string, number>) => 6.626e-34 / i.lambda,
      },
      {
        id: "photoelectric",
        name: "Eв‚– = hf - A",
        inputs: ["f", "A"],
        unit: "Р”Р¶",
        calc: (i: Record<string, number>) => 6.626e-34 * i.f - i.A,
      },
    ],
    relativity: [
      {
        id: "lorentz_factor",
        name: "Оі = 1/в€љ(1-vВІ/cВІ)",
        inputs: ["v_fraction"],
        unit: "",
        calc: (i: Record<string, number>) => 1 / Math.sqrt(1 - i.v_fraction * i.v_fraction),
      },
      {
        id: "time_dilation",
        name: "t' = t/Оі",
        inputs: ["t", "v_fraction"],
        unit: "СЃ",
        calc: (i: Record<string, number>) => i.t / (1 / Math.sqrt(1 - i.v_fraction * i.v_fraction)),
      },
      {
        id: "length_contraction",
        name: "L' = L/Оі",
        inputs: ["L", "v_fraction"],
        unit: "Рј",
        calc: (i: Record<string, number>) => i.L * Math.sqrt(1 - i.v_fraction * i.v_fraction),
      },
      {
        id: "mass_energy",
        name: "E = mcВІ",
        inputs: ["m"],
        unit: "Р”Р¶",
        calc: (i: Record<string, number>) => i.m * 8.98755179e16,
      },
      {
        id: "relativistic_mass",
        name: "m' = Оіmв‚Ђ",
        inputs: ["m0", "v_fraction"],
        unit: "РєРі",
        calc: (i: Record<string, number>) => i.m0 / Math.sqrt(1 - i.v_fraction * i.v_fraction),
      },
      {
        id: "relativistic_ke",
        name: "Eв‚– = (Оі-1)mcВІ",
        inputs: ["m", "v_fraction"],
        unit: "Р”Р¶",
        calc: (i: Record<string, number>) =>
          (1 / Math.sqrt(1 - i.v_fraction * i.v_fraction) - 1) * i.m * 8.98755179e16,
      },
    ],
  }

  const inputLabels: Record<string, string> = {
    m: "РњР°СЃСЃР° m (РєРі)",
    v: "РЎРєРѕСЂРѕСЃС‚СЊ v (Рј/СЃ)",
    g: "РЈСЃРєРѕСЂРµРЅРёРµ g (Рј/СЃВІ)",
    h: "Р’С‹СЃРѕС‚Р° h (Рј)",
    a: "РЈСЃРєРѕСЂРµРЅРёРµ a (Рј/СЃВІ)",
    F: "РЎРёР»Р° F (Рќ)",
    s: "Р Р°СЃСЃС‚РѕСЏРЅРёРµ s (Рј)",
    theta: "РЈРіРѕР» Оё (В°)",
    W: "Р Р°Р±РѕС‚Р° W (Р”Р¶)",
    t: "Р’СЂРµРјСЏ t (СЃ)",
    S: "РџР»РѕС‰Р°РґСЊ S (РјВІ)",
    I: "РЎРёР»Р° С‚РѕРєР° I (Рђ)",
    R: "РЎРѕРїСЂРѕС‚РёРІР»РµРЅРёРµ R (РћРј)",
    U: "РќР°РїСЂСЏР¶РµРЅРёРµ U (Р’)",
    P: "РњРѕС‰РЅРѕСЃС‚СЊ P (Р’С‚)",
    rho: "РЈРґ. СЃРѕРїСЂРѕС‚РёРІР»РµРЅРёРµ ПЃ (РћРјВ·Рј)",
    L: "Р”Р»РёРЅР° L (Рј)",
    q1: "Р—Р°СЂСЏРґ qв‚Ѓ (РљР»)",
    q2: "Р—Р°СЂСЏРґ qв‚‚ (РљР»)",
    r: "Р Р°СЃСЃС‚РѕСЏРЅРёРµ r (Рј)",
    epsilon: "Р”РёСЌР». РїСЂРѕРЅРёС†Р°РµРјРѕСЃС‚СЊ Оµ",
    d: "Р Р°СЃСЃС‚РѕСЏРЅРёРµ d (Рј)",
    C: "РЃРјРєРѕСЃС‚СЊ C (Р¤)",
    B: "РРЅРґСѓРєС†РёСЏ B (РўР»)",
    f: "Р§Р°СЃС‚РѕС‚Р° f (Р“С†)",
    p: "РРјРїСѓР»СЊСЃ p (РєРіВ·Рј/СЃ)",
    lambda: "Р”Р»РёРЅР° РІРѕР»РЅС‹ О» (Рј)",
    delta_x: "РќРµРѕРїСЂ. РїРѕР·РёС†РёРё О”x (Рј)",
    n: "РљРІР°РЅС‚РѕРІРѕРµ С‡РёСЃР»Рѕ n",
    A: "Р Р°Р±РѕС‚Р° РІС‹С…РѕРґР° A (Р”Р¶)",
    v_fraction: "РЎРєРѕСЂРѕСЃС‚СЊ v/c (0-0.999)",
    m0: "РњР°СЃСЃР° РїРѕРєРѕСЏ mв‚Ђ (РєРі)",
  }

  const categoryLabels: Record<string, string> = {
    mechanics: "вљ™пёЏ РњРµС…Р°РЅРёРєР°",
    electromagnetism: "вљЎ Р­Р»РµРєС‚СЂРёС‡РµСЃС‚РІРѕ",
    quantum: "вљ›пёЏ РљРІР°РЅС‚РѕРІР°СЏ С„РёР·РёРєР°",
    relativity: "рџљЂ РћС‚РЅРѕСЃРёС‚РµР»СЊРЅРѕСЃС‚СЊ",
  }

  const currentFormula = formulas[category].find((f) => f.id === formula) || formulas[category][0]

  const handleCategoryChange = (cat: typeof category) => {
    setCategory(cat)
    setInputs({})
    setResult(null)
    setFormula(formulas[cat][0].id)
  }

  const calculate = () => {
    try {
      const values: Record<string, number> = {}
      for (const key of currentFormula.inputs) {
        const val = parseFloat(inputs[key] || "0")
        if (isNaN(val)) {
          setResult("РћС€РёР±РєР°: РІРІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Рµ С‡РёСЃР»Р°")
          return
        }
        values[key] = val
      }
      const res = currentFormula.calc(values)
      if (isNaN(res) || !isFinite(res)) {
        setResult("РћС€РёР±РєР°: РЅРµРІРµСЂРЅС‹Р№ СЂРµР·СѓР»СЊС‚Р°С‚")
        return
      }
      setResult(res.toExponential(6))
      setResultUnit(currentFormula.unit)
    } catch {
      setResult("РћС€РёР±РєР° РІС‹С‡РёСЃР»РµРЅРёСЏ")
    }
  }

  return (
    <div className="space-y-4">
      {/* Category selector */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(formulas) as Array<keyof typeof formulas>).map((cat) => (
          <Button
            key={cat}
            onClick={() => {
              handleCategoryChange(cat)
            }}
            variant={category === cat ? "default" : "outline"}
            size="sm"
            className={`text-xs ${category === cat ? "bg-purple-600" : ""}`}
          >
            {categoryLabels[cat]}
          </Button>
        ))}
      </div>

      {/* Formula selector */}
      <div className="space-y-2">
        <label className="text-xs text-purple-400">Р’С‹Р±РµСЂРёС‚Рµ С„РѕСЂРјСѓР»Сѓ:</label>
        <div className="flex gap-2 flex-wrap">
          {formulas[category].map((f) => (
            <Button
              key={f.id}
              onClick={() => {
                setFormula(f.id)
                setInputs({})
                setResult(null)
              }}
              variant={formula === f.id ? "default" : "outline"}
              size="sm"
              className={`text-xs font-mono ${formula === f.id ? "bg-cyan-600" : "border-cyan-500/50 text-cyan-300"}`}
            >
              {f.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Input fields */}
      <div className="grid grid-cols-2 gap-3">
        {currentFormula.inputs.map((input) => (
          <div key={input} className="space-y-1">
            <label className="text-xs text-gray-400">{inputLabels[input] || input}</label>
            <input
              type="number"
              step="any"
              value={inputs[input] || ""}
              onChange={(e) => {
                setInputs({ ...inputs, [input]: e.target.value })
              }}
              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
              placeholder={input}
            />
          </div>
        ))}
      </div>

      {/* Calculate button */}
      <Button
        onClick={calculate}
        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500"
      >
        рџ§® Р’С‹С‡РёСЃР»РёС‚СЊ
      </Button>

      {/* Result */}
      {result && (
        <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg p-4 border border-purple-500/30">
          <div className="text-xs text-purple-400 mb-1">Р РµР·СѓР»СЊС‚Р°С‚:</div>
          <div className="text-2xl font-mono text-white">
            {result} {resultUnit && <span className="text-cyan-400 text-lg">{resultUnit}</span>}
          </div>
        </div>
      )}

      {/* Quick reference */}
      <div className="bg-gray-800/30 rounded-lg p-3 text-xs">
        <div className="text-gray-400 mb-2">рџ“‹ РљРѕРЅСЃС‚Р°РЅС‚С‹:</div>
        <div className="grid grid-cols-2 gap-2 text-gray-500">
          <div>c = 2.998Г—10вЃё Рј/СЃ</div>
          <div>h = 6.626Г—10вЃ»ВівЃґ Р”Р¶В·СЃ</div>
          <div>G = 6.674Г—10вЃ»В№В№ РќВ·РјВІ/РєРіВІ</div>
          <div>в„Џ = 1.055Г—10вЃ»ВівЃґ Р”Р¶В·СЃ</div>
          <div>e = 1.602Г—10вЃ»В№вЃ№ РљР»</div>
          <div>Оµв‚Ђ = 8.854Г—10вЃ»В№ВІ Р¤/Рј</div>
        </div>
      </div>
    </div>
  )
}

// ==================== MAIN PAGE ====================
export default function Home() {
  const [activeSection, setActiveSection] = useState("quantum")
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("physics-lang") as Language
      return saved && translations[saved] ? saved : "ru"
    }
    return "ru"
  })
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("physics-theme") as Theme
      return saved || "dark"
    }
    return "dark"
  })
  const [menuOpen, setMenuOpen] = useState(false)

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem("physics-lang", language)
  }, [language])

  useEffect(() => {
    localStorage.setItem("physics-theme", theme)
  }, [theme])

  // Keyboard shortcuts for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const sections = ["quantum", "relativity", "cosmos", "advanced"]

      if (e.key >= "1" && e.key <= "4") {
        const index = parseInt(e.key) - 1
        if (sections[index]) {
          setActiveSection(sections[index])
        }
      } else if (e.key === "m" || e.key === "M") {
        setMenuOpen((prev) => !prev)
      } else if (e.key === "Escape") {
        setMenuOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const t = translations[language]
  const isRTL = language === "he"
  const isDark = theme === "dark"

  const navItems = [
    { id: "quantum", label: t.quantum, color: "from-purple-600 to-blue-600" },
    { id: "relativity", label: t.relativity, color: "from-yellow-600 to-orange-600" },
    { id: "cosmos", label: t.cosmos, color: "from-red-600 to-purple-600" },
    { id: "advanced", label: t.advanced, color: "from-pink-600 to-purple-600" },
  ]

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white" : "bg-gradient-to-b from-gray-100 via-white to-gray-50 text-gray-900"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Side Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 z-[60] transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } ${isDark ? "bg-gray-900/98" : "bg-white/98"} backdrop-blur-lg shadow-2xl border-l ${isDark ? "border-gray-800" : "border-gray-200"}`}
      >
        <div className="p-6 h-full overflow-y-auto">
          {/* Close button */}
          <button
            onClick={() => {
              setMenuOpen(false)
            }}
            className={`absolute top-4 right-4 p-2 rounded-lg ${isDark ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-600"}`}
          >
            вњ•
          </button>

          {/* Menu content */}
          <div className="mt-8 space-y-6">
            <div>
              <h2 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                {language === "ru" && "рџ“љ Рћ РїСЂРѕРµРєС‚Рµ"}
                {language === "en" && "рџ“љ About"}
                {language === "zh" && "рџ“љ е…ідєЋйЎ№з›®"}
                {language === "he" && "рџ“љ ЧђЧ•Ч“Ч•ЧЄ"}
              </h2>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {language === "ru" &&
                  "РРЅС‚РµСЂР°РєС‚РёРІРЅС‹Рµ РІРёР·СѓР°Р»РёР·Р°С†РёРё С„РёР·РёС‡РµСЃРєРёС… СЏРІР»РµРЅРёР№: РѕС‚ РєРІР°РЅС‚РѕРІРѕР№ РјРµС…Р°РЅРёРєРё РґРѕ РєРѕСЃРјРѕР»РѕРіРёРё."}
                {language === "en" &&
                  "Interactive visualizations of physical phenomena: from quantum mechanics to cosmology."}
                {language === "zh" &&
                  "з‰©зђ†зЋ°и±Ўзљ„дє¤дє’ејЏеЏЇи§†еЊ–пјљд»Ћй‡Џе­ђеЉ›е­¦е€°е®‡е®™е­¦гЂ‚"}
                {language === "he" &&
                  "Ч•Ч™Ч–Ч•ЧђЧњЧ™Ч–Ч¦Ч™Ч•ЧЄ ЧђЧ™Ч ЧЧЁЧђЧ§ЧЧ™Ч‘Ч™Ч•ЧЄ Ч©Чњ ЧЄЧ•Ч¤ЧўЧ•ЧЄ Ч¤Ч™Ч–Ч™Ч§ЧњЧ™Ч•ЧЄ"}
              </p>
            </div>

            <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <h3 className={`font-semibold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {language === "ru" && "рџ“– Р Р°Р·РґРµР»С‹"}
                {language === "en" && "рџ“– Sections"}
                {language === "zh" && "рџ“– з« иЉ‚"}
                {language === "he" && "рџ“– ЧЎЧўЧ™Ч¤Ч™Чќ"}
              </h3>
              <div className="space-y-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id)
                      setMenuOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? "bg-purple-600/20 text-purple-400"
                        : isDark
                          ? "hover:bg-gray-800 text-gray-300"
                          : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <h3 className={`font-semibold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {language === "ru" && "рџ”¬ Р’РёР·СѓР°Р»РёР·Р°С†РёРё"}
                {language === "en" && "рџ”¬ Visualizations"}
                {language === "zh" && "рџ”¬ еЏЇи§†еЊ–"}
                {language === "he" && "рџ”¬ Ч•Ч™Ч–Ч•ЧђЧњЧ™Ч–Ч¦Ч™Ч•ЧЄ"}
              </h3>
              <div className={`text-xs space-y-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <div>
                  рџЊЉ{" "}
                  {language === "ru"
                    ? "Р’РѕР»РЅРѕРІР°СЏ С„СѓРЅРєС†РёСЏ"
                    : language === "en"
                      ? "Wave Function"
                      : language === "zh"
                        ? "жіўе‡Ѕж•°"
                        : "Ч¤Ч•Ч Ч§Ч¦Ч™Ч™ЧЄ Ч’Чњ"}
                </div>
                <div>
                  рџ“ђ{" "}
                  {language === "ru"
                    ? "РџСЂРёРЅС†РёРї РЅРµРѕРїСЂРµРґРµР»С‘РЅРЅРѕСЃС‚Рё"
                    : language === "en"
                      ? "Uncertainty Principle"
                      : language === "zh"
                        ? "дёЌзЎ®е®љжЂ§еЋџзђ†"
                        : "ЧўЧ™Ч§ЧЁЧ•Чџ ЧђЧ™-Ч”Ч•Ч•Ч“ЧђЧ•ЧЄ"}
                </div>
                <div>
                  рџљ§{" "}
                  {language === "ru"
                    ? "РљРІР°РЅС‚РѕРІРѕРµ С‚СѓРЅРЅРµР»РёСЂРѕРІР°РЅРёРµ"
                    : language === "en"
                      ? "Quantum Tunneling"
                      : language === "zh"
                        ? "й‡Џе­ђйљ§з©ї"
                        : "ЧћЧ™Ч Ч”Ч•ЧЁ Ч§Ч•Ч•Ч ЧЧ™"}
                </div>
                <div>
                  вЏ±пёЏ{" "}
                  {language === "ru"
                    ? "Р—Р°РјРµРґР»РµРЅРёРµ РІСЂРµРјРµРЅРё"
                    : language === "en"
                      ? "Time Dilation"
                      : language === "zh"
                        ? "ж—¶й—ґи†ЁиѓЂ"
                        : "Ч”ЧЄЧђЧЁЧ›Ч•ЧЄ Ч–ЧћЧџ"}
                </div>
                <div>рџ’Ґ E = mcВІ</div>
                <div>
                  рџ“Љ{" "}
                  {language === "ru"
                    ? "Р”РёР°РіСЂР°РјРјР° Р“-Р "
                    : language === "en"
                      ? "H-R Diagram"
                      : language === "zh"
                        ? "иµ«зЅ—е›ѕ"
                        : "Ч“Ч™ЧђЧ’ЧЁЧћЧЄ H-R"}
                </div>
                <div>
                  рџ’«{" "}
                  {language === "ru"
                    ? "РќРµР№С‚СЂРѕРЅРЅР°СЏ Р·РІРµР·РґР°"
                    : language === "en"
                      ? "Neutron Star"
                      : language === "zh"
                        ? "дё­е­ђжџ"
                        : "Ч›Ч•Ч›Ч‘ Ч Ч™Ч™ЧЧЁЧ•Чџ"}
                </div>
                <div>
                  рџ•іпёЏ{" "}
                  {language === "ru"
                    ? "Р§С‘СЂРЅР°СЏ РґС‹СЂР°"
                    : language === "en"
                      ? "Black Hole"
                      : language === "zh"
                        ? "й»‘жґћ"
                        : "Ч—Ч•ЧЁ Ч©Ч—Ч•ЧЁ"}
                </div>
                <div>
                  вљЄ{" "}
                  {language === "ru"
                    ? "Р‘РµР»Р°СЏ РґС‹СЂР°"
                    : language === "en"
                      ? "White Hole"
                      : language === "zh"
                        ? "з™Ѕжґћ"
                        : "Ч—Ч•ЧЁ ЧњЧ‘Чџ"}
                </div>
                <div>
                  рџ”¬{" "}
                  {language === "ru"
                    ? "Р”РІРѕР№РЅР°СЏ С‰РµР»СЊ"
                    : language === "en"
                      ? "Double Slit"
                      : language === "zh"
                        ? "еЏЊзјќе®ћйЄЊ"
                        : "ЧЎЧ“Ч§ Ч›Ч¤Ч•Чњ"}
                </div>
                <div>
                  рџЊЂ{" "}
                  {language === "ru"
                    ? "РўС‘РјРЅР°СЏ РјР°С‚РµСЂРёСЏ"
                    : language === "en"
                      ? "Dark Matter"
                      : language === "zh"
                        ? "жљ—з‰©иґЁ"
                        : "Ч—Ч•ЧћЧЁ ЧђЧ¤Чњ"}
                </div>
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <h3 className={`font-semibold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {language === "ru" && "рџ“ђ Р¤РѕСЂРјСѓР»С‹"}
                {language === "en" && "рџ“ђ Formulas"}
                {language === "zh" && "рџ“ђ е…¬ејЏ"}
                {language === "he" && "рџ“ђ Ч Ч•ЧЎЧ—ЧђЧ•ЧЄ"}
              </h3>
              <div
                className={`text-xs space-y-2 font-mono ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
              >
                <div>E = mcВІ</div>
                <div>О”xВ·О”p в‰Ґ в„Џ/2</div>
                <div>П€(x,t) = Ae^(i(kx-П‰t))</div>
                <div>R_s = 2GM/cВІ</div>
                <div>T_H = в„ЏcВі/8ПЂGMk_B</div>
                <div>Оі = 1/в€љ(1-vВІ/cВІ)</div>
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <h3 className={`font-semibold mb-3 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {language === "ru" && "вљ™пёЏ РќР°СЃС‚СЂРѕР№РєРё"}
                {language === "en" && "вљ™пёЏ Settings"}
                {language === "zh" && "вљ™пёЏ и®ѕзЅ®"}
                {language === "he" && "вљ™пёЏ Ч”Ч’Ч“ЧЁЧ•ЧЄ"}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {language === "ru"
                      ? "РЇР·С‹Рє"
                      : language === "en"
                        ? "Language"
                        : language === "zh"
                          ? "иЇ­иЁЂ"
                          : "Ч©Ч¤Ч”"}
                  </label>
                  <div className="flex gap-1 mt-1">
                    {(["ru", "en", "zh", "he"] as Language[]).map((lang) => (
                      <Button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang)
                        }}
                        variant={language === lang ? "default" : "ghost"}
                        size="sm"
                        className={`text-xs px-2 ${language === lang ? "bg-purple-600" : isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {lang.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {language === "ru"
                      ? "РўРµРјР°"
                      : language === "en"
                        ? "Theme"
                        : language === "zh"
                          ? "дё»йў"
                          : "ЧўЧЁЧ›ЧЄ Ч Ч•Ч©Чђ"}
                  </label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      onClick={() => {
                        setTheme("dark")
                      }}
                      variant={theme === "dark" ? "default" : "ghost"}
                      size="sm"
                      className={`text-xs ${theme === "dark" ? "bg-gray-700" : ""}`}
                    >
                      рџЊ™ Dark
                    </Button>
                    <Button
                      onClick={() => {
                        setTheme("light")
                      }}
                      variant={theme === "light" ? "default" : "ghost"}
                      size="sm"
                      className={`text-xs ${theme === "light" ? "bg-gray-200 text-gray-900" : ""}`}
                    >
                      вЂпёЏ Light
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                {language === "ru" &&
                  "РЎРѕР·РґР°РЅРѕ СЃ вќ¤пёЏ РґР»СЏ Р»СЋР±РёС‚РµР»РµР№ С„РёР·РёРєРё"}
                {language === "en" && "Made with вќ¤пёЏ for physics enthusiasts"}
                {language === "zh" && "дёєз‰©зђ†з€±еҐЅиЂ…з”Ёвќ¤пёЏе€¶дЅњ"}
                {language === "he" && "Ч Ч‘Ч Ч” Ч‘вќ¤пёЏ ЧњЧ—Ч•Ч‘Ч‘Ч™ Ч¤Ч™Ч–Ч™Ч§Ч”"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          onClick={() => {
            setMenuOpen(false)
          }}
        />
      )}

      {/* Header with controls */}
      <header
        className={`relative overflow-hidden py-6 md:py-10 ${isDark ? "border-b border-gray-800" : "border-b border-gray-200"}`}
      >
        <div
          className={`absolute inset-0 ${isDark ? "bg-[radial-gradient(ellipse_at_center,rgba(60,30,120,0.15),transparent_70%)]" : "bg-[radial-gradient(ellipse_at_center,rgba(100,80,180,0.08),transparent_70%)]"}`}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          {/* Language, Theme and Menu controls */}
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <div className="flex gap-2">
              {/* Language buttons */}
              <div className="flex gap-1">
                {(["ru", "en", "zh", "he"] as Language[]).map((lang) => (
                  <Button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang)
                    }}
                    variant={language === lang ? "default" : "ghost"}
                    size="sm"
                    className={`text-xs px-2 ${language === lang ? "bg-purple-600" : isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {lang.toUpperCase()}
                  </Button>
                ))}
              </div>
              {/* Theme toggle */}
              <Button
                onClick={() => {
                  setTheme(isDark ? "light" : "dark")
                }}
                variant="outline"
                size="sm"
                className={`text-xs ${isDark ? "border-gray-700 text-gray-300" : "border-gray-300 text-gray-700"}`}
              >
                {isDark ? "вЂпёЏ" : "рџЊ™"}
              </Button>
              {/* Menu toggle */}
              <Button
                onClick={() => {
                  setMenuOpen(true)
                }}
                variant="outline"
                size="sm"
                className={`text-xs ${isDark ? "border-gray-700 text-gray-300" : "border-gray-300 text-gray-700"}`}
              >
                в°{" "}
                {language === "ru"
                  ? "РњРµРЅСЋ"
                  : language === "en"
                    ? "Menu"
                    : language === "zh"
                      ? "иЏњеЌ•"
                      : "ЧЄЧ¤ЧЁЧ™Ч"}
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
              {t.title}
            </h1>
            <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {t.subtitle}
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur-md border-b ${isDark ? "bg-gray-950/90 border-gray-800" : "bg-white/90 border-gray-200"}`}
      >
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex justify-center gap-2 flex-wrap">
            {navItems.map((tab, index) => (
              <Button
                key={tab.id}
                onClick={() => {
                  setActiveSection(tab.id)
                }}
                variant={activeSection === tab.id ? "default" : "ghost"}
                title={`еї«жЌ·й”®: ${String(index + 1)} | Shortcut: ${String(index + 1)}`}
                className={`text-xs md:text-sm ${activeSection === tab.id ? `bg-gradient-to-r ${tab.color}` : isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {activeSection === "quantum" && (
          <>
            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30"
                  : "bg-white border-purple-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  {t.waveFunction}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.waveFunctionDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.waveFunction} isDark={isDark}>
                  <ErrorBoundary name="WaveFunctionVisualization">
                    <WaveFunctionVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-blue-500/30"
                  : "bg-white border-blue-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  {t.uncertainty}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.uncertaintyDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.uncertainty} isDark={isDark}>
                  <ErrorBoundary name="UncertaintyVisualization">
                    <UncertaintyVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-green-500/30"
                  : "bg-white border-green-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-green-400" : "text-green-600"}`}>
                  {t.tunneling}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.tunnelingDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.tunneling} isDark={isDark}>
                  <ErrorBoundary name="TunnelingVisualization">
                    <TunnelingVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>
          </>
        )}

        {activeSection === "relativity" && (
          <>
            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-orange-500/30"
                  : "bg-white border-orange-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-orange-400" : "text-orange-600"}`}>
                  {t.timeDilation}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.timeDilationDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.timeDilation} isDark={isDark}>
                  <ErrorBoundary name="TimeDilationVisualization">
                    <TimeDilationVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30"
                  : "bg-white border-purple-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  {t.lengthContraction}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.lengthContractionDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.lengthContraction} isDark={isDark}>
                  <ErrorBoundary name="LengthContractionVisualization">
                    <LengthContractionVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-yellow-500/30"
                  : "bg-white border-yellow-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                  {t.massEnergy}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.massEnergyDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.massEnergy} isDark={isDark}>
                  <ErrorBoundary name="MassEnergyVisualization">
                    <MassEnergyVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>
          </>
        )}

        {activeSection === "cosmos" && (
          <>
            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-blue-500/30"
                  : "bg-white border-blue-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  {t.hrDiagram}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.hrDiagramDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.hrDiagram} isDark={isDark}>
                  <ErrorBoundary name="HRDiagramVisualization">
                    <HRDiagramVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-cyan-500/30"
                  : "bg-white border-cyan-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                  {t.neutronStar}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.neutronStarDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.neutronStar} isDark={isDark}>
                  <ErrorBoundary name="NeutronStarVisualization">
                    <NeutronStarVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-red-500/30"
                  : "bg-white border-red-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-red-400" : "text-red-600"}`}>
                  {t.blackHole}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.blackHoleDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.blackHole} isDark={isDark}>
                  <ErrorBoundary name="BlackHoleVisualization">
                    <BlackHoleVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-cyan-500/30"
                  : "bg-white border-cyan-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                  {t.whiteHole}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.whiteHoleDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.whiteHole} isDark={isDark}>
                  <ErrorBoundary name="WhiteHoleVisualization">
                    <WhiteHoleVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-yellow-500/30"
                  : "bg-white border-yellow-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                  {t.solarSystem}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.solarSystemDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.solarSystem} isDark={isDark}>
                  <ErrorBoundary name="SolarSystemVisualization">
                    <SolarSystemVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-blue-500/30"
                  : "bg-white border-blue-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  {t.cmb}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.cmbDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.cmb} isDark={isDark}>
                  <ErrorBoundary name="CMBVisualization">
                    <CMBVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30"
                  : "bg-white border-purple-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  {t.darkEnergy}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.darkEnergyDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.darkEnergy} isDark={isDark}>
                  <ErrorBoundary name="DarkEnergyVisualization">
                    <DarkEnergyVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>
          </>
        )}

        {activeSection === "advanced" && (
          <>
            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-pink-500/30"
                  : "bg-white border-pink-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-pink-400" : "text-pink-600"}`}>
                  {t.doubleSlit}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.doubleSlitDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.doubleSlit} isDark={isDark}>
                  <ErrorBoundary name="DoubleSlitVisualization">
                    <DoubleSlitVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30"
                  : "bg-white border-purple-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  {t.darkMatter}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.darkMatterDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.darkMatter} isDark={isDark}>
                  <ErrorBoundary name="DarkMatterVisualization">
                    <DarkMatterVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30"
                  : "bg-white border-purple-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  {t.gravitationalWaves}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.gravitationalWavesDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.gravitationalWaves} isDark={isDark}>
                  <ErrorBoundary name="GravitationalWavesVisualization">
                    <GravitationalWavesVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-pink-500/30"
                  : "bg-white border-pink-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-pink-400" : "text-pink-600"}`}>
                  {t.quantumEntanglement}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.quantumEntanglementDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.quantumEntanglement} isDark={isDark}>
                  <ErrorBoundary name="QuantumEntanglementVisualization">
                    <QuantumEntanglementVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-cyan-500/30"
                  : "bg-white border-cyan-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                  {t.atomicModel}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.atomicModelDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.atomicModel} isDark={isDark}>
                  <ErrorBoundary name="AtomicModelVisualization">
                    <AtomicModelVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-green-500/30"
                  : "bg-white border-green-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-green-400" : "text-green-600"}`}>
                  {t.radioactiveDecay}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.radioactiveDecayDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.radioactiveDecay} isDark={isDark}>
                  <ErrorBoundary name="RadioactiveDecayVisualization">
                    <RadioactiveDecayVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-cyan-500/30"
                  : "bg-white border-cyan-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                  {t.superconductivity}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.superconductivityDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.superconductivity} isDark={isDark}>
                  <ErrorBoundary name="SuperconductivityVisualization">
                    <SuperconductivityVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-yellow-500/30"
                  : "bg-white border-yellow-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                  {t.standardModel}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.standardModelDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.standardModel} isDark={isDark}>
                  <ErrorBoundary name="StandardModelVisualization">
                    <StandardModelVisualization isDark={isDark} />
                  </ErrorBoundary>
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30"
                  : "bg-white border-purple-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  {t.calculator}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.calculatorDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.calculator} isDark={isDark}>
                  <FormulaCalculator />
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-purple-500/30"
                  : "bg-white border-purple-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                  {t.timeline}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.timelineDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.timeline} isDark={isDark}>
                  <PhysicsTimeline />
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-cyan-500/30"
                  : "bg-white border-cyan-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-cyan-400" : "text-cyan-600"}`}>
                  {t.physicsQuiz}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.physicsQuizDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.physicsQuiz} isDark={isDark}>
                  <PhysicsQuiz />
                </FullscreenWrapper>
              </CardContent>
            </Card>

            <Card
              className={
                isDark
                  ? "bg-gradient-to-br from-gray-900 to-gray-950 border-yellow-500/30"
                  : "bg-white border-yellow-300"
              }
            >
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
                  {t.scientists}
                </CardTitle>
                <CardDescription className={`text-xs ${isDark ? "" : "text-gray-600"}`}>
                  {t.scientistsDesc}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <FullscreenWrapper title={t.scientists} isDark={isDark}>
                  <ScientistsBiographies />
                </FullscreenWrapper>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <footer className={`border-t py-4 mt-6 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        <div
          className={`max-w-6xl mx-auto px-4 text-center text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
        >
          <p>{t.footer}</p>
          <p className={`mt-1 ${isDark ? "text-gray-600" : "text-gray-500"}`}>
            вЊЁпёЏ{" "}
            {language === "ru"
              ? "РљР»Р°РІРёС€Рё: 1-4 СЂР°Р·РґРµР»С‹, M РјРµРЅСЋ, Esc Р·Р°РєСЂС‹С‚СЊ"
              : language === "en"
                ? "Keys: 1-4 sections, M menu, Esc close"
                : language === "zh"
                  ? "еї«жЌ·й”®: 1-4з« иЉ‚, MиЏњеЌ•, Escе…ій—­"
                  : "ЧћЧ§Ч©Ч™Чќ: 1-4 ЧЎЧўЧ™Ч¤Ч™Чќ, M ЧЄЧ¤ЧЁЧ™Ч, Esc ЧЎЧ’Ч•ЧЁ"}
          </p>
        </div>
      </footer>
    </div>
  )
}
