// Система статистики и достижений пользователя

export interface UserStatistics {
  totalTimeSpent: number // секунды
  visualizationsViewed: Record<string, number>
  quizzesCompleted: number
  quizzesPassed: number
  presetsCreated: number
  presetsApplied: number
  comparisonsPerformed: number
  achievements: string[]
  lastActivity: number
  streakDays: number
  totalSessions: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: (stats: UserStatistics) => boolean
  category: "learning" | "exploration" | "mastery" | "dedication"
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary"
}

export const ACHIEVEMENTS: Achievement[] = [
  // Learning achievements
  {
    id: "first-quiz",
    name: "Первый тест",
    description: "Пройдите первый квиз",
    icon: "📝",
    condition: (stats) => stats.quizzesCompleted >= 1,
    category: "learning",
    rarity: "common",
  },
  {
    id: "quiz-master",
    name: "Мастер тестов",
    description: "Пройдите 10 тестов",
    icon: "🎓",
    condition: (stats) => stats.quizzesCompleted >= 10,
    category: "learning",
    rarity: "uncommon",
  },
  {
    id: "perfect-score",
    name: "Отличный результат",
    description: "Пройдите тест без ошибок",
    icon: "💯",
    condition: (stats) => stats.quizzesPassed >= 1,
    category: "learning",
    rarity: "uncommon",
  },
  {
    id: "scholar",
    name: "Учёный",
    description: "Пройдите 50 тестов",
    icon: "🏆",
    condition: (stats) => stats.quizzesCompleted >= 50,
    category: "learning",
    rarity: "rare",
  },
  {
    id: "phd",
    name: "Доктор наук",
    description: "Пройдите 100 тестов",
    icon: "👨‍🎓",
    condition: (stats) => stats.quizzesCompleted >= 100,
    category: "learning",
    rarity: "epic",
  },

  // Exploration achievements
  {
    id: "first-visualization",
    name: "Первое знакомство",
    description: "Посмотрите первую визуализацию",
    icon: "👀",
    condition: (stats) => Object.keys(stats.visualizationsViewed).length >= 1,
    category: "exploration",
    rarity: "common",
  },
  {
    id: "explorer",
    name: "Исследователь",
    description: "Посмотрите 10 различных визуализаций",
    icon: "🧭",
    condition: (stats) => Object.keys(stats.visualizationsViewed).length >= 10,
    category: "exploration",
    rarity: "uncommon",
  },
  {
    id: "world-explorer",
    name: "Первооткрыватель",
    description: "Посмотрите все визуализации",
    icon: "🌍",
    condition: (stats) => Object.keys(stats.visualizationsViewed).length >= 20,
    category: "exploration",
    rarity: "rare",
  },
  {
    id: "comparison-master",
    name: "Сравнитель",
    description: "Используйте режим сравнения 10 раз",
    icon: "⚖️",
    condition: (stats) => stats.comparisonsPerformed >= 10,
    category: "exploration",
    rarity: "uncommon",
  },

  // Mastery achievements
  {
    id: "preset-creator",
    name: "Создатель",
    description: "Создайте первый пресет",
    icon: "🎨",
    condition: (stats) => stats.presetsCreated >= 1,
    category: "mastery",
    rarity: "common",
  },
  {
    id: "preset-master",
    name: "Коллекционер",
    description: "Создайте 10 пресетов",
    icon: "📦",
    condition: (stats) => stats.presetsCreated >= 10,
    category: "mastery",
    rarity: "rare",
  },
  {
    id: "time-traveler",
    name: "Путешественник во времени",
    description: "Проведите 1 час за изучением",
    icon: "⏰",
    condition: (stats) => stats.totalTimeSpent >= 3600,
    category: "mastery",
    rarity: "uncommon",
  },
  {
    id: "dedicated-learner",
    name: "Преданный ученик",
    description: "Проведите 10 часов за изучением",
    icon: "⌛",
    condition: (stats) => stats.totalTimeSpent >= 36000,
    category: "mastery",
    rarity: "rare",
  },
  {
    id: "quantum-master",
    name: "Квантовый мастер",
    description: "Проведите 100 часов за изучением",
    icon: "⚛️",
    condition: (stats) => stats.totalTimeSpent >= 360000,
    category: "mastery",
    rarity: "legendary",
  },

  // Dedication achievements
  {
    id: "first-session",
    name: "Начало пути",
    description: "Начните первую сессию",
    icon: "🚀",
    condition: (stats) => stats.totalSessions >= 1,
    category: "dedication",
    rarity: "common",
  },
  {
    id: "regular",
    name: "Постоянный посетитель",
    description: "Проведите 10 сессий",
    icon: "📅",
    condition: (stats) => stats.totalSessions >= 10,
    category: "dedication",
    rarity: "uncommon",
  },
  {
    id: "week-streak",
    name: "Недельная серия",
    description: "Поддерживайте серию 7 дней",
    icon: "🔥",
    condition: (stats) => stats.streakDays >= 7,
    category: "dedication",
    rarity: "rare",
  },
  {
    id: "month-streak",
    name: "Месячная серия",
    description: "Поддерживайте серию 30 дней",
    icon: "🌟",
    condition: (stats) => stats.streakDays >= 30,
    category: "dedication",
    rarity: "epic",
  },
  {
    id: "year-streak",
    name: "Годовая серия",
    description: "Поддерживайте серию 365 дней",
    icon: "👑",
    condition: (stats) => stats.streakDays >= 365,
    category: "dedication",
    rarity: "legendary",
  },
]

