"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
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

const PROGRESS_QUERY_KEY = ["userProgress"] as const

function calculateStatsFromProgress(progress: UserProgressData[]): UserStats {
  const totalCourses = progress.length
  const completedCourses = progress.filter((p) => p.completedCount >= 1).length
  const totalTimeSpent = progress.reduce((sum, p) => sum + p.completedCount * 15, 0) // ~15 min per topic

  // Mock streak calculation (real implementation would track daily activity)
  const currentStreak = Math.min(progress.length, 7)
  const bestStreak = Math.max(currentStreak, 14)

  // Calculate XP from achievements and progress
  const totalXP = completedCourses * 50 + Math.floor(totalTimeSpent / 10) * 10
  const level = Math.floor(totalXP / 500) + 1

  return {
    totalCourses,
    completedCourses,
    totalTimeSpent,
    currentStreak,
    bestStreak,
    totalXP,
    level,
  }
}

export function useUserProgress() {
  const queryClient = useQueryClient()

  // Fetch progress using React Query
  const {
    data: progress = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: PROGRESS_QUERY_KEY,
    queryFn: async () => {
      const response = await fetchWithTimeout("/api/visualizations/progress", {
        timeoutMs: 10000,
      })

      if (!response.ok) {
        if (response.status === 401) {
          return []
        }
        throw new Error(`HTTP error! status: ${String(response.status)}`)
      }

      const result = (await response.json()) as APIResponse
      return result.success && result.data ? result.data : []
    },
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: 2,
  })

  const error = queryError instanceof Error ? queryError.message : null

  // Calculate stats from progress data
  const stats: UserStats | null =
    progress.length === 0 ? null : calculateStatsFromProgress(progress)

  // Update progress using mutation
  const { mutateAsync: updateProgressMutation } = useMutation({
    mutationFn: async ({ topic, title }: { topic: string; title: string }) => {
      const response = await fetchWithTimeout("/api/visualizations/bookmarks", {
        timeoutMs: 10000,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, title } satisfies UpdateProgressBody),
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Optimistically update local state
          queryClient.setQueryData(PROGRESS_QUERY_KEY, (old: UserProgressData[] = []) => {
            const existing = old.find((p) => p.topic === topic)
            if (existing) {
              return old.map((p) =>
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
              ...old,
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
      return result.success || false
    },
    onSuccess: () => {
      // Invalidate and refetch progress
      void queryClient.invalidateQueries({ queryKey: PROGRESS_QUERY_KEY })
    },
  })

  const updateProgress = async (topic: string, title: string) => {
    return await updateProgressMutation({ topic, title })
  }

  return {
    progress,
    stats,
    loading,
    error,
    refetch,
    updateProgress,
  }
}
