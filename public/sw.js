"use strict"
;(() => {
  var a = "quantum-horizon-v1",
    r = ["/", "/offline", "/favicon.svg"]
  self.addEventListener("install", (n) => {
    ;(n.waitUntil(caches.open(a).then((e) => e.addAll(r))), self.skipWaiting())
  })
  self.addEventListener("activate", (n) => {
    ;(n.waitUntil(
      caches.keys().then((e) => Promise.all(e.filter((t) => t !== a).map((t) => caches.delete(t))))
    ),
      self.clients.claim())
  })
  self.addEventListener("fetch", (n) => {
    let { request: e } = n
    e.method === "GET" &&
      e.url.startsWith("http") &&
      n.respondWith(
        fetch(e)
          .then((t) => {
            let s = t.clone()
            return (
              t.status === 200 &&
                caches.open(a).then((i) => {
                  i.put(e, s)
                }),
              t
            )
          })
          .catch(() =>
            caches
              .match(e)
              .then(
                (t) =>
                  t ||
                  (e.mode === "navigate"
                    ? caches.match("/offline")
                    : new Response("Offline", { status: 503 }))
              )
          )
      )
  })
  self.addEventListener("message", (n) => {
    n.data && n.data.type === "SKIP_WAITING" && self.skipWaiting()
  })
})()
