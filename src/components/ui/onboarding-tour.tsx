"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OnboardingStep {
  id: string
  title: string
  description: string
  targetElement?: string
  icon: React.ReactNode
  tip?: string
}

interface OnboardingTourProps {
  onComplete?: () => void
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Добро пожаловать в Quantum Horizon!",
    description:
      "Интерактивная платформа для изучения физики: от квантовой механики до космологии.",
    icon: <Sparkles className="h-6 w-6 text-purple-500" />,
    tip: "Используйте клавиши 1-5 для быстрого переключения разделов",
  },
  {
    id: "navigation",
    title: "Навигация по разделам",
    description:
      "Верхнее меню позволяет переключаться между основными разделами физики. Каждый раздел содержит интерактивные визуализации.",
    targetElement: "[role='navigation']",
    icon: <ChevronRight className="h-6 w-6 text-blue-500" />,
    tip: "Активный раздел подсвечивается градиентом",
  },
  {
    id: "visualizations",
    title: "Интерактивные визуализации",
    description:
      "Каждая визуализация реагирует на ваши действия. Изменяйте параметры и наблюдайте за результатами в реальном времени.",
    icon: <Sparkles className="h-6 w-6 text-pink-500" />,
    tip: "Наведите курсор на элементы управления для подсказок",
  },
  {
    id: "side-menu",
    title: "Боковое меню",
    description:
      "Полное меню со всеми разделами, визуализациями, формулами и настройками. Открывается по кнопке M или через иконку гамбургера.",
    targetElement: "[aria-label='Open menu']",
    icon: <ChevronLeft className="h-6 w-6 text-cyan-500" />,
    tip: "Нажмите M для открытия/закрытия меню",
  },
  {
    id: "settings",
    title: "Настройки и язык",
    description:
      "Переключайте тему (светлая/тёмная) и язык интерфейса (RU/EN/ZH/HE). Настройки сохраняются автоматически.",
    icon: <Sparkles className="h-6 w-6 text-orange-500" />,
    tip: "Тема меняется плавно с анимацией",
  },
  {
    id: "keyboard",
    title: "Горячие клавиши",
    description:
      "1-5: Переключение разделов | M: Меню | Esc: Закрыть меню | Ctrl+K: Поиск | Стрелки: Навигация",
    icon: <ChevronRight className="h-6 w-6 text-green-500" />,
    tip: "Все горячие клавиши показаны в футере",
  },
  {
    id: "complete",
    title: "Готово к изучению!",
    description:
      "Теперь вы готовы исследовать удивительный мир физики. Начните с любого раздела или используйте обучение для каждого модуля.",
    icon: <Sparkles className="h-6 w-6 text-purple-500" />,
    tip: "Удачи в изучении! 🚀",
  },
]

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isOpen, setIsOpen] = useState(true)
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null)

  const step = onboardingSteps[currentStep]
  const isLastStep = currentStep === onboardingSteps.length - 1
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  // Highlight target element - only on mount and when step changes
  useEffect(() => {
    if (!isOpen) return

    if (step.targetElement && typeof window !== "undefined") {
      const element = document.querySelector(step.targetElement)
      setHighlightedElement(element)

      // Scroll to element if exists - only once per step
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    } else {
      setHighlightedElement(null)
    }

    // Cleanup on unmount or step change
    return () => {
      setHighlightedElement(null)
    }
  }, [step.targetElement, isOpen])

  const handleNext = useCallback(() => {
    if (isLastStep) {
      setIsOpen(false)
      onComplete?.()
      // Mark as completed in localStorage
      localStorage.setItem("onboarding-completed", "true")
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }, [isLastStep, onComplete])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const handleClose = useCallback(() => {
    setIsOpen(false)
    localStorage.setItem("onboarding-completed", "true")
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "ArrowLeft" && currentStep > 0) {
        handlePrev()
      } else if (e.key === "Escape") {
        handleClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, handleNext, handlePrev, handleClose, currentStep])

  if (!isOpen) return null

  return (
    <>
      {/* Highlight overlay */}
      {highlightedElement && (
        <div
          className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm transition-all duration-500"
          onClick={handleClose}
        />
      )}

      {/* Onboarding modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 z-[9999] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <Card className="overflow-hidden border-2 shadow-2xl">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-white/10 p-2">{step.icon}</div>
                    <div>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                      <CardDescription className="text-sm">
                        Шаг {currentStep + 1} из {onboardingSteps.length}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleClose} className="shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    key={currentStep}
                    className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"
                  />
                </div>
              </div>

              {/* Content */}
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                {step.tip && (
                  <div className="bg-primary/10 text-primary mt-4 flex items-start gap-2 rounded-lg p-3 text-sm">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="font-medium">{step.tip}</span>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="mt-6 flex justify-between gap-2">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Назад
                  </Button>

                  <Button
                    onClick={handleNext}
                    className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                  >
                    {isLastStep ? (
                      <>
                        Начать изучение
                        <Sparkles className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Далее
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Check if user needs onboarding
export function useOnboarding(): {
  showOnboarding: boolean
  triggerOnboarding: () => void
  completeOnboarding: () => void
} {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Only run on client side
    const completed = localStorage.getItem("onboarding-completed")
    if (!completed && !initialized) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => {
        setShowOnboarding(true)
        setInitialized(true)
      }, 500)
      return () => clearTimeout(timer)
    }
    setInitialized(true)
  }, [initialized])

  const triggerOnboarding = useCallback(() => {
    localStorage.removeItem("onboarding-completed")
    setShowOnboarding(true)
    setInitialized(true)
  }, [])

  const completeOnboarding = useCallback(() => {
    setShowOnboarding(false)
  }, [])

  return { showOnboarding, triggerOnboarding, completeOnboarding }
}
