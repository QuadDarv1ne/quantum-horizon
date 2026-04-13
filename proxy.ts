import createMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { locales, defaultLocale } from "@/i18n/config"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { createInMemoryRateLimiter, type InMemoryRateLimiter } from "@/lib/in-memory-rate-limiter"

// next-intl middleware для обработки локали
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "never", // Не добавлять префикс локали к URL (используем localStorage)
  localeDetection: true, // Автоматическое определение локали
})

/**
 * Создание rate limiter
 * Использует Redis если доступен, иначе fallback на in-memory
 */
function createRateLimiter(
  requests: number,
  window: "1 m" | "1 h",
  prefix: string
): Ratelimit | InMemoryRateLimiter {
  // Используем Redis если настроен
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(requests, window),
      analytics: true,
      prefix: `@upstash/ratelimit/${prefix}`,
    })
  }

  // Fallback на in-memory rate limiter
  return createInMemoryRateLimiter(requests, window, prefix)
}

// Конфигурация rate limiters
const rateLimiters = {
  auth: createRateLimiter(5, "1 m", "auth"),
  register: createRateLimiter(3, "1 h", "register"),
  reset: createRateLimiter(2, "1 h", "reset"),
  visualizations: createRateLimiter(100, "1 m", "visualizations"),
  activity: createRateLimiter(60, "1 m", "activity"),
  achievements: createRateLimiter(60, "1 m", "achievements"),
}

/**
 * Обработка rate limit exceeded
 */
function rateLimitResponse(message: string, limit: number, remaining: number, reset: number) {
  return NextResponse.json(
    {
      error: message,
      remaining: Math.floor(remaining),
      reset: new Date(reset).toISOString(),
    },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    }
  )
}

/**
 * Проверка rate limit
 */
async function checkRateLimit(
  ip: string,
  limiter: Ratelimit | InMemoryRateLimiter,
  message: string
): Promise<NextResponse | null> {
  const { success, limit, reset, remaining } = await limiter.limit(ip)
  if (!success) {
    return rateLimitResponse(message, limit, remaining, reset)
  }
  return null
}

/**
 * Обработка CORS и rate limiting для API
 */
async function handleApiRequest(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1"
  const origin = request.headers.get("origin") ?? ""

  // Разрешённые домены для CORS
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:64764",
    "https://quantum-horizon.vercel.app",
    "https://quantum-horizon.onrender.com",
  ]

  const isAllowedOrigin = allowedOrigins.includes(origin)

  // Preflight request (OPTIONS)
  if (request.method === "OPTIONS") {
    if (isAllowedOrigin || !origin) {
      return new NextResponse(null, {
        headers: {
          "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Max-Age": "86400", // 24 часа
        },
      })
    }
    return new NextResponse("Forbidden", { status: 403 })
  }

  // Проверка rate limit
  const rateLimitChecks: Array<{
    pattern: string
    limiter: Ratelimit | InMemoryRateLimiter
    message: string
  }> = [
    {
      pattern: "/api/auth/nextauth",
      limiter: rateLimiters.auth,
      message: "Слишком много попыток входа. Попробуйте позже.",
    },
    {
      pattern: "/api/auth/register",
      limiter: rateLimiters.register,
      message: "Слишком много запросов регистрации. Попробуйте позже.",
    },
    {
      pattern: "/api/auth/reset-password",
      limiter: rateLimiters.reset,
      message: "Слишком много запросов сброса пароля. Попробуйте позже.",
    },
    {
      pattern: "/api/visualizations/",
      limiter: rateLimiters.visualizations,
      message: "Слишком много запросов. Попробуйте позже.",
    },
    {
      pattern: "/api/activity/",
      limiter: rateLimiters.activity,
      message: "Слишком много запросов активности. Попробуйте позже.",
    },
    {
      pattern: "/api/achievements/",
      limiter: rateLimiters.achievements,
      message: "Слишком много запросов достижений. Попробуйте позже.",
    },
  ]

  for (const check of rateLimitChecks) {
    if (pathname.includes(check.pattern.replace("/api/", ""))) {
      const response = await checkRateLimit(ip, check.limiter, check.message)
      if (response) {
        response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : "*")
        return response
      }
      break // Only apply first matching rate limit
    }
  }

  // Добавляем CORS заголовки к обычным ответам
  const response = NextResponse.next()
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Credentials", "true")
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
  return response
}

// Комбинированный proxy
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Обработка API запросов (CORS + rate limiting)
  if (pathname.startsWith("/api/")) {
    return handleApiRequest(request)
  }

  // Сначала обрабатываем i18n
  const intlResponse = intlMiddleware(request)

  // Получаем токен для auth
  const token = await getToken({ req: request })

  // Проверяем путь для защиты
  const isAuthPath = pathname.startsWith("/auth")
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings")

  // Если пытаемся получить доступ к защищённому пути без авторизации
  if (isProtectedPath && !token) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(signInUrl)
  }

  // Если пытаемся получить доступ к auth пути с авторизацией
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Иначе используем intl response
  return intlResponse
}

// Защищаем все необходимые пути
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - auth callback routes
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|auth/callback).*)",
    "/api/:path*",
  ],
}
