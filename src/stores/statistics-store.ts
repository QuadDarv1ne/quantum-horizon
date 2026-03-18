import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { type UserStatistics, createEmptyStatistics, checkAchievements } from "@/lib/statistics"

interface StatisticsState {
  statistics: UserStatistics
  sessionStartTime: number | null
  currentVisualization: string | null

  // Actions
  startSession: () => void
  endSession: () => void
  trackVisualizationView: (visualizationId: string) => void
  trackQuizCompleted: (passed: boolean) => void
  trackPresetCreated: () => void
  trackPresetApplied: () => void
  trackComparison: () => void
  updateTimeSpent: (seconds: number) => void
  checkNewAchievements: () => string[]
  resetStatistics: () => void
}

const STATISTICS_STORAGE_KEY = "user-statistics"

export const useStatisticsStore = create<StatisticsState>()(
  persist(
    (set, get) => ({
      statistics: createEmptyStatistics(),
      sessionStartTime: null,
      currentVisualization: null,

      startSession: () => {
        const now = Date.now()
        const { statistics } = get()

        // Проверка серии дней
        const lastActivity = new Date(statistics.lastActivity)
        const today = new Date(now)
        const diffDays = Math.floor(
          (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
        )

        let newStreak = statistics.streakDays
        if (diffDays === 1) {
          newStreak += 1
        } else if (diffDays > 1) {
          newStreak = 1
        }

        set({
          sessionStartTime: now,
          statistics: {
            ...statistics,
            totalSessions: statistics.totalSessions + 1,
            streakDays: newStreak,
            lastActivity: now,
          },
        })
      },

      endSession: () => {
        const { sessionStartTime, statistics } = get()

        if (sessionStartTime) {
          const sessionDuration = Math.floor((Date.now() - sessionStartTime) / 1000)

          set({
            sessionStartTime: null,
            statistics: {
              ...statistics,
              totalTimeSpent: statistics.totalTimeSpent + sessionDuration,
            },
          })
        }
      },

      trackVisualizationView: (visualizationId: string) => {
        const { statistics } = get()
        const currentCount = statistics.visualizationsViewed[visualizationId] || 0

        set({
          currentVisualization: visualizationId,
          statistics: {
            ...statistics,
            visualizationsViewed: {
              ...statistics.visualizationsViewed,
              [visualizationId]: currentCount + 1,
            },
            lastActivity: Date.now(),
          },
        })
      },

      trackQuizCompleted: (passed: boolean) => {
        const { statistics } = get()

        set({
          statistics: {
            ...statistics,
            quizzesCompleted: statistics.quizzesCompleted + 1,
            quizzesPassed: passed ? statistics.quizzesPassed + 1 : statistics.quizzesPassed,
            lastActivity: Date.now(),
          },
        })
      },

      trackPresetCreated: () => {
        const { statistics } = get()

        set({
          statistics: {
            ...statistics,
            presetsCreated: statistics.presetsCreated + 1,
            lastActivity: Date.now(),
          },
        })
      },

      trackPresetApplied: () => {
        const { statistics } = get()

        set({
          statistics: {
            ...statistics,
            presetsApplied: statistics.presetsApplied + 1,
            lastActivity: Date.now(),
          },
        })
      },

      trackComparison: () => {
        const { statistics } = get()

        set({
          statistics: {
            ...statistics,
            comparisonsPerformed: statistics.comparisonsPerformed + 1,
            lastActivity: Date.now(),
          },
        })
      },

      updateTimeSpent: (seconds: number) => {
        const { statistics } = get()

        set({
          statistics: {
            ...statistics,
            totalTimeSpent: statistics.totalTimeSpent + seconds,
          },
        })
      },

      checkNewAchievements: () => {
        const { statistics } = get()
        const newAchievements = checkAchievements(statistics)

        if (newAchievements.length > 0) {
          const achievementIds = newAchievements.map((a) => a.id)

          set({
            statistics: {
              ...statistics,
              achievements: [...statistics.achievements, ...achievementIds],
            },
          })

          return achievementIds
        }

        return []
      },

      resetStatistics: () => {
        set({
          statistics: createEmptyStatistics(),
          sessionStartTime: null,
          currentVisualization: null,
        })
      },
    }),
    {
      name: STATISTICS_STORAGE_KEY,
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : undefined)),
      partialize: (state) => ({
        statistics: state.statistics,
      }),
    }
  )
)
