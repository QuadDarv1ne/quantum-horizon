import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"

/**
 * GET /api/visualizations/bookmarks
 * Получить закладки пользователя
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

    const bookmarks = await db.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: bookmarks,
    })
  } catch (error) {
    console.error("Error fetching bookmarks:", error)
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/visualizations/bookmarks
 * Добавить закладку
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
    const { topic, title } = body

    if (!topic || !title) {
      return NextResponse.json(
        { error: "Topic and title are required" },
        { status: 400 }
      )
    }

    // Проверка на дубликат
    const existing = await db.bookmark.findFirst({
      where: {
        userId,
        topic,
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Bookmark already exists" },
        { status: 409 }
      )
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
  } catch (error) {
    console.error("Error creating bookmark:", error)
    return NextResponse.json(
      { error: "Failed to create bookmark" },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/visualizations/bookmarks
 * Удалить закладку
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        { error: "Bookmark ID is required" },
        { status: 400 }
      )
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
  } catch (error) {
    console.error("Error deleting bookmark:", error)
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    )
  }
}
