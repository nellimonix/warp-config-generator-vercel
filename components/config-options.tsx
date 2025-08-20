import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FaDiscord, FaYoutube, FaTwitter, FaFacebook, FaViber } from "react-icons/fa"
import { RiInstagramFill } from "react-icons/ri";
import { SiPatreon, SiCanva, SiProtonvpn } from "react-icons/si";
import { RiNetflixFill } from "react-icons/ri";
import { TbBoxMultipleFilled } from "react-icons/tb";
import { 
  ViberIcon, NNMClubIcon, KinozalIcon, 
  CopilotIcon, AnimeGoIcon, PornhubIcon, 
  JutsuIcon, YummyAnimeIcon, XVideosIcon,
  PornoLabIcon, FicBookIcon, RuTrackerIcon
} from "@/components/icons/custom-icons";

const services = [
  { name: "Discord", key: "discord", icon: FaDiscord },
  { name: "YouTube", key: "youtube", icon: FaYoutube },
  { name: "Twitter", key: "twitter", icon: FaTwitter },
  { name: "Instagram", key: "instagram", icon: RiInstagramFill },
  { name: "Facebook", key: "facebook", icon: FaFacebook },
  { name: "Viber", key: "viber", icon: ViberIcon },
  { name: "Zetflix", key: "zetflix", icon: RiNetflixFill },
  { name: "Canva", key: "canva", icon: SiCanva },
  { name: "Patreon", key: "patreon", icon: SiPatreon },
  { name: "Proton", key: "proton", icon: SiProtonvpn },
  { name: "NNM-Club", key: "nnmclub", icon: NNMClubIcon },
  { name: "RuTracker", key: "rutracker", icon: RuTrackerIcon },
  { name: "Kinozal", key: "kinozal", icon: KinozalIcon },
  { name: "Copilot", key: "copilot", icon: CopilotIcon },
  { name: "AnimeGo", key: "animego", icon: AnimeGoIcon },
  { name: "Jutsu", key: "jutsu", icon: JutsuIcon },
  { name: "YummyAnime", key: "yummyanime", icon: YummyAnimeIcon },
  { name: "PornHub", key: "pornhub", icon: PornhubIcon },
  { name: "XVideos", key: "xvideos", icon: XVideosIcon },
  { name: "Pornolab", key: "pornolab", icon: PornoLabIcon },
  { name: "Ficbook", key: "ficbook", icon: FicBookIcon },
  
]

interface ConfigOptionsProps {
  selectedServices: string[]
  onServiceToggle: (service: string) => void
  siteMode: "all" | "specific"
  onSiteModeChange: (mode: "all" | "specific") => void
  deviceType: "computer" | "phone" | "awg15"
  onDeviceTypeChange: (type: "computer" | "phone" | "awg15") => void
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
            {services.map((service) => {
              const Icon = service.icon || TbBoxMultipleFilled ;

              return (
                <Button
                  key={service.key}
                  variant={selectedServices.includes(service.key) ? "default" : "outline"}
                  onClick={() => onServiceToggle(service.key)}
                  className="justify-start gap-2"
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {service.name}
                </Button>
              )
            })}
          </div>
        )}

        <Select value={deviceType} onValueChange={onDeviceTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Настройки соединения" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="computer">Оптимальный</SelectItem>
            <SelectItem value="phone">Альтернативный</SelectItem>
            <SelectItem value="awg15">AmneziaWG 1.5</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

