"use client"

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState, useEffect, useCallback } from "react"

interface UserActivity {
  id: string
  userId: string
  action: string
  topic?: string
  xpGained: number
  createdAt: string
}

export function useActivity() {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user activities from API
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/activity")

      if (!response.ok) {
        if (response.status === 401) {
          console.log("User not authenticated, using mock data")
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.data) {
        setActivities(result.data as UserActivity[])
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
    async (action: string, topic?: string, xpGained = 0) => {
      try {
        const response = await fetch("/api/activity", {
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
                id: `temp_${Date.now()}`,
                userId: "anonymous",
                action,
                topic,
                xpGained,
                createdAt: new Date().toISOString(),
              },
            ])
            return true
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()

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
    async (topic: string) => {
      return await logActivity("lesson_completed", topic, 100)
    },
    [logActivity]
  )

  const trackQuizPass = useCallback(
    async (topic: string, score?: number) => {
      const xp = score && score >= 90 ? 150 : score && score >= 70 ? 100 : 50
      return await logActivity("quiz_passed", topic, xp)
    },
    [logActivity]
  )

  const trackVisualizationView = useCallback(
    async (topic: string) => {
      return await logActivity("visualization_viewed", topic, 10)
    },
    [logActivity]
  )

  const trackAchievementUnlock = useCallback(
    async (achievementId: string) => {
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
