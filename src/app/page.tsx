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
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gray-950 bg-[radial-gradient(ellipse_at_top,rgba(88,28,135,0.15),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.1),transparent_50%)] text-white"
          : "bg-gray-50 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.08),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(59,130,246,0.05),transparent_50%)] text-gray-900"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Animated background particles */}
      {isDark && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="animate-pulse-glow absolute top-1/4 left-1/4 h-1 w-1 rounded-full bg-purple-500/30" />
          <div className="animate-pulse-glow absolute top-3/4 right-1/4 h-1 w-1 rounded-full bg-blue-500/30 delay-1000" />
          <div className="animate-pulse-glow absolute bottom-1/4 left-1/3 h-1 w-1 rounded-full bg-pink-500/30 delay-500" />
        </div>
      )}

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
        className={`relative overflow-hidden border-b transition-colors duration-300 ${
          isDark
            ? "border-white/10 bg-gray-950/50 backdrop-blur-xl"
            : "border-gray-200/80 bg-white/50 backdrop-blur-xl"
        }`}
      >
        {/* Animated gradient header */}
        <div
          className={`animate-gradient-shift absolute inset-0 opacity-50 ${
            isDark
              ? "bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20"
              : "bg-gradient-to-r from-purple-100/30 via-blue-100/30 to-purple-100/30"
          }`}
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 md:py-12">
          <HeaderControls
            locale={locale}
            theme={theme}
            onThemeChange={handleThemeChange}
            onMenuOpen={() => {
              setMenuOpen(true)
            }}
            isDark={isDark}
          />

          <div className="mt-6 text-center">
            <h1 className="animate-float mb-3 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-3xl font-bold text-transparent md:text-5xl lg:text-6xl">
              Quantum Horizon
            </h1>
            <p
              className={`mx-auto max-w-2xl text-sm md:text-base lg:text-lg ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Интерактивные визуализации законов физики
            </p>

            {/* Decorative divider */}
            <div className="mx-auto mt-6 flex items-center justify-center gap-2">
              <div
                className={`h-px w-16 ${isDark ? "bg-gradient-to-r from-transparent to-purple-500/50" : "bg-gradient-to-r from-transparent to-purple-400/30"}`}
              />
              <div className="flex gap-1">
                <span className="text-purple-500">⚛️</span>
                <span className="text-blue-500">🌌</span>
                <span className="text-pink-500">🔬</span>
              </div>
              <div
                className={`h-px w-16 ${isDark ? "bg-gradient-to-l from-transparent to-purple-500/50" : "bg-gradient-to-l from-transparent to-purple-400/30"}`}
              />
            </div>
          </div>
        </div>
      </header>

      <Navigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isDark={isDark}
      />

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="space-y-6">
          {activeSection === "quantum" && <QuantumSection isDark={isDark} />}
          {activeSection === "relativity" && <RelativitySection isDark={isDark} />}
          {activeSection === "cosmos" && <CosmosSection isDark={isDark} />}
          {activeSection === "thermodynamics" && <ThermodynamicsSection isDark={isDark} />}
          {activeSection === "advanced" && <AdvancedSection isDark={isDark} />}
        </div>
      </main>

      <footer
        className={`mt-8 border-t py-6 transition-colors duration-300 ${
          isDark ? "border-white/10 bg-gray-950/50" : "border-gray-200/80 bg-white/50"
        }`}
      >
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className={`text-sm ${isDark ? "text-gray-500" : "text-gray-600"}`}>
              © 2026 Quantum Horizon. Образовательный проект по физике
            </p>
            <p
              className={`flex items-center gap-2 text-xs ${
                isDark ? "text-gray-600" : "text-gray-500"
              }`}
            >
              <span className="rounded-md bg-purple-500/10 px-2 py-1 text-purple-400">⌨️</span>
              <span>
                {locale === "ru" && "1-5 разделы, M меню, Esc закрыть"}
                {locale === "en" && "1-5 sections, M menu, Esc close"}
                {locale === "zh" && "1-5 章节，M 菜单，Esc 关闭"}
                {locale === "he" && "1-5 סעיפים, M תפריט, Esc סגור"}
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
