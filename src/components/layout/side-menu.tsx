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

  const handleSectionClick = (section: Section) => {
    onSectionSelect(section)
    onClose()
  }

  const handleLanguageClick = (lang: Language) => {
    onLanguageChange(lang)
  }

  return (
    <>
      <div
        className={`fixed top-0 right-0 z-[60] h-full w-80 transform overflow-hidden transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } ${
          isDark
            ? "bg-gradient-to-b from-gray-900 via-gray-950 to-black"
            : "bg-gradient-to-b from-white via-gray-50 to-white"
        } border-l shadow-2xl backdrop-blur-xl ${
          isDark ? "border-white/10" : "border-gray-200/80"
        }`}
      >
        {/* Header with gradient */}
        <div
          className={`relative h-24 overflow-hidden ${
            isDark
              ? "bg-gradient-to-r from-purple-900/50 to-blue-900/50"
              : "bg-gradient-to-r from-purple-100 to-blue-100"
          }`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="text-2xl">⚛️</span>
                <span
                  className={`bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-xl font-bold text-transparent`}
                >
                  Quantum Horizon
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-[calc(100%-6rem)] overflow-y-auto p-5">
          <button
            onClick={onClose}
            className={`absolute top-3 right-3 rounded-lg p-2 transition-all duration-300 ${
              isDark
                ? "text-gray-400 hover:bg-white/10 hover:text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="mt-4 space-y-6">
            {/* About Section */}
            <div className={`rounded-xl p-4 ${isDark ? "bg-white/5" : "bg-gray-100/50"}`}>
              <h2
                className={`mb-2 flex items-center gap-2 text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <span>📖</span> {texts.about}
              </h2>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Интерактивные визуализации физических явлений: от квантовой механики до космологии.
              </p>
            </div>

            {/* Navigation Sections */}
            <div>
              <h3
                className={`mb-3 flex items-center gap-2 text-sm font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <span>🧭</span> {texts.sections}
              </h3>
              <div className="space-y-1.5">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleSectionClick(item.id)
                    }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-300 ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-400 shadow-inner"
                        : isDark
                          ? "text-gray-300 hover:bg-white/5 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100/50 hover:text-gray-900"
                    }`}
                  >
                    <span className="text-lg">
                      {item.id === "quantum" && "⚛️"}
                      {item.id === "relativity" && "🚀"}
                      {item.id === "cosmos" && "🌌"}
                      {item.id === "thermodynamics" && "🌡️"}
                      {item.id === "advanced" && "🔬"}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>
                    {activeSection === item.id && (
                      <span className="ml-auto text-purple-400">●</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Visualizations */}
            <div className={`rounded-xl p-4 ${isDark ? "bg-white/5" : "bg-gray-100/50"}`}>
              <h3
                className={`mb-3 flex items-center gap-2 text-sm font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <span>✨</span> {texts.visualizations}
              </h3>
              <div className={`space-y-1.5 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <div className="flex items-center gap-2">
                  <span>🌊</span> {vizLabels.waveFunction}
                </div>
                <div className="flex items-center gap-2">
                  <span>📐</span> {vizLabels.uncertainty}
                </div>
                <div className="flex items-center gap-2">
                  <span>🚧</span> {vizLabels.tunneling}
                </div>
                <div className="flex items-center gap-2">
                  <span>⏱️</span> {vizLabels.timeDilation}
                </div>
                <div className="flex items-center gap-2">
                  <span>💥</span> E = mc²
                </div>
                <div className="flex items-center gap-2">
                  <span>📊</span> {vizLabels.hrDiagram}
                </div>
                <div className="flex items-center gap-2">
                  <span>💫</span> {vizLabels.neutronStar}
                </div>
                <div className="flex items-center gap-2">
                  <span>🕳️</span> {vizLabels.blackHole}
                </div>
                <div className="flex items-center gap-2">
                  <span>⚪</span> {vizLabels.whiteHole}
                </div>
                <div className="flex items-center gap-2">
                  <span>🔬</span> {vizLabels.doubleSlit}
                </div>
                <div className="flex items-center gap-2">
                  <span>🌀</span> {vizLabels.darkMatter}
                </div>
              </div>
            </div>

            {/* Formulas */}
            <div className={`rounded-xl p-4 ${isDark ? "bg-white/5" : "bg-gray-100/50"}`}>
              <h3
                className={`mb-3 flex items-center gap-2 text-sm font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <span>📐</span> {texts.formulas}
              </h3>
              <div
                className={`space-y-2 font-mono text-xs ${
                  isDark ? "text-cyan-400" : "text-cyan-600"
                }`}
              >
                {formulas.items.map((formula) => (
                  <div
                    key={formula}
                    className={`rounded px-2 py-1.5 ${
                      isDark ? "bg-cyan-500/10" : "bg-cyan-100/50"
                    }`}
                  >
                    {formula}
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className={`rounded-xl p-4 ${isDark ? "bg-white/5" : "bg-gray-100/50"}`}>
              <h3
                className={`mb-3 flex items-center gap-2 text-sm font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                <span>⚙️</span> {texts.settings}
              </h3>
              <div className="space-y-4">
                {/* Language */}
                <div>
                  <label
                    className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {texts.language}
                  </label>
                  <div className="mt-2 flex gap-1.5">
                    {LANGUAGES.map((lang) => (
                      <Button
                        key={lang}
                        onClick={() => {
                          handleLanguageClick(lang)
                        }}
                        variant={locale === lang ? "default" : "ghost"}
                        size="sm"
                        className={`transition-all duration-300 ${
                          locale === lang
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md"
                            : isDark
                              ? "text-gray-400 hover:text-white"
                              : "text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {lang.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Theme */}
                <div>
                  <label
                    className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {texts.theme}
                  </label>
                  <div className="mt-2 flex gap-2">
                    <Button
                      onClick={() => {
                        onThemeChange("dark")
                      }}
                      variant={theme === "dark" ? "default" : "ghost"}
                      size="sm"
                      className={`transition-all duration-300 ${
                        theme === "dark"
                          ? "bg-gradient-to-r from-purple-900 to-blue-900 text-white"
                          : isDark
                            ? "text-gray-400"
                            : "text-gray-600"
                      }`}
                    >
                      🌙 Dark
                    </Button>
                    <Button
                      onClick={() => {
                        onThemeChange("light")
                      }}
                      variant={theme === "light" ? "default" : "ghost"}
                      size="sm"
                      className={`transition-all duration-300 ${
                        theme === "light"
                          ? "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900"
                          : isDark
                            ? "text-gray-400"
                            : "text-gray-600"
                      }`}
                    >
                      ☀️ Light
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`rounded-xl border-t pt-4 ${
                isDark ? "border-white/10" : "border-gray-200/50"
              }`}
            >
              <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
                {texts.footer}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          isOpen
            ? "cursor-pointer bg-black/60 backdrop-blur-sm"
            : "pointer-events-none bg-transparent"
        }`}
        onClick={onClose}
      />
    </>
  )
}
