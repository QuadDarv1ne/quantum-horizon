"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Keyboard, X, Search, Command } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DEFAULT_SHORTCUTS,
  getShortcutsByCategory,
  formatKeyName,
  getCategoryIcon,
  getCategoryName,
  type KeyboardShortcut,
} from "@/lib/keyboard-shortcuts"

interface KeyboardShortcutsDialogProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function KeyboardShortcutsDialog({
  isOpen: externalIsOpen,
  onOpenChange: externalOnOpenChange,
}: KeyboardShortcutsDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const isOpen = externalIsOpen ?? internalIsOpen
  const onOpenChange = externalOnOpenChange ?? setInternalIsOpen

  const filteredShortcuts = DEFAULT_SHORTCUTS.filter(
    (shortcut) =>
      shortcut.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shortcut.key.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const shortcutsByCategory = {
    navigation: getShortcutsByCategory("navigation"),
    playback: getShortcutsByCategory("playback"),
    settings: getShortcutsByCategory("settings"),
    general: getShortcutsByCategory("general"),
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          Горячие клавиши
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] max-w-3xl overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Горячие клавиши
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Поиск горячих клавиш..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Shortcuts by category */}
          {Object.entries(shortcutsByCategory).map(([category, shortcuts]) =>
            shortcuts.length > 0 ? (
              <div key={category} className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                  <span>{getCategoryIcon(category)}</span>
                  {getCategoryName(category)}
                </h3>
                <div className="grid gap-2">
                  {shortcuts.map((shortcut) => (
                    <ShortcutRow key={shortcut.key} shortcut={shortcut} />
                  ))}
                </div>
              </div>
            ) : null
          )}

          {/* Tips */}
          <div className="bg-muted mt-6 rounded-lg p-4">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <Command className="h-4 w-4" />
              Советы
            </h4>
            <ul className="text-muted-foreground space-y-1 text-sm">
              <li>• Горячие клавиши не работают когда фокус в поле ввода</li>
              <li>• Используйте Space для паузы/запуска анимации</li>
              <li>• Цифры 1-5 для быстрого переключения разделов</li>
              <li>• Нажмите H для показа этой справки</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ShortcutRowProps {
  shortcut: KeyboardShortcut
}

function ShortcutRow({ shortcut }: ShortcutRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card hover:bg-accent/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
    >
      <span className="text-sm">{shortcut.description}</span>
      <div className="flex items-center gap-1">
        {shortcut.modifier && (
          <Badge variant="secondary" className="text-xs">
            {shortcut.modifier === "ctrl" && "Ctrl"}
            {shortcut.modifier === "shift" && "Shift"}
            {shortcut.modifier === "alt" && "Alt"}
            {shortcut.modifier === "meta" && "⌘"}
          </Badge>
        )}
        <Badge className="font-mono text-xs">{formatKeyName(shortcut.key)}</Badge>
      </div>
    </motion.div>
  )
}
