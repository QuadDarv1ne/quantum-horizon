import { describe, it, expect } from "vitest"
import {
  createEmptyStatistics,
  checkAchievements,
  getAchievementById,
  getAchievementsByCategory,
  getAchievementsByRarity,
  formatTimeSpent,
  getRarityColor,
  ACHIEVEMENTS,
} from "./statistics"

describe("statistics", () => {
  describe("createEmptyStatistics", () => {
    it("создаёт пустую статистику", () => {
      const stats = createEmptyStatistics()

      expect(stats.totalTimeSpent).toBe(0)
      expect(stats.quizzesCompleted).toBe(0)
      expect(stats.achievements).toEqual([])
      expect(stats.streakDays).toBe(0)
    })
  })

  describe("formatTimeSpent", () => {
    it("форматирует секунды в минуты", () => {
      expect(formatTimeSpent(120)).toBe("2м")
    })

    it("форматирует секунды в часы и минуты", () => {
      expect(formatTimeSpent(3660)).toBe("1ч 1м")
    })

    it("форматирует несколько часов", () => {
      expect(formatTimeSpent(7200)).toBe("2ч 0м")
    })
  })

  describe("getRarityColor", () => {
    it("возвращает правильный цвет для common", () => {
      expect(getRarityColor("common")).toBe("text-gray-500")
    })

    it("возвращает правильный цвет для legendary", () => {
      expect(getRarityColor("legendary")).toBe("text-yellow-500")
    })
  })

  describe("getAchievementById", () => {
    it("находит достижение по id", () => {
      const achievement = getAchievementById("first-quiz")

      expect(achievement).toBeDefined()
      expect(achievement?.name).toBe("Первый тест")
    })

    it("возвращает undefined для несуществующего id", () => {
      const achievement = getAchievementById("nonexistent")

      expect(achievement).toBeUndefined()
    })
  })

  describe("getAchievementsByCategory", () => {
    it("возвращает достижения категории learning", () => {
      const achievements = getAchievementsByCategory("learning")

      expect(achievements.length).toBeGreaterThan(0)
      expect(achievements.every((a) => a.category === "learning")).toBe(true)
    })

    it("возвращает достижения категории dedication", () => {
      const achievements = getAchievementsByCategory("dedication")

      expect(achievements.length).toBeGreaterThan(0)
    })
  })

  describe("getAchievementsByRarity", () => {
    it("возвращает достижения rarity common", () => {
      const achievements = getAchievementsByRarity("common")

      expect(achievements.length).toBeGreaterThan(0)
      expect(achievements.every((a) => a.rarity === "common")).toBe(true)
    })

    it("возвращает достижения rarity legendary", () => {
      const achievements = getAchievementsByRarity("legendary")

      expect(achievements.length).toBeGreaterThan(0)
    })
  })

  describe("checkAchievements", () => {
    it("не находит новых достижений для пустой статистики", () => {
      const stats = createEmptyStatistics()
      const newAchievements = checkAchievements(stats)

      expect(newAchievements.length).toBe(0)
    })

    it("находит достижение first-quiz", () => {
      const stats = createEmptyStatistics()
      stats.quizzesCompleted = 1

      const newAchievements = checkAchievements(stats)

      expect(newAchievements.some((a) => a.id === "first-quiz")).toBe(true)
    })

    it("находит достижение first-visualization", () => {
      const stats = createEmptyStatistics()
      stats.visualizationsViewed = { waveFunction: 1 }

      const newAchievements = checkAchievements(stats)

      expect(newAchievements.some((a) => a.id === "first-visualization")).toBe(true)
    })

    it("находит достижение first-session", () => {
      const stats = createEmptyStatistics()
      stats.totalSessions = 1

      const newAchievements = checkAchievements(stats)

      expect(newAchievements.some((a) => a.id === "first-session")).toBe(true)
    })
  })

  describe("ACHIEVEMENTS", () => {
    it("содержит все категории", () => {
      const categories = new Set(ACHIEVEMENTS.map((a) => a.category))

      expect(categories.has("learning")).toBe(true)
      expect(categories.has("exploration")).toBe(true)
      expect(categories.has("mastery")).toBe(true)
      expect(categories.has("dedication")).toBe(true)
    })

    it("содержит все уровни редкости", () => {
      const rarities = new Set(ACHIEVEMENTS.map((a) => a.rarity))

      expect(rarities.has("common")).toBe(true)
      expect(rarities.has("uncommon")).toBe(true)
      expect(rarities.has("rare")).toBe(true)
      expect(rarities.has("epic")).toBe(true)
      expect(rarities.has("legendary")).toBe(true)
    })

    it("все достижения имеют уникальные id", () => {
      const ids = ACHIEVEMENTS.map((a) => a.id)
      const uniqueIds = new Set(ids)

      expect(ids.length).toBe(uniqueIds.size)
    })
  })
})
