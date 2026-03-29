/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-deprecated */
import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { db } from "@/lib/db"
import { z } from "zod"
import { sendPasswordResetEmail } from "@/lib/email"
import { createLogger } from "@/lib/logger"

const logger = createLogger("api:reset-password")

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
})

const requestResetSchema = z.object({
  email: z.string().email("Некорректный email"),
})

/**
 * POST /api/auth/reset-password
 * Сброс пароля по токену
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = resetPasswordSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message ?? "Ошибка валидации" },
        { status: 400 }
      )
    }

    const { token, password } = validation.data

    // Поиск токена
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return NextResponse.json({ error: "Неверный токен сброса пароля" }, { status: 400 })
    }

    // Проверка истечения токена
    if (resetToken.expires < new Date()) {
      await db.passwordResetToken.delete({
        where: { token },
      })
      return NextResponse.json({ error: "Токен сброса пароля истек" }, { status: 400 })
    }

    // Хэширование нового пароля
    const hashedPassword = await hash(password, 12)

    // Обновление пароля пользователя
    await db.user.update({
      where: { email: resetToken.email },
      data: { password: hashedPassword },
    })

    // Удаление использованного токена
    await db.passwordResetToken.delete({
      where: { token },
    })

    return NextResponse.json({
      success: true,
      message: "Пароль успешно изменен",
    })
  } catch (error) {
    logger.error("Reset password error:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "Ошибка при сбросе пароля" }, { status: 500 })
  }
}

/**
 * GET /api/auth/reset-password
 * Проверка токена сброса пароля
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json({ error: "Токен не предоставлен" }, { status: 400 })
    }

    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    })

    if (!resetToken) {
      return NextResponse.json({ valid: false, error: "Неверный токен" }, { status: 404 })
    }

    if (resetToken.expires < new Date()) {
      await db.passwordResetToken.delete({
        where: { token },
      })
      return NextResponse.json({ valid: false, error: "Токен истек" }, { status: 400 })
    }

    return NextResponse.json({ valid: true, email: resetToken.email })
  } catch (error) {
    logger.error("Check token error:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "Ошибка проверки токена" }, { status: 500 })
  }
}

/**
 * POST /api/auth/request-reset
 * Запрос на сброс пароля (отправка email)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = requestResetSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0]?.message ?? "Ошибка валидации" },
        { status: 400 }
      )
    }

    const { email } = validation.data

    // Поиск пользователя
    const user = await db.user.findUnique({
      where: { email },
    })

    // Не раскрываем, существует ли пользователь
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "Если пользователь существует, письмо отправлено",
      })
    }

    // Генерация токена
    const token = crypto.randomUUID()
    const expires = new Date(Date.now() + 3600000) // 1 час

    // Удаление старых токенов
    await db.passwordResetToken.deleteMany({
      where: { email },
    })

    // Создание нового токена
    await db.passwordResetToken.create({
      data: {
        email,
        token,
        expires,
      },
    })

    // Отправка email
    const emailResult = await sendPasswordResetEmail(email, token)

    if (!emailResult.success) {
      logger.error("Failed to send email:", emailResult.error)
    }

    return NextResponse.json({
      success: true,
      message: "Если пользователь существует, письмо отправлено",
    })
  } catch (error) {
    logger.error("Request reset error:", error instanceof Error ? error.message : "Unknown error")
    return NextResponse.json({ error: "Ошибка при запросе сброса пароля" }, { status: 500 })
  }
}
