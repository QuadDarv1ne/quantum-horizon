/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getRequestConfig } from "next-intl/server"
import type { Locale } from "./config"

export { locales, type Locale } from "./config"

// Client-side hook for translations
export { useTranslations } from "next-intl"

// Server-side utilities
export { getTranslations, getLocale, getMessages } from "next-intl/server"

// Request config for next.config.ts

export default getRequestConfig(async ({ locale }) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const messages = await import(`./messages/${locale!}.json`)
  return {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    locale: locale!,
    messages: messages.default,
  }
})
