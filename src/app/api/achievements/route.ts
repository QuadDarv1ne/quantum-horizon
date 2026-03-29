/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { createLogger } from "@/lib/logger"

const logger = createLogger("api:achievements")

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
    })

    return NextResponse.json({
      success: true,
      data: achievements,
    })
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
    const { achievementId, progress = 1, target = 1 } = body

    if (!achievementId) {
      return NextResponse.json({ error: "Achievement ID is required" }, { status: 400 })
    }

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

      return NextResponse.json({
        success: true,
        data: updated,
        newlyUnlocked: updated.progress >= updated.target && existing.progress < existing.target,
      })
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

      return NextResponse.json({
        success: true,
        data: achievement,
        newlyUnlocked: progress >= target,
      })
    }
  } catch (error) {
    logger.error(
      "Error updating achievement:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.json({ error: "Failed to update achievement" }, { status: 500 })
  }
}
