"use client"

import {
  useTranslations as useNextIntlTranslations,
  useLocale as useNextIntlLocale,
} from "next-intl"
import { useState, useEffect } from "react"
import { type Locale, defaultLocale } from "./config"
import type { TranslationKeys } from "./types"

/**
 * Хук для получения переводов с типизацией
 * @example
 * const t = useI18n()
 * return <h1>{t('title')}</h1>
 */
export function useI18n() {
  return useNextIntlTranslations<TranslationKeys>()
}

/**
 * Хук для получения текущей локали
 */
export function useLocale() {
  return useNextIntlLocale()
}

/**
 * Хук для управления языком с сохранением в localStorage
 * @example
 * const { locale, setLocale } = useLanguage()
 * return <button onClick={() => setLocale('en')}>EN</button>
 */
export function useLanguage() {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  // Инициализация locale из localStorage после монтирования
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("NEXT_LOCALE") as Locale | null
      if (saved && ["ru", "en", "zh", "he"].includes(saved)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocaleState(saved)
      }
      setMounted(true)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== "undefined") {
      localStorage.setItem("NEXT_LOCALE", newLocale)
      // Обновляем атрибут lang у html элемента
      document.documentElement.lang = newLocale
      // Обновляем dir для RTL языков
      document.documentElement.dir = newLocale === "he" ? "rtl" : "ltr"
    }
  }

  // Возвращаем defaultLocale до монтирования для SSR consistency
  if (!mounted) {
    return {
      locale: defaultLocale,
      setLocale: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    }
  }

  return {
    locale,
    setLocale,
  }
}

/**
 * Хук для получения переводов с namespace
 * @example
 * const t = useI18nNamespace('canvas.waveFunction')
 * return <h1>{t('title')}</h1>
 */
export function useI18nNamespace<N extends keyof TranslationKeys>(namespace: N) {
  return useNextIntlTranslations(namespace)
}
