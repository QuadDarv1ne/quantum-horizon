"use client"

import { useState } from "react"
import { useLocale } from "next-intl"
import {
  X,
  Atom,
  Telescope,
  BookOpen,
  FlaskConical,
  Brain,
  Moon,
  Sun,
  Globe,
  Sparkles,
} from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { NAV_ITEMS, LANGUAGES, type Section, type Language } from "@/lib/constants-ui"
import { cn } from "@/lib/utils"
import { MicroInteraction } from "@/components/ui/micro-interactions"

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
      quantum:
        locale === "ru"
          ? "Квантовая"
          : locale === "zh"
            ? "量子"
            : locale === "he"
              ? "קוונטית"
              : "Quantum",
      relativity:
        locale === "ru"
          ? "Относительность"
          : locale === "zh"
            ? "相对论"
            : locale === "he"
              ? "יחסות"
              : "Relativity",
      cosmos:
        locale === "ru"
          ? "Космология"
          : locale === "zh"
            ? "宇宙学"
            : locale === "he"
              ? "קוסמולוגיה"
              : "Cosmos",
      thermodynamics:
        locale === "ru"
          ? "Термодинамика"
          : locale === "zh"
            ? "热力学"
            : locale === "he"
              ? "תרמודינמיקה"
              : "Thermodynamics",
      advanced:
        locale === "ru"
          ? "Доп."
          : locale === "zh"
            ? "高级"
            : locale === "he"
              ? "מתקדם"
              : "Advanced",
    }
    return labels[section]
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <MicroInteraction whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
            <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </MicroInteraction>
      </DrawerTrigger>
      <DrawerContent className="from-background to-background/95 h-[85vh] bg-gradient-to-b backdrop-blur-xl">
        <DrawerHeader className="flex items-center justify-between border-b pb-4">
          <div className="space-y-1">
            <DrawerTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-lg font-bold text-transparent">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Quantum Horizon
            </DrawerTitle>
            <p className="text-muted-foreground text-xs">Меню навигации</p>
          </div>
          <DrawerClose asChild>
            <MicroInteraction whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon">
                <X className="size-5" />
              </Button>
            </MicroInteraction>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex-1 space-y-6 overflow-y-auto p-4">
          {/* Sections */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-muted-foreground text-sm font-semibold">Разделы</h3>
              <Badge variant="outline" className="text-xs">
                1-5 клавиши
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {NAV_ITEMS.map((item, index) => (
                <MicroInteraction
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 transition-all",
                      activeSection === item.id
                        ? "border-l-4 border-purple-500 bg-gradient-to-r from-purple-500/20 to-blue-500/20"
                        : "hover:bg-secondary/50"
                    )}
                    onClick={() => handleSectionChange(item.id)}
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20",
                        activeSection === item.id ? "text-purple-400" : "text-muted-foreground"
                      )}
                    >
                      {getSectionIcon(item.id)}
                    </span>
                    <div className="flex-1 text-left">
                      <span className="block text-sm font-medium">{getSectionLabel(item.id)}</span>
                      <span className="text-muted-foreground block text-xs opacity-70">
                        {item.label}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs opacity-50">
                      {index + 1}
                    </Badge>
                  </Button>
                </MicroInteraction>
              ))}
            </div>
          </div>

          {/* Theme Toggle */}
          <div className="bg-secondary/30 space-y-3 rounded-xl border p-4">
            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
              <Sun className="h-4 w-4" />
              Тема оформления
            </h3>
            <div className="flex gap-2">
              <MicroInteraction whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={isDark ? "default" : "outline"}
                  className="flex-1 gap-2"
                  onClick={() => onThemeChange("dark")}
                >
                  <Moon className="h-4 w-4" />
                  Тёмная
                </Button>
              </MicroInteraction>
              <MicroInteraction whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant={!isDark ? "default" : "outline"}
                  className="flex-1 gap-2"
                  onClick={() => onThemeChange("light")}
                >
                  <Sun className="h-4 w-4" />
                  Светлая
                </Button>
              </MicroInteraction>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="bg-secondary/30 space-y-3 rounded-xl border p-4">
            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-semibold">
              <Globe className="h-4 w-4" />
              Язык интерфейса
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {LANGUAGES.map((lang) => (
                <MicroInteraction key={lang} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant={language === lang ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "aspect-square p-0 text-sm font-bold",
                      language === lang
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        : "hover:bg-primary/10"
                    )}
                    onClick={() => onLanguageChange(lang)}
                  >
                    {lang.toUpperCase()}
                  </Button>
                </MicroInteraction>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="rounded-xl border bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-pink-500/10 p-4">
            <h3 className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-purple-500" />
              Подсказки
            </h3>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 rounded px-1.5 py-0.5 font-mono">1-5</span>
                <span>Переключение разделов</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 rounded px-1.5 py-0.5 font-mono">M</span>
                <span>Открыть меню</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 rounded px-1.5 py-0.5 font-mono">Ctrl+K</span>
                <span>Поиск</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="bg-primary/10 rounded px-1.5 py-0.5 font-mono">Esc</span>
                <span>Закрыть меню</span>
              </li>
            </ul>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
