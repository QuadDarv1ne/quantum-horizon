/**
 * React Query hooks для аутентификации
 */

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

// ==================== TYPES ====================

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignInResult {
  error?: string
  status?: number
}

// ==================== SESSION HOOK ====================

/**
 * Хук для получения текущей сессии
 * Обёртка над useSession с дополнительными утилитами
 */
export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"
  const user = session?.user

  const redirectToSignIn = (callbackUrl?: string) => {
    const url = callbackUrl
      ? `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
      : "/auth/signin"
    router.push(url)
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  return {
    // Состояние
    user,
    session,
    status,

    // Флаги
    isAuthenticated,
    isLoading,
    isUnauthenticated: status === "unauthenticated",

    // Действия
    signIn: (provider?: string, options?: { callbackUrl?: string }) => signIn(provider, options),
    signOut: handleSignOut,
    update,
    redirectToSignIn,
  }
}

// ==================== SIGN IN HOOK ====================

/**
 * Хук для обработки формы входа
 */
export function useSignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signInWithEmail = async (credentials: SignInCredentials, callbackUrl?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
        return { error: result.error }
      }

      if (callbackUrl) {
        window.location.href = callbackUrl
      }

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to sign in"
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithProvider = async (provider: string, callbackUrl?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      await signIn(provider, { callbackUrl: callbackUrl ?? "/" })
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : String(err instanceof Error ? err : "Failed to sign in")
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    signInWithEmail,
    signInWithProvider,
    clearError: (): void => {
      setError(null)
    },
  }
}

// ==================== SIGN UP HOOK ====================

/**
 * Хук для обработки формы регистрации
 */
export function useSignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signUp = async (email: string, password: string, name?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Регистрация через API (требуется реализация)
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to register")
      }

      // Автоматический вход после регистрации
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to register"
      setError(errorMessage)
      return { error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    signUp,
    clearError: (): void => {
      setError(null)
    },
  }
}

// ==================== PROTECTED ROUTE HOOK ====================

/**
 * Хук для защиты маршрутов
 * Автоматически перенаправляет на страницу входа
 */
export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const requireAuth = (callbackUrl?: string) => {
    if (!isLoading && !isAuthenticated) {
      const url = callbackUrl
        ? `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : "/auth/signin"
      router.push(url)
      return false
    }
    return true
  }

  return {
    isLoading,
    isAuthenticated,
    requireAuth,
  }
}

// ==================== ROLE-BASED ACCESS HOOK ====================

/**
 * Хук для проверки ролей пользователя
 */
export function useHasRole(requiredRole: string | string[]) {
  const { user, isAuthenticated } = useAuth()

  const hasRole = (): boolean => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    if (!isAuthenticated || !(user as any)?.role) {
      return false
    }

    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const userRole: string = (user as any).role
    return roles.includes(userRole)
  }

  return {
    hasRole: hasRole(),
    user,
    isAuthenticated,
  }
}
