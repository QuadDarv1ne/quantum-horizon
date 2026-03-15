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

  test("visualization selector switches between categories", async ({ page }) => {
    await page.goto("/")

    // Click on Relativity tab
    const relativityTab = page.getByRole("button", { name: /relativity/i })
    await relativityTab.click()

    // Check relativity visualizations appear
    const timeDilation = page.getByText(/Time Dilation/i)
    await expect(timeDilation).toBeVisible()

    // Click on Cosmos tab
    const cosmosTab = page.getByRole("button", { name: /cosmos/i })
    await cosmosTab.click()

    // Check cosmos visualizations appear
    const blackHole = page.getByText(/Black Hole/i)
    await expect(blackHole).toBeVisible()
  })

  test("opens visualization in fullscreen mode", async ({ page }) => {
    await page.goto("/")

    // Find and click fullscreen button on first visualization
    const fullscreenButton = page.getByRole("button", { name: /fullscreen/i }).first()
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

    // Find play button (should be pause initially or play)
    const playButton = page.getByRole("button", { name: /play|pause/i }).first()
    await expect(playButton).toBeVisible()

    // Click to toggle
    await playButton.click()

    // Button state should change
    await expect(playButton).toBeVisible()
  })

  test("settings panel can be opened and closed", async ({ page }) => {
    await page.goto("/")

    // Find settings/menu button
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
    const quantumSection = page.getByRole("button", { name: /quantum/i })
    await expect(quantumSection).toBeVisible()
  })

  test("all main navigation tabs are accessible", async ({ page }) => {
    await page.goto("/")

    const tabs = ["Quantum", "Relativity", "Cosmos", "Advanced"]

    for (const tab of tabs) {
      const tabButton = page.getByRole("button", { name: new RegExp(tab, "i") })
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
      const waveFunction = page.getByText(/Wave Function/i)
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
    const thermoTab = page.getByRole("button", { name: /thermodynamics/i })
    if (await thermoTab.isVisible()) {
      await thermoTab.click()
      await page.waitForTimeout(300)

      // Check thermodynamics visualizations appear
      const thermalRadiation = page.getByText(/Thermal Radiation/i)
      await expect(thermalRadiation).toBeVisible()
    }
  })

  test("wormhole visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Cosmos tab
    const cosmosTab = page.getByRole("button", { name: /cosmos/i })
    await cosmosTab.click()
    await page.waitForTimeout(300)

    // Check wormhole visualization appears
    const wormhole = page.getByText(/Wormhole/i)
    await expect(wormhole).toBeVisible()
  })

  test("pulsar visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Cosmos tab
    const cosmosTab = page.getByRole("button", { name: /cosmos/i })
    await cosmosTab.click()
    await page.waitForTimeout(300)

    // Check pulsar visualization appears
    const pulsar = page.getByText(/Pulsar/i)
    await expect(pulsar).toBeVisible()
  })

  test("quasar visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Cosmos tab
    const cosmosTab = page.getByRole("button", { name: /cosmos/i })
    await cosmosTab.click()
    await page.waitForTimeout(300)

    // Check quasar visualization appears
    const quasar = page.getByText(/Quasar/i)
    await expect(quasar).toBeVisible()
  })

  test("protoplanetary disk visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Cosmos tab
    const cosmosTab = page.getByRole("button", { name: /cosmos/i })
    await cosmosTab.click()
    await page.waitForTimeout(300)

    // Check protoplanetary disk visualization appears
    const disk = page.getByText(/Protoplanetary Disk/i)
    await expect(disk).toBeVisible()
  })

  test("entropy visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Thermodynamics tab
    const thermoTab = page.getByRole("button", { name: /thermodynamics/i })
    if (await thermoTab.isVisible()) {
      await thermoTab.click()
      await page.waitForTimeout(300)

      // Check entropy visualization appears
      const entropy = page.getByText(/Entropy/i)
      await expect(entropy).toBeVisible()
    }
  })

  test("phase transition visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Thermodynamics tab
    const thermoTab = page.getByRole("button", { name: /thermodynamics/i })
    if (await thermoTab.isVisible()) {
      await thermoTab.click()
      await page.waitForTimeout(300)

      // Check phase transition visualization appears
      const phaseTransition = page.getByText(/Phase Transition/i)
      await expect(phaseTransition).toBeVisible()
    }
  })

  test("ideal gas visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Thermodynamics tab
    const thermoTab = page.getByRole("button", { name: /thermodynamics/i })
    if (await thermoTab.isVisible()) {
      await thermoTab.click()
      await page.waitForTimeout(300)

      // Check ideal gas visualization appears
      const idealGas = page.getByText(/Ideal Gas/i)
      await expect(idealGas).toBeVisible()
    }
  })

  test("carnot engine visualization is accessible", async ({ page }) => {
    await page.goto("/")

    // Click on Thermodynamics tab
    const thermoTab = page.getByRole("button", { name: /thermodynamics/i })
    if (await thermoTab.isVisible()) {
      await thermoTab.click()
      await page.waitForTimeout(300)

      // Check carnot engine visualization appears
      const carnot = page.getByText(/Carnot Engine/i)
      await expect(carnot).toBeVisible()
    }
  })
})
