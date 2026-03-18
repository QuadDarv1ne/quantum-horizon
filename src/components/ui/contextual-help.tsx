"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { HelpCircle, Lightbulb, BookOpen, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ContextualHelpProps {
  visualizationType: string
  className?: string
}

interface HelpContent {
  title: string
  description: string
  physicsConcept: string
  realWorldApplication: string
  difficulty: "beginner" | "intermediate" | "advanced"
  relatedFormulas?: string[]
  wikiLink?: string
}

const helpContent: Record<string, HelpContent> = {
  waveFunction: {
    title: "Волновая функция",
    description:
      "Математическое описание квантового состояния системы. Квадрат модуля волновой функции определяет вероятность обнаружения частицы.",
    physicsConcept:
      "Ψ(x,t) содержит всю информацию о квантовой системе. Это комплекснозначная функция, которая эволюционирует согласно уравнению Шрёдингера.",
    realWorldApplication:
      "Используется для расчёта вероятностей в квантовой механике, необходима для понимания атомной структуры и химических связей.",
    difficulty: "intermediate",
    relatedFormulas: ["iℏ ∂Ψ/∂t = ĤΨ", "|Ψ|² = вероятность"],
    wikiLink: "https://ru.wikipedia.org/wiki/Волновая_функция",
  },
  uncertainty: {
    title: "Принцип неопределённости",
    description:
      "Фундаментальное ограничение на точность одновременного измерения определённых пар физических величин, например, координаты и импульса.",
    physicsConcept:
      "Δx·Δp ≥ ℏ/2. Невозможно одновременно точно измерить положение и импульс частицы. Это не техническое ограничение, а свойство природы.",
    realWorldApplication:
      "Объясняет стабильность атомов, ограничивает миниатюризацию транзисторов, влияет на работу лазеров и квантовых компьютеров.",
    difficulty: "advanced",
    relatedFormulas: ["Δx·Δp ≥ ℏ/2", "ΔE·Δt ≥ ℏ/2"],
    wikiLink: "https://ru.wikipedia.org/wiki/Принцип_неопределённости",
  },
  tunneling: {
    title: "Квантовое туннелирование",
    description:
      "Явление прохождения квантовой частицей потенциального барьера даже в случаях, когда её энергия меньше высоты барьера.",
    physicsConcept:
      "Благодаря волновой природе, частица имеет ненулевую вероятность оказаться по другую сторону барьера. Вероятность экспоненциально падает с шириной барьера.",
    realWorldApplication:
      "Работа сканирующего туннельного микроскопа, альфа-распад, термоядерные реакции в звёздах, флэш-память.",
    difficulty: "advanced",
    relatedFormulas: ["T ≈ e^(-2κL)", "κ = √(2m(V-E))/ℏ"],
    wikiLink: "https://ru.wikipedia.org/wiki/Туннельный_эффект",
  },
  timeDilation: {
    title: "Замедление времени",
    description:
      "Эффект специальной теории относительности: движущиеся часы идут медленнее покоящихся с точки зрения неподвижного наблюдателя.",
    physicsConcept:
      "t' = t/√(1-v²/c²). При скоростях, близких к скорости света, время замедляется. Это подтверждено экспериментально с атомными часами.",
    realWorldApplication:
      "GPS-спутники требуют коррекции на релятивистские эффекты, ускорители частиц, космические путешествия.",
    difficulty: "intermediate",
    relatedFormulas: ["t' = t/γ", "γ = 1/√(1-v²/c²)"],
    wikiLink: "https://ru.wikipedia.org/wiki/Релятивистское_замедление_времени",
  },
  hrDiagram: {
    title: "Диаграмма Герцшпрунга — Рассела",
    description:
      "Зависимость между светимостью звезды и её температурой поверхности. Позволяет классифицировать звёзды и изучать их эволюцию.",
    physicsConcept:
      "Большинство звёзд находятся на главной последовательности. Положение звезды зависит от массы, возраста и химического состава.",
    realWorldApplication:
      "Определение возраста звёздных скоплений, изучение эволюции звёзд, предсказание судьбы Солнца.",
    difficulty: "beginner",
    relatedFormulas: ["L ∝ M³·⁵", "L = 4πR²σT⁴"],
    wikiLink: "https://ru.wikipedia.org/wiki/Диаграмма_Герцшпрунга_—_Рассела",
  },
  blackHole: {
    title: "Чёрные дыры",
    description:
      "Область пространства-времени с настолько сильной гравитацией, что покинуть её не могут даже объекты, движущиеся со скоростью света.",
    physicsConcept:
      "Радиус Шварцшильда: Rs = 2GM/c². Внутри горизонта событий пространство и время меняются ролями. Сингулярность в центре.",
    realWorldApplication:
      "Изучение гравитационных волн, влияние на эволюцию галактик, тестирование общей теории относительности.",
    difficulty: "advanced",
    relatedFormulas: ["Rs = 2GM/c²", "S = kA/4"],
    wikiLink: "https://ru.wikipedia.org/wiki/Чёрная_дыра",
  },
  doubleSlit: {
    title: "Двухщелевой эксперимент",
    description:
      "Демонстрация корпускулярно-волнового дуализма. Частицы создают интерференционную картину, характерную для волн.",
    physicsConcept:
      "Каждая частица интерферирует сама с собой, проходя через обе щели одновременно. Наблюдение разрушает интерференцию.",
    realWorldApplication:
      "Фундаментальное понимание квантовой природы, электронная микроскопия, квантовая криптография.",
    difficulty: "beginner",
    relatedFormulas: ["d·sinθ = nλ", "I = I₁ + I₂ + 2√(I₁I₂)cos(δ)"],
    wikiLink: "https://ru.wikipedia.org/wiki/Опыт_Юнга",
  },
  darkMatter: {
    title: "Тёмная материя",
    description:
      "Гипотетическая форма материи, не взаимодействующая с электромагнитным излучением, но создающая гравитационные эффекты.",
    physicsConcept:
      "Составляет ~27% Вселенной. Обнаружена по вращению галактик и гравитационному линзированию. Природа неизвестна.",
    realWorldApplication:
      "Формирование крупномасштабной структуры Вселенной, динамика галактик, космологические модели.",
    difficulty: "advanced",
    relatedFormulas: ["v = √(GM/r)", "Ω_dm ≈ 0.27"],
    wikiLink: "https://ru.wikipedia.org/wiki/Тёмная_материя",
  },
}

