import { getRequestConfig } from "next-intl/server"
import { locales, type Locale } from "./config"

function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Validate locale
  if (!locale || !isValidLocale(locale)) {
    locale = "ru"
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
