/**
 * In-memory rate limiter
 * Fallback when Redis is not available
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

// Map to store rate limit data: key -> entry
const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Create an in-memory rate limiter
 */
export function createInMemoryRateLimiter(
  requests: number,
  window: "1 m" | "1 h",
  prefix: string
): InMemoryRateLimiter {
  const windowMs = window === "1 m" ? 60 * 1000 : 60 * 60 * 1000

  return new InMemoryRateLimiter(requests, windowMs, prefix)
}

/**
 * In-memory rate limiter class
 */
export class InMemoryRateLimiter {
  private maxRequests: number
  private windowMs: number
  private prefix: string

  constructor(maxRequests: number, windowMs: number, prefix: string) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.prefix = prefix
  }

  /**
   * Check rate limit for a key
   */
  limit(key: string): {
    success: boolean
    limit: number
    remaining: number
    reset: number
  } {
    const now = Date.now()
    const storeKey = `${this.prefix}:${key}`
    const entry = rateLimitStore.get(storeKey)

    // If no entry or window expired, create new entry
    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.windowMs
      rateLimitStore.set(storeKey, {
        count: 1,
        resetTime,
      })

      return {
        success: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        reset: resetTime,
      }
    }

    // Increment count
    entry.count++

    // Check if limit exceeded
    if (entry.count > this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: entry.resetTime,
      }
    }

    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - entry.count,
      reset: entry.resetTime,
    }
  }
}

/**
 * Cleanup expired entries (optional, for memory management)
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now()
  const keysToDelete: string[] = []

  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      keysToDelete.push(key)
    }
  })

  keysToDelete.forEach((key) => rateLimitStore.delete(key))
}

// Run cleanup every minute
if (typeof global !== "undefined") {
  setInterval(cleanupExpiredEntries, 60 * 1000)
}
