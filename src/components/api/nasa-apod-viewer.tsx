/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"

import { useState } from "react"
import Image from "next/image"
import { ExternalLink, Download, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VisualizationLoader } from "@/components/ui/visualization-loader"
import { PhysicsTooltip, TooltipTrigger } from "@/components/ui/physics-tooltip-enhanced"
import { cn } from "@/lib/utils"
import { useAPOD } from "@/hooks/api/use-apod"

interface APODData {
  date: string
  explanation: string
  hdurl: string
  media_type: "image" | "video"
  service_version: string
  title: string
  url: string
  copyright?: string
}

interface NASAAPODViewerProps {
  className?: string
  showDateSelector?: boolean
}

export function NASAAPODViewer({ className, showDateSelector = true }: NASAAPODViewerProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])

  const { data, isLoading, error, refetch } = useAPOD({
    date: selectedDate,
    enabled: true,
  })

  const handleDownload = async () => {
    if (!data?.hdurl) return

    try {
      const response = await fetch(data.hdurl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `apod-${data.date}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed:", err)
    }
  }

  if (isLoading) {
    return <VisualizationLoader className={className} />
  }

  if (error) {
    return (
      <div
        className={cn("bg-card flex items-center justify-center rounded-xl border p-8", className)}
      >
        <div className="space-y-4 text-center">
          <div className="text-4xl">😕</div>
          <h3 className="text-lg font-semibold">Failed to load APOD</h3>
          <p className="text-muted-foreground text-sm">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-card overflow-hidden rounded-xl border shadow-lg", className)}>
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌌</span>
              <h3 className="text-2xl font-bold">{data?.title}</h3>
            </div>

            {showDateSelector && (
              <div className="flex items-center gap-2">
                <Calendar className="text-muted-foreground size-4" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value)
                  }}
                  className="bg-background rounded-md border px-3 py-1 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  max={new Date().toISOString().split("T")[0]}
                  min="1995-06-16" // First APOD image
                />
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <PhysicsTooltip
              title="About APOD"
              description="Astronomy Picture of the Day is a website provided by NASA that features a different image or photograph of our universe daily, along with a brief explanation written by a professional astronomer."
              learnMoreUrl="https://apod.nasa.gov/"
            >
              <TooltipTrigger>
                <span className="text-sm">What is APOD?</span>
              </TooltipTrigger>
            </PhysicsTooltip>

            <Button onClick={handleDownload} variant="outline" size="sm" title="Download HD image">
              <Download className="size-4" />
            </Button>

            <Button variant="default" size="sm" asChild title="View on NASA">
              <a
                href={`https://apod.nasa.gov/apod/ap${data?.date.replace(/-/g, "")}.html`}
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <ExternalLink className="size-4" />
                NASA
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Media Content */}
      <div className="relative aspect-video w-full bg-black">
        {data?.media_type === "image" ? (
          <>
            <Image
              src={data.url}
              alt={data.title}
              fill
              className="object-contain"
              unoptimized
              priority
            />
            {data.copyright && (
              <div className="absolute right-2 bottom-2 rounded-md bg-black/70 px-3 py-1 text-xs text-white">
                © {data.copyright}
              </div>
            )}
          </>
        ) : (
          <iframe src={data?.url ?? ""} title={data?.title} className="size-full" allowFullScreen />
        )}
      </div>

      {/* Explanation */}
      <div className="p-6">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">{data?.explanation}</p>
        </div>

        {/* Metadata */}
        <div className="text-muted-foreground mt-4 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1">
            <span className="font-medium">Date:</span>
            <span>
              {new Date(data?.date || "").toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-medium">Media Type:</span>
            <span className="capitalize">{data?.media_type}</span>
          </div>

          <div className="flex items-center gap-1">
            <span className="font-medium">Version:</span>
            <span>{data?.service_version}</span>
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-6 flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://www.nasa.gov/search/?search=${encodeURIComponent(data?.title || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              🔭 Search on NASA.gov
            </a>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <a
              href={`https://images.nasa.gov/search?q=${encodeURIComponent(data?.title || "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              📸 More Images
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
