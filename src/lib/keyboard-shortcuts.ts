// Система горячих клавиш

import { useEffect, useCallback } from "react"

export interface KeyboardShortcut {
  key: string
  description: string
  action: () => void
  category: "navigation" | "playback" | "settings" | "general"
  modifier?: "ctrl" | "shift" | "alt" | "meta"
}

export const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  // Playback
  {
    key: "Space",
    description: "Старт/Пауза анимации",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "playback",
  },
  {
    key: "R",
    description: "Сброс настроек",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "playback",
  },
  {
    key: "+",
    description: "Увеличить скорость",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "playback",
  },
  {
    key: "-",
    description: "Уменьшить скорость",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "playback",
  },

  // Navigation
  {
    key: "1",
    description: "Квантовая механика",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "navigation",
  },
  {
    key: "2",
    description: "Теория относительности",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "navigation",
  },
  {
    key: "3",
    description: "Космология",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "navigation",
  },
  {
    key: "4",
    description: "Термодинамика",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "navigation",
  },
  {
    key: "5",
    description: "Продвинутые",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "navigation",
  },

  // Settings
  {
    key: "F",
    description: "Полноэкранный режим",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "settings",
  },
  {
    key: "T",
    description: "Сменить тему",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "settings",
  },
  {
    key: "L",
    description: "Сменить язык",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "settings",
  },

  // General
  {
    key: "H",
    description: "Показать справку",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "general",
  },
  {
    key: "?",
    description: "Показать горячие клавиши",
    action: () => {
      /* Реализуется в компоненте */
    },
    category: "general",
  },
]

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Игнорируем если фокус в input/textarea
      const target = event.target as HTMLElement
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return
      }

      const shortcut = shortcuts.find((s) => {
        const keyMatch = s.key.toLowerCase() === event.key.toLowerCase()
        const modifierMatch =
          !s.modifier ||
          (s.modifier === "ctrl" && event.ctrlKey) ||
          (s.modifier === "shift" && event.shiftKey) ||
          (s.modifier === "alt" && event.altKey) ||
          (s.modifier === "meta" && event.metaKey)

        return keyMatch && modifierMatch
      })

      if (shortcut) {
        event.preventDefault()
        shortcut.action()
      }
    },
    [shortcuts, enabled]
  )

  useEffect(() => {
    if (!enabled) return

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown, enabled])
}

export function getShortcutsByCategory(category: string): KeyboardShortcut[] {
  return DEFAULT_SHORTCUTS.filter((s) => s.category === category)
}

export function formatKeyName(key: string): string {
  const keyMap: Record<string, string> = {
    " ": "Space",
    "+": "+",
    "-": "-",
  }
  return keyMap[key] || key.toUpperCase()
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case "navigation":
      return "🧭"
    case "playback":
      return "▶️"
    case "settings":
      return "⚙️"
    case "general":
      return "ℹ️"
    default:
      return "🎯"
  }
}

export function getCategoryName(category: string): string {
  switch (category) {
    case "navigation":
      return "Навигация"
    case "playback":
      return "Воспроизведение"
    case "settings":
      return "Настройки"
    case "general":
      return "Общие"
    default:
      return category
  }
}
