"use client"

import { Component, type ReactNode, type ErrorInfo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  name?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.name ? `: ${this.props.name}` : ""}]`, error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-red-500/50 bg-red-950/20">
          <CardHeader>
            <CardTitle className="text-red-400">
              ⚠️ Ошибка визуализации{this.props.name ? `: ${this.props.name}` : ""}
            </CardTitle>
            <CardDescription className="text-red-300/70">
              {this.state.error?.message || "Произошла неизвестная ошибка"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null })
              }}
              variant="outline"
              className="border-red-500/50 text-red-300 hover:bg-red-950/50"
            >
              Попробовать снова
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}
