import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest, NextResponse } from "next/server"

// Mock next-intl middleware - createIntlMiddleware returns a middleware function
vi.mock("next-intl/middleware", () => {
  const middlewareFn = vi.fn(() => new NextResponse())
  return {
    default: vi.fn(() => middlewareFn),
  }
})

// Mock next-auth - not used in current tests (auth protection tests are todo)
// vi.mock("next-auth/jwt", () => ({
//   getToken: vi.fn().mockResolvedValue(null),
// }))

// Mock Upstash - используем in-memory fallback
vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: vi.fn().mockImplementation(() => ({
    limit: vi.fn().mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: Date.now() + 60000,
    }),
  })),
}))

vi.mock("@upstash/redis", () => ({
  Redis: {
    fromEnv: vi.fn(() => ({})),
  },
}))

// Mock in-memory rate limiter
vi.mock("@/lib/in-memory-rate-limiter", () => ({
  createInMemoryRateLimiter: vi.fn().mockImplementation(() => ({
    limit: vi.fn().mockResolvedValue({
      success: true,
      limit: 5,
      remaining: 4,
      reset: Date.now() + 60000,
    }),
  })),
}))

describe("Proxy", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("CORS headers", () => {
    it("should add CORS headers for allowed origins", async () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        headers: {
          origin: "http://localhost:3000",
          "x-forwarded-for": "127.0.0.1",
        },
      })

      // Импортируем proxy после моков
      const { default: proxy } = await import("../proxy")
      const response = await proxy(request)

      expect(response.headers.get("Access-Control-Allow-Origin")).toBe("http://localhost:3000")
      expect(response.headers.get("Access-Control-Allow-Methods")).toContain("GET")
    })

    it("should handle OPTIONS preflight requests", async () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "OPTIONS",
        headers: {
          origin: "http://localhost:3000",
          "x-forwarded-for": "127.0.0.1",
        },
      })

      const { default: proxy } = await import("../proxy")
      const response = await proxy(request)

      expect(response.status).toBe(200)
      expect(response.headers.get("Access-Control-Allow-Methods")).toContain("POST")
      expect(response.headers.get("Access-Control-Max-Age")).toBe("86400")
    })

    it("should reject requests from non-allowed origins", async () => {
      const request = new NextRequest("http://localhost:3000/api/test", {
        method: "OPTIONS",
        headers: {
          origin: "http://evil.com",
          "x-forwarded-for": "127.0.0.1",
        },
      })

      const { default: proxy } = await import("../proxy")
      const response = await proxy(request)

      expect(response.status).toBe(403)
    })
  })

  describe("Rate limiting", () => {
    it("should allow requests when rate limit not exceeded", async () => {
      const request = new NextRequest("http://localhost:3000/api/auth/nextauth", {
        headers: {
          origin: "http://localhost:3000",
          "x-forwarded-for": "127.0.0.1",
        },
      })

      const { default: proxy } = await import("../proxy")
      const response = await proxy(request)

      // Should not be rate limited (success: true in mock)
      expect(response.status).not.toBe(429)
    })
  })

  describe("Auth protection", () => {
    // NOTE: Auth protection tests require integration testing with real next-intl middleware
    // The mock setup is complex due to the factory function pattern
    // These tests should be implemented as E2E tests with Playwright instead
    
    it.todo("should redirect to signin when accessing protected path without auth", () => {
      // Requires E2E testing with real middleware chain
    })

    it.todo("should redirect away from auth pages when already authenticated", () => {
      // Requires E2E testing with real middleware chain
    })
  })
})
