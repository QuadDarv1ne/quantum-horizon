"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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

const ACTIVITY_QUERY_KEY = ["activity"] as const

export function useActivity() {
  const queryClient = useQueryClient()

  // Fetch activities using React Query
  const {
    data: activities = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ACTIVITY_QUERY_KEY,
    queryFn: async () => {
      const response = await fetchWithTimeout("/api/activity", {
        timeoutMs: 10000,
      })

      if (!response.ok) {
        if (response.status === 401) {
          return []
        }
        throw new Error(`HTTP error! status: ${String(response.status)}`)
      }

      const result = (await response.json()) as ActivityResponse
      return result.success && result.data ? result.data : []
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
  })

  const error = queryError instanceof Error ? queryError.message : null

  // Log activity using mutation
  const { mutateAsync: logActivityMutation } = useMutation({
    mutationFn: async ({
      action,
      topic,
      xpGained,
    }: {
      action: string
      topic?: string
      xpGained: number
    }) => {
      const response = await fetchWithTimeout("/api/activity", {
        timeoutMs: 10000,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, topic, xpGained }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Optimistically update local state
          queryClient.setQueryData(ACTIVITY_QUERY_KEY, (old: UserActivity[] = []) => [
            ...old,
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

      const result = (await response.json()) as ActivityResponse
      return result.success || false
    },
    onSuccess: () => {
      // Invalidate and refetch activities
      void queryClient.invalidateQueries({ queryKey: ACTIVITY_QUERY_KEY })
    },
  })

  // Track common actions with XP rewards
  const logActivity = async (action: string, topic?: string, xpGained = 0) => {
    return await logActivityMutation({ action, topic, xpGained })
  }

  const trackLessonComplete = async (topic: string) => {
    return await logActivityMutation({ action: "lesson_completed", topic, xpGained: 100 })
  }

  const trackQuizPass = async (topic: string, score?: number) => {
    const xp = score && score >= 90 ? 150 : score && score >= 70 ? 100 : 50
    return await logActivityMutation({ action: "quiz_passed", topic, xpGained: xp })
  }

  const trackVisualizationView = async (topic: string) => {
    return await logActivityMutation({ action: "visualization_viewed", topic, xpGained: 10 })
  }

  const trackAchievementUnlock = async (achievementId: string) => {
    return await logActivityMutation({
      action: "achievement_unlocked",
      topic: achievementId,
      xpGained: 500,
    })
  }

  return {
    activities,
    loading,
    error,
    refetch,
    logActivity,
    trackLessonComplete,
    trackQuizPass,
    trackVisualizationView,
    trackAchievementUnlock,
  }
}
