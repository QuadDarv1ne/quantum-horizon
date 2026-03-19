/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Инициализация Redis и Ratelimit только если переменные окружения настроены
const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        // Лимиты для аутентификации
        limiter: Ratelimit.slidingWindow(5, "1 m"), // 5 попыток в минуту
        analytics: true,
        prefix: "@upstash/ratelimit/auth",
      })
    : null

// Лимит для регистрации
const registerRatelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 регистрации в час с одного IP
        analytics: true,
        prefix: "@upstash/ratelimit/register",
      })
    : null

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limiting для API аутентификации
  if (pathname.startsWith("/api/auth/")) {
    const ip = request.ip ?? "127.0.0.1"

    // Лимит для login (signin)
    if (pathname.includes("nextauth")) {
      if (!ratelimit) {
        // Если Redis не настроен, пропускаем без rate limiting
        return NextResponse.next()
      }

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
    if (pathname.includes("register")) {
      if (!registerRatelimit) {
        return NextResponse.next()
      }

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
    if (pathname.includes("reset-password")) {
      const resetRatelimit =
        process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
          ? new Ratelimit({
              redis: Redis.fromEnv(),
              limiter: Ratelimit.slidingWindow(2, "1 h"), // 2 запроса в час
              analytics: true,
              prefix: "@upstash/ratelimit/reset",
            })
          : null

      if (resetRatelimit) {
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
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/auth/:path*"],
}
