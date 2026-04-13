"use client"

/**
 * Development-only Web Vitals component.
 * Renders nothing in production — bundle is tree-shaken.
 */
export function WebVitalsDev() {
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  // Dynamic import only in dev
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-require-imports
  const { WebVitals } = require("./web-vitals")
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return <WebVitals />
}
