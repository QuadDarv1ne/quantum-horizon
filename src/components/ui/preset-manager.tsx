"use client"

import { useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Save, Download, Upload, Trash2, Star, Plus, X, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  getAllPresets,
  saveUserPreset,
  deleteUserPreset,
  createCustomPreset,
  exportPresets,
  importPresets,
  type Preset,
} from "@/lib/presets"
import { useVisualizationStore, type VisualizationType } from "@/stores/visualization-store"
import { toast } from "sonner"

interface PresetManagerProps {
  visualizationType: VisualizationType
}

export function PresetManager({ visualizationType }: PresetManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [presetName, setPresetName] = useState("")
  const [presetDescription, setPresetDescription] = useState("")
  const [importText, setImportText] = useState("")
  const [presets, setPresets] = useState<Preset[]>([])

  const settings = useVisualizationStore((state) => ({
    waveFunction: state.waveFunction,
    timeDilation: state.timeDilation,
    blackHole: state.blackHole,
  }))

  const setQuantumNumber = useVisualizationStore((state) => state.setQuantumNumber)
  const toggleShowProbability = useVisualizationStore((state) => state.toggleShowProbability)
  const toggleShowWaveFunction = useVisualizationStore((state) => state.toggleShowWaveFunction)
  const setVelocity = useVisualizationStore((state) => state.setVelocity)
  const toggleShowClock = useVisualizationStore((state) => state.toggleShowClock)
  const setBlackHoleMass = useVisualizationStore((state) => state.setBlackHoleMass)
  const toggleAccretionDisk = useVisualizationStore((state) => state.toggleAccretionDisk)
  const toggleHawkingRadiation = useVisualizationStore((state) => state.toggleHawkingRadiation)

  const loadPresets = useCallback(() => {
    const allPresets = getAllPresets(visualizationType)
    setPresets(allPresets)
  }, [visualizationType])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      if (open) {
        loadPresets()
      }
    },
    [loadPresets]
  )

  const handleApplyPreset = useCallback(
    (preset: Preset) => {
      const wfSettings = preset.settings.waveFunction
      const tdSettings = preset.settings.timeDilation
      const bhSettings = preset.settings.blackHole

      if (wfSettings) {
        if (wfSettings.quantumNumber !== undefined) {
          setQuantumNumber(wfSettings.quantumNumber)
        }
        if (wfSettings.showProbability !== undefined) {
          // Toggle if different
        }
        if (wfSettings.showWaveFunction !== undefined) {
          // Toggle if different
        }
      }

      if (tdSettings) {
        if (tdSettings.velocity !== undefined) {
          setVelocity(tdSettings.velocity)
        }
      }

      if (bhSettings) {
        if (bhSettings.mass !== undefined) {
          setBlackHoleMass(bhSettings.mass)
        }
      }

      toast.success(`Пресет "${preset.name}" применён`)
    },
    [setQuantumNumber, setVelocity, setBlackHoleMass]
  )

  const handleSavePreset = useCallback(() => {
    if (!presetName.trim()) {
      toast.error("Введите название пресета")
      return
    }

    const preset = createCustomPreset(
      presetName,
      presetDescription,
      visualizationType,
      settings as any
    )

    saveUserPreset(visualizationType, preset)
    toast.success(`Пресет "${presetName}" сохранён`)
    setPresetName("")
    setPresetDescription("")
    setIsSaveDialogOpen(false)
    loadPresets()
  }, [presetName, presetDescription, visualizationType, settings, loadPresets])

  const handleDeletePreset = useCallback(
    (preset: Preset) => {
      if (preset.isDefault) {
        toast.error("Нельзя удалить стандартный пресет")
        return
      }

      deleteUserPreset(visualizationType, preset.id)
      toast.success("Пресет удалён")
      loadPresets()
    },
    [visualizationType, loadPresets]
  )

  const handleExport = useCallback(() => {
    const json = exportPresets()
    navigator.clipboard.writeText(json)
    toast.success("Пресеты экспортированы в буфер обмена")
  }, [])

  const handleImport = useCallback(() => {
    const success = importPresets(importText)
    if (success) {
      toast.success("Пресеты импортированы")
      setImportText("")
      setIsImportDialogOpen(false)
      loadPresets()
    } else {
      toast.error("Ошибка импорта: неверный формат JSON")
    }
  }, [importText, loadPresets])

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Star className="h-4 w-4" />
            Пресеты
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between border-b p-2">
            <span className="text-sm font-semibold">Пресеты настроек</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsSaveDialogOpen(true)}
                title="Сохранить текущие настройки"
              >
                <Save className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleExport}
                title="Экспортировать пресеты"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsImportDialogOpen(true)}
                title="Импортировать пресеты"
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-96 overflow-auto">
            {presets.length === 0 ? (
              <div className="text-muted-foreground p-4 text-center text-sm">
                Нет сохранённых пресетов
              </div>
            ) : (
              presets.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  className="flex cursor-pointer items-start justify-between p-3"
                  onClick={() => handleApplyPreset(preset)}
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{preset.name}</span>
                      {preset.isDefault && <Star className="fill-primary text-primary h-3 w-3" />}
                    </div>
                    <p className="text-muted-foreground text-xs">{preset.description}</p>
                  </div>
                  {!preset.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeletePreset(preset)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </DropdownMenuItem>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog для сохранения нового пресета */}
      <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Сохранить пресет</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="preset-name">Название</Label>
              <Input
                id="preset-name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Мои настройки"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preset-description">Описание</Label>
              <Textarea
                id="preset-description"
                value={presetDescription}
                onChange={(e) => setPresetDescription(e.target.value)}
                placeholder="Описание пресета..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSaveDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleSavePreset}>
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog для импорта пресетов */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Импортировать пресеты</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="import-json">JSON с пресетами</Label>
              <Textarea
                id="import-json"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"waveFunction": [...]}'
                rows={8}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleImport}>
              <Upload className="mr-2 h-4 w-4" />
              Импортировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
