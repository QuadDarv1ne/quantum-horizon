/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth, { type NextAuthOptions } from "next-auth"

// Адаптер для Prisma (отключён до настройки схемы)
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { db } from "@/lib/db"
// const prismaAdapter = PrismaAdapter(db)

export const authOptions: NextAuthOptions = {
  // Адаптер для хранения сессий в БД
  // adapter: prismaAdapter,

  providers: [
    // Email/Password провайдер (требуется дополнительная настройка)
    // CredentialsProvider({
    //   name: "credentials",
    //   credentials: {
    //     email: { label: "Email", type: "email" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     if (!credentials?.email || !credentials?.password) {
    //       throw new Error("Invalid credentials")
    //     }
    //
    //     const user = await db.user.findUnique({
    //       where: { email: credentials.email },
    //       select: {
    //         id: true,
    //         email: true,
    //         name: true,
    //         password: true,
    //         role: true,
    //       },
    //     })
    //
    //     if (!user || !user.password) {
    //       throw new Error("Invalid credentials")
    //     }
    //
    //     // Проверка пароля (требуется bcrypt)
    //     // const isCorrect = await bcrypt.compare(credentials.password, user.password)
    //
    //     if (!isCorrect) {
    //       throw new Error("Invalid credentials")
    //     }
    //
    //     return {
    //       id: user.id,
    //       email: user.email,
    //       name: user.name,
    //       role: user.role,
    //     }
    //   },
    // }),
    // Google OAuth
    // {
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // },
    // GitHub OAuth
    // {
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // },
  ],

  // Страницы аутентификации
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },

  // Сессии
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // JWT настройки
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Callbacks
  callbacks: {
    jwt({ token, user }) {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (user) {
        token.id = user.id
        token.role = user.role as string
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },

  // События
  events: {
    createUser() {
      // Создание записи прогресса для нового пользователя
      // await db.userProgress.create({
      //   data: {
      //     userId: user.id,
      //     topic: "general",
      //     completedCount: 0,
      //   },
      // })
    },
  },

  // Debug режим только в development
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
