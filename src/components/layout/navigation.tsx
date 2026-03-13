"use client"

import { Button } from "@/components/ui/button"

interface NavigationProps {
  activeSection: string
  onSectionChange: (section: string) => void
  isDark: boolean
}

const navItems = [
  { id: "quantum", label: "quantum", color: "from-purple-600 to-blue-600" },
  { id: "relativity", label: "relativity", color: "from-yellow-600 to-orange-600" },
  { id: "cosmos", label: "cosmos", color: "from-red-600 to-purple-600" },
  { id: "advanced", label: "advanced", color: "from-pink-600 to-purple-600" },
]

export function Navigation({ activeSection, onSectionChange, isDark }: NavigationProps) {
  return (
    <nav
      className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        isDark ? "border-gray-800 bg-gray-950/90" : "border-gray-200 bg-white/90"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 py-2">
        <div className="flex flex-wrap justify-center gap-2">
          {navItems.map((tab, index) => (
            <Button
              key={tab.id}
              onClick={() => {
                onSectionChange(tab.id)
              }}
              variant={activeSection === tab.id ? "default" : "ghost"}
              title={`Shortcut: ${String(index + 1)}`}
              className={`text-xs md:text-sm ${
                activeSection === tab.id
                  ? `bg-gradient-to-r ${tab.color}`
                  : isDark
                    ? "text-gray-400"
                    : "text-gray-600"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>
    </nav>
  )
}
