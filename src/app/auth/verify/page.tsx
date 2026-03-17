"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VerifyRequestPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/auth/signin")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900/80 text-white backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">✉️ Проверьте почту</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Ссылка для входа отправлена
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-slate-300">
            Мы отправили ссылку для входа на вашу почту. Проверьте папку «Входящие» или «Спам».
          </p>

          <div className="text-center">
            <p className="text-sm text-slate-400">
              Перенаправление на страницу входа через{" "}
              <span className="font-semibold text-indigo-400">{countdown}</span> сек...
            </p>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
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
