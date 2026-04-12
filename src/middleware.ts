import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/**
 * Middleware для Next.js
 * Обрабатывает rate limiting для API
 */

interface RateLimitConfig {
  limiter: Ratelimit | null
  message: string
  prefix: string
}

/**
 * Создание rate limiter
 */
function createRateLimiter(
  requests: number,
  window: "1 m" | "1 h",
  prefix: string
): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null
  }

  return new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: true,
    prefix: `@upstash/ratelimit/${prefix}`,
  })
}

// Конфигурация rate limiters
const rateLimiters: Record<string, RateLimitConfig> = {
  auth: {
    limiter: createRateLimiter(5, "1 m", "auth"),
    message: "Слишком много попыток входа. Попробуйте позже.",
    prefix: "auth",
  },
  register: {
    limiter: createRateLimiter(3, "1 h", "register"),
    message: "Слишком много запросов регистрации. Попробуйте позже.",
    prefix: "register",
  },
  reset: {
    limiter: createRateLimiter(2, "1 h", "reset"),
    message: "Слишком много запросов сброса пароля. Попробуйте позже.",
    prefix: "reset",
  },
  visualizations: {
    limiter: createRateLimiter(100, "1 m", "visualizations"),
    message: "Слишком много запросов. Попробуйте позже.",
    prefix: "visualizations",
  },
  activity: {
    limiter: createRateLimiter(60, "1 m", "activity"),
    message: "Слишком много запросов активности. Попробуйте позже.",
    prefix: "activity",
  },
  achievements: {
    limiter: createRateLimiter(60, "1 m", "achievements"),
    message: "Слишком много запросов достижений. Попробуйте позже.",
    prefix: "achievements",
  },
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
async function checkRateLimit(ip: string, config: RateLimitConfig): Promise<NextResponse | null> {
  if (!config.limiter) return null

  const { success, limit, reset, remaining } = await config.limiter.limit(ip)
  if (!success) {
    return rateLimitResponse(config.message, limit, remaining, reset)
  }
  return null
}

export async function middleware(request: NextRequest) {
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

  // CORS headers для API запросов
  if (pathname.startsWith("/api/")) {
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
    if (pathname.startsWith("/api/auth/")) {
      if (pathname.includes("nextauth")) {
        const response = await checkRateLimit(ip, rateLimiters.auth)
        if (response) {
          response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : "*")
          return response
        }
      }

      if (pathname.includes("register")) {
        const response = await checkRateLimit(ip, rateLimiters.register)
        if (response) {
          response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : "*")
          return response
        }
      }

      if (pathname.includes("reset-password")) {
        const response = await checkRateLimit(ip, rateLimiters.reset)
        if (response) {
          response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : "*")
          return response
        }
      }
    }

    // Rate limiting для визуализаций
    if (pathname.startsWith("/api/visualizations/")) {
      const response = await checkRateLimit(ip, rateLimiters.visualizations)
      if (response) {
        response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : "*")
        return response
      }
    }

    // Rate limiting для активности
    if (pathname.startsWith("/api/activity/")) {
      const response = await checkRateLimit(ip, rateLimiters.activity)
      if (response) {
        response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : "*")
        return response
      }
    }

    // Rate limiting для достижений
    if (pathname.startsWith("/api/achievements/")) {
      const response = await checkRateLimit(ip, rateLimiters.achievements)
      if (response) {
        response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : "*")
        return response
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

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
