"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Command, X, ChevronRight, Globe, Moon, Sun, Atom } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MicroInteraction } from "./micro-interactions"
import { cn } from "@/lib/utils"
import { NAV_ITEMS, type Section } from "@/lib/constants-ui"

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  activeSection?: Section
  onSectionChange?: (section: Section) => void
  theme?: "dark" | "light"
  onThemeChange?: (theme: "dark" | "light") => void
  isDark?: boolean
}

interface CommandItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  action: () => void
  category: "navigation" | "settings" | "visualizations"
}

export function EnhancedCommandPalette({
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
  theme,
  onThemeChange,
  isDark,
}: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Generate command items
  const commandItems: CommandItem[] = [
    // Navigation
    ...NAV_ITEMS.map((item, index) => ({
      id: `nav-${item.id}`,
      label: item.label,
      icon:
        item.id === "quantum" ? <Atom className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />,
      shortcut: `${index + 1}`,
      category: "navigation" as const,
      action: () => {
        onSectionChange?.(item.id as Section)
        onClose()
      },
    })),

    // Settings
    {
      id: "toggle-theme",
      label: isDark ? "Switch to Light Theme" : "Switch to Dark Theme",
      icon: isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
      shortcut: "T",
      category: "settings" as const,
      action: () => {
        onThemeChange?.(isDark ? "light" : "dark")
        onClose()
      },
    },
    {
      id: "toggle-language",
      label: "Change Language",
      icon: <Globe className="h-4 w-4" />,
      shortcut: "L",
      category: "settings" as const,
      action: () => {
        // TODO: Implement language cycling
        console.log("Cycle language")
        onClose()
      },
    },

    // Visualizations
    {
      id: "viz-wave",
      label: "Wave Function",
      icon: <Atom className="h-4 w-4" />,
      category: "visualizations" as const,
      action: () => {
        onSectionChange?.("quantum")
        onClose()
      },
    },
    {
      id: "viz-time-dilation",
      label: "Time Dilation",
      icon: <Atom className="h-4 w-4" />,
      category: "visualizations" as const,
      action: () => {
        onSectionChange?.("relativity")
        onClose()
      },
    },
    {
      id: "viz-black-hole",
      label: "Black Hole",
      icon: <Atom className="h-4 w-4" />,
      category: "visualizations" as const,
      action: () => {
        onSectionChange?.("cosmos")
        onClose()
      },
    },
  ]

  // Filter items based on search
  const filteredItems = commandItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action()
        }
      } else if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex, onClose])

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command Palette */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2 }}
        className="fixed top-[20%] left-1/2 z-[9999] w-full max-w-2xl -translate-x-1/2 p-4"
      >
        <div className="bg-background overflow-hidden rounded-xl border-2 shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center border-b px-4 py-3">
            <Search className="text-muted-foreground mr-3 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredItems.length === 0 ? (
              <div className="text-muted-foreground py-8 text-center text-sm">
                <Command className="mx-auto mb-2 h-8 w-8 opacity-50" />
                No results found for "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-1">
                {/* Group by category */}
                {["navigation", "settings", "visualizations"].map((category) => {
                  const categoryItems = filteredItems.filter((item) => item.category === category)
                  if (categoryItems.length === 0) return null

                  return (
                    <div key={category} className="mb-3">
                      <div className="text-muted-foreground mb-2 px-2 text-xs font-semibold tracking-wider uppercase">
                        {category}
                      </div>
                      {categoryItems.map((item, index) => {
                        const globalIndex = filteredItems.indexOf(item)
                        const isSelected = globalIndex === selectedIndex

                        return (
                          <MicroInteraction
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <button
                              onClick={() => {
                                item.action()
                              }}
                              className={cn(
                                "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-accent hover:text-accent-foreground"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <span className="opacity-70">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                              </div>
                              {item.shortcut && (
                                <kbd className="bg-background rounded-md border px-2 py-1 font-mono text-xs">
                                  {item.shortcut}
                                </kbd>
                              )}
                            </button>
                          </MicroInteraction>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-muted-foreground border-t px-4 py-2 text-xs">
            <div className="flex items-center justify-between">
              <span>
                <kbd className="bg-background rounded-md border px-1.5 py-0.5">↑↓</kbd> to navigate
              </span>
              <span>
                <kbd className="bg-background rounded-md border px-1.5 py-0.5">Enter</kbd> to select
              </span>
              <span>
                <kbd className="bg-background rounded-md border px-1.5 py-0.5">Esc</kbd> to close
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/**
 * Hook to manage command palette state globally
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return { isOpen, open, close }
}
