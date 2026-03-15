"use client"

import { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { SideMenu } from "@/components/layout/side-menu"
import { HeaderControls } from "@/components/layout/header-controls"
import { Navigation } from "@/components/layout/navigation"
import { VisualizationCard } from "@/components/visualizations/base/visualization-card"
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
  PhysicsTimeline,
} from "@/components/visualizations/lazy"
import { SECTIONS, type Section, type Language } from "@/lib/constants-ui"

type Theme = "dark" | "light"

const STORAGE_KEYS = {
  THEME: "physics-theme",
  LOCALE: "NEXT_LOCALE",
} as const

export default function Home() {
  const t = useTranslations()
  const locale = useLocale()

  const [activeSection, setActiveSection] = useState<Section>("quantum")
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark"
    const saved = localStorage.getItem(STORAGE_KEYS.THEME)
    if (saved === "dark" || saved === "light") return saved
    return "dark"
  })
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  }, [theme])

  useEffect(() => {
    if (typeof window !== "undefined" && locale) {
      localStorage.setItem(STORAGE_KEYS.LOCALE, locale)
    }
  }, [locale])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.key >= "1" && e.key <= "4") {
        const index = parseInt(e.key) - 1
        if (SECTIONS[index]) setActiveSection(SECTIONS[index])
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

  const isRTL = locale === "he"
  const isDark = theme === "dark"

  const handleLanguageChange = (lang: Language) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.LOCALE, lang)
      window.location.reload()
    }
  }

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? "bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white"
          : "bg-gradient-to-b from-gray-100 via-white to-gray-50 text-gray-900"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <SideMenu
        isOpen={menuOpen}
        onClose={() => {
          setMenuOpen(false)
        }}
        activeSection={activeSection}
        onSectionSelect={setActiveSection}
        locale={locale}
        theme={theme}
        onThemeChange={handleThemeChange}
        onLanguageChange={handleLanguageChange}
        isDark={isDark}
      />

      <header
        className={`relative overflow-hidden py-6 md:py-10 ${
          isDark ? "border-b border-gray-800" : "border-b border-gray-200"
        }`}
      >
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-[radial-gradient(ellipse_at_center,rgba(60,30,120,0.15),transparent_70%)]"
              : "bg-[radial-gradient(ellipse_at_center,rgba(100,80,180,0.08),transparent_70%)]"
          }`}
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <HeaderControls
            locale={locale}
            theme={theme}
            onThemeChange={handleThemeChange}
            onMenuOpen={() => {
              setMenuOpen(true)
            }}
            isDark={isDark}
          />

          <div className="text-center">
            <h1 className="mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-2xl font-bold text-transparent md:text-4xl">
              {t("title")}
            </h1>
            <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {t("subtitle")}
            </p>
          </div>
        </div>
      </header>

      <Navigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isDark={isDark}
      />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        {activeSection === "quantum" && (
          <>
            <VisualizationCard
              title={t("waveFunction")}
              description={t("waveFunctionDesc")}
              color="purple"
              isDark={isDark}
            >
              <WaveFunctionVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("uncertainty")}
              description={t("uncertaintyDesc")}
              color="blue"
              isDark={isDark}
            >
              <UncertaintyVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("tunneling")}
              description={t("tunnelingDesc")}
              color="green"
              isDark={isDark}
            >
              <TunnelingVisualization isDark={isDark} />
            </VisualizationCard>
          </>
        )}

        {activeSection === "relativity" && (
          <>
            <VisualizationCard
              title={t("timeDilation")}
              description={t("timeDilationDesc")}
              color="orange"
              isDark={isDark}
            >
              <TimeDilationVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("lengthContraction")}
              description={t("lengthContractionDesc")}
              color="purple"
              isDark={isDark}
            >
              <LengthContractionVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("massEnergy")}
              description={t("massEnergyDesc")}
              color="yellow"
              isDark={isDark}
            >
              <MassEnergyVisualization isDark={isDark} />
            </VisualizationCard>
          </>
        )}

        {activeSection === "cosmos" && (
          <>
            <VisualizationCard
              title={t("hrDiagram")}
              description={t("hrDiagramDesc")}
              color="blue"
              isDark={isDark}
            >
              <HRDiagramVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("neutronStar")}
              description={t("neutronStarDesc")}
              color="cyan"
              isDark={isDark}
            >
              <NeutronStarVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("blackHole")}
              description={t("blackHoleDesc")}
              color="red"
              isDark={isDark}
            >
              <BlackHoleVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("whiteHole")}
              description={t("whiteHoleDesc")}
              color="cyan"
              isDark={isDark}
            >
              <WhiteHoleVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("solarSystem")}
              description={t("solarSystemDesc")}
              color="yellow"
              isDark={isDark}
            >
              <SolarSystemVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("cmb")}
              description={t("cmbDesc")}
              color="blue"
              isDark={isDark}
            >
              <CMBVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("darkEnergy")}
              description={t("darkEnergyDesc")}
              color="purple"
              isDark={isDark}
            >
              <DarkEnergyVisualization isDark={isDark} />
            </VisualizationCard>
          </>
        )}

        {activeSection === "advanced" && (
          <>
            <VisualizationCard
              title={t("doubleSlit")}
              description={t("doubleSlitDesc")}
              color="pink"
              isDark={isDark}
            >
              <DoubleSlitVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("darkMatter")}
              description={t("darkMatterDesc")}
              color="purple"
              isDark={isDark}
            >
              <DarkMatterVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("gravitationalWaves")}
              description={t("gravitationalWavesDesc")}
              color="purple"
              isDark={isDark}
            >
              <GravitationalWavesVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("quantumEntanglement")}
              description={t("quantumEntanglementDesc")}
              color="pink"
              isDark={isDark}
            >
              <QuantumEntanglementVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("atomicModel")}
              description={t("atomicModelDesc")}
              color="cyan"
              isDark={isDark}
            >
              <AtomicModelVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("radioactiveDecay")}
              description={t("radioactiveDecayDesc")}
              color="green"
              isDark={isDark}
            >
              <RadioactiveDecayVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("superconductivity")}
              description={t("superconductivityDesc")}
              color="cyan"
              isDark={isDark}
            >
              <SuperconductivityVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("standardModel")}
              description={t("standardModelDesc")}
              color="yellow"
              isDark={isDark}
            >
              <StandardModelVisualization isDark={isDark} />
            </VisualizationCard>

            <VisualizationCard
              title={t("calculator")}
              description={t("calculatorDesc")}
              color="purple"
              isDark={isDark}
            >
              <FormulaCalculator />
            </VisualizationCard>

            <VisualizationCard
              title={t("timeline")}
              description={t("timelineDesc")}
              color="purple"
              isDark={isDark}
            >
              <PhysicsTimeline />
            </VisualizationCard>

            <VisualizationCard
              title={t("physicsQuiz")}
              description={t("physicsQuizDesc")}
              color="cyan"
              isDark={isDark}
            >
              <PhysicsQuiz />
            </VisualizationCard>

            <VisualizationCard
              title={t("scientists")}
              description={t("scientistsDesc")}
              color="yellow"
              isDark={isDark}
            >
              <ScientistsBiographies />
            </VisualizationCard>
          </>
        )}
      </main>

      <footer className={`mt-6 border-t py-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        <div className="mx-auto max-w-6xl px-4 text-center text-xs">
          <p className={isDark ? "text-gray-500" : "text-gray-600"}>{t("footer")}</p>
          <p className={`mt-1 ${isDark ? "text-gray-600" : "text-gray-500"}`}>
            ⌨️ {locale === "ru" && "Клавиши: 1-4 разделы, M меню, Esc закрыть"}
            {locale === "en" && "Keys: 1-4 sections, M menu, Esc close"}
            {locale === "zh" && "快捷键：1-4 章节，M 菜单，Esc 关闭"}
            {locale === "he" && "מקשים: 1-4 סעיפים, M תפריט, Esc סגור"}
          </p>
        </div>
      </footer>
    </div>
  )
}
