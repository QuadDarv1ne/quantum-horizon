import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { db } from "@/lib/db"
import { createLogger } from "@/lib/logger"
import { z, treeifyError } from "zod"

const logger = createLogger("api:bookmarks")

const bookmarkSchema = z.object({
  topic: z.string().min(1).max(100),
  title: z.string().min(1).max(200),
})

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user.id ?? null
}

/**
 * GET /api/visualizations/bookmarks
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
      select: { id: true, topic: true, title: true, createdAt: true },
    })

    return NextResponse.json(
      { success: true, data: bookmarks },
      { headers: { "Cache-Control": "private, no-store" } }
    )
  } catch (error) {
    logger.error("Error fetching bookmarks:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 })
  }
}

/**
 * POST /api/visualizations/bookmarks
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const body = await request.json()
    const validationResult = bookmarkSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input", details: treeifyError(validationResult.error) },
        { status: 400 }
      )
    }

    const { topic, title } = validationResult.data

    const existing = await db.bookmark.findFirst({ where: { userId, topic } })
    if (existing) {
      return NextResponse.json({ error: "Bookmark already exists" }, { status: 409 })
    }

    const bookmark = await db.bookmark.create({
      data: { userId, topic, title },
      select: { id: true, topic: true, title: true, createdAt: true },
    })

    return NextResponse.json(
      { success: true, data: bookmark },
      { headers: { "Cache-Control": "private, no-store" } }
    )
  } catch (error) {
    logger.error("Error creating bookmark:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 })
  }
}

/**
 * DELETE /api/visualizations/bookmarks
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

    await db.bookmark.deleteMany({ where: { topic, userId } })

    return NextResponse.json(
      { success: true, message: "Bookmark deleted" },
      { headers: { "Cache-Control": "private, no-store" } }
    )
  } catch (error) {
    logger.error("Error deleting bookmark:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 })
  }
}
