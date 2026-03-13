// TypeScript types for service worker events
export {}
declare global {
  interface ServiceWorkerInstallEvent extends Event {
    waitUntil(fn: Promise<unknown>): void
  }
  interface ServiceWorkerActivateEvent extends Event {
    waitUntil(fn: Promise<unknown>): void
  }
  interface ServiceWorkerFetchEvent extends Event {
    request: Request
    respondWith(response: Promise<Response>): void
  }

  interface ServiceWorkerGlobalScope {
    skipWaiting(): void
    clients: {
      claim(): void
    }
  }

  var self: ServiceWorkerGlobalScope
}
