/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// Service Worker for Quantum Horizon PWA
// Provides offline caching and network-first strategies

const CACHE_NAME = "quantum-horizon-v1"
const STATIC_ASSETS = ["/", "/offline", "/favicon.svg"]

// Install event - cache static assets
self.addEventListener("install", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch event - network first, fallback to cache
self.addEventListener("fetch", (event: FetchEvent) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith("http")) {
    return
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response for caching
        const responseToCache = response.clone()

        // Cache successful responses
        if (response.status === 200) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache)
          })
        }

        return response
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          // Show offline page for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/offline")
          }

          // Return empty response for other requests
          return new Response("Offline", { status: 503 })
        })
      })
  )
})

// Handle messages from main thread
self.addEventListener("message", (event: ExtendableMessageEvent) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

// TypeScript types for service worker
declare const self: ServiceWorkerGlobalScope
