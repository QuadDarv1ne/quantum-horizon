/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-deprecated */
import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
  name: z.string().min(2, "Имя должно содержать минимум 2 символа").optional(),
})

/**
 * POST /api/auth/register
 * Регистрация нового пользователя
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = registerSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message ?? "Ошибка валидации" },
        { status: 400 }
      )
    }

    const { email, password, name } = validation.data

    // Проверка существования пользователя
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      )
    }

    // Хэширование пароля
    const hashedPassword = await hash(password, 12)

    // Создание пользователя
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name ?? null,
        role: "USER",
      },
    })

    // Создание записи прогресса
    await db.userProgress.create({
      data: {
        userId: user.id,
        topic: "general",
        completedCount: 0,
      },
    })

    // Создание настроек пользователя
    await db.userSettings.create({
      data: {
        userId: user.id,
        theme: "system",
        language: "ru",
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Пользователь успешно зарегистрирован",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Ошибка при регистрации" }, { status: 500 })
  }
}
