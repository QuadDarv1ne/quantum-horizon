"use client"

import { Button } from "@/components/ui/button"
import { usePageTranslations } from "@/hooks/use-page-translations"
import { NAV_ITEMS, LANGUAGES, type Section, type Language } from "@/lib/constants-ui"

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
  activeSection: Section
  onSectionSelect: (section: Section) => void
  locale: string
  theme: "dark" | "light"
  onThemeChange: (theme: "dark" | "light") => void
  onLanguageChange: (lang: Language) => void
  isDark: boolean
}

export function SideMenu({
  isOpen,
  onClose,
  activeSection,
  onSectionSelect,
  locale,
  theme,
  onThemeChange,
  onLanguageChange,
  isDark,
}: SideMenuProps) {
  const { getTexts, getVisualizationLabels, getFormulas } = usePageTranslations()
  const texts = getTexts()
  const vizLabels = getVisualizationLabels()
  const formulas = getFormulas()

  return (
    <>
      <div
        className={`fixed top-0 right-0 z-[60] h-full w-80 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${isDark ? "bg-gray-900/98" : "bg-white/98"} border-l shadow-2xl backdrop-blur-lg ${
          isDark ? "border-gray-800" : "border-gray-200"
        }`}
      >
        <div className="h-full overflow-y-auto p-6">
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 rounded-lg p-2 ${
              isDark ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            ✕
          </button>

          <div className="mt-8 space-y-6">
            <div>
              <h2 className={`mb-2 text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {texts.about}
              </h2>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Интерактивные визуализации физических явлений: от квантовой механики до космологии.
              </p>
            </div>

            <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <h3 className={`mb-3 font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {texts.sections}
              </h3>
              <div className="space-y-2">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSectionSelect(item.id)
                      onClose()
                    }}
                    className={`w-full rounded-lg px-3 py-2 text-left transition-colors ${
                      activeSection === item.id
                        ? "bg-purple-600/20 text-purple-400"
                        : isDark
                          ? "text-gray-300 hover:bg-gray-800"
                          : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <h3 className={`mb-3 font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {texts.visualizations}
              </h3>
              <div className={`space-y-1 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <div>🌊 {vizLabels.waveFunction}</div>
                <div>📐 {vizLabels.uncertainty}</div>
                <div>🚧 {vizLabels.tunneling}</div>
                <div>⏱️ {vizLabels.timeDilation}</div>
                <div>💥 E = mc²</div>
                <div>📊 {vizLabels.hrDiagram}</div>
                <div>💫 {vizLabels.neutronStar}</div>
                <div>🕳️ {vizLabels.blackHole}</div>
                <div>⚪ {vizLabels.whiteHole}</div>
                <div>🔬 {vizLabels.doubleSlit}</div>
                <div>🌀 {vizLabels.darkMatter}</div>
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <h3 className={`mb-3 font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {texts.formulas}
              </h3>
              <div
                className={`space-y-2 font-mono text-xs ${
                  isDark ? "text-cyan-400" : "text-cyan-600"
                }`}
              >
                {formulas.items.map((formula) => (
                  <div key={formula}>{formula}</div>
                ))}
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <h3 className={`mb-3 font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                {texts.settings}
              </h3>
              <div className="space-y-3">
                <div>
                  <label className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {texts.language}
                  </label>
                  <div className="mt-1 flex gap-1">
                    {LANGUAGES.map((lang) => (
                      <Button
                        key={lang}
                        onClick={() => {
                          onLanguageChange(lang)
                        }}
                        variant={locale === lang ? "default" : "ghost"}
                        size="sm"
                        className={`px-2 text-xs ${
                          locale === lang
                            ? "bg-purple-600"
                            : isDark
                              ? "text-gray-400"
                              : "text-gray-600"
                        }`}
                      >
                        {lang.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {texts.theme}
                  </label>
                  <div className="mt-1 flex gap-2">
                    <Button
                      onClick={() => {
                        onThemeChange("dark")
                      }}
                      variant={theme === "dark" ? "default" : "ghost"}
                      size="sm"
                      className={`text-xs ${theme === "dark" ? "bg-gray-700" : ""}`}
                    >
                      🌙 Dark
                    </Button>
                    <Button
                      onClick={() => {
                        onThemeChange("light")
                      }}
                      variant={theme === "light" ? "default" : "ghost"}
                      size="sm"
                      className={`text-xs ${theme === "light" ? "bg-gray-200 text-gray-900" : ""}`}
                    >
                      ☀️ Light
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className={`border-t pt-4 ${isDark ? "border-gray-800" : "border-gray-200"}`}>
              <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                {texts.footer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      )}
    </>
  )
}
