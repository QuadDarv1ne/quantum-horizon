import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { createLogger } from "@/lib/logger"
import { z } from "zod"

const logger = createLogger("api:achievements")

// Zod schemas для валидации
const achievementSchema = z.object({
  achievementId: z.string().min(1).max(100),
  progress: z.number().min(0).max(10000).default(1),
  target: z.number().min(1).max(10000).default(1),
})

type AchievementResponse = {
  success: true
  data: unknown
  newlyUnlocked?: boolean
}

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user.id ?? null
}

/**
 * GET /api/achievements
 * Получить достижения пользователя
 */
export async function GET() {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const achievements = await db.userAchievement.findMany({
      where: { userId },
      orderBy: { unlockedAt: "desc" },
      // Селекция только нужных полей
      select: {
        id: true,
        achievementId: true,
        progress: true,
        target: true,
        unlockedAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: achievements,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    )
  } catch (error) {
    logger.error(
      "Error fetching achievements:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 })
  }
}

/**
 * POST /api/achievements
 * Разблокировать достижение или обновить прогресс
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    // Валидация входных данных
    const validationResult = achievementSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { achievementId, progress, target } = validationResult.data

    // Check if achievement already exists
    const existing = await db.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId,
        },
      },
    })

    if (existing) {
      // Update progress
      const updated = await db.userAchievement.update({
        where: {
          id: existing.id,
        },
        data: {
          progress: { increment: progress },
        },
      })

      return NextResponse.json(
        {
          success: true,
          data: updated,
          newlyUnlocked: updated.progress >= updated.target && existing.progress < existing.target,
        },
        {
          headers: {
            "Cache-Control": "private, no-store",
          },
        }
      )
    } else {
      // Create new achievement
      const achievement = await db.userAchievement.create({
        data: {
          userId,
          achievementId,
          progress,
          target,
        },
      })

      return NextResponse.json(
        {
          success: true,
          data: achievement,
          newlyUnlocked: progress >= target,
        },
        {
          headers: {
            "Cache-Control": "private, no-store",
          },
        }
      )
    }
  } catch (error) {
    logger.error(
      "Error updating achievement:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.json(
      { error: "Failed to update achievement" },
      { status: 500 }
    )
  }
}
