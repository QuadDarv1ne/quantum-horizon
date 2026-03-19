"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchWithTimeout } from "@/lib/fetch-with-timeout"

interface UserProgressData {
  id: string
  topic: string
  completedCount: number
  lastCompleted: string
}

interface UserStats {
  totalCourses: number
  completedCourses: number
  totalTimeSpent: number // minutes
  currentStreak: number
  bestStreak: number
  totalXP: number
  level: number
}

interface APIResponse {
  success: boolean
  data?: UserProgressData[]
}

interface UpdateProgressBody {
  topic: string
  title: string
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgressData[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user progress from API
  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetchWithTimeout("/api/visualizations/progress", {
        timeoutMs: 10000,
      })

      if (!response.ok) {
        if (response.status === 401) {
          return
        }
        throw new Error(`HTTP error! status: ${String(response.status)}`)
      }

      const result = (await response.json()) as APIResponse

      if (result.success && result.data) {
        setProgress(result.data)
      }
    } catch (err) {
      console.error("Failed to fetch progress:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  // Update progress for a topic
  const updateProgress = useCallback(
    async (topic: string, title: string): Promise<boolean> => {
      try {
        const response = await fetchWithTimeout("/api/visualizations/bookmarks", {
          timeoutMs: 10000,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            title,
          } satisfies UpdateProgressBody),
        })

        if (!response.ok) {
          if (response.status === 401) {
            // Optimistically update local state
            setProgress((prev) => {
              const existing = prev.find((p) => p.topic === topic)
              if (existing) {
                return prev.map((p) =>
                  p.topic === topic
                    ? {
                        ...p,
                        completedCount: p.completedCount + 1,
                        lastCompleted: new Date().toISOString(),
                      }
                    : p
                )
              }
              return [
                ...prev,
                {
                  id: `temp_${String(Date.now())}`,
                  topic,
                  completedCount: 1,
                  lastCompleted: new Date().toISOString(),
                },
              ]
            })
            return true
          }
          throw new Error(`HTTP error! status: ${String(response.status)}`)
        }

        const result = (await response.json()) as APIResponse

        if (result.success) {
          await fetchProgress()
          return true
        }

        return false
      } catch (err) {
        console.error("Failed to update progress:", err)
        return false
      }
    },
    [fetchProgress]
  )

  // Calculate stats from progress data
  const calculateStats = useCallback(() => {
    setProgress((currentProgress) => {
      if (currentProgress.length === 0) {
        setStats(null)
        return currentProgress
      }

      const totalCourses = currentProgress.length
      const completedCourses = currentProgress.filter((p) => p.completedCount >= 1).length
      const totalTimeSpent = currentProgress.reduce((sum, p) => sum + p.completedCount * 15, 0) // ~15 min per topic

      // Mock streak calculation (real implementation would track daily activity)
      const currentStreak = Math.min(currentProgress.length, 7)
      const bestStreak = Math.max(currentStreak, 14)

      // Calculate XP from achievements and progress
      const totalXP = completedCourses * 50 + Math.floor(totalTimeSpent / 10) * 10
      const level = Math.floor(totalXP / 500) + 1

      setStats({
        totalCourses,
        completedCourses,
        totalTimeSpent,
        currentStreak,
        bestStreak,
        totalXP,
        level,
      })

      return currentProgress
    })
  }, [])

  useEffect(() => {
    void fetchProgress()
  }, [fetchProgress])

  useEffect(() => {
    calculateStats()
  }, [calculateStats])

  return {
    progress,
    stats,
    loading,
    error,
    refetch: fetchProgress,
    updateProgress,
  }
}
