"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignOutPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = () => {
    setIsLoading(true)
    void signOut({ callbackUrl: "/" })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-900/80 text-white backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl font-bold">Выход из аккаунта</CardTitle>
          <CardDescription className="text-center text-slate-400">
            Вы уверены, что хотите выйти?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 border-slate-600 bg-slate-800 hover:bg-slate-700"
              onClick={() => {
                window.history.back()
              }}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleSignOut}
              disabled={isLoading}
            >
              {isLoading ? "Выход..." : "Выйти"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
