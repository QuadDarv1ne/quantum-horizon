// Типы для переводов next-intl
import enMessages from "./messages/en.json"

type Messages = typeof enMessages

// Рекурсивный тип для извлечения всех ключей перевода
type FlattenMessages<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}.${string & keyof FlattenMessages<T[K]>}`
          : K
        : never
    }[keyof T]
  : never

// Извлекаем все возможные ключи переводов
export type TranslationKey = FlattenMessages<Messages>

// Тип для хука useTranslations
export type UseTranslations = <T extends TranslationKey = TranslationKey>(
  namespace?: T extends `${infer K}.${string}` ? K : never,
) => {
  (key: T): string
  raw: (key: T) => string
  rich: (key: T) => React.ReactNode
}
