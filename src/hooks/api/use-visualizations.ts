/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/**
 * React Query hooks для API визуализаций
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { UserProgress, Bookmark } from "@prisma/client"

// ==================== TYPES ====================

interface ProgressData {
  topic: string
  completedCount?: number
}

interface BookmarkData {
  topic: string
  title: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// ==================== PROGRESS HOOKS ====================

/**
 * Хук для получения прогресса пользователя
 */
export function useUserProgress() {
  return useQuery<ApiResponse<UserProgress[]>>({
    queryKey: ["user", "progress"],
    queryFn: async () => {
      const response = await fetch("/api/visualizations/progress")
      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: "Unauthorized" }
        }
        throw new Error("Failed to fetch progress")
      }
      return response.json()
    },
    retry: false,
  })
}

/**
 * Хук для обновления прогресса
 */
export function useUpdateProgress() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ProgressData) => {
      const response = await fetch("/api/visualizations/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = (await response.json()) as { error?: string }
        throw new Error(error.error ?? "Failed to update progress")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "progress"] })
    },
  })
}

/**
 * Хук для отслеживания прогресса конкретной визуализации
 */
export function useVisualizationProgress(topic: string) {
  const { data, isLoading, error } = useUserProgress()

  const progress = data?.data?.find((p) => p.topic === topic)

  return {
    progress,
    isLoading,
    error,
    completedCount: progress?.completedCount ?? 0,
  }
}

// ==================== BOOKMARKS HOOKS ====================

/**
 * Хук для получения закладок пользователя
 */
export function useBookmarks() {
  return useQuery<ApiResponse<Bookmark[]>>({
    queryKey: ["user", "bookmarks"],
    queryFn: async () => {
      const response = await fetch("/api/visualizations/bookmarks")
      if (!response.ok) {
        if (response.status === 401) {
          return { success: false, error: "Unauthorized" }
        }
        throw new Error("Failed to fetch bookmarks")
      }
      return response.json()
    },
    retry: false,
  })
}

/**
 * Хук для добавления закладки
 */
export function useAddBookmark() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: BookmarkData) => {
      const response = await fetch("/api/visualizations/bookmarks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = (await response.json()) as { error?: string }
        throw new Error(error.error ?? "Failed to add bookmark")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "bookmarks"] })
    },
  })
}

/**
 * Хук для удаления закладки
 */
export function useRemoveBookmark() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/visualizations/bookmarks?id=${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const error = (await response.json()) as { error?: string }
        throw new Error(error.error ?? "Failed to remove bookmark")
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "bookmarks"] })
    },
  })
}

/**
 * Хук для проверки, есть ли визуализация в закладках
 */
export function useIsBookmarked(topic: string) {
  const { data } = useBookmarks()

  const isBookmarked = data?.data?.some((b) => b.topic === topic) ?? false

  return { isBookmarked }
}

// ==================== COMBINED HOOKS ====================

/**
 * Хук для управления состоянием визуализации (прогресс + закладки)
 */
export function useVisualizationState(topic: string) {
  const { progress, isLoading: progressLoading } = useVisualizationProgress(topic)
  const { isBookmarked } = useIsBookmarked(topic)
  const updateProgress = useUpdateProgress()
  const addBookmark = useAddBookmark()
  const removeBookmark = useRemoveBookmark() // eslint-disable-line @typescript-eslint/no-unused-vars

  const markAsCompleted = () => {
    return void updateProgress.mutateAsync({ topic, completedCount: 1 })
  }

  const toggleBookmark = async (_title: string) => {
    if (isBookmarked) {
      // Need bookmark ID to remove - requires additional implementation
      return null
    } else {
      return addBookmark.mutateAsync({ topic, title: _title })
    }
  }

  return {
    progress,
    isBookmarked,
    isLoading: progressLoading,
    markAsCompleted,
    toggleBookmark,
  }
}
