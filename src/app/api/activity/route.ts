import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

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
      take: 50, // Last 50 activities
    })

    return NextResponse.json({
      success: true,
      data: activities,
    })
  } catch (error) {
    console.error("Error fetching activities:", error)
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 })
  }
}

/**
 * POST /api/activity
 * Записать новое действие
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, topic, xpGained = 0 } = body

    if (!action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 })
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
    })
  } catch (error) {
    console.error("Error logging activity:", error)
    return NextResponse.json({ error: "Failed to log activity" }, { status: 500 })
  }
}
