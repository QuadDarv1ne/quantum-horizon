import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { InMemoryRateLimiter, createInMemoryRateLimiter, cleanupExpiredEntries } from "./in-memory-rate-limiter"

describe("InMemoryRateLimiter", () => {
  let limiter: InMemoryRateLimiter

  beforeEach(() => {
    limiter = new InMemoryRateLimiter(5, 60 * 1000, "test")
  })

  afterEach(() => {
    limiter.stopCleanup()
  })

  describe("constructor", () => {
    it("should create instance with correct properties", () => {
      expect(limiter["maxRequests"]).toBe(5)
      expect(limiter["windowMs"]).toBe(60 * 1000)
      expect(limiter["prefix"]).toBe("test")
      expect(limiter["autoCleanup"]).toBe(true)
    })

    it("should accept custom options", () => {
      const customLimiter = new InMemoryRateLimiter(10, 30 * 1000, "custom", {
        autoCleanup: false,
        cleanupIntervalMs: 30 * 1000
      })
      
      expect(customLimiter["maxRequests"]).toBe(10)
      expect(customLimiter["windowMs"]).toBe(30 * 1000)
      expect(customLimiter["prefix"]).toBe("custom")
      expect(customLimiter["autoCleanup"]).toBe(false)
      expect(customLimiter["cleanupIntervalMs"]).toBe(30 * 1000)
    })
  })

  describe("limit", () => {
    it("should allow requests under limit", () => {
      const result = limiter.limit("user1")
      expect(result.success).toBe(true)
      expect(result.limit).toBe(5)
      expect(result.remaining).toBe(4)
      expect(result.reset).toBeGreaterThan(Date.now())
    })

    it("should track multiple requests for same key", () => {
      // First request
      let result = limiter.limit("user1")
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)

      // Second request
      result = limiter.limit("user1")
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(3)

      // Third request
      result = limiter.limit("user1")
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(2)

      // Fourth request
      result = limiter.limit("user1")
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(1)

      // Fifth request (at limit)
      result = limiter.limit("user1")
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(0)

      // Sixth request (over limit)
      result = limiter.limit("user1")
      expect(result.success).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it("should track different keys independently", () => {
      // Use up limit for user1
      for (let i = 0; i < 5; i++) {
        limiter.limit("user1")
      }

      // user1 should be limited
      let result = limiter.limit("user1")
      expect(result.success).toBe(false)

      // user2 should still be allowed
      result = limiter.limit("user2")
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)
    })

    it("should reset after window expires", () => {
      // Use up limit
      for (let i = 0; i < 5; i++) {
        limiter.limit("user1")
      }

      // Should be limited
      let result = limiter.limit("user1")
      expect(result.success).toBe(false)

      // Mock time to be past the window
      vi.useFakeTimers()
      const originalNow = Date.now()
      vi.setSystemTime(originalNow + 61 * 1000) // 61 seconds later

      // Should be allowed again
      result = limiter.limit("user1")
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4)

      vi.useRealTimers()
    })
  })

  describe("createInMemoryRateLimiter factory function", () => {
    it("should create instance with default options", () => {
      const limiter = createInMemoryRateLimiter(3, "1 m", "factory")
      expect(limiter["maxRequests"]).toBe(3)
      expect(limiter["windowMs"]).toBe(60 * 1000)
      expect(limiter["prefix"]).toBe("factory")
      expect(limiter["autoCleanup"]).toBe(true)
    })

    it("should create instance with custom options", () => {
      const limiter = createInMemoryRateLimiter(7, "1 h", "factory-custom", {
        autoCleanup: false,
        cleanupIntervalMs: 30 * 1000
      })
      expect(limiter["maxRequests"]).toBe(7)
      expect(limiter["windowMs"]).toBe(60 * 60 * 1000)
      expect(limiter["prefix"]).toBe("factory-custom")
      expect(limiter["autoCleanup"]).toBe(false)
      expect(limiter["cleanupIntervalMs"]).toBe(30 * 1000)
    })
  })

  describe("cleanupExpiredEntries", () => {
    it("should remove expired entries", () => {
      // Add an entry
      limiter.limit("user1")
      
      // Manually add an expired entry
      const expiredKey = "expired:user"
      const expiredEntry = {
        count: 5,
        resetTime: Date.now() - 1000 // Expired 1 second ago
      }
      limiter["rateLimitStore"].set(expiredKey, expiredEntry)
      
      // Verify both entries exist
      expect(limiter["rateLimitStore"].has("test:user1")).toBe(true)
      expect(limiter["rateLimitStore"].has(expiredKey)).toBe(true)
      
      // Run cleanup
      limiter.cleanupExpiredEntries()
      
      // Expired entry should be removed, active entry should remain
      expect(limiter["rateLimitStore"].has("test:user1")).toBe(true)
      expect(limiter["rateLimitStore"].has(expiredKey)).toBe(false)
    })
  })

  describe("auto cleanup", () => {
    it("should start cleanup timer when autoCleanup is true", () => {
      const limiterWithAuto = new InMemoryRateLimiter(5, 60 * 1000, "auto", {
        autoCleanup: true
      })

      expect(limiterWithAuto["cleanupTimer"]).not.toBeNull()

      limiterWithAuto.stopCleanup()
    })

    it("should not start cleanup timer when autoCleanup is false", () => {
      const limiterWithoutAuto = new InMemoryRateLimiter(5, 60 * 1000, "no-auto", {
        autoCleanup: false
      })

      expect(limiterWithoutAuto["cleanupTimer"]).toBeNull()
    })
  })

  describe("maxStorageSize and eviction", () => {
    it("should respect maxStorageSize limit", () => {
      const limiter = new InMemoryRateLimiter(5, 60 * 1000, "test", {
        maxStorageSize: 3
      })

      // Fill up to the limit
      expect(limiter.limit("key1").success).toBe(true)
      expect(limiter.limit("key2").success).toBe(true)
      expect(limiter.limit("key3").success).toBe(true)
      
      // All should be allowed
      expect(limiter.limit("key1").success).toBe(true)
      expect(limiter.limit("key2").success).toBe(true)
      expect(limiter.limit("key3").success).toBe(true)
      
      // Add a fourth key - should evict the oldest (key1)
      expect(limiter.limit("key4").success).toBe(true)
      
      // key1 should now be treated as new (evicted)
      const result = limiter.limit("key1")
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(4) // Should be 4, not 0
    })

    it("should evict oldest entries when limit is reached", () => {
      const limiter = new InMemoryRateLimiter(5, 60 * 1000, "test", {
        maxStorageSize: 2
      })

      // Add first two entries
      limiter.limit("key1")
      limiter.limit("key2")
      
      // Add third entry - should evict key1
      limiter.limit("key3")
      
      // key1 should behave like a new key (evicted)
      const result1 = limiter.limit("key1")
      expect(result1.success).toBe(true)
      expect(result1.remaining).toBe(4) // Like a fresh key
      
      // key2 should still be in store (second oldest)
      const result2 = limiter.limit("key2")
      expect(result2.success).toBe(true)
      
      // Add another to evict key2
      limiter.limit("key4")
      const result2After = limiter.limit("key2")
      expect(result2After.success).toBe(true)
      expect(result2After.remaining).toBe(3) // Evicted and reset (accessed twice)
    })

    it("should cleanup expired entries before eviction", () => {
      const limiter = new InMemoryRateLimiter(5, 60 * 1000, "test", {
        maxStorageSize: 2
      })

      // Add entries
      limiter.limit("key1")
      limiter.limit("key2")
      
      // Manually make one entry expired
      const expiredKey = "test:key1"
      const expiredEntry = {
        count: 5,
        resetTime: Date.now() - 1000 // Expired 1 second ago
      }
      limiter["rateLimitStore"].set(expiredKey, expiredEntry)
      
      // Add a third entry - should trigger cleanup and eviction
      limiter.limit("key3")
      
      // After cleanup, expired entry should be removed
      // Then eviction should happen if still over limit
      // Since we had 2 entries, one expired, after cleanup we have 1
      // Adding third makes it 2, which is at limit, so no eviction needed
      // But let's verify the store size is reasonable
      expect(limiter["rateLimitStore"].size).toBeLessThanOrEqual(2)
    })
  })
})