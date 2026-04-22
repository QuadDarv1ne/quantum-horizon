"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Award,
  Star,
  BookOpen,
  Layers,
  Zap,
  Flame,
  Calendar,
  BarChart3,
  Medal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStatisticsStore } from "@/stores/statistics-store"
import {
  ACHIEVEMENTS,
  getUnlockedAchievements,
  getLockedAchievements,
  getAchievementsByCategory,
  getRarityColor,
  getCategoryIcon,
  formatTimeSpent,
} from "@/lib/statistics"

export function StatisticsDashboard() {
  const [isOpen, setIsOpen] = useState(false)
  const statistics = useStatisticsStore((state) => state.statistics)
  const checkNewAchievements = useStatisticsStore((state) => state.checkNewAchievements)
  const startSession = useStatisticsStore((state) => state.startSession)

  const unlockedAchievements = getUnlockedAchievements(statistics)
  const lockedAchievements = getLockedAchievements(statistics)
  const progress = Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)

  useEffect(() => {
    if (isOpen) {
      startSession()
      const newAchievements = checkNewAchievements()
      if (newAchievements.length > 0) {
        // Можно показать уведомление о новых достижениях
      }
    }
  }, [isOpen, startSession, checkNewAchievements])

  const learningAchievements = getAchievementsByCategory("learning")
  const explorationAchievements = getAchievementsByCategory("exploration")
  const masteryAchievements = getAchievementsByCategory("mastery")
  const dedicationAchievements = getAchievementsByCategory("dedication")

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          Статистика
        </Button>
      </DialogTrigger>

      <DialogContent aria-label="Статистика и достижения" className="max-h-[90vh] max-w-5xl overflow-auto">
        <DialogTitle className="text-2xl">Статистика и достижения</DialogTitle>
        <DialogDescription className="sr-only">
          Диалог со статистикой и достижениями: продолжительность, графики, проверки, серии, прогресс.
        </DialogDescription>

        <div className="space-y-6">
          {/* Общие статистики */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  Время
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatTimeSpent(statistics.totalTimeSpent)}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">Всего проведено</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="h-4 w-4" />
                  Визуализации
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(statistics.visualizationsViewed).length}
                </div>
                <p className="text-muted-foreground mt-1 text-xs">Уникальных просмотрено</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Target className="h-4 w-4" />
                  Тесты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.quizzesCompleted}</div>
                <p className="text-muted-foreground mt-1 text-xs">
                  Пройдено ({statistics.quizzesPassed} успешно)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <Flame className="h-4 w-4" />
                  Серия
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{statistics.streakDays}</div>
                <p className="text-muted-foreground mt-1 text-xs">Дней подряд</p>
              </CardContent>
            </Card>
          </div>

          {/* Дополнительные статистики */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Layers className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{statistics.presetsCreated}</div>
                    <div className="text-muted-foreground text-sm">Создано пресетов</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Zap className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{statistics.presetsApplied}</div>
                    <div className="text-muted-foreground text-sm">Применено пресетов</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <TrendingUp className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{statistics.comparisonsPerformed}</div>
                    <div className="text-muted-foreground text-sm">Сравнений</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Прогресс достижений */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Прогресс достижений
              </CardTitle>
              <CardDescription>
                {unlockedAchievements.length} из {ACHIEVEMENTS.length} разблокировано
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={progress} className="h-3" />
                <p className="text-muted-foreground text-right text-sm">{progress}%</p>
              </div>
            </CardContent>
          </Card>

          {/* Вкладки достижений */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Все</TabsTrigger>
              <TabsTrigger value="learning">
                <span className="text-lg">📚</span>
              </TabsTrigger>
              <TabsTrigger value="exploration">
                <span className="text-lg">🧭</span>
              </TabsTrigger>
              <TabsTrigger value="mastery">
                <span className="text-lg">🎯</span>
              </TabsTrigger>
              <TabsTrigger value="dedication">
                <span className="text-lg">🔥</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <AchievementGrid unlocked={unlockedAchievements} locked={lockedAchievements} />
            </TabsContent>

            <TabsContent value="learning" className="space-y-4">
              <AchievementGrid
                unlocked={unlockedAchievements.filter((a) =>
                  learningAchievements.some((la) => la.id === a.id)
                )}
                locked={lockedAchievements.filter((a) =>
                  learningAchievements.some((la) => la.id === a.id)
                )}
              />
            </TabsContent>

            <TabsContent value="exploration" className="space-y-4">
              <AchievementGrid
                unlocked={unlockedAchievements.filter((a) =>
                  explorationAchievements.some((ea) => ea.id === a.id)
                )}
                locked={lockedAchievements.filter((a) =>
                  explorationAchievements.some((ea) => ea.id === a.id)
                )}
              />
            </TabsContent>

            <TabsContent value="mastery" className="space-y-4">
              <AchievementGrid
                unlocked={unlockedAchievements.filter((a) =>
                  masteryAchievements.some((ma) => ma.id === a.id)
                )}
                locked={lockedAchievements.filter((a) =>
                  masteryAchievements.some((ma) => ma.id === a.id)
                )}
              />
            </TabsContent>

            <TabsContent value="dedication" className="space-y-4">
              <AchievementGrid
                unlocked={unlockedAchievements.filter((a) =>
                  dedicationAchievements.some((da) => da.id === a.id)
                )}
                locked={lockedAchievements.filter((a) =>
                  dedicationAchievements.some((da) => da.id === a.id)
                )}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface AchievementGridProps {
  unlocked: typeof ACHIEVEMENTS
  locked: typeof ACHIEVEMENTS
}

function AchievementGrid({ unlocked, locked }: AchievementGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {unlocked.map((achievement) => (
        <motion.div
          key={achievement.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
        >
          <Card
            className={`relative overflow-hidden ${getRarityColor(achievement.rarity)} border-2`}
          >
            <div className="absolute top-2 right-2">
              <Star className={`h-4 w-4 fill-current ${getRarityColor(achievement.rarity)}`} />
            </div>
            <CardContent className="space-y-2 pt-6 text-center">
              <div className="text-4xl">{achievement.icon}</div>
              <div className="text-sm font-semibold">{achievement.name}</div>
              <div className="text-muted-foreground text-xs">{achievement.description}</div>
              <Badge variant="secondary" className="text-xs">
                {achievement.rarity === "common" && "Обычная"}
                {achievement.rarity === "uncommon" && "Необычная"}
                {achievement.rarity === "rare" && "Редкая"}
                {achievement.rarity === "epic" && "Эпическая"}
                {achievement.rarity === "legendary" && "Легендарная"}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {locked.map((achievement) => (
        <Card key={achievement.id} className="opacity-50 grayscale">
          <CardContent className="space-y-2 pt-6 text-center">
            <div className="text-4xl">❓</div>
            <div className="text-sm font-semibold">???</div>
            <div className="text-muted-foreground text-xs">
              Продолжайте изучать, чтобы разблокировать
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
