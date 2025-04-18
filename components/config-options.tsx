import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const services = [
  { name: "Discord", key: "discord" },
  { name: "YouTube", key: "youtube" },
  { name: "Twitter", key: "twitter" },
  { name: "Instagram", key: "instagram" },
  { name: "Facebook", key: "facebook" },
  { name: "Viber", key: "viber" },
  { name: "TikTok", key: "tiktok" },
  { name: "Spotify", key: "spotify" },
  { name: "Zetflix", key: "zetflix" },
  { name: "NNM-Club", key: "nnmclub" },
  { name: "RuTracker", key: "rutracker" },
  { name: "Kinozal", key: "kinozal" },
  { name: "Copilot", key: "copilot" },
  { name: "Canva", key: "canva" },
  { name: "Patreon", key: "patreon" },
  { name: "AnimeGo", key: "animego" },
  { name: "Jutsu", key: "jutsu" },
  { name: "YummyAnime", key: "yummianime" },
  { name: "PornHub", key: "pornhub" },
  { name: "XVideos", key: "xvideos" },
  { name: "Pornolab", key: "pornolab" },
  { name: "Ficbook", key: "ficbook" },
  { name: "BestChange", key: "bestchange" },
]

interface ConfigOptionsProps {
  selectedServices: string[]
  onServiceToggle: (service: string) => void
  siteMode: "all" | "specific"
  onSiteModeChange: (mode: "all" | "specific") => void
  deviceType: "computer" | "phone"
  onDeviceTypeChange: (type: "computer" | "phone") => void
}

export function ConfigOptions({
  selectedServices,
  onServiceToggle,
  siteMode,
  onSiteModeChange,
  deviceType,
  onDeviceTypeChange,
}: ConfigOptionsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <Select value={siteMode} onValueChange={onSiteModeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите режим" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все сайты</SelectItem>
            <SelectItem value="specific">Определенные сайты</SelectItem>
          </SelectContent>
        </Select>

        {siteMode === "specific" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {services.map((service) => (
              <Button
                key={service.key}
                variant={selectedServices.includes(service.key) ? "default" : "outline"}
                onClick={() => onServiceToggle(service.key)}
                className="justify-start"
              >
                {service.name}
              </Button>
            ))}
          </div>
        )}

        <Select value={deviceType} onValueChange={onDeviceTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Выберите устройство" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="computer">Компьютер</SelectItem>
            <SelectItem value="phone">Телефон</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

