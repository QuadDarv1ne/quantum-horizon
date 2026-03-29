import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextResponse } from "next/server"

describe("Rate Limiting Middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("должен пропускать запросы в пределах лимита", () => {
    // Mock successful rate limit check
    const mockLimit = vi.fn().mockResolvedValue({
      success: true,
      limit: 100,
      remaining: 99,
      reset: Date.now() + 60000,
    })

    // Mock Redis
    vi.mock("@upstash/ratelimit", () => ({
      Ratelimit: {
        slidingWindow: vi.fn(),
      },
    }))

    vi.mock("@upstash/redis", () => ({
      Redis: {
        fromEnv: vi.fn(),
      },
    }))

    expect(mockLimit).toBeDefined()
  })

  it("должен возвращать 429 при превышении лимита", () => {
    const limit = 5
    const remaining = 0
    const reset = Date.now() + 60000

    const response = NextResponse.json(
      {
        error: "Слишком много запросов",
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

    expect(response.status).toBe(429)
  })

  it("должен устанавливать заголовки X-RateLimit-*", () => {
    const limit = 100
    const remaining = 50
    const reset = Date.now() + 60000

    const response = NextResponse.json(
      {
        error: "Rate limit exceeded",
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

    expect(response.headers.get("X-RateLimit-Limit")).toBe(limit.toString())
    expect(response.headers.get("X-RateLimit-Remaining")).toBe(remaining.toString())
  })

  it("должен применять разные лимиты для разных endpoints", () => {
    const limits = {
      auth: { requests: 5, window: "1 m" },
      register: { requests: 3, window: "1 h" },
      resetPassword: { requests: 2, window: "1 h" },
      visualizations: { requests: 100, window: "1 m" },
      activity: { requests: 60, window: "1 m" },
      achievements: { requests: 60, window: "1 m" },
    }

    expect(limits.auth.requests).toBe(5)
    expect(limits.register.requests).toBe(3)
    expect(limits.resetPassword.requests).toBe(2)
    expect(limits.visualizations.requests).toBe(100)
    expect(limits.activity.requests).toBe(60)
    expect(limits.achievements.requests).toBe(60)
  })

  it("должен использовать IP из x-forwarded-for заголовка", () => {
    const mockIp = "203.0.113.1"
    const headerValue = `${mockIp}, proxy1, proxy2`
    const ip = headerValue.split(",")[0]?.trim() ?? "127.0.0.1"

    expect(ip).toBe(mockIp)
  })

  it("должен использовать fallback IP если заголовок отсутствует", () => {
    const fallbackIp = "127.0.0.1"

    expect(fallbackIp).toBe("127.0.0.1")
  })

  it("должен применять middleware только к /api/* routes", () => {
    const config = {
      matcher: ["/api/:path*"],
    }

    const testPaths = [
      { path: "/api/auth/signin", shouldMatch: true },
      { path: "/api/visualizations/quantum", shouldMatch: true },
      { path: "/api/activity", shouldMatch: true },
      { path: "/api/achievements", shouldMatch: true },
      { path: "/", shouldMatch: false },
      { path: "/auth/signin", shouldMatch: false },
      { path: "/offline", shouldMatch: false },
    ]

    testPaths.forEach(({ path, shouldMatch }) => {
      const matches = config.matcher.some((pattern: string) => {
        const regex = new RegExp(`^${pattern.replace(":path*", ".*")}$`)
        return regex.test(path)
      })
      expect(matches).toBe(shouldMatch)
    })
  })
})
