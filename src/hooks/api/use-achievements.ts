"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchWithTimeout } from "@/lib/fetch-with-timeout"

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

const ACHIEVEMENTS_QUERY_KEY = ["achievements"] as const

export function useAchievements() {
  const queryClient = useQueryClient()

  // Fetch achievements using React Query
  const {
    data: achievements = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ACHIEVEMENTS_QUERY_KEY,
    queryFn: async () => {
      const response = await fetchWithTimeout("/api/achievements", {
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
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  })

  const error = queryError instanceof Error ? queryError.message : null

  // Unlock or update achievement using mutation
  const { mutateAsync: unlockAchievement } = useMutation({
    mutationFn: async ({
      achievementId,
      progress = 1,
      target = 1,
    }: {
      achievementId: string
      progress?: number
      target?: number
    }) => {
      const response = await fetchWithTimeout("/api/achievements", {
        timeoutMs: 10000,
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
          // Optimistically update local state
          queryClient.setQueryData(ACHIEVEMENTS_QUERY_KEY, (old: UserAchievement[] = []) => {
            const existing = old.find((a) => a.achievementId === achievementId)
            if (existing) {
              return old.map((a) =>
                a.achievementId === achievementId ? { ...a, progress: a.progress + progress } : a
              )
            }
            return [
              ...old,
              {
                id: `temp_${String(Date.now())}`,
                achievementId,
                progress,
                target,
                unlockedAt: new Date().toISOString(),
              },
            ]
          })
          return { newlyUnlocked: false }
        }
        throw new Error(`HTTP error! status: ${String(response.status)}`)
      }

      const result = (await response.json()) as APIResponse
      return { newlyUnlocked: result.newlyUnlocked ?? false }
    },
    onSuccess: () => {
      // Invalidate and refetch achievements
      void queryClient.invalidateQueries({ queryKey: ACHIEVEMENTS_QUERY_KEY })
    },
  })

  return {
    achievements,
    loading,
    error,
    refetch,
    unlockAchievement: async (achievementId: string, progress = 1, target = 1) => {
      const result = await unlockAchievement({ achievementId, progress, target })
      return result.newlyUnlocked
    },
  }
}