export function ContextualHelp({ visualizationType, className }: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false)
  const content = helpContent[visualizationType]

  if (!content) {
    return (
      <Button variant="outline" size="sm" disabled className={cn("gap-2 opacity-50", className)}>
        <HelpCircle className="h-4 w-4" />
        Справка
      </Button>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500 hover:bg-green-600"
      case "intermediate":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "advanced":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "Начальный"
      case "intermediate":
        return "Средний"
      case "advanced":
        return "Продвинутый"
      default:
        return difficulty
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-2 transition-all hover:scale-105", className)}
        >
          <HelpCircle className="h-4 w-4" />
          Помощь
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="h-8 w-8 text-yellow-500" />
            <div>
              <DialogTitle className="text-2xl">{content.title}</DialogTitle>
              <Badge className={cn("mt-1", getDifficultyColor(content.difficulty))}>
                {getDifficultyLabel(content.difficulty)}
              </Badge>
            </div>
          </div>
          <DialogDescription className="text-base">{content.description}</DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Physics Concept */}
          <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-blue-50 p-4 dark:from-purple-950/30 dark:to-blue-950/30">
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold">Физическая концепция</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{content.physicsConcept}</p>
          </div>

          {/* Formulas */}
          {content.relatedFormulas && content.relatedFormulas.length > 0 && (
            <div className="rounded-lg border bg-black/5 p-4 font-mono text-sm dark:bg-white/5">
              <div className="mb-2 flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-600" />
                <h3 className="font-semibold">Формулы</h3>
              </div>
              <div className="space-y-2">
                {content.relatedFormulas.map((formula, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded bg-white/50 px-3 py-2 dark:bg-black/30"
                  >
                    {formula}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Real World Application */}
          <div className="rounded-lg border bg-gradient-to-br from-green-50 to-emerald-50 p-4 dark:from-green-950/30 dark:to-emerald-950/30">
            <div className="mb-2 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Применение в реальном мире</h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">{content.realWorldApplication}</p>
          </div>

          {/* Wiki Link */}
          {content.wikiLink && (
            <a
              href={content.wikiLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center justify-center gap-2 rounded-lg p-3 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              Узнать больше в Википедии
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
