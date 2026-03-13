"use client"

import { Button } from "@/components/ui/button"
import { usePageTranslations } from "@/hooks/use-page-translations"
import { LANGUAGES } from "@/lib/constants-ui"

interface HeaderControlsProps {
  locale: string
  theme: "dark" | "light"
  onThemeChange: (theme: "dark" | "light") => void
  onMenuOpen: () => void
  isDark: boolean
}

export function HeaderControls({
  locale,
  theme,
  onThemeChange,
  onMenuOpen,
  isDark,
}: HeaderControlsProps) {
  const { getTexts } = usePageTranslations()
  const texts = getTexts()

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
    const base = "px-2 text-xs"
    if (locale === lang) {
      return `${base} bg-purple-600`
    }
    return `${base} ${isDark ? "text-gray-400" : "text-gray-600"}`
  }

  const themeButtonClass = `text-xs ${isDark ? "border-gray-700 text-gray-300" : "border-gray-300 text-gray-700"}`

  return (
    <div className="mb-4 flex items-center justify-between">
      <div></div>
      <div className="flex gap-2">
        <div className="flex gap-1">
          {LANGUAGES.map((lang) => (
            <Button
              key={lang}
              onClick={() => {
                handleLanguageChange(lang)
              }}
              variant={locale === lang ? "default" : "ghost"}
              size="sm"
              className={getLangButtonClass(lang)}
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>
        <Button
          onClick={handleThemeToggle}
          variant="outline"
          size="sm"
          className={themeButtonClass}
        >
          {isDark ? "☀️" : "🌙"}
        </Button>
        <Button onClick={onMenuOpen} variant="outline" size="sm" className={themeButtonClass}>
          ☰ {texts.menu}
        </Button>
      </div>
    </div>
  )
}
