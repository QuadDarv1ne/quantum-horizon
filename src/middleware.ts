import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/**
 * Middleware для Next.js
 * Обрабатывает rate limiting для API аутентификации
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1"

  // Rate limiting для API аутентификации
  if (pathname.startsWith("/api/auth/")) {
    // Лимит для login (signin)
    if (pathname.includes("nextauth") && ratelimit) {
      const { success, limit, reset, remaining } = await ratelimit.limit(ip)

      if (!success) {
        return NextResponse.json(
          {
            error: "Слишком много попыток входа. Попробуйте позже.",
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
    }

    // Лимит для регистрации
    if (pathname.includes("register") && registerRatelimit) {
      const { success, limit, reset, remaining } = await registerRatelimit.limit(ip)

      if (!success) {
        return NextResponse.json(
          {
            error: "Слишком много запросов регистрации. Попробуйте позже.",
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
    }

    // Лимит для сброса пароля
    if (pathname.includes("reset-password") && resetRatelimit) {
      const { success, limit, reset, remaining } = await resetRatelimit.limit(ip)

      if (!success) {
        return NextResponse.json(
          {
            error: "Слишком много запросов сброса пароля. Попробуйте позже.",
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
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/auth/:path*"],
}
