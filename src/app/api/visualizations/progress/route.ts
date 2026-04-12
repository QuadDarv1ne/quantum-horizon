import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { createLogger } from "@/lib/logger"
import { z, treeifyError } from "zod"

const logger = createLogger("api:progress")

const progressSchema = z.object({
  topic: z.string().min(1).max(100),
  completedCount: z.number().min(1).max(1000).default(1),
})

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user.id ?? null
}

/**
 * GET /api/visualizations/progress
 * Получить прогресс пользователя для визуализаций
 */
export async function GET() {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const progress = await db.userProgress.findMany({
      where: { userId },
      orderBy: { lastCompleted: "desc" },
      select: {
        id: true,
        topic: true,
        completedCount: true,
        lastCompleted: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: progress,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    )
  } catch (error) {
    logger.error(
      "Error fetching progress:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}

/**
 * POST /api/visualizations/progress
 * Обновить или создать прогресс для визуализации
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const validationResult = progressSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: treeifyError(validationResult.error) },
        { status: 400 }
      )
    }

    const { topic, completedCount } = validationResult.data

    const progress = await db.userProgress.upsert({
      where: {
        userId_topic: {
          userId,
          topic,
        },
      },
      update: {
        completedCount: { increment: completedCount },
        lastCompleted: new Date(),
      },
      create: {
        userId,
        topic,
        completedCount,
      },
    })

    return NextResponse.json({
      success: true,
      data: progress,
    })
  } catch {
    logger.error("Error updating progress:")
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
