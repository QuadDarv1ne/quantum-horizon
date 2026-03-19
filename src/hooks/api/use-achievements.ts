"use client"

import { useState, useEffect, useCallback } from "react"

interface UserAchievement {
  id: string
  achievementId: string
  progress: number
  target: number
  unlockedAt: string
}

interface APIResponse {
  success: boolean
  data?: UserAchievement[]
  newlyUnlocked?: boolean
}

interface UnlockAchievementBody {
  achievementId: string
  progress: number
  target: number
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<UserAchievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch achievements from API
  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/achievements")

      if (!response.ok) {
        if (response.status === 401) {
          // User not authenticated - use mock data
          console.log("User not authenticated, using mock data")
          return
        }
        throw new Error(`HTTP error! status: ${String(response.status)}`)
      }

      const result = (await response.json()) as APIResponse

      if (result.success && result.data) {
        setAchievements(result.data)
      }
    } catch (err) {
      console.error("Failed to fetch achievements:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  // Unlock or update achievement
  const unlockAchievement = useCallback(
    async (achievementId: string, progress = 1, target = 1): Promise<boolean> => {
      try {
        const response = await fetch("/api/achievements", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            achievementId,
            progress,
            target,
          } satisfies UnlockAchievementBody),
        })

        if (!response.ok) {
          if (response.status === 401) {
            console.log("Not authenticated - simulating achievement unlock")
            // Optimistically update local state
            setAchievements((prev) => {
              const existing = prev.find((a) => a.achievementId === achievementId)
              if (existing) {
                return prev.map((a) =>
                  a.achievementId === achievementId ? { ...a, progress: a.progress + progress } : a
                )
              }
              return [
                ...prev,
                {
                  id: `temp_${String(Date.now())}`,
                  achievementId,
                  progress,
                  target,
                  unlockedAt: new Date().toISOString(),
                },
              ]
            })
            return true
          }
          throw new Error(`HTTP error! status: ${String(response.status)}`)
        }

        const result = (await response.json()) as APIResponse

        if (result.success) {
          // Refresh achievements list
          await fetchAchievements()
          return result.newlyUnlocked ?? false
        }

        return false
      } catch (err) {
        console.error("Failed to unlock achievement:", err)
        return false
      }
    },
    [fetchAchievements]
  )

  useEffect(() => {
    void fetchAchievements()
  }, [fetchAchievements])

  return {
    achievements,
    loading,
    error,
    refetch: fetchAchievements,
    unlockAchievement,
  }
}
