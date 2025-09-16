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
  Sparkles,
  LoaderCircle,
  FileText,
  AlertTriangle
} from "lucide-react"
import Image from "next/image"
import { rybbitEvent } from "@/utils/analyticsEvent"
import { EnhancedConfigOptions } from "./config-options"
import { Badge } from "@/components/ui/badge"
import { CONFIG_FORMATS, type ConfigFormat, type DeviceType, type SiteMode, type EndPointType, getFileName } from "@/lib/types"

interface WarpConfigData {
  configBase64: string;
  qrCodeBase64: string;
  configFormat: ConfigFormat;
  fileName?: string;
}

export function EnhancedWarpGenerator() {
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [configData, setConfigData] = useState<WarpConfigData | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [siteMode, setSiteMode] = useState<SiteMode>("all")
  const [deviceType, setDeviceType] = useState<DeviceType>("computer")
  const [endPoint, setEndPoint] = useState<EndPointType>("default")
  const [customEndpoint, setCustomEndpoint] = useState("")
  const [configFormat, setConfigFormat] = useState<ConfigFormat>("wireguard")
  const [isGenerated, setIsGenerated] = useState(false)
  const [isConfigOpen, setIsConfigOpen] = useState(false)
  const [isConfigCopied, setIsConfigCopied] = useState(false)

  const handleEndPointChange = (value: EndPointType) => {
    setEndPoint(value);
    if (value === "input") {
      setCustomEndpoint("");
    }
  };

  const handleCustomEndpointChange = (endpoint: string) => {
    setCustomEndpoint(endpoint);
  };

  const generateConfig = async () => {
    setIsLoading(true)
    setStatus("")

    let finalEndpoint = "162.159.195.1:500"; // по умолчанию

    switch (endPoint) {
      case "default":
        finalEndpoint = "162.159.195.1:500";
        break;
      case "default2":
        finalEndpoint = "engage.cloudflareclient.com:2408";
        break;
      case "input":
        finalEndpoint = customEndpoint || "162.159.195.1:500"; // fallback если пусто
        break;
    }

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
          endpoint: finalEndpoint,
          configFormat,
        }),
      })
      const data = await response.json()

      if (data.success) {
        setConfigData(data.content)
        setStatus("")
        setIsGenerated(true)
        rybbitEvent("WARP_GEN", `Format: ${configFormat}`)
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
      rybbitEvent("WARP_COPY", `Format: ${configData.configFormat}`)
    }
  }

  const downloadConfig = () => {
    if (configData) {
      const fileName = configData.fileName || getFileName(configData.configFormat);
      const link = document.createElement("a")
      link.href = "data:application/octet-stream;base64," + configData.configBase64
      link.download = fileName
      link.click()
      rybbitEvent("WARP_DOWNLOAD", `Format: ${configData.configFormat}`)
    }
  }

  const handleReset = () => {
    setConfigData(null)
    setIsGenerated(false)
  }

  const selectedFormatInfo = CONFIG_FORMATS.find(f => f.id === configFormat);
  const supportsQR = selectedFormatInfo?.supportsQR ?? true;

  return (
    <div className="w-full space-y-4">

        {/* Индикатор выбранного формата */}
        {!isGenerated && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>Формат: {selectedFormatInfo?.name || 'AmneziaWG'}</span>
            {/* !supportsQR && (
            <Badge variant="outline" className="text-xs">
                Без QR
            </Badge>
            )*/ }
        </div>
        )}

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
                className="absolute -top-2 -right-2 bg-white text-black rounded-[5px] w-5 h-5 flex items-center justify-center text-xs pointer-events-none"
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
                  <DialogDescription>
                    Выберите формат конфигурации и параметры для вашего WARP соединения.
                  </DialogDescription>
                </DialogHeader>
                <EnhancedConfigOptions
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
                  endPoint={endPoint}
                  onEndPointChange={handleEndPointChange}
                  customEndpoint={customEndpoint}
                  onCustomEndpointChange={handleCustomEndpointChange}
                  configFormat={configFormat}
                  onConfigFormatChange={setConfigFormat}
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
          {/* Информация о сгенерированной конфигурации */}
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
            <div className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-700 dark:text-green-300">
                  Конфигурация {selectedFormatInfo?.name} готова!
                </p>
                <p className="text-green-600 dark:text-green-400 mt-1">
                  {configData.fileName && `Файл: ${configData.fileName}`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={downloadConfig} className="flex-[0.7]">
              <Download /> Скачать конфиг
            </Button>
            
            {supportsQR ? (
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
            ) : (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-[0.3]" disabled>
                    <AlertTriangle className="h-4 w-4" />
                    QR код
                  </Button>
                </DialogTrigger>
                <DialogContent className="config-dialog sm:max-w-[425px]">
                  <DialogHeader className="dialog-header">
                    <DialogTitle>QR код</DialogTitle>
                    <DialogDescription>
                      Формат {selectedFormatInfo?.name} не поддерживает QR коды
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Сохраните конфигурацию как файл и импортируйте вручную в ваше приложение
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
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