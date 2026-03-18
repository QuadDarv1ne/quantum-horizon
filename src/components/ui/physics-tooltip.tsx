"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Info, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getPhysicsInfo, type PhysicsInfo } from "@/lib/physics-info"

interface PhysicsTooltipProps {
  visualizationType: string
  variant?: "button" | "inline" | "card"
}

export function PhysicsTooltip({ visualizationType, variant = "button" }: PhysicsTooltipProps) {
  const [open, setOpen] = useState(false)
  const info = getPhysicsInfo(visualizationType)

  if (!info) {
    return null
  }

  if (variant === "inline") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary h-6 w-6"
            aria-label="Физическая информация"
          >
            <Info className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <PhysicsDialogContent info={info} onClose={() => setOpen(false)} />
      </Dialog>
    )
  }

  if (variant === "card") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="group bg-card hover:bg-accent/50 cursor-pointer rounded-lg border p-4 transition-all">
            <div className="flex items-center gap-2">
              <Info className="text-muted-foreground h-4 w-4" />
              <span className="text-sm font-medium">О явлении</span>
              <ChevronRight className="text-muted-foreground ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </DialogTrigger>
        <PhysicsDialogContent info={info} onClose={() => setOpen(false)} />
      </Dialog>
    )
  }

  // Button variant (default)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" aria-label="Физическая информация">
          <Info className="h-4 w-4" />
          Информация
        </Button>
      </DialogTrigger>
      <PhysicsDialogContent info={info} onClose={() => setOpen(false)} />
    </Dialog>
  )
}

interface PhysicsDialogContentProps {
  info: PhysicsInfo
  onClose: () => void
}

function PhysicsDialogContent({ info, onClose }: PhysicsDialogContentProps) {
  return (
    <DialogContent className="max-h-[80vh] max-w-3xl p-0">
      <DialogHeader className="border-b p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <DialogTitle className="text-2xl">{info.title}</DialogTitle>
            <DialogDescription className="text-base">{info.description}</DialogDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogHeader>

      <ScrollArea className="max-h-[60vh] px-6 pb-6">
        <div className="space-y-6">
          {/* Formula */}
          {info.formula && (
            <section className="space-y-2">
              <h4 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                Формула
              </h4>
              <div className="bg-muted rounded-lg p-4 text-center font-mono text-lg">
                {info.formula}
              </div>
            </section>
          )}

          {/* Key Concepts */}
          <section className="space-y-2">
            <h4 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Ключевые понятия
            </h4>
            <div className="flex flex-wrap gap-2">
              {info.keyConcepts.map((concept) => (
                <Badge key={concept} variant="secondary">
                  {concept}
                </Badge>
              ))}
            </div>
          </section>

          {/* Real World Applications */}
          <section className="space-y-2">
            <h4 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Применение
            </h4>
            <ul className="grid gap-2">
              {info.realWorldApplications.map((app, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <ChevronRight className="text-primary h-4 w-4" />
                  {app}
                </li>
              ))}
            </ul>
          </section>

          {/* Historical Context */}
          <section className="space-y-2">
            <h4 className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
              Исторический контекст
            </h4>
            <div className="bg-accent/50 rounded-lg p-4 text-sm leading-relaxed">
              {info.historicalContext}
            </div>
          </section>
        </div>
      </ScrollArea>
    </DialogContent>
  )
}
