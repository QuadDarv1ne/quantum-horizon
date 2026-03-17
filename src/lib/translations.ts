// ==================== TRANSLATIONS ====================
// Re-export translations from JSON files for backward compatibility
import ruTranslations from "@/i18n/translations/ru.json"
import enTranslations from "@/i18n/translations/en.json"
import zhTranslations from "@/i18n/translations/zh.json"
import heTranslations from "@/i18n/translations/he.json"

export type Language = "ru" | "en" | "zh" | "he"

export type Translation = typeof ruTranslations

export const translations: Record<Language, Translation> = {
  ru: ruTranslations,
  en: enTranslations,
  zh: zhTranslations,
  he: heTranslations,
}

// Export individual translations for direct import
export { ruTranslations as ru, enTranslations as en, zhTranslations as zh, heTranslations as he }
