import { test, expect } from "@playwright/test"

test.describe("Quantum Horizon", () => {
  test("has correct title", async ({ page }) => {
    await page.goto("/")
    
    // Check title
    await expect(page).toHaveTitle(/Quantum Horizon/)
    
    // Check main heading
    const mainHeading = page.getByText(/QUANTUM HORIZON/i)
    await expect(mainHeading).toBeVisible()
  })

  test("displays visualization cards", async ({ page }) => {
    await page.goto("/")
    
    // Check for visualization cards
    const waveFunctionCard = page.getByText(/Wave Function/i)
    await expect(waveFunctionCard).toBeVisible()
    
    const timeDilationCard = page.getByText(/Time Dilation/i)
    await expect(timeDilationCard).toBeVisible()
  })

  test("theme toggle works", async ({ page }) => {
    await page.goto("/")
    
    // Find theme toggle button
    const themeToggle = page.getByRole("button", { name: /theme/i })
    await themeToggle.click()
    
    // Check if theme changed
    const html = page.locator("html")
    const classAttribute = await html.getAttribute("class")
    expect(classAttribute).toBeTruthy()
  })

  test("language switcher is accessible", async ({ page }) => {
    await page.goto("/")
    
    // Check language switcher
    const languageSelect = page.getByRole("combobox", { name: /language/i })
    await expect(languageSelect).toBeVisible()
    
    // Test language change
    await languageSelect.selectOption("en")
    await page.waitForTimeout(500)
    
    // Check if English text appears
    const englishText = page.getByText(/From Particles to Cosmos/i)
    await expect(englishText).toBeVisible()
  })

  test("is responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/")
    
    // Check main content is visible
    const mainHeading = page.getByText(/QUANTUM HORIZON/i)
    await expect(mainHeading).toBeVisible()
  })
})
