/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

/**
 * GET /api/visualizations/progress
 * Получить прогресс пользователя для визуализаций
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session.user as any).id as string

    // Получить весь прогресс пользователя
    const progress = await db.userProgress.findMany({
      where: { userId },
      orderBy: { lastCompleted: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: progress,
    })
  } catch {
    console.error("Error fetching progress:")
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
  }
}

/**
 * POST /api/visualizations/progress
 * Обновить или создать прогресс для визуализации
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session.user as any).id as string
    const body = (await request.json()) as { topic?: string; completedCount?: number }
    const { topic, completedCount = 1 } = body

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Обновить или создать прогресс
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
    console.error("Error updating progress:")
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
  }
}
