"use client"

import { Button } from "@/components/ui/button"
import { CommandPalette } from "@/components/ui/command-palette"
import { MobileNavigation } from "@/components/ui/mobile-navigation"
import { LANGUAGES, type Section, type Language } from "@/lib/constants-ui"

interface HeaderControlsProps {
  locale: string
  theme: "dark" | "light"
  onThemeChange: (theme: "dark" | "light") => void
  _onMenuOpen?: () => void
  isDark: boolean
  activeSection: Section
  onSectionChange: (section: Section) => void
  language: string
  onLanguageChange: (lang: Language) => void
}

export function HeaderControls({
  locale,
  theme,
  onThemeChange,
  _onMenuOpen,
  isDark,
  activeSection,
  onSectionChange,
  language,
  onLanguageChange,
}: HeaderControlsProps) {
  const handleLanguageChange = (lang: (typeof LANGUAGES)[number]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("NEXT_LOCALE", lang)
      window.location.reload()
    }
  }

  const handleThemeToggle = () => {
    onThemeChange(theme === "dark" ? "light" : "dark")
  }

  const getLangButtonClass = (lang: (typeof LANGUAGES)[number]) => {
    const base = "px-2.5 text-xs font-medium transition-all duration-300"
    if (locale === lang) {
      return `${base} bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md`
    }
    return `${base} ${
      isDark
        ? "text-gray-400 hover:text-white hover:bg-white/5"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
    }`
  }

  const iconButtonClass = `size-9 rounded-lg transition-all duration-300 ${
    isDark
      ? "border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
      : "border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
  }`

  return (
    <div className="flex items-center justify-between">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg">
          <span className="text-sm">⚛️</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Mobile Navigation Drawer */}
        <MobileNavigation
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          theme={theme}
          onThemeChange={onThemeChange}
          language={language}
          onLanguageChange={onLanguageChange}
          isDark={isDark}
        />

        {/* Command Palette */}
        <div className="hidden w-full max-w-xs md:block">
          <CommandPalette
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            theme={theme}
            onThemeChange={onThemeChange}
            language={language}
            onLanguageChange={onLanguageChange}
            isDark={isDark}
          />
        </div>

        {/* Mobile Command Palette Trigger */}
        <Button
          onClick={() => {
            const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true })
            document.dispatchEvent(event)
          }}
          variant="outline"
          size="icon"
          className={iconButtonClass}
          title="Search (Ctrl+K)"
        >
          <span className="text-base">🔍</span>
        </Button>
        {/* Language Switcher */}
        <div className="hidden gap-1 sm:flex">
          {LANGUAGES.map((lang) => (
            <Button
              key={lang}
              onClick={() => {
                handleLanguageChange(lang)
              }}
              variant="ghost"
              size="sm"
              className={getLangButtonClass(lang)}
              title={
                lang === "ru"
                  ? "Русский"
                  : lang === "en"
                    ? "English"
                    : lang === "zh"
                      ? "中文"
                      : "עברית"
              }
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Theme Toggle */}
        <Button
          onClick={handleThemeToggle}
          variant="outline"
          size="icon"
          className={iconButtonClass}
          title={isDark ? "Светлая тема" : "Тёмная тема"}
        >
          <span className="text-base">{isDark ? "☀️" : "🌙"}</span>
        </Button>
      </div>
    </div>
  )
}
