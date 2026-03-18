/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import {
  Trophy,
  Award,
  Star,
  Zap,
  Rocket,
  Globe,
  Atom,
  Telescope,
  Clock,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAchievements } from "@/hooks/api/use-achievements"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "learning" | "exploration" | "social" | "special"
  rarity: "common" | "rare" | "epic" | "legendary"
  xpReward: number
  unlocked: boolean
  unlockedAt?: Date
  progress: number
  maxProgress: number
}

interface AchievementsPanelProps {
  className?: string
}

export function AchievementsPanel({ className }: AchievementsPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const { achievements: apiAchievements, loading, error } = useAchievements()

  // Mock achievements data (fallback for non-authenticated users)
  const mockAchievements: Achievement[] = [
    // Learning Category
    {
      id: "learn_001",
      name: "First Steps",
      description: "Complete your first lesson",
      icon: "🌟",
      category: "learning",
      rarity: "common",
      xpReward: 50,
      unlocked: true,
      unlockedAt: new Date("2026-03-01"),
      progress: 1,
      maxProgress: 1,
    },
    {
      id: "learn_002",
      name: "Quick Learner",
      description: "Complete 10 lessons in a week",
      icon: "⚡",
      category: "learning",
      rarity: "rare",
      xpReward: 200,
      unlocked: true,
      unlockedAt: new Date("2026-03-05"),
      progress: 10,
      maxProgress: 10,
    },
    {
      id: "learn_003",
      name: "Physics Master",
      description: "Complete all physics courses",
      icon: "⚛️",
      category: "learning",
      rarity: "epic",
      xpReward: 500,
      unlocked: false,
      progress: 18,
      maxProgress: 27,
    },
    {
      id: "learn_004",
      name: "Quantum Physicist",
      description: "Master quantum mechanics",
      icon: "🔬",
      category: "learning",
      rarity: "legendary",
      xpReward: 1000,
      unlocked: false,
      progress: 3,
      maxProgress: 10,
    },

    // Exploration Category
    {
      id: "explore_001",
      name: "Stargazer",
      description: "Observe 10 celestial objects",
      icon: "🔭",
      category: "exploration",
      rarity: "common",
      xpReward: 100,
      unlocked: true,
      unlockedAt: new Date("2026-03-03"),
      progress: 10,
      maxProgress: 10,
    },
    {
      id: "explore_002",
      name: "Galaxy Explorer",
      description: "Visit all galaxy visualizations",
      icon: "🌌",
      category: "exploration",
      rarity: "rare",
      xpReward: 250,
      unlocked: false,
      progress: 5,
      maxProgress: 8,
    },
    {
      id: "explore_003",
      name: "Black Hole Hunter",
      description: "Study 10 black holes",
      icon: "🕳️",
      category: "exploration",
      rarity: "epic",
      xpReward: 400,
      unlocked: false,
      progress: 4,
      maxProgress: 10,
    },

    // Social Category
    {
      id: "social_001",
      name: "Team Player",
      description: "Join a study group",
      icon: "👥",
      category: "social",
      rarity: "common",
      xpReward: 75,
      unlocked: true,
      unlockedAt: new Date("2026-03-02"),
      progress: 1,
      maxProgress: 1,
    },
    {
      id: "social_002",
      name: "Mentor",
      description: "Help 20 other students",
      icon: "🎓",
      category: "social",
      rarity: "rare",
      xpReward: 300,
      unlocked: false,
      progress: 12,
      maxProgress: 20,
    },

    // Special Category
    {
      id: "special_001",
      name: "Daily Visitor",
      description: "7-day login streak",
      icon: "📅",
      category: "special",
      rarity: "common",
      xpReward: 150,
      unlocked: true,
      unlockedAt: new Date("2026-03-07"),
      progress: 7,
      maxProgress: 7,
    },
    {
      id: "special_002",
      name: "Dedicated Scholar",
      description: "30-day login streak",
      icon: "🔥",
      category: "special",
      rarity: "epic",
      xpReward: 600,
      unlocked: false,
      progress: 15,
      maxProgress: 30,
    },
    {
      id: "special_003",
      name: "Cosmic Explorer",
      description: "Explore every section of the platform",
      icon: "🚀",
      category: "special",
      rarity: "legendary",
      xpReward: 1500,
      unlocked: false,
      progress: 4,
      maxProgress: 6,
    },
  ]

  // Use API data if available, otherwise use mock data
  const achievements = apiAchievements.length > 0 ? apiAchievements : mockAchievements

  const categories = [
    { id: "all", name: "All", icon: <Award className="size-4" /> },
    { id: "learning", name: "Learning", icon: <Atom className="size-4" /> },
    { id: "exploration", name: "Exploration", icon: <Telescope className="size-4" /> },
    { id: "social", name: "Social", icon: <Globe className="size-4" /> },
    { id: "special", name: "Special", icon: <Star className="size-4" /> },
  ]

  const filteredAchievements =
    selectedCategory === "all"
      ? achievements
      : achievements.filter((a) => "category" in a && a.category === selectedCategory)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return {
          border: "border-gray-400",
          bg: "bg-gray-400/10",
          text: "text-gray-400",
          glow: "",
        }
      case "rare":
        return {
          border: "border-blue-500",
          bg: "bg-blue-500/10",
          text: "text-blue-500",
          glow: "shadow-blue-500/20",
        }
      case "epic":
        return {
          border: "border-purple-500",
          bg: "bg-purple-500/10",
          text: "text-purple-500",
          glow: "shadow-purple-500/30",
        }
      case "legendary":
        return {
          border: "border-yellow-500",
          bg: "bg-yellow-500/10",
          text: "text-yellow-500",
          glow: "shadow-yellow-500/40 animate-pulse",
        }
      default:
        return {
          border: "border-gray-400",
          bg: "bg-gray-400/10",
          text: "text-gray-400",
          glow: "",
        }
    }
  }

  const stats = {
    total: achievements.length,
    unlocked: achievements.filter((a) => "unlocked" in a && a.unlocked).length,
    locked: achievements.filter((a) => !("unlocked" in a) || !a.unlocked).length,
    totalXP: achievements
      .filter((a) => "unlocked" in a && a.unlocked)
      .reduce((sum, a) => sum + ("xpReward" in a ? a.xpReward : 0), 0),
  }

  return (
    <div className={cn("bg-card overflow-hidden rounded-xl border shadow-lg", className)}>
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-yellow-500/10 via-purple-500/10 to-pink-500/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Trophy className="size-8 text-yellow-500" />
              <h3 className="text-2xl font-bold">🏆 Achievements</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Unlock achievements by exploring and learning
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background rounded-lg border p-3 text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {stats.unlocked}/{stats.total}
              </div>
              <div className="text-muted-foreground text-xs">Unlocked</div>
            </div>
            <div className="bg-background rounded-lg border p-3 text-center">
              <div className="text-2xl font-bold text-purple-500">{stats.totalXP}</div>
              <div className="text-muted-foreground text-xs">Total XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="border-b px-6 py-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id)
              }}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-all",
                selectedCategory === category.id
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              )}
            >
              {category.icon}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredAchievements.map((achievement) => {
          const rarity = "rarity" in achievement ? achievement.rarity : "common"
          const colors = getRarityColor(rarity)
          const progress = "progress" in achievement ? achievement.progress : 0
          const maxProgress = "maxProgress" in achievement ? achievement.maxProgress : 1
          const progressPercent = (progress / maxProgress) * 100

          return (
            <div
              key={achievement.id}
              className={cn(
                "relative overflow-hidden rounded-xl border-2 p-4 transition-all duration-300",
                "unlocked" in achievement && achievement.unlocked
                  ? cn(colors.bg, colors.border, "shadow-lg", colors.glow)
                  : "bg-muted/50 border-gray-700 opacity-60"
              )}
            >
              {/* Icon & Title */}
              <div className="mb-3 flex items-start justify-between">
                <div className="text-4xl">{"icon" in achievement ? achievement.icon : "🏆"}</div>
                {"unlocked" in achievement && achievement.unlocked && (
                  <div className={cn("rounded-full p-1", colors.bg)}>
                    <Zap className={cn("size-4", colors.text)} />
                  </div>
                )}
              </div>

              <h4
                className={cn(
                  "mb-1 font-bold",
                  "unlocked" in achievement && achievement.unlocked ? "" : "text-muted-foreground"
                )}
              >
                {"name" in achievement ? achievement.name : "Achievement"}
              </h4>

              <p className="text-muted-foreground mb-3 text-xs">
                {"description" in achievement ? achievement.description : ""}
              </p>

              {/* Progress Bar */}
              {!("unlocked" in achievement) || !achievement.unlocked ? (
                <div className="mb-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {progress}/{maxProgress}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
                    <div
                      className={cn("h-full transition-all duration-500", colors.bg)}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              ) : null}

              {/* XP Reward */}
              <div className="flex items-center justify-between">
                <div className={cn("text-xs font-bold", colors.text)}>
                  +{"xpReward" in achievement ? achievement.xpReward : 0} XP
                </div>
                {"unlocked" in achievement &&
                  achievement.unlocked &&
                  "unlockedAt" in achievement &&
                  achievement.unlockedAt && (
                    <div className="text-muted-foreground text-xs">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
              </div>

              {/* Locked Overlay */}
              {(!("unlocked" in achievement) || !achievement.unlocked) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[1px]">
                  <div className="rounded-full bg-black/80 p-3">
                    <Clock className="size-6 text-gray-400" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer Stats */}
      <div className="bg-muted/50 border-t p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="bg-background rounded-lg border p-4 text-center">
            <Rocket
              className={cn(
                "mx-auto mb-2 size-6",
                stats.unlocked === stats.total ? "text-green-500" : "text-blue-500"
              )}
            />
            <div className="text-2xl font-bold">
              {((stats.unlocked / stats.total) * 100).toFixed(1)}%
            </div>
            <div className="text-muted-foreground text-xs">Completion Rate</div>
          </div>

          <div className="bg-background rounded-lg border p-4 text-center">
            <Target className="mx-auto mb-2 size-6 text-purple-500" />
            <div className="text-2xl font-bold">{stats.locked}</div>
            <div className="text-muted-foreground text-xs">Remaining</div>
          </div>

          <div className="bg-background rounded-lg border p-4 text-center">
            <Award className="mx-auto mb-2 size-6 text-yellow-500" />
            <div className="text-2xl font-bold">{stats.unlocked}</div>
            <div className="text-muted-foreground text-xs">Earned</div>
          </div>

          <div className="bg-background rounded-lg border p-4 text-center">
            <Star className="mx-auto mb-2 size-6 text-orange-500" />
            <div className="text-2xl font-bold">{stats.totalXP}</div>
            <div className="text-muted-foreground text-xs">Total XP</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementsPanel
