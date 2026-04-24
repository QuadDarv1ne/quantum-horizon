/**
 * In-memory rate limiter
 * Fallback when Redis is not available
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

interface InMemoryRateLimiterOptions {
  /**
   * Whether to automatically cleanup expired entries
   * @default true
   */
  autoCleanup?: boolean
  
  /**
   * Cleanup interval in milliseconds
   * @default 60000 (1 minute)
   */
  cleanupIntervalMs?: number
}

/**
 * Create an in-memory rate limiter
 */
export function createInMemoryRateLimiter(
  requests: number,
  window: "1 m" | "1 h",
  prefix: string,
  options: InMemoryRateLimiterOptions = {}
): InMemoryRateLimiter {
  const windowMs = window === "1 m" ? 60 * 1000 : 60 * 60 * 1000
  const {
    autoCleanup = true,
    cleanupIntervalMs = 60 * 1000
  } = options

  return new InMemoryRateLimiter(requests, windowMs, prefix, {
    autoCleanup,
    cleanupIntervalMs
  })
}

/**
 * In-memory rate limiter class
 */
export class InMemoryRateLimiter {
  private maxRequests: number
  private windowMs: number
  private prefix: string
  private autoCleanup: boolean
  private cleanupIntervalMs: number
  
  // Each instance has its own storage
  private rateLimitStore: Map<string, RateLimitEntry>
  
  // Cleanup timer reference
  private cleanupTimer: NodeJS.Timeout | null = null

  constructor(
    maxRequests: number, 
    windowMs: number, 
    prefix: string,
    options: {
      autoCleanup?: boolean
      cleanupIntervalMs?: number
    } = {}
  ) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.prefix = prefix
    this.autoCleanup = options.autoCleanup ?? true
    this.cleanupIntervalMs = options.cleanupIntervalMs ?? 60 * 1000
    this.rateLimitStore = new Map<string, RateLimitEntry>()
    
    // Start auto cleanup if enabled
    if (this.autoCleanup && typeof global !== "undefined") {
      this.startCleanup()
    }
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
    const entry = this.rateLimitStore.get(storeKey)

    // If no entry or window expired, create new entry
    if (!entry || now > entry.resetTime) {
      const resetTime = now + this.windowMs
      this.rateLimitStore.set(storeKey, {
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
  
  /**
   * Start the cleanup timer
   */
  private startCleanup(): void {
    if (this.cleanupTimer) {
      return
    }
    
    this.cleanupTimer = setInterval(() => {
      this.cleanupExpiredEntries()
    }, this.cleanupIntervalMs)
  }
  
  /**
   * Stop the cleanup timer
   */
  public stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }

  /**
   * Cleanup expired entries (optional, for memory management)
   */
  public cleanupExpiredEntries(): void {
    const now = Date.now()
    const keysToDelete: string[] = []

    this.rateLimitStore.forEach((entry, key) => {
      if (now > entry.resetTime) {
        keysToDelete.push(key)
      }
    })

    keysToDelete.forEach((key) => this.rateLimitStore.delete(key))
  }
}

/**
 * Cleanup all in-memory rate limiters (for testing)
 */
export function cleanupAllRateLimiters(): void {
  // Note: In a real application, you'd need to track all instances
  // This is primarily useful for testing scenarios
}
