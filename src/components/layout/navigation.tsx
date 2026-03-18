"use client"

import { Button } from "@/components/ui/button"
import { NAV_ITEMS, type Section } from "@/lib/constants-ui"

interface NavigationProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
  isDark: boolean
}

export function Navigation({ activeSection, onSectionChange, isDark }: NavigationProps) {
  const handleClick = (section: Section) => {
    onSectionChange(section)
  }

  const getButtonClass = (tab: (typeof NAV_ITEMS)[number]) => {
    const base = "text-xs md:text-sm font-medium transition-all duration-300"
    if (activeSection === tab.id) {
      return `${base} bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-purple-500/25 scale-105`
    }
    return `${base} ${
      isDark
        ? "text-gray-400 hover:text-white hover:bg-white/5"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
    }`
  }

  return (
    <nav
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300 ${
        isDark ? "border-white/10 bg-gray-950/80" : "border-gray-200/80 bg-white/80"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div
          className="flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Visualization sections"
        >
          {NAV_ITEMS.map((tab, index) => (
            <Button
              key={tab.id}
              onClick={() => {
                handleClick(tab.id)
              }}
              variant={activeSection === tab.id ? "default" : "ghost"}
              title={`Shortcut: ${String(index + 1)}`}
              className={getButtonClass(tab)}
              role="tab"
              aria-selected={activeSection === tab.id}
              aria-controls={`${tab.id}-panel`}
              id={`${tab.id}-tab`}
              aria-keyshortcuts={String(index + 1)}
            >
              <span className="flex items-center gap-2">
                {tab.id === "quantum" && "⚛️"}
                {tab.id === "relativity" && "🚀"}
                {tab.id === "cosmos" && "🌌"}
                {tab.id === "thermodynamics" && "🌡️"}
                {tab.id === "advanced" && "🔬"}
                {tab.label}
              </span>
            </Button>
          ))}
        </div>

        {/* Active section indicator */}
        <div className="mt-2 text-center">
          <div
            className={`inline-flex items-center gap-2 text-xs ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          >
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-purple-500/50" />
            <span>
              {activeSection === "quantum" && "Квантовая механика"}
              {activeSection === "relativity" && "Теория относительности"}
              {activeSection === "cosmos" && "Космология"}
              {activeSection === "thermodynamics" && "Термодинамика"}
              {activeSection === "advanced" && "Продвинутые темы"}
            </span>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>
        </div>
      </div>
    </nav>
  )
}
