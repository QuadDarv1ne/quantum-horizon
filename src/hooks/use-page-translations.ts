import { useTranslations, useLocale } from "next-intl"
import { useMemo } from "react"

type Locale = "ru" | "en" | "zh" | "he"

interface Texts {
  about: string
  sections: string
  visualizations: string
  formulas: string
  settings: string
  language: string
  theme: string
  footer: string
  keyboard: string
  menu: string
}

interface VisualizationLabels {
  waveFunction: string
  uncertainty: string
  tunneling: string
  timeDilation: string
  hrDiagram: string
  neutronStar: string
  blackHole: string
  whiteHole: string
  doubleSlit: string
  darkMatter: string
}

interface FormulaExamples {
  items: string[]
}

const TEXTS: Record<Locale, Texts> = {
  ru: {
    about: "📚 О проекте",
    sections: "📖 Разделы",
    visualizations: "🔬 Визуализации",
    formulas: "📐 Формулы",
    settings: "⚙️ Настройки",
    language: "Язык",
    theme: "Тема",
    footer: "Создано с ❤️ для любителей физики",
    keyboard: "Клавиши: 1-4 разделы, M меню, Esc закрыть",
    menu: "Меню",
  },
  en: {
    about: "📚 About",
    sections: "📖 Sections",
    visualizations: "🔬 Visualizations",
    formulas: "📐 Formulas",
    settings: "⚙️ Settings",
    language: "Language",
    theme: "Theme",
    footer: "Made with ❤️ for physics enthusiasts",
    keyboard: "Keys: 1-4 sections, M menu, Esc close",
    menu: "Menu",
  },
  zh: {
    about: "📚 关于项目",
    sections: "📖 章节",
    visualizations: "🔬 可视化",
    formulas: "📐 公式",
    settings: "⚙️ 设置",
    language: "语言",
    theme: "主题",
    footer: "为物理爱好者用❤️制作",
    keyboard: "快捷键：1-4 章节，M 菜单，Esc 关闭",
    menu: "菜单",
  },
  he: {
    about: "📚 אודות",
    sections: "📖 סעיפים",
    visualizations: "🔬 ויזואליזציות",
    formulas: "📐 נוסחאות",
    settings: "⚙️ הגדרות",
    language: "שפה",
    theme: "ערכת נושא",
    footer: "נבנה ב❤️ לחובבי פיזיקה",
    keyboard: "מקשים: 1-4 סעיפים, M תפריט, Esc סגור",
    menu: "תפריט",
  },
}

const VISUALIZATION_LABELS: Record<Locale, VisualizationLabels> = {
  ru: {
    waveFunction: "Волновая функция",
    uncertainty: "Принцип неопределённости",
    tunneling: "Квантовое туннелирование",
    timeDilation: "Замедление времени",
    hrDiagram: "Диаграмма Г-Р",
    neutronStar: "Нейтронная звезда",
    blackHole: "Чёрная дыра",
    whiteHole: "Белая дыра",
    doubleSlit: "Двойная щель",
    darkMatter: "Тёмная материя",
  },
  en: {
    waveFunction: "Wave Function",
    uncertainty: "Uncertainty Principle",
    tunneling: "Quantum Tunneling",
    timeDilation: "Time Dilation",
    hrDiagram: "H-R Diagram",
    neutronStar: "Neutron Star",
    blackHole: "Black Hole",
    whiteHole: "White Hole",
    doubleSlit: "Double Slit",
    darkMatter: "Dark Matter",
  },
  zh: {
    waveFunction: "波函数",
    uncertainty: "不确定性原理",
    tunneling: "量子隧穿",
    timeDilation: "时间膨胀",
    hrDiagram: "赫罗图",
    neutronStar: "中子星",
    blackHole: "黑洞",
    whiteHole: "白洞",
    doubleSlit: "双缝实验",
    darkMatter: "暗物质",
  },
  he: {
    waveFunction: "פונקציית גל",
    uncertainty: "עיקרון אי-הוודאות",
    tunneling: "מינהור קוונטי",
    timeDilation: "התארכות זמן",
    hrDiagram: "דיאגרמת H-R",
    neutronStar: "כוכב נייטרון",
    blackHole: "חור שחור",
    whiteHole: "חור לבן",
    doubleSlit: "סדק כפול",
    darkMatter: "חומר אפל",
  },
}

const FORMULAS: FormulaExamples = {
  items: [
    "E = mc²",
    "Δx·Δp ≥ ℏ/2",
    "ψ(x,t) = Ae^(i(kx-ωt))",
    "R_s = 2GM/c²",
    "T_H = ℏc³/8πGMk_B",
    "γ = 1/√(1-v²/c²)",
  ],
}

export function usePageTranslations() {
  const t = useTranslations()
  const locale = useLocale() as Locale

  return useMemo(
    () => ({
      t,
      locale,
      getTexts: () => TEXTS[locale],
      getVisualizationLabels: () => VISUALIZATION_LABELS[locale],
      getFormulas: () => FORMULAS,
    }),
    [t, locale]
  )
}
