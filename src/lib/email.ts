import nodemailer from "nodemailer"

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  const mailOptions = {
    from: process.env.EMAIL_FROM ?? "noreply@quantum-horizon.app",
    to,
    subject,
    html,
    text,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log("Email sent:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("Email error:", error)
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
