import { getRequestConfig } from "next-intl/server"
import type { Locale } from "./config"

export { locales, type Locale } from "./config"

// Client-side hook for translations
export { useTranslations } from "next-intl"

// Server-side utilities
export { getTranslations, getLocale, getMessages } from "next-intl/server"

// Request config for next.config.ts
export default getRequestConfig(async ({ locale }) => {
  const messages = await import(`./messages/${String(locale)}.json`)
  return {
    locale,
    messages: messages.default,
  }
})
