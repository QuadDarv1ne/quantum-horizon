"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  Clock,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getLearningModule, type LearningModule } from "@/lib/learning-data"

interface LearningModeProps {
  visualizationType: string
}

export function LearningMode({ visualizationType }: LearningModeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [completed, setCompleted] = useState(false)

  const module = getLearningModule(visualizationType)

  if (!module) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <BookOpen className="h-4 w-4" />
        Обучение (недоступно)
      </Button>
    )
  }

  const totalSteps = module.steps.length
  const progress = ((currentStep + 1) / totalSteps) * 100
  const isLastStep = currentStep === totalSteps - 1
  const quizStarted = currentStep >= totalSteps

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep, totalSteps])

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }, [currentStep])

  const handleQuizAnswer = useCallback((questionId: number, answerIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }, [])

  const handleFinishQuiz = useCallback(() => {
    setShowResults(true)
    const allCorrect = module.quiz.every((q) => quizAnswers[q.id] === q.correctAnswer)
    if (allCorrect) {
      setCompleted(true)
    }
  }, [module.quiz, quizAnswers])

  const handleRestart = useCallback(() => {
    setCurrentStep(0)
    setQuizAnswers({})
    setShowResults(false)
    setCompleted(false)
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500"
      case "intermediate":
        return "bg-yellow-500"
      case "advanced":
        return "bg-red-500"
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
        <Button variant="outline" size="sm" className="gap-2">
          <BookOpen className="h-4 w-4" />
          Обучение
        </Button>
      </DialogTrigger>

      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col p-0">
        <DialogHeader className="border-b p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl">{module.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-4">
                <span>{module.description}</span>
                <Badge className={getDifficultyColor(module.difficulty)}>
                  {getDifficultyLabel(module.difficulty)}
                </Badge>
                <span className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  {module.estimatedTime} мин
                </span>
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              Закрыть
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6">
          <AnimatePresence mode="wait">
            {!quizStarted ? (
              // Режим обучения
              <motion.div
                key="step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Прогресс */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      Шаг {currentStep + 1} из {totalSteps}
                    </span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Контент шага */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {module.steps[currentStep].keyPoint && (
                        <TrendingUp className="text-primary h-5 w-5" />
                      )}
                      {module.steps[currentStep].title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {module.steps[currentStep].content}
                    </p>
                    {module.steps[currentStep].visualCue && (
                      <div className="bg-primary/10 text-primary mt-4 rounded-lg p-3 text-sm">
                        💡 {module.steps[currentStep].visualCue}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Навигация */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentStep === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Назад
                  </Button>

                  {isLastStep ? (
                    <Button onClick={() => setCurrentStep(totalSteps)} className="gap-2">
                      Начать тест
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleNext} className="gap-2">
                      Далее
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ) : (
              // Режим квиза
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {!showResults ? (
                  // Вопросы
                  <>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
                      <HelpCircle className="h-4 w-4" />
                      Ответьте на все вопросы
                    </div>

                    {module.quiz.map((question, qIndex) => (
                      <Card key={question.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Вопрос {qIndex + 1}: {question.question}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {question.options.map((option, oIndex) => {
                            const isSelected = quizAnswers[question.id] === oIndex
                            return (
                              <Button
                                key={oIndex}
                                variant={isSelected ? "default" : "outline"}
                                className="h-auto w-full justify-start px-4 py-3"
                                onClick={() => handleQuizAnswer(question.id, oIndex)}
                              >
                                <span className="mr-2 font-mono text-sm">
                                  {String.fromCharCode(65 + oIndex)}.
                                </span>
                                {option}
                              </Button>
                            )
                          })}
                        </CardContent>
                      </Card>
                    ))}

                    <Button
                      onClick={handleFinishQuiz}
                      disabled={Object.keys(quizAnswers).length < module.quiz.length}
                      className="w-full"
                    >
                      Завершить тест
                    </Button>
                  </>
                ) : (
                  // Результаты
                  <div className="space-y-6">
                    <Card className="bg-primary/10">
                      <CardHeader className="text-center">
                        <Trophy className="text-primary mx-auto mb-4 h-16 w-16" />
                        <CardTitle className="text-2xl">
                          {completed ? "Поздравляем! 🎉" : "Хорошая работа! 👍"}
                        </CardTitle>
                        <CardDescription>
                          Вы набрали{" "}
                          {module.quiz.filter((q) => quizAnswers[q.id] === q.correctAnswer).length}{" "}
                          из {module.quiz.length} правильных ответов
                        </CardDescription>
                      </CardHeader>
                    </Card>

                    {/* Разбор ответов */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Разбор ответов:</h3>
                      {module.quiz.map((question) => {
                        const isCorrect = quizAnswers[question.id] === question.correctAnswer
                        const userAnswer = quizAnswers[question.id]

                        return (
                          <Card
                            key={question.id}
                            className={isCorrect ? "border-green-500" : "border-red-500"}
                          >
                            <CardHeader>
                              <CardTitle className="flex items-center gap-2 text-base">
                                {isCorrect ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                {question.question}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <p className="text-sm">
                                <span className="text-muted-foreground">Ваш ответ:</span>{" "}
                                {question.options[userAnswer]}
                              </p>
                              {!isCorrect && (
                                <p className="text-sm text-green-600">
                                  <span className="text-muted-foreground">Правильный ответ:</span>{" "}
                                  {question.options[question.correctAnswer]}
                                </p>
                              )}
                              <p className="text-muted-foreground bg-muted mt-2 rounded p-2 text-sm">
                                💡 {question.explanation}
                              </p>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    <Button onClick={handleRestart} variant="outline" className="w-full">
                      Пройти заново
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
