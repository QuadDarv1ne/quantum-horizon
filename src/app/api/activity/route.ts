import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { createLogger } from "@/lib/logger"
import { z, treeifyError } from "zod"

const logger = createLogger("api:activity")

// Zod схемы для валидации
const activitySchema = z.object({
  action: z.string().min(1).max(200),
  topic: z.string().max(100).nullable().optional(),
  xpGained: z.number().min(0).max(10000).default(0),
})

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user.id ?? null
}

/**
 * GET /api/activity
 * Получить историю активности пользователя
 */
export async function GET() {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const activities = await db.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        action: true,
        topic: true,
        xpGained: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { success: true, data: activities },
      { headers: { "Cache-Control": "private, no-store" } }
    )
  } catch (error) {
    logger.error(
      "Error fetching activities:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}

/**
 * POST /api/activity
 * Записать новое действие
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as Record<string, unknown>

    // Валидация входных данных
    const validationResult = activitySchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: treeifyError(validationResult.error) },
        { status: 400 }
      )
    }

    const { action, topic, xpGained } = validationResult.data

    const activity = await db.userActivity.create({
      data: {
        userId,
        action,
        topic,
        xpGained,
      },
      select: {
        id: true,
        action: true,
        topic: true,
        xpGained: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { success: true, data: activity },
      { headers: { "Cache-Control": "private, no-store" } }
    )
  } catch (error) {
    logger.error(
      "Error logging activity:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 })
  }
}
