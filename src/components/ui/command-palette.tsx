"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import {
  Monitor,
  Moon,
  Sun,
  Globe,
  BookOpen,
  Atom,
  Telescope,
  Microscope,
  FlaskConical,
  Brain,
  ChevronRight,
  Keyboard,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { NAV_ITEMS, type Section, type Language } from "@/lib/constants-ui"

interface CommandPaletteProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
  theme: "dark" | "light"
  onThemeChange: (theme: "dark" | "light") => void
  language: string
  onLanguageChange: (lang: Language) => void
  isDark: boolean
}

type CommandType =
  | { type: "section"; id: Section; label: string }
  | { type: "theme"; value: "dark" | "light"; label: string }
  | { type: "language"; code: Language; label: string }
  | { type: "action"; id: string; label: string; shortcut?: string }

export function CommandPalette({
  activeSection,
  onSectionChange,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  isDark,
}: CommandPaletteProps) {
  const locale = useLocale()
  const [open, setOpen] = React.useState(false)

  // Keyboard shortcut to open
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const commands: CommandType[] = React.useMemo(
    () => [
      // Sections
      ...NAV_ITEMS.map((item) => ({
        type: "section" as const,
        id: item.id as Section,
        label: `📊 ${item.label}`,
      })),

      // Themes
      {
        type: "theme" as const,
        value: "dark" as const,
        label: "🌙 Dark Theme",
      },
      {
        type: "theme" as const,
        value: "light" as const,
        label: "☀️ Light Theme",
      },

      // Languages
      {
        type: "language" as const,
        code: "ru" as Language,
        label: "🇷🇺 Русский",
      },
      {
        type: "language" as const,
        code: "en" as Language,
        label: "🇬🇧 English",
      },
      {
        type: "language" as const,
        code: "zh" as Language,
        label: "🇨🇳 中文",
      },
      {
        type: "language" as const,
        code: "he" as Language,
        label: "🇮🇱 עברית",
      },

      // Actions
      {
        type: "action" as const,
        id: "fullscreen",
        label: "⛶ Fullscreen Mode",
        shortcut: "F11",
      },
      {
        type: "action" as const,
        id: "help",
        label: "❓ Help & Shortcuts",
        shortcut: "?",
      },
    ],
    []
  )

  const handleSelect = React.useCallback(
    (command: CommandType) => {
      switch (command.type) {
        case "section":
          onSectionChange(command.id)
          setOpen(false)
          break
        case "theme":
          onThemeChange(command.value)
          setOpen(false)
          break
        case "language":
          onLanguageChange(command.code)
          setOpen(false)
          break
        case "action":
          if (command.id === "fullscreen") {
            document.documentElement.requestFullscreen().catch(console.error)
          }
          setOpen(false)
          break
      }
    },
    [onSectionChange, onThemeChange, onLanguageChange]
  )

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "relative flex w-full items-center justify-between gap-2 rounded-md border",
          "bg-transparent px-3 py-2 text-left text-sm font-normal",
          "transition-all duration-200",
          isDark
            ? "border-white/10 bg-white/5 text-gray-400 hover:bg-white/10"
            : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
          "focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
        )}
        aria-label="Open command palette"
      >
        <span className="flex items-center gap-2">
          <Keyboard className="size-4" />
          Search...
        </span>
        <kbd
          className={cn(
            "pointer-events-none inline-flex h-5 items-center gap-1 rounded select-none",
            "border font-sans font-medium",
            isDark
              ? "border-white/10 bg-white/5 text-gray-400"
              : "border-gray-200 bg-gray-100 text-gray-500"
          )}
        >
          <span className="text-xs">Ctrl</span>K
        </kbd>
      </button>

      <CommandDialog
        title="Command Palette"
        description="Search for visualizations, settings, and actions"
        open={open}
        onOpenChange={setOpen}
        className={cn(
          isDark
            ? "[&_[cmdk-group-heading]]:text-gray-400 [&_[cmdk-item]]:text-gray-200"
            : "[&_[cmdk-group-heading]]:text-gray-600 [&_[cmdk-item]]:text-gray-800"
        )}
      >
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Quick Navigation */}
          <CommandGroup heading="📐 Navigation">
            {commands
              .filter((c) => c.type === "section")
              .map((command) => (
                <CommandItem
                  key={command.id}
                  onSelect={() => handleSelect(command)}
                  className={cn(activeSection === command.id && "bg-purple-500/20 text-purple-400")}
                >
                  <div className="flex items-center gap-2">
                    {command.id === "quantum" && <Atom className="size-4" />}
                    {command.id === "relativity" && <Telescope className="size-4" />}
                    {command.id === "cosmos" && <BookOpen className="size-4" />}
                    {command.id === "thermodynamics" && <FlaskConical className="size-4" />}
                    {command.id === "advanced" && <Brain className="size-4" />}
                    <span>{command.label}</span>
                  </div>
                  {activeSection === command.id && <ChevronRight className="ml-auto size-4" />}
                </CommandItem>
              ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Appearance */}
          <CommandGroup heading="🎨 Appearance">
            {commands
              .filter((c) => c.type === "theme")
              .map((command) => (
                <CommandItem
                  key={command.value}
                  onSelect={() => handleSelect(command)}
                  className={cn(theme === command.value && "bg-purple-500/20 text-purple-400")}
                >
                  <div className="flex items-center gap-2">
                    {command.value === "dark" && <Moon className="size-4" />}
                    {command.value === "light" && <Sun className="size-4" />}
                    <span>{command.label}</span>
                  </div>
                  {theme === command.value && <ChevronRight className="ml-auto size-4" />}
                </CommandItem>
              ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Language */}
          <CommandGroup heading="🌍 Language">
            {commands
              .filter((c) => c.type === "language")
              .map((command) => (
                <CommandItem
                  key={command.code}
                  onSelect={() => handleSelect(command)}
                  className={cn(language === command.code && "bg-purple-500/20 text-purple-400")}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="size-4" />
                    <span>{command.label}</span>
                  </div>
                  {language === command.code && <ChevronRight className="ml-auto size-4" />}
                </CommandItem>
              ))}
          </CommandGroup>

          <CommandSeparator />

          {/* Actions */}
          <CommandGroup heading="⚡ Actions">
            {commands
              .filter((c) => c.type === "action")
              .map((command) => (
                <CommandItem key={command.id} onSelect={() => handleSelect(command)}>
                  <div className="flex items-center gap-2">
                    <Monitor className="size-4" />
                    <span>{command.label}</span>
                  </div>
                  {command.shortcut && (
                    <kbd className="ml-auto text-xs opacity-50">{command.shortcut}</kbd>
                  )}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
