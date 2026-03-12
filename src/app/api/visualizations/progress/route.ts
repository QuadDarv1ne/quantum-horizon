import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

/**
 * GET /api/visualizations/progress
 * Получить прогресс пользователя для визуализаций
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // Получить весь прогресс пользователя
    const progress = await db.userProgress.findMany({
      where: { userId },
      orderBy: { lastCompleted: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: progress,
    })
  } catch (error) {
    console.error("Error fetching progress:", error)
    return NextResponse.json(
      { error: "Failed to fetch progress" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/visualizations/progress
 * Обновить или создать прогресс для визуализации
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const body = await request.json()
    const { topic, completedCount = 1 } = body

    if (!topic) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      )
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
  } catch (error) {
    console.error("Error updating progress:", error)
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    )
  }
}
