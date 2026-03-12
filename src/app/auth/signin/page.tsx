"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const callbackUrl = searchParams.get("callbackUrl") ?? "/"

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Ошибка входа",
          description: result.error,
        })
      } else {
        toast({
          title: "Успешный вход",
          description: "Добро пожаловать!",
        })
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при входе",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-4">
      <Card className="w-full max-w-md bg-slate-900/80 border-slate-700 text-white backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">⧫ Quantum Horizon</CardTitle>
          <CardDescription className="text-slate-400 text-center">
            Войдите для сохранения прогресса
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Форма входа */}
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
                className="bg-slate-800 border-slate-600"
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
                disabled={isLoading}
                className="bg-slate-800 border-slate-600"
                autoComplete="current-password"
              />
            </div>

            {/* Сообщения об ошибках */}
            {searchParams.get("error") && (
              <Alert variant="destructive" className="bg-red-950/50 border-red-800">
                <AlertDescription>
                  {searchParams.get("error") === "OAuthAccountNotLinked"
                    ? "Этот email уже используется другим способом входа"
                    : searchParams.get("error") === "CredentialsSignin"
                      ? "Неверный email или пароль"
                      : "Произошла ошибка при входе"}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>

          <div className="text-center">
            <a href="/auth/forgot-password" className="text-xs text-indigo-400 hover:underline">
              Забыли пароль?
            </a>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-400">или</span>
            </div>
          </div>

          <p className="text-xs text-center text-slate-500">
            Нет аккаунта?{" "}
            <a href="/auth/signup" className="text-indigo-400 hover:underline">
              Зарегистрироваться
            </a>
          </p>

          <p className="text-xs text-center text-slate-600">
            Продолжая, вы соглашаетесь с нашими Условиями использования и Политикой
            конфиденциальности
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
