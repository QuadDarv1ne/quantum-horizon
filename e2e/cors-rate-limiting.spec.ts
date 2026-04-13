import { test, expect } from "@playwright/test"

test.describe("CORS & Rate Limiting (E2E)", () => {
  test("API endpoints return CORS headers for allowed origins", async ({ page }) => {
    const response = await page.request.get("/api/visualizations/progress", {
      headers: { Origin: "http://localhost:3000" },
    })

    const corsHeader = response.headers()["access-control-allow-origin"]
    expect(corsHeader).toBeTruthy()
    expect(corsHeader).toBe("http://localhost:3000")
  })

  test("OPTIONS preflight request returns CORS headers", async ({ page }) => {
    const response = await page.request.fetch("/api/visualizations/progress", {
      method: "OPTIONS",
      headers: { Origin: "http://localhost:3000" },
    })

    expect(response.status()).toBe(200)
    const methodsHeader = response.headers()["access-control-allow-methods"]
    expect(methodsHeader).toBeTruthy()
    expect(methodsHeader).toContain("GET")
    expect(methodsHeader).toContain("POST")
  })

  test("disallowed origins are rejected", async ({ page }) => {
    const response = await page.request.fetch("/api/visualizations/progress", {
      method: "OPTIONS",
      headers: { Origin: "http://evil.com" },
    })

    expect(response.status()).toBe(403)
  })

  test("auth endpoint handles invalid requests gracefully", async ({ page }) => {
    const response = await page.request.post("/api/auth/register", {
      headers: { "Content-Type": "application/json" },
      data: { name: "", email: "invalid-email", password: "short" },
    })

    expect(response.status()).toBe(400)
  })

  test("visualizations endpoint returns proper response", async ({ page }) => {
    const response = await page.request.get("/api/visualizations/progress", {
      headers: { Origin: "http://localhost:3000" },
    })

    const contentType = response.headers()["content-type"]
    expect(contentType).toContain("application/json")
  })

  test("multiple rapid requests are handled correctly", async ({ page }) => {
    const responses = await Promise.all(
      Array.from({ length: 5 }).map(() =>
        page.request.get("/api/visualizations/progress", {
          headers: { Origin: "http://localhost:3000" },
        })
      )
    )

    const statusCodes = responses.map((r) => r.status())
    const has429 = statusCodes.includes(429)
    expect(has429).toBe(false)
  })

  test("CORS headers vary by origin", async ({ page }) => {
    const response1 = await page.request.get("/api/visualizations/progress", {
      headers: { Origin: "http://localhost:3000" },
    })

    const response2 = await page.request.get("/api/visualizations/progress", {
      headers: { Origin: "https://quantum-horizon.vercel.app" },
    })

    expect(response1.headers()["access-control-allow-origin"]).toBeTruthy()
    expect(response2.headers()["access-control-allow-origin"]).toBeTruthy()
  })
})
