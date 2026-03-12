/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import NextAuth, { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "name@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Введите email и пароль")
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            password: true,
            role: true,
          },
        })

        if (!user?.password) {
          throw new Error("Неверный email или пароль")
        }

        const isCorrect = await compare(credentials.password, user.password)

        if (!isCorrect) {
          throw new Error("Неверный email или пароль")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
    // Google OAuth (раскомментировать для использования)
    // {
    //   id: "google",
    //   name: "google",
    //   type: "oauth",
    //   wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
    //   authorization: { params: { scope: "openid email profile" } },
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   idToken: true,
    //   checks: ["pkce", "state"],
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: profile.name,
    //       email: profile.email,
    //       image: profile.picture,
    //       role: "USER",
    //     }
    //   },
    // },
    // GitHub OAuth (раскомментировать для использования)
    // {
    //   id: "github",
    //   name: "github",
    //   type: "oauth",
    //   authorization: { params: { scope: "read:user user:email" } },
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    //   profile(profile) {
    //     return {
    //       id: profile.id.toString(),
    //       name: profile.name ?? profile.login,
    //       email: profile.email,
    //       image: profile.avatar_url,
    //       role: "USER",
    //     }
    //   },
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        token.role = (user as any).role as string
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        ;(session.user as any).id = token.id as string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
        ;(session.user as any).role = token.role as string
      }
      return session
    },
  },

  // События
  events: {
    async createUser({ user }) {
      // Создание записей прогресса и настроек для нового пользователя
      try {
        await db.userProgress.create({
          data: {
            userId: user.id,
            topic: "general",
            completedCount: 0,
          },
        })
        await db.userSettings.create({
          data: {
            userId: user.id,
            theme: "system",
            language: "ru",
          },
        })
      } catch (error) {
        console.error("Error creating user progress/settings:", error)
      }
    },
  },

  // Debug режим только в development
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
