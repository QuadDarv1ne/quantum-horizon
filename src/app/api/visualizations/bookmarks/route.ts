import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { createLogger } from "@/lib/logger"

const logger = createLogger("api:bookmarks")

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user.id ?? null
}

/**
 * GET /api/visualizations/bookmarks
 * Получить закладки пользователя
 */
export async function GET() {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bookmarks = await db.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: bookmarks,
    })
  } catch {
    logger.error("Error fetching bookmarks:")
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}

/**
 * POST /api/visualizations/bookmarks
 * Добавить закладку
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as { topic?: string; title?: string }
    const { topic, title } = body

    if (!topic || !title) {
      return NextResponse.json({ error: "Topic and title are required" }, { status: 400 })
    }

    const existing = await db.bookmark.findFirst({
      where: {
        userId,
        topic,
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Bookmark already exists" }, { status: 409 })
    }

    const bookmark = await db.bookmark.create({
      data: {
        userId,
        topic,
        title,
      },
    })

    return NextResponse.json({
      success: true,
      data: bookmark,
    })
  } catch {
    logger.error("Error creating bookmark:")
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 })
  }
}

/**
 * DELETE /api/visualizations/bookmarks
 * Удалить закладку
 */
export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const topic = searchParams.get("topic")

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    await db.bookmark.deleteMany({
      where: {
        topic,
        userId,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Bookmark deleted",
    })
  } catch {
    logger.error("Error deleting bookmark:")
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 })
  }
}
