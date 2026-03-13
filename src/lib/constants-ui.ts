export const NAV_ITEMS = [
  { id: "quantum", label: "quantum", color: "from-purple-600 to-blue-600" },
  { id: "relativity", label: "relativity", color: "from-yellow-600 to-orange-600" },
  { id: "cosmos", label: "cosmos", color: "from-red-600 to-purple-600" },
  { id: "advanced", label: "advanced", color: "from-pink-600 to-purple-600" },
] as const

export const SECTIONS = ["quantum", "relativity", "cosmos", "advanced"] as const
export const LANGUAGES = ["ru", "en", "zh", "he"] as const

export type Section = (typeof SECTIONS)[number]
export type Language = (typeof LANGUAGES)[number]

export function getSectionById(id: string): Section | undefined {
  return SECTIONS.find((s) => s === id)
}

export function getLanguageByCode(code: string): Language | undefined {
  return LANGUAGES.find((l) => l === code)
}
