"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Check,
  Copy,
  Download,
  QrCode,
  Settings,
  RefreshCw,
  X,
  Sparkles,
  LoaderCircle
} from "lucide-react"
import Image from "next/image"
import { ym } from "@/utils/ym"
import { ConfigOptions } from "./config-options"
import { Badge } from "@/components/ui/badge"

export function WarpGenerator() {
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [configData, setConfigData] = useState<{ configBase64: string; qrCodeBase64: string } | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [siteMode, setSiteMode] = useState<"all" | "specific">("all")
  const [deviceType, setDeviceType] = useState<"computer" | "phone" | "awg15">("computer")
  const [isGenerated, setIsGenerated] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isConfigCopied, setIsConfigCopied] = useState(false)

  const generateConfig = async () => {
    setIsLoading(true)
    setStatus("")
    try {
      const response = await fetch("/api/warp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedServices: siteMode === "specific" && selectedServices.length === 0 ? ["all"] : selectedServices,
          siteMode: siteMode === "specific" && selectedServices.length === 0 ? "all" : siteMode,
          deviceType,
        }),
      })
      const data = await response.json()

      if (data.success) {
        setConfigData(data.content)
        setStatus("")
        setIsGenerated(true)
        ym(98811523, "reachGoal", "WARP_GEN")
      } else {
        setStatus("Ошибка: " + data.message)
      }
    } catch (error) {
      setStatus("Произошла ошибка при генерации.")
    } finally {
      setIsLoading(false)
    }
  }

  const copyConfig = () => {
    if (configData) {
      navigator.clipboard.writeText(atob(configData.configBase64))
      setIsConfigCopied(true)
      setTimeout(() => { setIsConfigCopied(false) }, 3000)
    }
  }

  const downloadConfig = () => {
    if (configData) {
      const link = document.createElement("a")
      link.href = "data:application/octet-stream;base64," + configData.configBase64
      link.download = `WARP${Math.floor(Math.random() * (9999999 - 1000000 + 1)) + 1000000}.conf`
      link.click()
      ym(98811523, "reachGoal", "WARP_DOWNLOAD")
    }
  }

  const handleReset = () => {
    setConfigData(null)
    setIsGenerated(false)
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Button onClick={generateConfig} disabled={isLoading || isGenerated} className="flex-grow">
          {isLoading ? <LoaderCircle className="animate-spin" /> : <Sparkles />}
          {isLoading ? "Генерация..." : "Сгенерировать"}
        </Button>

        {!isGenerated ? (
          <div className="relative">
            {siteMode === "specific" && (
              <Badge
                variant="secondary"
                className="absolute -top-2 -right-2 bg-white text-black rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {selectedServices.length}
              </Badge>
            )}
            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="config-dialog sm:max-w-[425px] md:max-w-[700px]">
                <DialogHeader className="dialog-header">
                  <DialogTitle>Настройка конфигурации</DialogTitle>
                  <DialogDescription>Выберите параметры для вашей конфигурации WARP.</DialogDescription>
                </DialogHeader>
                <ConfigOptions
                  selectedServices={selectedServices}
                  onServiceToggle={(service) =>
                    setSelectedServices((prev) =>
                      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service],
                    )
                  }
                  siteMode={siteMode}
                  onSiteModeChange={setSiteMode}
                  deviceType={deviceType}
                  onDeviceTypeChange={setDeviceType}
                />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Button onClick={handleReset} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>

      {status && <p className="text-sm text-muted-foreground">{status}</p>}
      {configData && isGenerated && (
        <>
          <div className="flex gap-2">
            <Button onClick={downloadConfig} className="flex-[0.7]">
              <Download /> Скачать конфиг
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex-[0.3]">
                  <QrCode /> QR код
                </Button>
              </DialogTrigger>
              <DialogContent className="config-dialog sm:max-w-[425px]">
                <DialogHeader className="dialog-header">
                  <DialogTitle>QR код конфигурации</DialogTitle>
                  <DialogDescription>
                    Отсканируйте этот QR код для импорта конфигурации
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center justify-center">
                  <Image
                    src={configData.qrCodeBase64 || "/placeholder.svg"}
                    alt="QR Code"
                    width={425}
                    height={425}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Button onClick={copyConfig} className="w-full">
            {!isConfigCopied ? <Copy /> : <Check />}
            {!isConfigCopied ? "Скопировать конфиг" : "Скопировано"}
          </Button>
        </>
      )}
    </div>
  )
}

