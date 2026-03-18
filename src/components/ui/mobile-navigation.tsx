"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import { X, Atom, Telescope, BookOpen, FlaskConical, Brain, Moon, Sun, Globe } from "lucide-react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { NAV_ITEMS, type Section, type Language } from "@/lib/constants-ui"
import { cn } from "@/lib/utils"

interface MobileNavigationProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
  theme: "dark" | "light"
  onThemeChange: (theme: "dark" | "light") => void
  language: string
  onLanguageChange: (lang: Language) => void
  isDark: boolean
}

export function MobileNavigation({
  activeSection,
  onSectionChange,
  theme,
  onThemeChange,
  language,
  onLanguageChange,
  isDark,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false)
  const locale = useLocale()

  const handleSectionChange = (section: Section) => {
    onSectionChange(section)
    setOpen(false)
  }

  const toggleTheme = () => {
    onThemeChange(theme === "dark" ? "light" : "dark")
  }

  const cycleLanguage = () => {
    const languages: Language[] = ["ru", "en", "zh", "he"]
    const currentIndex = languages.indexOf(language as Language)
    const nextIndex = (currentIndex + 1) % languages.length
    onLanguageChange(languages[nextIndex])
  }

  const getSectionIcon = (section: Section) => {
    switch (section) {
      case "quantum":
        return <Atom className="size-5" />
      case "relativity":
        return <Telescope className="size-5" />
      case "cosmos":
        return <BookOpen className="size-5" />
      case "thermodynamics":
        return <FlaskConical className="size-5" />
      case "advanced":
        return <Brain className="size-5" />
      default:
        return <Atom className="size-5" />
    }
  }

  const getSectionLabel = (section: Section) => {
    const labels: Record<Section, string> = {
      quantum: locale === "ru" ? "Квантовая" : locale === "zh" ? "量子" : locale === "he" ? "קוונטית" : "Quantum",
      relativity: locale === "ru" ? "Относительность" : locale === "zh" ? "相对论" : locale === "he" ? "יחסות" : "Relativity",
      cosmos: locale === "ru" ? "Космология" : locale === "zh" ? "宇宙学" : locale === "he" ? "קוסמולוגיה" : "Cosmos",
      thermodynamics: locale === "ru" ? "Термодинамика" : locale === "zh" ? "热力学" : locale === "he" ? "תרמודינמיקה" : "Thermodynamics",
      advanced: locale === "ru" ? "Доп." : locale === "zh" ? "高级" : locale === "he" ? "מתקדם" : "Advanced",
    }
    return labels[section]
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open menu"
        >
          <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Quantum Horizon
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {/* Sections */}
          <div className="space-y-2 mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Sections</h3>
            {NAV_ITEMS.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  activeSection === item.id && "bg-secondary/80"
                )}
                onClick={() => handleSectionChange(item.id)}
              >
                <span className={cn(
                  "flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-blue-500/20",
                  activeSection === item.id ? "text-purple-400" : "text-muted-foreground"
                )}>
                  {getSectionIcon(item.id)}
                </span>
                <span className="flex-1 text-left">{getSectionLabel(item.id)}</span>
              </Button>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="space-y-2 mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Theme</h3>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={toggleTheme}
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-muted-foreground">
                {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </span>
              <span>{isDark ? "Light" : "Dark"}</span>
            </Button>
          </div>

          {/* Language Toggle */}
          <div className="space-y-2 mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground">Language</h3>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={cycleLanguage}
            >
              <span className="flex size-8 items-center justify-center rounded-md bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-muted-foreground">
                <Globe className="size-5" />
              </span>
              <span>{language.toUpperCase()}</span>
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
