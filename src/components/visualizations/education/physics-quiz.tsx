"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Language = "ru" | "en" | "zh" | "he"

interface Question {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface QuizText {
  score: string
  of: string
  restart: string
  next: string
  correct: string
  incorrect: string
}

const QUESTIONS: Record<Language, Question[]> = {
  ru: [
    {
      question: "Чему равна скорость света в вакууме?",
      options: ["3×10⁶ м/с", "3×10⁸ м/с", "3×10¹⁰ м/с", "3×10⁵ м/с"],
      correct: 1,
      explanation: "Скорость света c ≈ 299 792 458 м/с ≈ 3×10⁸ м/с",
    },
    {
      question: "Какая частица является переносчиком электромагнитного взаимодействия?",
      options: ["Глюон", "Фотон", "W-бозон", "Гравитон"],
      correct: 1,
      explanation:
        "Фотон — квант электромагнитного поля, переносчик электромагнитного взаимодействия.",
    },
    {
      question: "Что описывает уравнение Шрёдингера?",
      options: [
        "Движение планет",
        "Эволюцию квантового состояния",
        "Распад радиоактивных ядер",
        "Течение жидкости",
      ],
      correct: 1,
      explanation:
        "Уравнение Шрёдингера описывает изменение волновой функции квантовой системы во времени.",
    },
    {
      question: "Чему равен период полураспада?",
      options: ["T₁/₂ = τ·ln(2)", "T₁/₂ = τ/ln(2)", "T₁/₂ = ln(2)/τ", "T₁/₂ = 1/τ"],
      correct: 0,
      explanation: "Период полураспада связан со временем жизни τ: T₁/₂ = τ·ln(2) ≈ 0.693τ",
    },
    {
      question: "Что происходит с массой объекта при приближении к скорости света?",
      options: ["Уменьшается", "Не изменяется", "Увеличивается", "Становится отрицательной"],
      correct: 2,
      explanation: "Согласно СТО, релятивистская масса m = γm₀ увеличивается при приближении к c.",
    },
    {
      question: "Какой принцип сформулировал Гейзенберг?",
      options: [
        "Принцип относительности",
        "Принцип неопределённости",
        "Принцип дополнительности",
        "Принцип суперпозиции",
      ],
      correct: 1,
      explanation: "Принцип неопределённости: Δx·Δp ≥ ℏ/2",
    },
    {
      question: "Что такое сингулярность чёрной дыры?",
      options: [
        "Область низкой плотности",
        "Точка бесконечной плотности",
        "Горизонт событий",
        "Аккреционный диск",
      ],
      correct: 1,
      explanation:
        "Сингулярность — точка, где плотность и кривизна пространства-времени стремятся к бесконечности.",
    },
    {
      question: "Какая сила доминирует во Вселенной на больших масштабах?",
      options: ["Электромагнитная", "Сильная ядерная", "Слабая ядерная", "Гравитационная"],
      correct: 3,
      explanation:
        "Гравитация — единственная сила, действующая на бесконечных расстояниях, доминирует в космосе.",
    },
    {
      question: "Каков возраст Вселенной согласно современным оценкам?",
      options: ["4.5 млрд лет", "10 млрд лет", "13.8 млрд лет", "20 млрд лет"],
      correct: 2,
      explanation: "Возраст Вселенной ~13.8 млрд лет, определён по данным спутника Planck.",
    },
    {
      question: "Что такое бозон Хиггса?",
      options: [
        "Переносчик гравитации",
        "Частица, дающая массу",
        "Разновидность кварка",
        "Тип излучения",
      ],
      correct: 1,
      explanation:
        "Бозон Хиггса — квант поля Хиггса, взаимодействие с которым придаёт частицам массу.",
    },
  ],
  en: [
    {
      question: "What is the speed of light in vacuum?",
      options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁵ m/s"],
      correct: 1,
      explanation: "Speed of light c ≈ 299,792,458 m/s ≈ 3×10⁸ m/s",
    },
    {
      question: "Which particle carries the electromagnetic interaction?",
      options: ["Gluon", "Photon", "W-boson", "Graviton"],
      correct: 1,
      explanation:
        "Photon is the quantum of the electromagnetic field, carrier of electromagnetic interaction.",
    },
    {
      question: "What does the Schrödinger equation describe?",
      options: ["Planetary motion", "Quantum state evolution", "Radioactive decay", "Fluid flow"],
      correct: 1,
      explanation:
        "The Schrödinger equation describes how the wave function of a quantum system changes over time.",
    },
    {
      question: "What happens to mass as an object approaches the speed of light?",
      options: ["Decreases", "Remains unchanged", "Increases", "Becomes negative"],
      correct: 2,
      explanation:
        "According to special relativity, relativistic mass m = γm₀ increases as v approaches c.",
    },
    {
      question: "What principle did Heisenberg formulate?",
      options: [
        "Principle of relativity",
        "Uncertainty principle",
        "Complementarity principle",
        "Superposition principle",
      ],
      correct: 1,
      explanation: "Uncertainty principle: Δx·Δp ≥ ℏ/2",
    },
  ],
  zh: [
    {
      question: "真空中的光速是多少？",
      options: ["3×10⁶ m/s", "3×10⁸ m/s", "3×10¹⁰ m/s", "3×10⁵ m/s"],
      correct: 1,
      explanation: "光速 c ≈ 299,792,458 m/s ≈ 3×10⁸ m/s",
    },
    {
      question: "哪种粒子传递电磁相互作用？",
      options: ["胶子", "光子", "W 玻色子", "引力子"],
      correct: 1,
      explanation: "光子是电磁场的量子，是电磁相互作用的传递者。",
    },
    {
      question: "薛定谔方程描述什么？",
      options: ["行星运动", "量子态演化", "放射性衰变", "流体流动"],
      correct: 1,
      explanation: "薛定谔方程描述量子系统的波函数如何随时间变化。",
    },
    {
      question: "当物体接近光速时，质量会发生什么变化？",
      options: ["减小", "保持不变", "增加", "变为负数"],
      correct: 2,
      explanation: "根据狭义相对论，相对论质量 m = γm₀ 随着速度接近光速而增加。",
    },
    {
      question: "海森堡提出了什么原理？",
      options: ["相对性原理", "不确定性原理", "互补原理", "叠加原理"],
      correct: 1,
      explanation: "不确定性原理：Δx·Δp ≥ ℏ/2",
    },
  ],
  he: [
    {
      question: "מהי מהירות האור בריק?",
      options: ["3×10⁶ מ'/ש'", "3×10⁸ מ'/ש'", "3×10¹⁰ מ'/ש'", "3×10⁵ מ'/ש'"],
      correct: 1,
      explanation: "מהירות האור c ≈ 299,792,458 מ'/ש' ≈ 3×10⁸ מ'/ש'",
    },
    {
      question: "איזה חלקיק נושא את האינטראקציה האלקטרומגנטית?",
      options: ["גלואון", "פוטון", "בוזון W", "גרביטון"],
      correct: 1,
      explanation: "פוטון הוא קוונטום של השדה האלקטרומגנטי.",
    },
  ],
}

const RESULT_TEXT: Record<Language, QuizText> = {
  ru: {
    score: "Ваш результат",
    of: "из",
    restart: "Начать заново",
    next: "Далее",
    correct: "Правильно!",
    incorrect: "Неправильно",
  },
  en: {
    score: "Your score",
    of: "of",
    restart: "Restart",
    next: "Next",
    correct: "Correct!",
    incorrect: "Incorrect",
  },
  zh: {
    score: "您的得分",
    of: "共",
    restart: "重新开始",
    next: "下一题",
    correct: "正确！",
    incorrect: "错误",
  },
  he: {
    score: "הציון שלך",
    of: "מתוך",
    restart: "התחל מחדש",
    next: "הבא",
    correct: "נכון!",
    incorrect: "לא נכון",
  },
}

export function PhysicsQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [language] = useState<Language>("ru")

