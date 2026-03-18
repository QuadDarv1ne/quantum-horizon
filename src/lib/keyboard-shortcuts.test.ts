import { describe, it, expect } from "vitest"
import {
  DEFAULT_SHORTCUTS,
  getShortcutsByCategory,
  formatKeyName,
  getCategoryIcon,
  getCategoryName,
} from "./keyboard-shortcuts"

describe("keyboard-shortcuts", () => {
  describe("DEFAULT_SHORTCUTS", () => {
    it("содержит горячие клавиши для всех категорий", () => {
      const categories = new Set(DEFAULT_SHORTCUTS.map((s) => s.category))

      expect(categories.has("navigation")).toBe(true)
      expect(categories.has("playback")).toBe(true)
      expect(categories.has("settings")).toBe(true)
      expect(categories.has("general")).toBe(true)
    })

    it("содержит Space для старт/паузы", () => {
      const spaceShortcut = DEFAULT_SHORTCUTS.find((s) => s.key === "Space")

      expect(spaceShortcut).toBeDefined()
      expect(spaceShortcut?.category).toBe("playback")
    })

    it("содержит цифры 1-5 для навигации", () => {
      const numberShortcuts = DEFAULT_SHORTCUTS.filter((s) => /^[1-5]$/.test(s.key))

      expect(numberShortcuts.length).toBe(5)
      expect(numberShortcuts.every((s) => s.category === "navigation")).toBe(true)
    })
  })

  describe("getShortcutsByCategory", () => {
    it("возвращает shortcut'ы категории playback", () => {
      const shortcuts = getShortcutsByCategory("playback")

      expect(shortcuts.length).toBeGreaterThan(0)
      expect(shortcuts.every((s) => s.category === "playback")).toBe(true)
    })

    it("возвращает shortcut'ы категории navigation", () => {
      const shortcuts = getShortcutsByCategory("navigation")

      expect(shortcuts.length).toBeGreaterThan(0)
    })

    it("возвращает пустой массив для несуществующей категории", () => {
      const shortcuts = getShortcutsByCategory("nonexistent")

      expect(shortcuts).toEqual([])
    })
  })

  describe("formatKeyName", () => {
    it("форматирует Space", () => {
      expect(formatKeyName(" ")).toBe("Space")
    })

    it("возвращает верхний регистр для обычных клавиш", () => {
      expect(formatKeyName("h")).toBe("H")
      expect(formatKeyName("f")).toBe("F")
    })

    it("возвращает специальные символы", () => {
      expect(formatKeyName("+")).toBe("+")
      expect(formatKeyName("-")).toBe("-")
    })
  })

  describe("getCategoryIcon", () => {
    it("возвращает иконку для navigation", () => {
      expect(getCategoryIcon("navigation")).toBe("🧭")
    })

    it("возвращает иконку для playback", () => {
      expect(getCategoryIcon("playback")).toBe("▶️")
    })

    it("возвращает иконку для settings", () => {
      expect(getCategoryIcon("settings")).toBe("⚙️")
    })

    it("возвращает иконку для general", () => {
      expect(getCategoryIcon("general")).toBe("ℹ️")
    })
  })

  describe("getCategoryName", () => {
    it("возвращает название для navigation", () => {
      expect(getCategoryName("navigation")).toBe("Навигация")
    })

    it("возвращает название для playback", () => {
      expect(getCategoryName("playback")).toBe("Воспроизведение")
    })

    it("возвращает название для settings", () => {
      expect(getCategoryName("settings")).toBe("Настройки")
    })

    it("возвращает название для general", () => {
      expect(getCategoryName("general")).toBe("Общие")
    })
  })
})
