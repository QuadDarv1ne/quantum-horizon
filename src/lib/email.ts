import nodemailer from "nodemailer"
import { createLogger } from "./logger"

const logger = createLogger("email")

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Проверка, включена ли отправка email
const isEmailEnabled =
  process.env.EMAIL_ENABLED === "true" &&
  process.env.EMAIL_SERVER_HOST &&
  process.env.EMAIL_SERVER_USER

let transporter: nodemailer.Transporter | null = null

if (isEmailEnabled) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  // Mock-режим для разработки (вывод в консоль)
  if (!transporter) {
    logger.info("\n" + "=".repeat(60))
    logger.info("📧 EMAIL (MOCK MODE) - Письмо не отправлено")
    logger.info("=".repeat(60))
    logger.info(`Кому: ${to}`)
    logger.info(`Тема: ${subject}`)
    logger.info("-".repeat(60))
    logger.info(text ?? html.substring(0, 500) + "...")
    logger.info("=".repeat(60) + "\n")

    // Вывод ссылки для сброса пароля (если есть)
    const resetLinkMatch = /href="([^"]*reset-password[^"]*)"/.exec(html)
    if (resetLinkMatch) {
      logger.info("🔗 Ссылка для сброса пароля:")
      logger.info(resetLinkMatch[1])
      logger.info("")
    }

    return { success: true, messageId: `mock-${String(Date.now())}` }
  }

  // Реальная отправка
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM ?? "noreply@quantum-horizon.app",
      to,
      subject,
      html,
      text,
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const info = await transporter.sendMail(mailOptions)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    logger.log("Email sent:", info.messageId)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return { success: true, messageId: String(info.messageId) }
  } catch (error) {
    logger.error("Email error:", error instanceof Error ? error.message : "Unknown error")
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL ?? "http://localhost:3000"}/auth/reset-password?token=${token}`

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Quantum Horizon</h1>
            <p>Сброс пароля</p>
          </div>
          <div class="content">
            <p>Здравствуйте,</p>
            <p>Вы запросили сброс пароля для вашего аккаунта Quantum Horizon.</p>
            <p>Нажмите на кнопку ниже, чтобы установить новый пароль:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Сбросить пароль</a>
            </p>
            <p>Или скопируйте эту ссылку в браузер:</p>
            <p style="word-break: break-all; color: #6366f1;">${resetUrl}</p>
            <p><strong>Внимание:</strong> Эта ссылка действительна в течение 1 часа.</p>
            <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
          </div>
          <div class="footer">
            <p>© ${String(new Date().getFullYear())} Quantum Horizon. Все права защищены.</p>
          </div>
        </div>
      </body>
    </html>
  `

  const text = `
    Quantum Horizon - Сброс пароля

    Здравствуйте,

    Вы запросили сброс пароля для вашего аккаунта Quantum Horizon.

    Перейдите по ссылке для сброса пароля:
    ${resetUrl}

    Внимание: Эта ссылка действительна в течение 1 часа.

    Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.

    © ${String(new Date().getFullYear())} Quantum Horizon
  `

  return sendEmail({
    to: email,
    subject: "🔐 Quantum Horizon - Сброс пароля",
    html,
    text,
  })
}
