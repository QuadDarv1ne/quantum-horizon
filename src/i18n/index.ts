// Client-side hook for translations
export { useTranslations } from "next-intl"

// Server-side utilities
export { getTranslations, getLocale, getMessages } from "next-intl/server"

// Re-export config types
export { locales, type Locale } from "./config"
