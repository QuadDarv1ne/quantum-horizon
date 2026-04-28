/**
 * Proxy handler for Quantum Horizon
 * Consolidates CORS, rate limiting, and auth protection logic
 * Next.js 16 recommended approach (replaces deprecated middleware.ts)
 */

import { NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { getToken } from "next-auth/jwt"
import createIntlMiddleware from "next-intl/middleware"
import { createInMemoryRateLimiter, InMemoryRateLimiter } from "@/lib/in-memory-rate-limiter"

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:64764",
  "https://quantum-horizon.vercel.app",
]

// Protected paths that require authentication
const PROTECTED_PATHS = ["/dashboard", "/profile", "/settings"]

// Auth paths that should redirect if already authenticated
const AUTH_PATHS = ["/auth/signin", "/auth/signup", "/auth/forgot-password"]

// CORS configuration
const CORS_HEADERS = {
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
  "Access-Control-Max-Age": "86400",
}

// Create rate limiter (Redis or in-memory fallback)
function getRateLimiter(prefix: string, requests: number, window: "1 m" | "1 h") {
  // Try Redis first
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = Redis.fromEnv()
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(requests, window),
      prefix,
    })
  }

  // Fallback to in-memory rate limiter with caching to ensure same instance for same prefix
  const cacheKey = `${prefix}:${String(requests)}:${window}`
  if (inMemoryLimiterCache.has(cacheKey)) {
    const cachedLimiter = inMemoryLimiterCache.get(cacheKey)
    if (cachedLimiter !== undefined) {
      return cachedLimiter
    }
  }

  const limiter = createInMemoryRateLimiter(requests, window, prefix)
  inMemoryLimiterCache.set(cacheKey, limiter)
  return limiter
}

// Cache for in-memory rate limiters to ensure same instance is used for same prefix
const inMemoryLimiterCache = new Map<string, InMemoryRateLimiter>()

// Rate limit configurations for different endpoints
const RATE_LIMITS = {
  "api/auth/nextauth": { requests: 5, window: "1 m" as const, prefix: "auth" },
  "api/auth/register": { requests: 3, window: "1 h" as const, prefix: "auth_register" },
  "api/auth/reset-password": { requests: 2, window: "1 h" as const, prefix: "auth_reset" },
  "api/visualizations": { requests: 100, window: "1 m" as const, prefix: "viz" },
  "api/activity": { requests: 60, window: "1 m" as const, prefix: "activity" },
  "api/achievements": { requests: 60, window: "1 m" as const, prefix: "achievements" },
}

/**
 * Apply CORS headers to response
 */
function applyCorsHeaders(response: NextResponse, origin: string): NextResponse {
  response.headers.set("Access-Control-Allow-Origin", origin)
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  Object.entries(CORS_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

/**
 * Handle CORS preflight requests
 */
function handleCorsPreflight(origin: string): NextResponse {
  const response = new NextResponse(null, { status: 200 })
  return applyCorsHeaders(response, origin)
}

/**
 * Check if origin is allowed
 */
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true // Server-to-server requests
  return ALLOWED_ORIGINS.includes(origin)
}

/**
 * Apply rate limiting
 */
async function applyRateLimit(
  request: NextRequest,
  pathname: string
): Promise<{ success: boolean; response?: NextResponse }> {
  // Find matching rate limit config
  let rateConfig: { requests: number; window: "1 m" | "1 h"; prefix: string } | undefined

  for (const [path, config] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(`/${path}`)) {
      rateConfig = config
      break
    }
  }

  if (!rateConfig) {
    return { success: true } // No rate limit for this path
  }

  // Get client identifier (IP or fallback)
  const clientIp =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "127.0.0.1"

  const rateLimiter = getRateLimiter(
    rateConfig.prefix,
    rateConfig.requests,
    rateConfig.window
  )

  const result = await rateLimiter.limit(clientIp)

  if (!result.success) {
    const response = NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 }
    )
    response.headers.set("X-RateLimit-Limit", result.limit.toString())
    response.headers.set("X-RateLimit-Remaining", result.remaining.toString())
    response.headers.set("X-RateLimit-Reset", result.reset.toString())
    return { success: false, response }
  }

  return { success: true }
}

/**
 * Check if path requires authentication
 */
function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path))
}

/**
 * Check if path is an auth page
 */
function isAuthPath(pathname: string): boolean {
  return AUTH_PATHS.some((path) => pathname.startsWith(path))
}

/**
 * Create intl middleware for i18n support
 */
const intlMiddlewareFn = createIntlMiddleware({
  locales: ["en", "ru", "de", "es"],
  defaultLocale: "en",
})

/**
 * Main proxy handler
 */
export default async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl
  const origin = request.headers.get("origin")

  // Check CORS for all requests
  if (!isAllowedOrigin(origin)) {
    return new NextResponse("Forbidden", { status: 403 })
  }

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    if (origin) {
      return handleCorsPreflight(origin)
    }
    return new NextResponse(null, { status: 200 })
  }

  // Apply rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const rateLimitResult = await applyRateLimit(request, pathname)
    if (!rateLimitResult.success && rateLimitResult.response) {
      return rateLimitResult.response
    }
  }

  // Auth protection: redirect to signin if accessing protected path without auth
  if (isProtectedPath(pathname)) {
    const token = await getToken({ req: request })
    if (!token) {
      const url = new URL("/auth/signin", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
  }

  // Auth protection: redirect away from auth pages if already authenticated
  if (isAuthPath(pathname)) {
    const token = await getToken({ req: request })
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Apply CORS headers to API responses
  if (pathname.startsWith("/api/") && origin) {
    const response = intlMiddlewareFn(request)
    return applyCorsHeaders(response, origin)
  }

  // Default: proceed with intl middleware
  return intlMiddlewareFn(request)
}

// Export config
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sw.js (service worker)
     */
    "/((?!_next/static|_next/image|favicon.ico|sw\\.js).*)",
  ],
}
