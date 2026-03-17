"use client"

import { useState, useEffect } from "react"
import { useLocale } from "next-intl"
import { SideMenu } from "@/components/layout/side-menu"
import { HeaderControls } from "@/components/layout/header-controls"
import { Navigation } from "@/components/layout/navigation"
import {
  QuantumSection,
  RelativitySection,
  CosmosSection,
  ThermodynamicsSection,
  AdvancedSection,
} from "@/components/sections"
import { SECTIONS, type Section, type Language } from "@/lib/constants-ui"
import type { Theme } from "@/types"

const STORAGE_KEYS = {
  THEME: "physics-theme",
  LOCALE: "NEXT_LOCALE",
} as const

export default function Home() {
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

      if (e.key >= "1" && e.key <= "5") {
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
              Quantum Horizon
            </h1>
            <p className={`text-sm md:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Интерактивные визуализации законов физики
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
        {activeSection === "quantum" && <QuantumSection isDark={isDark} />}
        {activeSection === "relativity" && <RelativitySection isDark={isDark} />}
        {activeSection === "cosmos" && <CosmosSection isDark={isDark} />}
        {activeSection === "thermodynamics" && <ThermodynamicsSection isDark={isDark} />}
        {activeSection === "advanced" && <AdvancedSection isDark={isDark} />}
      </main>

      <footer className={`mt-6 border-t py-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
        <div className="mx-auto max-w-6xl px-4 text-center text-xs">
          <p className={isDark ? "text-gray-500" : "text-gray-600"}>
            © 2026 Quantum Horizon. Образовательный проект по физике
          </p>
          <p className={`mt-1 ${isDark ? "text-gray-600" : "text-gray-500"}`}>
            ⌨️ {locale === "ru" && "Клавиши: 1-5 разделы, M меню, Esc закрыть"}
            {locale === "en" && "Keys: 1-5 sections, M menu, Esc close"}
            {locale === "zh" && "快捷键：1-5 章节，M 菜单，Esc 关闭"}
            {locale === "he" && "מקשים: 1-5 סעיפים, M תפריט, Esc סגור"}
          </p>
        </div>
      </footer>
    </div>
  )
}
