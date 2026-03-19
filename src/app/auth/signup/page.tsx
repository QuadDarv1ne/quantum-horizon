"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { fetchWithTimeout } from "@/lib/fetch-with-timeout"

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchWithTimeout("/api/auth/register", {
        timeoutMs: 10000,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? "Ошибка регистрации")
      }

      toast({
        title: "Успешно",
        description: "Аккаунт создан. Теперь войдите.",
      })

      // Автоматический вход
      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (signInResult?.error) {
        router.push("/auth/signin")
      } else {
        router.push("/")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ошибка регистрации"
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900/80 text-white backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">⧫ Регистрация</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Создайте аккаунт для сохранения прогресса
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Форма регистрации */}
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя (необязательно)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                }}
                disabled={isLoading}
                className="border-slate-600 bg-slate-800"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                required
                disabled={isLoading}
                className="border-slate-600 bg-slate-800"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
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
              <p className="text-xs text-slate-400">Минимум 8 символов</p>
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
              {isLoading ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-400">или</span>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500">
            Уже есть аккаунт?{" "}
            <a
              href="/auth/signin"
              onClick={(e) => {
                e.preventDefault()
                router.push("/auth/signin")
              }}
              className="text-indigo-400 hover:underline"
            >
              Войти
            </a>
          </p>

          <p className="text-center text-xs text-slate-600">
            Продолжая, вы соглашаетесь с нашими Условиями использования и Политикой
            конфиденциальности
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