export function createEmptyStatistics(): UserStatistics {
  return {
    totalTimeSpent: 0,
    visualizationsViewed: {},
    quizzesCompleted: 0,
    quizzesPassed: 0,
    presetsCreated: 0,
    presetsApplied: 0,
    comparisonsPerformed: 0,
    achievements: [],
    lastActivity: Date.now(),
    streakDays: 0,
    totalSessions: 0,
  }
}

export function checkAchievements(stats: UserStatistics): Achievement[] {
  const newAchievements: Achievement[] = []

  for (const achievement of ACHIEVEMENTS) {
    if (achievement.condition(stats) && !stats.achievements.includes(achievement.id)) {
      newAchievements.push(achievement)
    }
  }

  return newAchievements
}

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}

export function getAchievementsByCategory(category: string): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category)
}

export function getAchievementsByRarity(rarity: string): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.rarity === rarity)
}

export function getUnlockedAchievements(stats: UserStatistics): Achievement[] {
  return ACHIEVEMENTS.filter((a) => stats.achievements.includes(a.id))
}

export function getLockedAchievements(stats: UserStatistics): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !stats.achievements.includes(a.id))
}

export function getProgressToNextAchievement(
  stats: UserStatistics,
  achievement: Achievement
): number {
  // Упрощённая логика прогресса
  switch (achievement.id) {
    case "quiz-master":
      return Math.min(100, (stats.quizzesCompleted / 10) * 100)
    case "scholar":
      return Math.min(100, (stats.quizzesCompleted / 50) * 100)
    case "phd":
      return Math.min(100, (stats.quizzesCompleted / 100) * 100)
    case "explorer":
      return Math.min(100, (Object.keys(stats.visualizationsViewed).length / 10) * 100)
    case "time-traveler":
      return Math.min(100, (stats.totalTimeSpent / 3600) * 100)
    case "dedicated-learner":
      return Math.min(100, (stats.totalTimeSpent / 36000) * 100)
    default:
      return 0
  }
}

export function formatTimeSpent(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (hours > 0) {
    return `${String(hours)}ч ${String(minutes)}м`
  }
  return `${String(minutes)}м`
}

export function getRarityColor(rarity: string): string {
  switch (rarity) {
    case "common":
      return "text-gray-500"
    case "uncommon":
      return "text-green-500"
    case "rare":
      return "text-blue-500"
    case "epic":
      return "text-purple-500"
    case "legendary":
      return "text-yellow-500"
    default:
      return "text-gray-500"
  }
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case "learning":
      return "📚"
    case "exploration":
      return "🧭"
    case "mastery":
      return "🎯"
    case "dedication":
      return "🔥"
    default:
      return "🏆"
  }
}
