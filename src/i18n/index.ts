// Client-side hooks for translations
export { useI18n, useLocale, useLanguage, useI18nNamespace } from "./use-i18n"

// Re-export from next-intl for direct usage
export { useTranslations } from "next-intl"
export { useLocale } from "next-intl"

// Server-side utilities
export { getTranslations, getLocale, getMessages } from "next-intl/server"

// Re-export config types
export { locales, defaultLocale, type Locale } from "./config"

// Re-export types
export type { TranslationKeys, TranslationFunction, UseTranslations } from "./types"
