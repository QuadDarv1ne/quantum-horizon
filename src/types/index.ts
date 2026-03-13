/**
 * Глобальные типы приложения Quantum Horizon
 */

// ==================== ОБЩИЕ ТИПЫ ====================

/** Тема оформления */
export type Theme = "dark" | "light"

/** Язык интерфейса */
export type Language = "ru" | "en" | "zh" | "he"

/** Секции главной страницы */
export type SectionId = "quantum" | "relativity" | "cosmos" | "advanced"

// ==================== ТИПЫ ДЛЯ ВИЗУАЛИЗАЦИЙ ====================

/** Настройки canvas контекста */
export interface CanvasSettings {
  /** Отключить анимацию */
  reducedMotion?: boolean
  /** FPS лимит (0 = без лимита) */
  fpsLimit?: number
  /** Приостанавливать когда не виден */
  pauseWhenHidden?: boolean
}

/** Базовые пропсы для компонентов визуализаций */
export interface VisualizationProps {
  /** Тема оформления */
  isDark: boolean
  /** Уникальный идентификатор */
  id?: string
  /** Дополнительные классы */
  className?: string
}

/** Позиция на canvas */
export interface CanvasPoint {
  x: number
  y: number
}

/** Размеры области */
export interface CanvasSize {
  width: number
  height: number
}

// ==================== ТИПЫ ДЛЯ ХУКОВ ====================

/** Опции для хуков работы с canvas */
export interface UseCanvasOptions {
  dependencies?: React.DependencyList
  pauseWhenHidden?: boolean
  respectReducedMotion?: boolean
  onContextReady?: (ctx: CanvasRenderingContext2D) => void
}

// ==================== ТИПЫ ДЛЯ STORE ====================

/** Базовое состояние визуализации */
export interface VisualizationState {
  isPlaying: boolean
  animationSpeed: number
  quantumNumber: 1 | 2 | 3 | 4 | 5
  velocity: number
  showProbability: boolean
  showClock: boolean
}

/** Настройки пользователя */
export interface UserPreferences {
  theme: Theme
  language: Language
  reducedMotion: boolean
}

// ==================== ТИПЫ ДЛЯ API ====================

/** Базовый ответ API */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/** Пагинация */
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  totalPages: number
}

// ==================== УТИЛИТАРНЫЕ ТИПЫ ====================

/** Частично требуемые поля */
export type PartialRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/** Глубоко частичный тип */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

/** Извлекает только сериализуемые поля */
export type Serializable<T> = {
  [K in keyof T]: T[K] extends (...args: unknown[]) => unknown ? never : T[K]
}
