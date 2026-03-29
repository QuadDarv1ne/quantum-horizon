import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/**
 * Middleware для Next.js
 * Обрабатывает rate limiting для API
 */

/**
 * Rate limiter для аутентификации
 * 5 попыток входа в минуту с одного IP
 */
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(5, "1 m"),
        analytics: true,
        prefix: "@upstash/ratelimit/auth",
      })
    : null

/**
 * Rate limiter для регистрации
 * 3 регистрации в час с одного IP
 */
const registerRatelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, "1 h"),
        analytics: true,
        prefix: "@upstash/ratelimit/register",
      })
    : null

/**
 * Rate limiter для сброса пароля
 * 2 запроса в час с одного IP
 */
const resetRatelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(2, "1 h"),
        analytics: true,
        prefix: "@upstash/ratelimit/reset",
      })
    : null

/**
 * Rate limiter для визуализаций
 * 100 запросов в минуту
 */
const visualizationsRatelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(100, "1 m"),
        analytics: true,
        prefix: "@upstash/ratelimit/visualizations",
      })
    : null

/**
 * Rate limiter для активности
 * 60 запросов в минуту
 */
const activityRatelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(60, "1 m"),
        analytics: true,
        prefix: "@upstash/ratelimit/activity",
      })
    : null

/**
 * Rate limiter для достижений
 * 60 запросов в минуту
 */
const achievementsRatelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(60, "1 m"),
        analytics: true,
        prefix: "@upstash/ratelimit/achievements",
      })
    : null

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1"

  // Rate limiting для API аутентификации
  if (pathname.startsWith("/api/auth/")) {
    // Лимит для login (signin)
    if (pathname.includes("nextauth") && ratelimit) {
      const { success, limit, reset, remaining } = await ratelimit.limit(ip)
      if (!success) {
        return rateLimitResponse(
          "Слишком много попыток входа. Попробуйте позже.",
          limit,
          remaining,
          reset
        )
      }
    }

    // Лимит для регистрации
    if (pathname.includes("register") && registerRatelimit) {
      const { success, limit, reset, remaining } = await registerRatelimit.limit(ip)
      if (!success) {
        return rateLimitResponse(
          "Слишком много запросов регистрации. Попробуйте позже.",
          limit,
          remaining,
          reset
        )
      }
    }

    // Лимит для сброса пароля
    if (pathname.includes("reset-password") && resetRatelimit) {
      const { success, limit, reset, remaining } = await resetRatelimit.limit(ip)
      if (!success) {
        return rateLimitResponse(
          "Слишком много запросов сброса пароля. Попробуйте позже.",
          limit,
          remaining,
          reset
        )
      }
    }
  }

  // Rate limiting для визуализаций
  if (pathname.startsWith("/api/visualizations/") && visualizationsRatelimit) {
    const { success, limit, reset, remaining } = await visualizationsRatelimit.limit(ip)
    if (!success) {
      return rateLimitResponse("Слишком много запросов. Попробуйте позже.", limit, remaining, reset)
    }
  }

  // Rate limiting для активности
  if (pathname.startsWith("/api/activity/") && activityRatelimit) {
    const { success, limit, reset, remaining } = await activityRatelimit.limit(ip)
    if (!success) {
      return rateLimitResponse("Слишком много запросов. Попробуйте позже.", limit, remaining, reset)
    }
  }

  // Rate limiting для достижений
  if (pathname.startsWith("/api/achievements/") && achievementsRatelimit) {
    const { success, limit, reset, remaining } = await achievementsRatelimit.limit(ip)
    if (!success) {
      return rateLimitResponse("Слишком много запросов. Попробуйте позже.", limit, remaining, reset)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
