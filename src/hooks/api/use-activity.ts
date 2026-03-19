"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchWithTimeout } from "@/lib/fetch-with-timeout"

interface UserActivity {
  id: string
  userId: string
  action: string
  topic?: string
  xpGained: number
  createdAt: string
}

interface ActivityResponse {
  success: boolean
  data?: UserActivity[]
  error?: string
}

interface LogActivityResponse {
  success: boolean
  data?: UserActivity
  error?: string
}

export function useActivity() {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user activities from API
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetchWithTimeout("/api/activity", {
        timeoutMs: 10000,
      })

      if (!response.ok) {
        if (response.status === 401) {
          console.log("User not authenticated, using mock data")
          return
        }
        throw new Error(`HTTP error! status: ${String(response.status)}`)
      }

      const result = (await response.json()) as ActivityResponse

      if (result.success && result.data) {
        setActivities(result.data)
      }
    } catch (err) {
      console.error("Failed to fetch activities:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [])

  // Log new activity
  const logActivity = useCallback(
    async (action: string, topic?: string, xpGained = 0): Promise<boolean> => {
      try {
        const response = await fetchWithTimeout("/api/activity", {
          timeoutMs: 10000,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action,
            topic,
            xpGained,
          }),
        })

        if (!response.ok) {
          if (response.status === 401) {
            console.log("Not authenticated - simulating activity log")
            // Optimistically update local state
            setActivities((prev) => [
              ...prev,
              {
                id: `temp_${String(Date.now())}`,
                userId: "anonymous",
                action,
                topic,
                xpGained,
                createdAt: new Date().toISOString(),
              },
            ])
            return true
          }
          throw new Error(`HTTP error! status: ${String(response.status)}`)
        }

        const result = (await response.json()) as LogActivityResponse

        if (result.success) {
          await fetchActivities()
          return true
        }

        return false
      } catch (err) {
        console.error("Failed to log activity:", err)
        return false
      }
    },
    [fetchActivities]
  )

  // Track common actions with XP rewards
  const trackLessonComplete = useCallback(
    async (topic: string): Promise<boolean> => {
      return await logActivity("lesson_completed", topic, 100)
    },
    [logActivity]
  )

  const trackQuizPass = useCallback(
    async (topic: string, score?: number): Promise<boolean> => {
      const xp = score && score >= 90 ? 150 : score && score >= 70 ? 100 : 50
      return await logActivity("quiz_passed", topic, xp)
    },
    [logActivity]
  )

  const trackVisualizationView = useCallback(
    async (topic: string): Promise<boolean> => {
      return await logActivity("visualization_viewed", topic, 10)
    },
    [logActivity]
  )

  const trackAchievementUnlock = useCallback(
    async (achievementId: string): Promise<boolean> => {
      return await logActivity("achievement_unlocked", achievementId, 500)
    },
    [logActivity]
  )

  useEffect(() => {
    void fetchActivities()
  }, [fetchActivities])

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
    logActivity,
    trackLessonComplete,
    trackQuizPass,
    trackVisualizationView,
    trackAchievementUnlock,
  }
}
