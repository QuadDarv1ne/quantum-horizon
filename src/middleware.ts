import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Получаем токен сессии
    const token = req.nextauth.token

    // Проверяем путь для защиты
    const isAuthPath = req.nextUrl.pathname.startsWith("/auth")
    const isProtectedPath = req.nextUrl.pathname.startsWith("/dashboard") ||
      req.nextUrl.pathname.startsWith("/profile") ||
      req.nextUrl.pathname.startsWith("/settings")

    // Если пытаемся получить доступ к защищённому пути без авторизации
    if (isProtectedPath && !token) {
      const signInUrl = new URL("/auth/signin", req.url)
      signInUrl.searchParams.set("callbackUrl", req.url)
      return NextResponse.redirect(signInUrl)
    }

    // Если пытаемся получить доступ к auth пути с авторизацией
    if (isAuthPath && token) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  }
)

// Защищаем только определённые пути
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - auth callback routes
     */
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.json|icons|auth/callback).*)",
  ],
}
