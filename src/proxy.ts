import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

/**
 * Proxy middleware для Next.js 16+
 * Обрабатывает rate limiting для API аутентификации
 *
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 */

/**
 * Rate limiter для аутентификации
 * 5 попыток входа в минуту с одного IP
 */
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

/**
 * Rate limiter для регистрации
 * 3 регистрации в час с одного IP
 */
const registerRatelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 регистрации в час с одного IP
        analytics: true,
        prefix: "@upstash/ratelimit/register",
      })
    : null

/**
 * Proxy функция для обработки запросов
 * Реализует rate limiting для endpoints аутентификации
 *
 * @param request - NextRequest объект
 * @returns NextResponse - следующий middleware или 429 error
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limiting для API аутентификации
  if (pathname.startsWith("/api/auth/")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "127.0.0.1"

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
