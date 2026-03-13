/**
 * Утилиты для API routes
 * Устраняет дублирование кода обработки ошибок, валидации и ответов
 */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession, type Session } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

// ==================== ТИПЫ ====================

/** Базовый ответ API */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/** Опции для обработчика запроса */
export interface HandlerOptions<T = unknown> {
  /** Требуется ли авторизация */
  requireAuth?: boolean
  /** Минимальная роль пользователя */
  requiredRole?: "USER" | "MODERATOR" | "ADMIN"
  /** Функция валидации тела запроса */
  validateBody?: (body: unknown) => T | Promise<T>
  /** Обработчик запроса */
  handler: (request: HandlerRequest<T>) => Promise<NextResponse<ApiResponse>>
}

/** Данные запроса для обработчика */
export interface HandlerRequest<T = unknown> {
  request: NextRequest
  userId?: string
  body?: T
  searchParams: URLSearchParams
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

/**
 * Получить ID пользователя из сессии
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user.id ?? null
}

/**
 * Получить текущую сессию с проверкой пользователя
 */
export async function getCurrentSession(): Promise<{
  session: Session | null
  userId: string | null
}> {
  const session = await getServerSession(authOptions)
  return { session, userId: session?.user.id ?? null }
}

/**
 * Создать JSON ответ с правильными заголовками
 */
export function createJsonResponse<T>(data: ApiResponse<T>): NextResponse<ApiResponse<T>> {
  return NextResponse.json(data)
}

/**
 * Создать ответ с ошибкой
 */
export function errorResponse(message: string, status = 500): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ success: false, error: message }, { status })
}

/**
 * Создать ответ с успехом
 */
export function successResponse<T>(data: T, message?: string): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    ...(message && { message }),
  })
}

/**
 * Обёртка для обработки ошибок в API routes
 * Автоматически ловит ошибки и возвращает стандартный формат ответа
 */
export async function withErrorHandler<T>(
  fn: () => Promise<NextResponse<ApiResponse<T>>>
): Promise<NextResponse<ApiResponse<T>>> {
  try {
    return await fn()
  } catch (error) {
    console.error("API Error:", error instanceof Error ? error.message : error)
    return errorResponse("Internal server error", 500)
  }
}

/**
 * Обёртка для обработки запросов с авторизацией и валидацией
 */
export async function withRequestHandler<T = unknown>(
  request: NextRequest,
  options: HandlerOptions<T>
): Promise<NextResponse<ApiResponse>> {
  const { requireAuth = true, validateBody, handler } = options

  return withErrorHandler(async () => {
    // Проверка авторизации
    if (requireAuth) {
      const userId = await getCurrentUserId()
      if (!userId) {
        return errorResponse("Unauthorized", 401)
      }

      const searchParams = request.nextUrl.searchParams
      const body = validateBody
        ? await validateBody(await request.json().catch(() => null))
        : undefined

      return handler({ request, userId, body, searchParams })
    }

    // Без авторизации
    const searchParams = request.nextUrl.searchParams
    const body = validateBody
      ? await validateBody(await request.json().catch(() => null))
      : undefined

    return handler({ request, body, searchParams })
  })
}

// ==================== ВАЛИДАТОРЫ ====================

/**
 * Валидатор для обязательных полей
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  body: unknown,
  fields: Array<keyof T>
): T {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body")
  }

  const missingFields = fields.filter((field) => !(field in body))
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(", ")}`)
  }

  return body as T
}

/**
 * Валидатор для строковых полей
 */
export function validateStringField(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} must be a non-empty string`)
  }
  return value.trim()
}

/**
 * Валидатор для числовых полей
 */
export function validateNumberField(
  value: unknown,
  fieldName: string,
  options?: { min?: number; max?: number }
): number {
  const num = Number(value)
  if (isNaN(num)) {
    throw new Error(`${fieldName} must be a number`)
  }
  if (options?.min !== undefined && num < options.min) {
    throw new Error(`${fieldName} must be at least ${String(options.min)}`)
  }
  if (options?.max !== undefined && num > options.max) {
    throw new Error(`${fieldName} must be at most ${String(options.max)}`)
  }
  return num
}

// ==================== ПРЕДОПРЕДЕЛЁННЫЕ ОБРАБОТЧИКИ ====================

/**
 * GET обработчик с авторизацией
 */
export async function createGetHandler<T>(
  handler: (userId: string, searchParams: URLSearchParams) => Promise<T>
): Promise<NextResponse<ApiResponse<T>>> {
  return withErrorHandler(async () => {
    const userId = await getCurrentUserId()
    if (!userId) {
      return errorResponse("Unauthorized", 401)
    }

    // Пустой request для совместимости
    const emptyRequest = new NextRequest(new URL("http://localhost"))
    const searchParams = emptyRequest.nextUrl.searchParams

    const data = await handler(userId, searchParams)
    return successResponse(data)
  })
}

/**
 * POST обработчик с авторизацией и валидацией
 */
export async function createPostHandler<T, R>(
  validateBody: (body: unknown) => T,
  handler: (userId: string, body: T) => Promise<R>
): Promise<NextResponse<ApiResponse<R>>> {
  return withErrorHandler(async () => {
    const userId = await getCurrentUserId()
    if (!userId) {
      return errorResponse("Unauthorized", 401)
    }

    // Пустой request для совместимости
    const emptyRequest = new NextRequest(new URL("http://localhost"))
    const body = validateBody(await emptyRequest.json().catch(() => null))

    const data = await handler(userId, body)
    return successResponse(data)
  })
}
