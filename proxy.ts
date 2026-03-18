import createMiddleware from "next-intl/middleware"
import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"
import { locales, defaultLocale } from "@/i18n/config"

// next-intl middleware для обработки локали
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "never", // Не добавлять префикс локали к URL (используем localStorage)
  localeDetection: true, // Автоматическое определение локали
})

// Комбинированный proxy
export default async function proxy(request: NextRequest) {
  // Сначала обрабатываем i18n
  const intlResponse = intlMiddleware(request)

  // Получаем токен для auth
  const token = await getToken({ req: request })

  // Проверяем путь для защиты
  const isAuthPath = request.nextUrl.pathname.startsWith("/auth")
  const isProtectedPath =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/settings")

  // Если пытаемся получить доступ к защищённому пути без авторизации
  if (isProtectedPath && !token) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(signInUrl)
  }

  // Если пытаемся получить доступ к auth пути с авторизацией
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Иначе используем intl response
  return intlResponse
}

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
