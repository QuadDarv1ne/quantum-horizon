/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

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
  PhysicsQuiz,
  ScientistsBiographies,
  FormulaCalculator,
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

// ==================== SCIENTISTS BIOGRAPHIES ====================
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
