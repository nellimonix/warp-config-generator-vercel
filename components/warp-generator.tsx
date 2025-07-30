"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings, Download, QrCode, RefreshCw, Zap } from "lucide-react"
import Image from "next/image"
import ConfigOptions from "./config-options"

interface ConfigData {
  configBase64: string
  qrCodeBase64: string
}

export default function WarpGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [configData, setConfigData] = useState<ConfigData | null>(null)
  const [isGenerated, setIsGenerated] = useState(false)
  const [status, setStatus] = useState("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [siteMode, setSiteMode] = useState<"all" | "specific">("all")
  const [deviceType, setDeviceType] = useState<"android" | "ios" | "windows" | "linux">("windows")
  const [isConfigOpen, setIsConfigOpen] = useState(false)

  const generateConfig = async () => {
    setIsLoading(true)
    setStatus("Генерация конфигурации...")

    try {
      const response = await fetch("/api/warp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedServices, siteMode, deviceType }),
      })

      const data = await response.json()

      if (data.success) {
        // Сохраняем ответ API в стейт
        setConfigData(data.content)
        setIsGenerated(true)
        setStatus("Конфигурация готова!")
      } else {
        setStatus("Ошибка при генерации конфигурации")
      }
    } catch (error) {
      setStatus("Произошла ошибка")
    } finally {
      setIsLoading(false)
    }
  }

  const downloadConfig = () => {
    if (!configData) return

    // Декодируем Base64 → текст
    const decoded = atob(configData.configBase64)
    const blob = new Blob([decoded], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "warp-config.conf"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)

    URL.revokeObjectURL(url)
  }

  const resetGenerator = () => {
    setConfigData(null)
    setIsGenerated(false)
    setStatus("")
  }

  return (
    <div className="space-y-0">
      {/* Основная секция генерации */}
      <div className="p-6 border-b border-telegram-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-telegram-blue rounded-full flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-medium text-telegram-text">Быстрая генерация</h2>
              <p className="text-sm text-telegram-secondary">Создать WARP конфигурацию</p>
            </div>
          </div>

          {siteMode === "specific" && selectedServices.length > 0 && (
            <Badge className="bg-telegram-blue text-white rounded-full px-3 py-1">
              {selectedServices.length}
            </Badge>
          )}
        </div>

        <Button
          onClick={generateConfig}
          disabled={isLoading}
          className="w-full bg-telegram-blue hover:bg-telegram-blue-dark text-white rounded-xl py-3 h-12 font-medium transition-all duration-200 hover:shadow-telegram-hover"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Генерация...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Сгенерировать конфиг</span>
            </div>
          )}
        </Button>

        {status && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-telegram-secondary text-center">{status}</p>
          </div>
        )}
      </div>

      {/* Настройки */}
      <div className="p-6 border-b border-telegram-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-telegram-secondary" />
            </div>
            <div>
              <h3 className="font-medium text-telegram-text">Настройки</h3>
              <p className="text-sm text-telegram-secondary">Дополнительные параметры</p>
            </div>
          </div>

          <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-telegram-blue hover:bg-telegram-blue/10 rounded-lg">
                Настроить
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl text-telegram-text">Настройка конфигурации</DialogTitle>
              </DialogHeader>

              <ConfigOptions
                selectedServices={selectedServices}
                onServiceToggle={(service) =>
                  setSelectedServices((prev) =>
                    prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
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
      </div>

      {/* Результаты генерации */}
      {isGenerated && configData && (
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-telegram-green rounded-full flex items-center justify-center">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-telegram-text">Готово!</h3>
              <p className="text-sm text-telegram-secondary">Конфигурация сгенерирована</p>
            </div>
          </div>

          {/* Кнопки скачать + QR */}
          <div className="grid grid-cols-2 gap-3">
            {/* Скачать конфиг */}
            <Button
              onClick={downloadConfig}
              className="bg-telegram-green hover:bg-telegram-green/90 text-white rounded-xl py-3 h-12 font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Скачать
            </Button>

            {/* QR код */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-telegram-border text-telegram-blue hover:bg-telegram-blue/10 rounded-xl py-3 h-12 font-medium"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR код
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="text-center text-telegram-text">QR код</DialogTitle>
                </DialogHeader>

                <div className="flex justify-center p-4">
                  {configData.qrCodeBase64 && (
                    <Image
                      src={configData.qrCodeBase64}
                      alt="QR Code"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: "100%", height: "auto" }}
                      className="rounded-lg"
                    />
                  )}
                </div>

                <p className="text-sm text-telegram-secondary text-center px-4">
                  Отсканируйте для импорта конфигурации
                </p>
              </DialogContent>
            </Dialog>
          </div>

          {/* Сброс генератора */}
          <Button
            onClick={resetGenerator}
            variant="ghost"
            className="w-full text-telegram-secondary hover:bg-gray-50 rounded-xl py-2"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Создать новую конфигурацию
          </Button>
        </div>
      )}
    </div>
  )
}
