"use client"

import { useState, useEffect } from "react"
import { Share2, Link as LinkIcon, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

// Social icons as SVG components (removed from lucide-react v1.7)
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-12.7 14.5-5.5 1.7-8.8-5.9-5.7-9C1 12.5 0 10 0 10c3.9 1.7 7.2 0 7.2 0-3.6-.5-4.3-4.2-4.3-4.2 2.3 1.2 4.2 1.2 4.2 1.2C3.6 5.6 5.6 3 9.4 3c1.8 0 3 .7 3 .7-3.1-.1-4.2 1.8-4.2 1.8 2.4-1.2 4.8-.6 4.8-.6-1.4 1-1.5 2.6-1.5 2.6 4.6-2.3 8.9 1.2 8.9 1.2"/>
  </svg>
)

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
)

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
)

interface VisualizationParams {
  viz?: string
  [key: string]: string | undefined
}

interface ShareVisualizationProps {
  visualizationId: string
  visualizationName: string
  parameters?: Record<string, string | number | boolean>
  className?: string
}

export function ShareVisualization({
  visualizationId,
  visualizationName,
  parameters,
  className,
}: ShareVisualizationProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Generate shareable URL with parameters
      const url = new URL(window.location.href)
      url.searchParams.set("viz", visualizationId)

      if (parameters) {
        Object.entries(parameters).forEach(([key, value]) => {
          url.searchParams.set(key, String(value))
        })
      }

      setShareUrl(url.toString())
    }
  }, [visualizationId, parameters])

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast({
          title: "Link copied!",
          description: "The shareable link has been copied to your clipboard.",
          duration: 2000,
        })
        setTimeout(() => setCopied(false), 2000)
      } else {
        // Fallback для браузеров без clipboard API
        const textarea = document.createElement("textarea")
        textarea.value = shareUrl
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
        setCopied(true)
        toast({
          title: "Link copied!",
          description: "The shareable link has been copied to your clipboard.",
          duration: 2000,
        })
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
      })
    }
  }

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: visualizationName,
          text: `Check out this physics visualization: ${visualizationName}`,
          url: shareUrl,
        })
        toast({
          title: "Shared successfully!",
          description: "Thanks for sharing!",
        })
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          // User aborted, don't log
        }
      }
    } else {
      setOpen(true)
    }
  }

  const handleSocialShare = (platform: string) => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out: ${visualizationName}`)}&url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(visualizationName)}`,
    }

    const url = urls[platform as keyof typeof urls]
    if (url) {
      window.open(url, "_blank", "width=600,height=400")
      toast({
        title: "Opening share dialog...",
        description: `Sharing to ${platform}`,
      })
    }
  }

  return (
    <>
      <Button
        onClick={handleShareNative}
        variant="outline"
        size="sm"
        className={cn(
          "gap-2 transition-all duration-300",
          "hover:scale-105 hover:shadow-lg",
          className
        )}
        title="Share this visualization"
      >
        <Share2 className="size-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="size-5" />
              Share Visualization
            </DialogTitle>
            <DialogDescription>Share "{visualizationName}" with others</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Copy Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Copy Link</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="bg-muted flex-1 rounded-md border px-3 py-2 text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  size="sm"
                  variant={copied ? "default" : "outline"}
                  className="shrink-0"
                >
                  {copied ? <Check className="size-4" /> : <LinkIcon className="size-4" />}
                </Button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Share on Social Media</label>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleSocialShare("twitter")}
                  variant="outline"
                  size="icon"
                  className="hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]"
                >
                  <TwitterIcon />
                </Button>
                <Button
                  onClick={() => handleSocialShare("facebook")}
                  variant="outline"
                  size="icon"
                  className="hover:bg-[#4267B2]/10 hover:text-[#4267B2]"
                >
                  <FacebookIcon />
                </Button>
                <Button
                  onClick={() => handleSocialShare("linkedin")}
                  variant="outline"
                  size="icon"
                  className="hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]"
                >
                  <LinkedinIcon />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Hook to read URL parameters on mount
export function useVisualizationFromURL() {
  const [params, setParams] = useState<VisualizationParams>({})

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      const vizId = searchParams.get("viz")

      if (vizId) {
        const extractedParams: VisualizationParams = { viz: vizId }
        searchParams.forEach((value, key) => {
          if (key !== "viz") {
            extractedParams[key] = value
          }
        })
        setParams(extractedParams)
      }
    }
  }, [])

  return params
}