  const currentQuestions = QUESTIONS[language]
  const q = currentQuestions[currentQuestion]
  const text = RESULT_TEXT[language]

  const handleAnswer = (index: number) => {
    if (answered) return
    setSelectedAnswer(index)
    setAnswered(true)
    if (index === q.correct) {
      setScore((s) => s + 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      setShowResult(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setAnswered(false)
  }

  if (showResult) {
    const percentage = Math.round((score / currentQuestions.length) * 100)
    return (
      <div className="space-y-4 text-center">
        <div className="text-4xl font-bold text-purple-400">{text.score}</div>
        <div className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-6xl font-bold text-transparent">
          {score} {text.of} {currentQuestions.length}
        </div>
        <div className="text-2xl">
          {percentage >= 80 ? "🏆" : percentage >= 60 ? "🌟" : percentage >= 40 ? "📚" : "💪"}
        </div>
        <div className={`text-sm ${percentage >= 60 ? "text-green-400" : "text-yellow-400"}`}>
          {percentage >= 80
            ? language === "ru"
              ? "Отлично!"
              : language === "en"
                ? "Excellent!"
                : language === "zh"
                  ? "太棒了！"
                  : "מעולה!"
            : percentage >= 60
              ? language === "ru"
                ? "Хорошо!"
                : language === "en"
                  ? "Good!"
                  : language === "zh"
                    ? "不错！"
                    : "טוב!"
              : language === "ru"
                ? "Попробуйте ещё!"
                : language === "en"
                  ? "Try again!"
                  : language === "zh"
                    ? "再试一次！"
                    : "נסה שוב!"}
        </div>
        <Button onClick={restartQuiz} className="bg-gradient-to-r from-purple-600 to-cyan-600">
          {text.restart}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-purple-400">
          {language === "ru"
            ? "Вопрос"
            : language === "en"
              ? "Question"
              : language === "zh"
                ? "问题"
                : "שאלה"}{" "}
          {currentQuestion + 1}/{currentQuestions.length}
        </span>
        <span className="text-green-400">
          {language === "ru"
            ? "Счёт"
            : language === "en"
              ? "Score"
              : language === "zh"
                ? "得分"
                : "ציון"}
          : {score}
        </span>
      </div>

      <div className="rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 p-4">
        <div className="mb-4 font-medium text-white">{q.question}</div>

        <div className="space-y-2">
          {q.options.map((option, index) => (
            <button
              key={index}
              onClick={() => {
                handleAnswer(index)
              }}
              disabled={answered}
              className={`w-full rounded-lg px-4 py-3 text-left text-sm transition-all ${
                answered
                  ? index === q.correct
                    ? "border-2 border-green-400 bg-green-600/50"
                    : index === selectedAnswer
                      ? "border-2 border-red-400 bg-red-600/50"
                      : "bg-gray-800/50 opacity-50"
                  : "border border-gray-700 bg-gray-800/50 hover:border-purple-500 hover:bg-gray-700/50"
              }`}
            >
              <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {answered && (
        <div className="space-y-3">
          <div
            className={`rounded-lg p-3 text-sm ${selectedAnswer === q.correct ? "border border-green-500/30 bg-green-900/30" : "border border-red-500/30 bg-red-900/30"}`}
          >
            <div
              className={
                selectedAnswer === q.correct
                  ? "font-semibold text-green-400"
                  : "font-semibold text-red-400"
              }
            >
              {selectedAnswer === q.correct ? text.correct : text.incorrect}
            </div>
            <div className="mt-1 text-gray-400">{q.explanation}</div>
          </div>

          <Button
            onClick={nextQuestion}
            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600"
          >
            {text.next} →
          </Button>
        </div>
      )}
    </div>
  )
}
