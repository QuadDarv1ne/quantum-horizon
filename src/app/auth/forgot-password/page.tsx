"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { fetchWithTimeout } from "@/lib/fetch-with-timeout"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetchWithTimeout("/api/auth/reset-password", {
        timeoutMs: 10000,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? "Ошибка запроса")
      }

      setSuccess(true)
      toast({
        title: "Успешно",
        description: "Письмо со сбросом пароля отправлено",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ошибка запроса"
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

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-4">
        <Card className="w-full max-w-md border-slate-700 bg-slate-900/80 text-white backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">✉️ Письмо отправлено</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Проверьте вашу почту
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-green-800 bg-green-950/50">
              <AlertDescription className="text-slate-300">
                Мы отправили инструкцию по сбросу пароля на {email}
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              className="w-full border-slate-600 bg-slate-800 hover:bg-slate-700"
              onClick={() => {
                router.push("/auth/signin")
              }}
            >
              Вернуться ко входу
            </Button>
            <Button
              variant="ghost"
              className="w-full text-indigo-400 hover:text-indigo-300"
              onClick={() => {
                setSuccess(false)
                setEmail("")
              }}
            >
              Отправить повторно
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
          <CardTitle className="text-center text-2xl font-bold">🔑 Восстановление пароля</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Введите email для сброса пароля
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
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
              {isLoading ? "Отправка..." : "Отправить инструкцию"}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            <a href="/auth/signin" className="text-indigo-400 hover:underline">
              Вернуться ко входу
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
