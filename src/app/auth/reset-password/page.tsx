"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { fetchWithTimeout } from "@/lib/fetch-with-timeout"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setError("Токен не предоставлен")
      setTokenValid(false)
      return
    }

    const checkToken = async () => {
      try {
        const response = await fetchWithTimeout(`/api/auth/reset-password?token=${token}`, {
          timeoutMs: 10000,
        })
        const data = (await response.json()) as { valid?: boolean; email?: string; error?: string }

        if (response.ok && data.valid) {
          setTokenValid(true)
          setEmail(data.email ?? null)
        } else {
          setTokenValid(false)
          setError(data.error ?? "Неверный токен")
        }
      } catch {
        setTokenValid(false)
        setError("Ошибка проверки токена")
      }
    }

    void checkToken()
  }, [token])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Пароли не совпадают")
      return
    }

    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetchWithTimeout("/api/auth/reset-password", {
        timeoutMs: 10000,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? "Ошибка сброса пароля")
      }

      toast({
        title: "Успешно",
        description: "Пароль изменен. Теперь войдите.",
      })

      router.push("/auth/signin")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ошибка сброса пароля"
      setError(errorMessage)
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (tokenValid === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-4">
        <Card className="w-full max-w-md border-slate-700 bg-slate-900/80 text-white">
          <CardContent className="pt-6">
            <p className="text-center text-slate-400">Проверка токена...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-4">
        <Card className="w-full max-w-md border-slate-700 bg-slate-900/80 text-white">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">⚠️ Ошибка</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Токен недействителен
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive" className="border-red-800 bg-red-950/50">
              <AlertDescription className="text-slate-300">
                {error ?? "Токен сброса пароля недействителен или истек"}
              </AlertDescription>
            </Alert>
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
              onClick={() => {
                router.push("/auth/signin")
              }}
            >
              Вернуться ко входу
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900/80 text-white backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">🔒 Сброс пароля</CardTitle>
          <CardDescription className="text-center text-slate-400">
            {email && `Для: ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Новый пароль</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                required
                minLength={8}
                disabled={isLoading}
                className="border-slate-600 bg-slate-800"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                }}
                required
                minLength={8}
                disabled={isLoading}
                className="border-slate-600 bg-slate-800"
                autoComplete="new-password"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-800 bg-red-950/50">
                <AlertDescription className="text-slate-300">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Изменение..." : "Изменить пароль"}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            <a
              href="/auth/signin"
              onClick={(e) => {
                e.preventDefault()
                router.push("/auth/signin")
              }}
              className="text-indigo-400 hover:underline"
            >
              Вернуться ко входу
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
