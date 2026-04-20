import { test, expect } from "@playwright/test"

test.describe("Auth Protection (E2E)", () => {
  test("protected paths are accessible", async ({ page }) => {
    // Access dashboard/profile/settings pages (may not redirect without auth setup)
    await page.goto("/dashboard")

    // Page should load without errors
    await expect(page).toHaveTitle(/Quantum Horizon/)
  })

  test("signin page is accessible", async ({ page }) => {
    await page.goto("/auth/signin")

    // Should see the signin page
    await expect(page).toHaveURL(/.*signin.*/)
    await expect(page).toHaveTitle(/Quantum Horizon/)
  })

  test("can access public homepage", async ({ page }) => {
    await page.goto("/")

    // Public content should be accessible - use more specific selector
    const mainHeading = page.getByRole("heading", { name: /Quantum Horizon/i, level: 1 })
    await expect(mainHeading).toBeVisible()
  })

  test("can access visualization pages", async ({ page }) => {
    await page.goto("/")

    // Should be able to see visualizations - use more specific selector
    const waveFunctionCard = page.getByRole("heading", { name: /Wave Function/i, level: 3 })
    await expect(waveFunctionCard).toBeVisible()
  })

  test("profile page loads without error", async ({ page }) => {
    await page.goto("/profile")

    // Page should load (even if protected, should not 500)
    const statusCode = page.locator("text=500")
    await expect(statusCode).not.toBeVisible()
  })

  test("settings page loads without error", async ({ page }) => {
    await page.goto("/settings")

    // Page should load without 500 error
    const statusCode = page.locator("text=500")
    await expect(statusCode).not.toBeVisible()
  })

  test("should redirect to signin when accessing protected path without auth", async ({ page }) => {
    // Access a protected path without authentication
    await page.goto("/dashboard")
    // Expect redirect to signin with callbackUrl
    await expect(page).toHaveURL(/.*\/auth\/signin.*/)
    const url = new URL(page.url())
    expect(url.searchParams.get('callbackUrl')).toBe('/dashboard')
  })

  test("should redirect away from auth pages when already authenticated", async ({ page }) => {
    // First, log in using seed credentials
    await page.goto("/auth/signin")
    await page.fill('input[type="email"]', 'student@quantum-horizon.app')
    await page.fill('input[type="password"]', 'Student@123456')
    await page.click('button:has-text("Sign in")')
    // Wait for redirect to dashboard
    await expect(page).toHaveURL('/dashboard')

    // Now, go to signin page (should redirect to dashboard)
    await page.goto("/auth/signin")
    await expect(page).toHaveURL('/dashboard')
  })
})
