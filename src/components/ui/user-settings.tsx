"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Settings,
  Moon,
  Sun,
  Monitor,
  Globe,
  Type,
  Volume2,
  Eye,
  Palette,
  Check,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "next-themes"
import { useLocale } from "next-intl"

const THEMES = [
  { value: "light", label: "Светлая", icon: Sun },
  { value: "dark", label: "Тёмная", icon: Moon },
  { value: "system", label: "Системная", icon: Monitor },
]

const FONTS = [
  { value: "normal", label: "Обычный" },
  { value: "large", label: "Крупный" },
  { value: "xl", label: "Очень крупный" },
]

export function UserSettings() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const locale = useLocale()

  const [settings, setSettings] = useState({
    fontSize: "normal",
    reduceMotion: false,
    showAnimations: true,
    soundEnabled: false,
    highContrast: false,
    autoSave: true,
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Настройки
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] max-w-4xl overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Настройки
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Theme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Тема
              </CardTitle>
              <CardDescription>Выберите цветовую схему интерфейса</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {THEMES.map((t) => {
                const Icon = t.icon
                return (
                  <Button
                    key={t.value}
                    variant={theme === t.value ? "default" : "outline"}
                    className="w-full justify-start gap-2"
                    onClick={() => setTheme(t.value)}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                    {theme === t.value && <Check className="ml-auto h-4 w-4" />}
                  </Button>
                )
              })}
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Язык
              </CardTitle>
              <CardDescription>Выберите язык интерфейса</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={locale}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="he">עברית</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Доступность
              </CardTitle>
              <CardDescription>Настройки для улучшения доступности</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Уменьшить анимацию</Label>
                  <p className="text-muted-foreground text-xs">Минимизировать движение элементов</p>
                </div>
                <Switch
                  checked={settings.reduceMotion}
                  onCheckedChange={(v) => setSettings({ ...settings, reduceMotion: v })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Высокий контраст</Label>
                  <p className="text-muted-foreground text-xs">Увеличить контрастность</p>
                </div>
                <Switch
                  checked={settings.highContrast}
                  onCheckedChange={(v) => setSettings({ ...settings, highContrast: v })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Display */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Отображение
              </CardTitle>
              <CardDescription>Настройки размера шрифта</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Размер шрифта</Label>
                <Select
                  value={settings.fontSize}
                  onValueChange={(v: string) => setSettings({ ...settings, fontSize: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONTS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Показывать анимации</Label>
                  <p className="text-muted-foreground text-xs">Анимировать переходы и эффекты</p>
                </div>
                <Switch
                  checked={settings.showAnimations}
                  onCheckedChange={(v) => setSettings({ ...settings, showAnimations: v })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Audio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                Звук
              </CardTitle>
              <CardDescription>Настройки звуковых эффектов</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Звуковые эффекты</Label>
                  <p className="text-muted-foreground text-xs">
                    Воспроизводить звуки при действиях
                  </p>
                </div>
                <Switch
                  checked={settings.soundEnabled}
                  onCheckedChange={(v) => setSettings({ ...settings, soundEnabled: v })}
                />
              </div>

              <div className="space-y-2">
                <Label>Громкость</Label>
                <Slider defaultValue={[50]} max={100} step={10} disabled={!settings.soundEnabled} />
              </div>
            </CardContent>
          </Card>

          {/* Data */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Данные и конфиденциальность</CardTitle>
              <CardDescription>Управление данными и настройками</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Автосохранение</Label>
                  <p className="text-muted-foreground text-xs">Сохранять настройки автоматически</p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(v) => setSettings({ ...settings, autoSave: v })}
                />
              </div>

              <div className="border-t pt-2">
                <Button variant="outline" size="sm" className="w-full">
                  Экспорт настроек
                </Button>
              </div>

              <Button variant="outline" size="sm" className="w-full">
                Импорт настроек
              </Button>

              <Button variant="destructive" size="sm" className="w-full">
                <X className="mr-2 h-4 w-4" />
                Сбросить все настройки
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
