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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 p-4">
      <Card className="w-full max-w-md bg-slate-900/80 border-slate-700 text-white backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Выход из аккаунта</CardTitle>
          <CardDescription className="text-slate-400 text-center">
            Вы уверены, что хотите выйти?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 bg-slate-800 border-slate-600 hover:bg-slate-700"
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
