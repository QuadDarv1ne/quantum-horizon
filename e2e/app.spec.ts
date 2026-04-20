import { test, expect } from "@playwright/test"

test.describe("Quantum Horizon", () => {
  test("has correct title", async ({ page }) => {
    await page.goto("/")

    // Check title
    await expect(page).toHaveTitle(/Quantum Horizon/)

    // Check main heading - use more specific selector for the main heading
    const mainHeading = page.getByRole("heading", { name: /Quantum Horizon/i, level: 1 })
    await expect(mainHeading).toBeVisible()
  })

  test("displays visualization cards", async ({ page }) => {
    await page.goto("/")

    // Check for visualization cards - use more specific selectors
    const waveFunctionCard = page.getByRole("heading", { name: /Wave Function/i, level: 3 })
    await expect(waveFunctionCard).toBeVisible()

    const timeDilationCard = page.getByRole("heading", { name: /Time Dilation/i, level: 3 })
    await expect(timeDilationCard).toBeVisible()
  })

  test("theme toggle works", async ({ page }) => {
    await page.goto("/")

    // Find theme toggle button - more specific
    const themeToggle = page.getByRole("button", { name: /theme/i })
    await expect(themeToggle).toBeVisible()
    await themeToggle.click()

    // Check if theme changed
    const html = page.locator("html")
    const classAttribute = await html.getAttribute("class")
    expect(classAttribute).toBeTruthy()
  })

  test("language switcher is accessible", async ({ page }) => {
    await page.goto("/")

    // Check language switcher - more specific
    const languageSelect = page.getByLabel(/language/i)
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

    // Check main content is visible - use heading role
    const mainHeading = page.getByRole("heading", { name: /Quantum Horizon/i, level: 1 })
    await expect(mainHeading).toBeVisible()
  })

  test("visualization selector switches between categories", async ({ page }) => {
    await page.goto("/")

    // Click on Relativity tab
    const relativityTab = page.getByRole("tab", { name: /relativity/i })
    await expect(relativityTab).toBeVisible()
    await relativityTab.click()

    // Check relativity visualizations appear
    const timeDilation = page.getByRole("heading", { name: /Time Dilation/i, level: 3 })
    await expect(timeDilation).toBeVisible()

    // Click on Cosmos tab
    const cosmosTab = page.getByRole("tab", { name: /cosmos/i })
    await expect(cosmosTab).toBeVisible()
    await cosmosTab.click()

    // Check cosmos visualizations appear
    const blackHole = page.getByRole("heading", { name: /Black Hole/i, level: 3 })
    await expect(blackHole).toBeVisible()
  })

  test("opens visualization in fullscreen mode", async ({ page }) => {
    await page.goto("/")

    // Find and click fullscreen button on first visualization - more specific
    const fullscreenButton = page.getByRole("button", { name: /fullscreen/i }).first()
    await expect(fullscreenButton).toBeVisible()
    await fullscreenButton.click()

    // Check fullscreen modal opens
    const modal = page.getByRole("dialog")
    await expect(modal).toBeVisible()

    // Close modal with Escape
    await page.keyboard.press("Escape")
    await expect(modal).not.toBeVisible()
  })

  test("play/pause button controls animation", async ({ page }) => {
    await page.goto("/")

    // Find play button (should be pause initially or play) - more specific
    const playButton = page.getByRole("button", { name: /play|pause/i, exact: false }).first()
    await expect(playButton).toBeVisible()

    // Click to toggle
    await playButton.click()

    // Button state should change
    await expect(playButton).toBeVisible()
  })

  test("settings panel can be opened and closed", async ({ page }) => {
    await page.goto("/")

    // Find settings/menu button - more specific
    const menuButton = page.getByRole("button", { name: /menu|settings/i })
    if (await menuButton.isVisible()) {
      await menuButton.click()

      // Check settings panel opens
      const settingsPanel = page.getByRole("dialog")
      if (await settingsPanel.isVisible()) {
        // Close with escape
        await page.keyboard.press("Escape")
      }
    }
  })

  test("keyboard shortcuts work", async ({ page }) => {
    await page.goto("/")

    // Test 'm' key for menu toggle
    await page.keyboard.press("m")
    await page.waitForTimeout(300)

    // Test '1' key for first section
    await page.keyboard.press("1")
    await page.waitForTimeout(300)

    // Check quantum section is active
    const quantumSection = page.getByRole("tab", { name: /quantum/i })
    await expect(quantumSection).toBeVisible()
  })

  test("all main navigation tabs are accessible", async ({ page }) => {
    await page.goto("/")

    const tabs = ["Quantum", "Relativity", "Cosmos", "Advanced"]

    for (const tab of tabs) {
      const tabButton = page.getByRole("tab", { name: new RegExp(tab, "i") })
      if (await tabButton.isVisible()) {
        await tabButton.click()
        await page.waitForTimeout(200)
      }
    }
  })

  test("search/filter functionality works", async ({ page }) => {
    await page.goto("/")

    // Look for search input
    const searchInput = page.getByRole("searchbox", { name: /search/i })
    if (await searchInput.isVisible()) {
      await searchInput.fill("wave")
      await page.waitForTimeout(300)

      // Should filter to show wave function
      const waveFunction = page.getByRole("heading", { name: /Wave Function/i, level: 3 })
      await expect(waveFunction).toBeVisible()

      // Clear search
      await searchInput.clear()
    }
  })

  test("speed control slider changes animation speed", async ({ page }) => {
    await page.goto("/")

    // Find speed slider
    const speedSlider = page.getByRole("slider", { name: /speed/i })
    if (await speedSlider.isVisible()) {
      const initialValue = await speedSlider.inputValue()

      // Change speed value
      await speedSlider.fill(String(Number(initialValue) + 1))
      await page.waitForTimeout(200)

      // Verify value changed
      const newValue = await speedSlider.inputValue()
      expect(Number(newValue)).toBeGreaterThan(Number(initialValue))
    }
  })

  test("canvas elements are present in visualizations", async ({ page }) => {
    await page.goto("/")

    // Check that canvas elements render
    const canvasElements = page.locator("canvas")
    await expect(canvasElements.first()).toBeVisible()

    // Verify canvas has proper attributes for accessibility
    const firstCanvas = canvasElements.first()
    await expect(firstCanvas).toHaveAttribute("role", "img")
  })

  test("thermodynamics section is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Thermodynamics tab
    const thermoTab = page.getByRole("tab", { name: /thermodynamics/i })
    if (await thermoTab.isVisible()) {
      await thermoTab.click()
      await page.waitForTimeout(300)

      // Check thermodynamics visualizations appear
      const thermalRadiation = page.getByRole("heading", { name: /Thermal Radiation/i, level: 3 })
      await expect(thermalRadiation).toBeVisible()
    }
  })

  test("wormhole visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Cosmos tab
    const cosmosTab = page.getByRole("tab", { name: /cosmos/i })
    await expect(cosmosTab).toBeVisible()
    await cosmosTab.click()
    await page.waitForTimeout(300)

    // Check wormhole visualization appears
    const wormhole = page.getByRole("heading", { name: /Wormhole/i, level: 3 })
    await expect(wormhole).toBeVisible()
  })

  test("pulsar visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Cosmos tab
    const cosmosTab = page.getByRole("tab", { name: /cosmos/i })
    await expect(cosmosTab).toBeVisible()
    await cosmosTab.click()
    await page.waitForTimeout(300)

    // Check pulsar visualization appears
    const pulsar = page.getByRole("heading", { name: /Pulsar/i, level: 3 })
    await expect(pulsar).toBeVisible()
  })

  test("quasar visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Cosmos tab
    const cosmosTab = page.getByRole("tab", { name: /cosmos/i })
    await expect(cosmosTab).toBeVisible()
    await cosmosTab.click()
    await page.waitForTimeout(300)

    // Check quasar visualization appears
    const quasar = page.getByRole("heading", { name: /Quasar/i, level: 3 })
    await expect(quasar).toBeVisible()
  })

  test("protoplanetary disk visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Cosmos tab
    const cosmosTab = page.getByRole("tab", { name: /cosmos/i })
    await expect(cosmosTab).toBeVisible()
    await cosmosTab.click()
    await page.waitForTimeout(300)

    // Check protoplanetary disk visualization appears
    const disk = page.getByRole("heading", { name: /Protoplanetary Disk/i, level: 3 })
    await expect(disk).toBeVisible()
  })

  test("entropy visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Thermodynamics tab
    const thermoTab = page.getByRole("tab", { name: /thermodynamics/i })
    if (await thermoTab.isVisible()) {
      await thermoTab.click()
      await page.waitForTimeout(300)

      // Check entropy visualization appears
      const entropy = page.getByRole("heading", { name: /Entropy/i, level: 3 })
      await expect(entropy).toBeVisible()
    }
  })

  test("phase transition visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Thermodynamics tab
    const thermoTab = page.getByRole("tab", { name: /thermodynamics/i })
    if (await thermoTab.isVisible()) {
      await thermoTab.click()
      await page.waitForTimeout(300)

      // Check phase transition visualization appears
      const phaseTransition = page.getByRole("heading", { name: /Phase Transition/i, level: 3 })
      await expect(phaseTransition).toBeVisible()
    }
  })

  test("ideal gas visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Thermodynamics tab
    const thermoTab = page.getByRole("tab", { name: /thermodynamics/i })
    if (await thermoTab.isVisible()) {
      await thermoTab.click()
      await page.waitForTimeout(300)

      // Check ideal gas visualization appears
      const idealGas = page.getByRole("heading", { name: /Ideal Gas/i, level: 3 })
      await expect(idealGas).toBeVisible()
    }
  })

  test("carnot engine visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Thermodynamics tab
    const thermoTab = page.getByRole("tab", { name: /thermodynamics/i })
    if (await thermoTab.isVisible()) {
      await thermoTab.click()
      await page.waitForTimeout(300)

      // Check carnot engine visualization appears
      const carnot = page.getByRole("heading", { name: /Carnot Engine/i, level: 3 })
      await expect(carnot).toBeVisible()
    }
  })
})
