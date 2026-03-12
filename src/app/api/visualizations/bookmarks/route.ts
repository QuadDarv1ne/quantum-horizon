/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

/**
 * GET /api/visualizations/bookmarks
 * Получить закладки пользователя
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

    const bookmarks = await db.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: bookmarks,
    })
  } catch {
    console.error("Error fetching bookmarks:")
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}

/**
 * POST /api/visualizations/bookmarks
 * Добавить закладку
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
    const body = (await request.json()) as { topic?: string; title?: string }
    const { topic, title } = body

    if (!topic || !title) {
      return NextResponse.json({ error: "Topic and title are required" }, { status: 400 })
    }

    // Проверка на дубликат
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
    console.error("Error creating bookmark:")
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 })
  }
}

/**
 * DELETE /api/visualizations/bookmarks
 * Удалить закладку
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session.user as any).id as string
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Bookmark ID is required" }, { status: 400 })
    }

    await db.bookmark.delete({
      where: {
        id,
        userId, // Ensure user can only delete their own bookmarks
      },
    })

    return NextResponse.json({
      success: true,
      message: "Bookmark deleted",
    })
  } catch {
    console.error("Error deleting bookmark:")
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 })
  }
}
