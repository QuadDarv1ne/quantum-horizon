"use client"

import { useReportWebVitals } from "next/web-vitals"

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Web Vitals]", metric.name, metric.value)
    }

    // Send to analytics endpoint
    const body = {
      dsn: process.env.NEXT_PUBLIC_WEB_VITALS_DSN,
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating:
        metric.rating === "good"
          ? "good"
          : metric.rating === "needs-improvement"
            ? "needs-improvement"
            : "poor",
      delta: metric.delta,
      navigationType: metric.navigationType,
    }

    // Send to /api/web-vitals endpoint if configured
    if (process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT) {
      navigator.sendBeacon(process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT, JSON.stringify(body))
    }
  })

  return null
}
