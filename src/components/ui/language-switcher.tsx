"use client"

import { useLocale } from "next-intl"
import { useRouter, usePathname } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { locales, type Locale } from "@/i18n/config"

const languageNames: Record<Locale, string> = {
  ru: "Русский",
  en: "English",
}

export function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function handleLocaleChange(newLocale: string) {
    // Replace locale in pathname
    const newPathname = pathname.replace(
      new RegExp(`^/${locale}`),
      `/${newLocale}`,
    )
    router.push(newPathname)
  }

  return (
    <Select value={locale} onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-[120px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {languageNames[loc]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
