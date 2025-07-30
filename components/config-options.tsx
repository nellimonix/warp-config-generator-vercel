
"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Wifi, Server, Globe, Shield, Zap, MonitorCog } from "lucide-react"

interface ConfigOptionsProps {
  selectedServices: string[]
  onServiceToggle: (service: string) => void
  siteMode: "all" | "specific"
  onSiteModeChange: (mode: "all" | "specific") => void
  deviceType: "computer" | "phone"
  onDeviceTypeChange: (type: "computer" | "phone") => void
}

const services = [
  { id: "youtube", name: "YouTube"},
  { id: "discord", name: "Discord"},
  { id: "twitter", name: "Twitter/X"},
  { id: "instagram", name: "Instagram"},
  { id: "facebook", name: "Facebook"},
  { id: "viber", name: "Viber"},
  { id: "zetflix", name: "Zetflix"},
  { id: "nnmclub", name: "NNM-Club"},
  { id: "rutracker", name: "RuTracker"},
  { id: "kinozal", name: "Kinozal"},
  { id: "copilot", name: "Copilot"},
  { id: "canva", name: "Canva"},
  { id: "patreon", name: "Patreon"},
  { id: "animego", name: "AnimeGo"},
  { id: "jutsu", name: "Jutsu"},
  { id: "yummianime", name: "YummyAnime"},
  { id: "pornhub", name: "PornHub"},
  { id: "xvideos", name: "XVideos"},
  { id: "pornolab", name: "Pornolab"},
  { id: "ficbook", name: "Ficbook"},
  { id: "proton", name: "Proton"},
  { id: "telegram", name: "Telegram"},
  { id: "whatsapp", name: "WhatsApp"},
]

const deviceTypes = [
  { id: "computer", name: "Оптимальный", icon: Globe },
  { id: "phone", name: "Альтернативный", icon: Server },
]

export default function ConfigOptions({
  selectedServices,
  onServiceToggle,
  siteMode,
  onSiteModeChange,
  deviceType,
  onDeviceTypeChange,
}: ConfigOptionsProps) {
  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Site Mode Selection */}
      <Card className="p-6 telegram-card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-telegram-blue/10 rounded-full flex items-center justify-center">
            <MonitorCog className="w-5 h-5 text-telegram-blue" />
          </div>
          <div>
            <h3 className="font-medium text-telegram-text">Режим работы</h3>
            <p className="text-sm text-telegram-secondary">Выберите какие сайты обходить</p>
          </div>
        </div>

        <RadioGroup value={siteMode} onValueChange={onSiteModeChange} className="space-y-3">
          <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="all" id="all" className="text-telegram-blue" />
            <Label htmlFor="all" className="flex-1 cursor-pointer">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-telegram-blue" />
                <span className="font-medium">Все сайты</span>
              </div>
              <p className="text-sm text-telegram-secondary mt-1">Обходить блокировки для всех сайтов</p>
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <RadioGroupItem value="specific" id="specific" className="text-telegram-blue" />
            <Label htmlFor="specific" className="flex-1 cursor-pointer">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-telegram-blue" />
                <span className="font-medium">Выборочно</span>
              </div>
              <p className="text-sm text-telegram-secondary mt-1">Только для выбранных сервисов</p>
            </Label>
          </div>
        </RadioGroup>
      </Card>

      {/* Services Selection */}
      {siteMode === "specific" && (
        <Card className="p-6 telegram-card animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-telegram-green/10 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-telegram-green" />
              </div>
              <div>
                <h3 className="font-medium text-telegram-text">Сервисы</h3>
                <p className="text-sm text-telegram-secondary">Выберите нужные сервисы</p>
              </div>
            </div>
            {selectedServices.length > 0 && (
              <Badge className="bg-telegram-green text-white rounded-full">
                {selectedServices.length}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {services.map((service) => (
              <div
                key={service.id}
                className={`flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedServices.includes(service.id)
                    ? "border-telegram-blue bg-telegram-blue/5"
                    : "border-telegram-border hover:border-telegram-blue/50 hover:bg-gray-50"
                }`}
                onClick={() => onServiceToggle(service.id)}
              >
                <Checkbox
                  checked={selectedServices.includes(service.id)}
                  onChange={() => onServiceToggle(service.id)}
                  className="text-telegram-blue"
                />
                <div className="flex items-center space-x-2 flex-1">
                  <span className="text-sm font-medium text-telegram-text">{service.name}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedServices.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedServices.map((serviceId) => {
                const service = services.find((s) => s.id === serviceId)
                return (
                  <Badge
                    key={serviceId}
                    variant="secondary"
                    className="bg-telegram-blue text-white rounded-full px-3 py-1 cursor-pointer hover:bg-telegram-blue-dark"
                    onClick={() => onServiceToggle(serviceId)}
                  >
                    {service?.name} ×
                  </Badge>
                )
              })}
            </div>
          )}
        </Card>
      )}

      {/* Device Type Selection */}
      <Card className="p-6 telegram-card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Wifi className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-telegram-text">Настройки соединения</h3>
            <p className="text-sm text-telegram-secondary">Выберите нужные настройки</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {deviceTypes.map((device) => {
            const IconComponent = device.icon
            return (
              <Button
                key={device.id}
                variant={deviceType === device.id ? "default" : "outline"}
                className={`h-auto p-4 justify-start ${
                  deviceType === device.id
                    ? "bg-telegram-blue hover:bg-telegram-blue-dark text-white"
                    : "border-telegram-border text-telegram-text hover:border-telegram-blue hover:bg-telegram-blue/5"
                } rounded-xl`}
                onClick={() => onDeviceTypeChange(device.id as any)}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{device.name}</span>
                </div>
              </Button>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
