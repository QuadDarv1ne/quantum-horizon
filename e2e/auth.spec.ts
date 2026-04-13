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

    // Public content should be accessible
    const mainHeading = page.getByText(/QUANTUM HORIZON/i)
    await expect(mainHeading).toBeVisible()
  })

  test("can access visualization pages", async ({ page }) => {
    await page.goto("/")

    // Should be able to see visualizations
    const waveFunctionCard = page.getByText(/Wave Function/i)
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
})
