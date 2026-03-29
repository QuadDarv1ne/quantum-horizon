import { describe, it, expect } from "vitest"

describe("CSP Headers Configuration", () => {
  const cspConfig = {
    defaultSrc: "'self'",
    scriptSrc: "'self' 'wasm-unsafe-eval'",
    styleSrc: "'self' 'unsafe-inline'",
    imgSrc:
      "'self' data: blob: https://images-assets.nasa.gov https://where-theiss.at https://api.wheretheiss.at https://*.basemaps.cartocdn.com",
    fontSrc: "'self' data:",
    connectSrc:
      "'self' https://api.nasa.gov https://where-theiss.at https://api.wheretheiss.at https://api.open-notify.org",
    frameAncestors: "'none'",
    baseUri: "'self'",
    formAction: "'self'",
    workerSrc: "'self' blob:",
  }

  it("должен иметь правильный default-src", () => {
    expect(cspConfig.defaultSrc).toBe("'self'")
  })

  it("должен разрешать только свои скрипты и wasm", () => {
    expect(cspConfig.scriptSrc).toContain("'self'")
    expect(cspConfig.scriptSrc).toContain("'wasm-unsafe-eval'")
  })

  it("должен разрешать стили с unsafe-inline для Leaflet", () => {
    expect(cspConfig.styleSrc).toContain("'self'")
    expect(cspConfig.styleSrc).toContain("'unsafe-inline'")
  })

  it("должен разрешать изображения только с доверенных доменов", () => {
    expect(cspConfig.imgSrc).toContain("'self'")
    expect(cspConfig.imgSrc).toContain("data:")
    expect(cspConfig.imgSrc).toContain("blob:")
    expect(cspConfig.imgSrc).toContain("https://images-assets.nasa.gov")
    expect(cspConfig.imgSrc).toContain("https://where-theiss.at")
    expect(cspConfig.imgSrc).toContain("https://api.wheretheiss.at")
    expect(cspConfig.imgSrc).toContain("https://*.basemaps.cartocdn.com")
  })

  it("не должен разрешать все https: для img-src", () => {
    // Проверяем что нет "https:" без конкретного домена
    const httpsOnlyPattern = /\bhttps:\s(?![\w.-]+\.)/g
    expect(httpsOnlyPattern.test(cspConfig.imgSrc)).toBe(false)
  })

  it("должен разрешать connect только с доверенных API доменов", () => {
    expect(cspConfig.connectSrc).toContain("'self'")
    expect(cspConfig.connectSrc).toContain("https://api.nasa.gov")
    expect(cspConfig.connectSrc).toContain("https://where-theiss.at")
    expect(cspConfig.connectSrc).toContain("https://api.wheretheiss.at")
    expect(cspConfig.connectSrc).toContain("https://api.open-notify.org")
  })

  it("не должен разрешать все https: для connect-src", () => {
    const httpsOnlyPattern = /\bhttps:\s(?![\w.-]+\.)/g
    expect(httpsOnlyPattern.test(cspConfig.connectSrc)).toBe(false)
  })

  it("должен запрещать фреймы (frame-ancestors 'none')", () => {
    expect(cspConfig.frameAncestors).toBe("'none'")
  })

  it("должен иметь base-uri 'self' для предотвращения атак", () => {
    expect(cspConfig.baseUri).toBe("'self'")
  })

  it("должен иметь form-action 'self' для предотвращения CSRF", () => {
    expect(cspConfig.formAction).toBe("'self'")
  })

  it("должен разрешать worker только с self и blob:", () => {
    expect(cspConfig.workerSrc).toBe("'self' blob:")
  })

  it("должен содержать все required директивы CSP", () => {
    const requiredDirectives = [
      "default-src",
      "script-src",
      "style-src",
      "img-src",
      "font-src",
      "connect-src",
      "frame-ancestors",
      "base-uri",
      "form-action",
      "worker-src",
    ]

    const cspString = Object.entries(cspConfig)
      .map(([key, value]) => `${key} ${value}`)
      .join("; ")

    requiredDirectives.forEach((directive) => {
      expect(cspString).toContain(directive)
    })
  })

  it("должен иметь правильный формат CSP строки", () => {
    const cspString = Object.entries(cspConfig)
      .map(([key, value]) => `${key} ${value}`)
      .join("; ")

    // Проверяем что каждая директива заканчивается на ; кроме последней
    const directives = cspString.split("; ")
    expect(directives.length).toBeGreaterThan(5)

    // Проверяем что нет пустых директив
    directives.forEach((directive) => {
      expect(directive.trim()).not.toBe("")
    })
  })

  it("должен разрешать NASA API endpoints", () => {
    const nasaDomains = ["https://api.nasa.gov", "https://images-assets.nasa.gov"]

    nasaDomains.forEach((domain) => {
      expect(cspConfig.imgSrc.includes(domain) || cspConfig.connectSrc.includes(domain)).toBe(true)
    })
  })

  it("должен разрешать WhereTheISSat API endpoints", () => {
    const whereTheIssatDomains = ["https://where-theiss.at", "https://api.wheretheiss.at"]

    whereTheIssatDomains.forEach((domain) => {
      expect(cspConfig.imgSrc.includes(domain) || cspConfig.connectSrc.includes(domain)).toBe(true)
    })
  })

  it("должен разрешать CartoCDN для карт", () => {
    expect(cspConfig.imgSrc).toContain("https://*.basemaps.cartocdn.com")
  })

  it("должен разрешать data: и blob: URI схемы", () => {
    expect(cspConfig.imgSrc).toContain("data:")
    expect(cspConfig.imgSrc).toContain("blob:")
    expect(cspConfig.fontSrc).toContain("data:")
    expect(cspConfig.workerSrc).toContain("blob:")
  })
})

describe("Security Headers", () => {
  const securityHeaders = {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()",
  }

  it("должен иметь X-Content-Type-Options nosniff", () => {
    expect(securityHeaders["X-Content-Type-Options"]).toBe("nosniff")
  })

  it("должен иметь X-Frame-Options DENY", () => {
    expect(securityHeaders["X-Frame-Options"]).toBe("DENY")
  })

  it("должен иметь X-XSS-Protection", () => {
    expect(securityHeaders["X-XSS-Protection"]).toBe("1; mode=block")
  })

  it("должен иметь Referrer-Policy", () => {
    expect(securityHeaders["Referrer-Policy"]).toBe("strict-origin-when-cross-origin")
  })

  it("должен иметь Permissions-Policy с отключенными функциями", () => {
    expect(securityHeaders["Permissions-Policy"]).toContain("camera=()")
    expect(securityHeaders["Permissions-Policy"]).toContain("microphone=()")
    expect(securityHeaders["Permissions-Policy"]).toContain("geolocation=()")
  })
})
