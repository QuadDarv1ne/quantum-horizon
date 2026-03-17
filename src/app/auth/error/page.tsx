"use client"

import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Ошибка конфигурации",
    description: "Произошла ошибка конфигурации. Пожалуйста, обратитесь к администратору.",
  },
  AccessDenied: {
    title: "Доступ запрещён",
    description: "У вас нет доступа к этой странице.",
  },
  Verification: {
    title: "Ошибка проверки",
    description: "Ссылка для входа устарела или уже была использована.",
  },
  Default: {
    title: "Произошла ошибка",
    description: "Не удалось завершить вход. Пожалуйста, попробуйте снова.",
  },
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const errorConfig = errorMessages[error ?? "Default"] ?? errorMessages.Default

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900/80 text-white backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">⚠️ {errorConfig.title}</CardTitle>
          <CardDescription className="text-center text-slate-400">Quantum Horizon</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive" className="border-red-800 bg-red-950/50">
            <AlertDescription className="text-slate-300">
              {errorConfig.description}
            </AlertDescription>
          </Alert>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-slate-600 bg-slate-800 hover:bg-slate-700"
              onClick={() => {
                window.history.back()
              }}
            >
              Назад
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
              onClick={(): void => {
                window.location.href = "/auth/signin"
              }}
            >
              Попробовать снова
            </Button>
          </div>

          {error && <p className="text-center text-xs text-slate-500">Код ошибки: {error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
