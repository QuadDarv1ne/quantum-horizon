import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { createLogger } from "@/lib/logger"

const logger = createLogger("api:activity")

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user.id ?? null
}

interface ActivityBody {
  action?: string
  topic?: string
  xpGained?: number
}

interface ActivityData {
  id: string
  userId: string
  action: string
  topic: string | null
  xpGained: number
  createdAt: Date
}

interface SuccessResponse<T> {
  success: true
  data: T
}

interface ErrorResponse {
  error: string
}

/**
 * GET /api/activity
 * Получить историю активности пользователя
 */
export async function GET() {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" } satisfies ErrorResponse, { status: 401 })
    }

    const activities = await db.userActivity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50, // Last 50 activities
    })

    return NextResponse.json({
      success: true,
      data: activities,
    } satisfies SuccessResponse<ActivityData[]>)
  } catch (error) {
    logger.error(
      "Error fetching activities:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.json({ error: "Failed to fetch activities" } satisfies ErrorResponse, {
      status: 500,
    })
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
      return NextResponse.json({ error: "Unauthorized" } satisfies ErrorResponse, { status: 401 })
    }

    const body = (await request.json()) as ActivityBody
    const { action, topic, xpGained = 0 } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" } satisfies ErrorResponse, {
        status: 400,
      })
    }

    const activity = await db.userActivity.create({
      data: {
        userId,
        action,
        topic,
        xpGained,
      },
    })

    return NextResponse.json({
      success: true,
      data: activity,
    } satisfies SuccessResponse<ActivityData>)
  } catch (error) {
    logger.error(
      "Error logging activity:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.json({ error: "Failed to log activity" } satisfies ErrorResponse, {
      status: 500,
    })
  }
}
