"use client"

import { Component, type ReactNode, type ErrorInfo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  name?: string
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[ErrorBoundary${this.props.name ? `: ${this.props.name}` : ""}]`,
      error,
      errorInfo
    )

    this.props.onError?.(error, errorInfo)
    this.setState({ errorInfo })
  }

  public handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
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
              ⚠️ Ошибка{this.props.name ? `: ${this.props.name}` : ""}
            </CardTitle>
            <CardDescription className="space-y-2 text-red-300/70">
              <p>{this.state.error?.message || "Произошла неизвестная ошибка"}</p>
              {process.env.NODE_ENV === "development" && this.state.errorInfo && (
                <details className="mt-2 text-xs text-red-300/50">
                  <summary className="cursor-pointer">Детали ошибки (Dev)</summary>
                  <pre className="mt-2 max-h-40 overflow-auto rounded bg-red-950/50 p-2">
                    <code>{this.state.errorInfo.componentStack}</code>
                  </pre>
                </details>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button
              onClick={this.handleRetry}
              variant="outline"
              className="border-red-500/50 text-red-300 hover:bg-red-950/50"
            >
              🔄 Попробовать снова
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
              className="bg-slate-800 text-slate-200"
            >
              🔄 Перезагрузить страницу
            </Button>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

export function ErrorBoundaryFallback({
  error,
  reset,
  title,
}: {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
}) {
  return (
    <Card className="border-red-500/50 bg-red-950/20">
      <CardHeader>
        <CardTitle className="text-red-400">⚠️ Ошибка{title ? `: ${title}` : ""}</CardTitle>
        <CardDescription className="text-red-300/70">
          <p>{error.message}</p>
          {error.digest && <p className="mt-2 text-xs text-red-300/50">Error ID: {error.digest}</p>}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button onClick={reset} variant="outline" className="border-red-500/50 text-red-300">
          🔄 Попробовать снова
        </Button>
      </CardContent>
    </Card>
  )
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: { name?: string; fallback?: ReactNode } = {}
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary name={options.name} fallback={options.fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}
