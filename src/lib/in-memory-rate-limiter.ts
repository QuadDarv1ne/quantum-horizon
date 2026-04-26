/**
 * In-memory rate limiter
 * Fallback when Redis is not available
 * Includes LRU-like eviction when storage limit is reached
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

  /**
   * Maximum number of keys to store in the rate limiter
   * @default 1000
   */
  maxStorageSize?: number
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
    cleanupIntervalMs = 60 * 1000,
    maxStorageSize = 1000
  } = options

  return new InMemoryRateLimiter(requests, windowMs, prefix, {
    autoCleanup,
    cleanupIntervalMs,
    maxStorageSize
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
  private maxStorageSize: number

  // Each instance has its own storage
  private rateLimitStore: Map<string, RateLimitEntry>
  // Queue to track insertion order for FIFO eviction
  private keyQueue: string[]

  // Cleanup timer reference
  private cleanupTimer: NodeJS.Timeout | null = null

  constructor(
    maxRequests: number,
    windowMs: number,
    prefix: string,
    options: {
      autoCleanup?: boolean
      cleanupIntervalMs?: number
      maxStorageSize?: number
    } = {}
  ) {
    this.maxRequests = maxRequests
    this.windowMs = windowMs
    this.prefix = prefix
    this.autoCleanup = options.autoCleanup ?? true
    this.cleanupIntervalMs = options.cleanupIntervalMs ?? 60 * 1000
    this.maxStorageSize = options.maxStorageSize ?? 1000
    this.rateLimitStore = new Map<string, RateLimitEntry>()
    this.keyQueue = []

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
      // Check if we need to evict old entries to make space for NEW entry
      // We only evict if we're actually adding a new entry and we're at or over capacity
      if (this.rateLimitStore.size >= this.maxStorageSize) {
        this.evictOldestEntry()
      }

      const resetTime = now + this.windowMs
      this.rateLimitStore.set(storeKey, {
        count: 1,
        resetTime,
      })

      // Add to queue for FIFO tracking
      this.keyQueue.push(storeKey)

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
   * Evict the oldest entry when storage limit is reached
   * Uses FIFO eviction based on insertion order
   */
  private evictOldestEntry(): void {
    // Remove expired entries first
    this.cleanupExpiredEntries()

    // If still over limit, remove the oldest entry
    if (this.rateLimitStore.size >= this.maxStorageSize && this.keyQueue.length > 0) {
      const oldestKey = this.keyQueue.shift()
      if (oldestKey) {
        this.rateLimitStore.delete(oldestKey)
      }
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
   * Remove expired entries from storage
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now()
    for (const [key, entry] of this.rateLimitStore.entries()) {
      if (now > entry.resetTime) {
        this.rateLimitStore.delete(key)
        // Also remove from queue
        const index = this.keyQueue.indexOf(key)
        if (index > -1) {
          this.keyQueue.splice(index, 1)
        }
      }
    }
  }
}

/**
 * Cleanup all in-memory rate limiters (for testing)
 */
export function cleanupAllRateLimiters(): void {
  // Note: In a real application, you'd need to track all instances
  // This is primarily useful for testing scenarios
}
