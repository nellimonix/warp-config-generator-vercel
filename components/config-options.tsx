import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // допустим у тебя есть компонент Input
import { FaDiscord, FaYoutube, FaTwitter, FaFacebook } from "react-icons/fa";
import { FaTelegram, FaSignalMessenger } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
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
  { name: "Telegram", key: "telegram", icon: FaTelegram, type: "new" },
  { name: "WhatsApp", key: "whatsapp", icon: IoLogoWhatsapp, type: "new" },
  { name: "Twitter", key: "twitter", icon: FaTwitter },
  { name: "Instagram", key: "instagram", icon: RiInstagramFill },
  { name: "Facebook", key: "facebook", icon: FaFacebook },
  { name: "Viber", key: "viber", icon: ViberIcon },
  { name: "Signal", key: "signal", icon: FaSignalMessenger, type: "new" },
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
];

interface ConfigOptionsProps {
  selectedServices: string[]
  onServiceToggle: (service: string) => void
  siteMode: "all" | "specific"
  onSiteModeChange: (mode: "all" | "specific") => void
  deviceType: "computer" | "phone" | "awg15"
  onDeviceTypeChange: (type: "computer" | "phone" | "awg15") => void
  endPoint: "default" | "default2" | "input"
  onEndPointChange: (point: "default" | "default2" | "input") => void
  customEndpoint: string
  onCustomEndpointChange: (endpoint: string) => void
}

const getEndpointDisplayValue = (endPointValue: string) => {
  switch (endPointValue) {
    case "default":
      return "162.159.195.1:500";
    case "default2":
      return "engage.cloudflareclient.com:2408";
    case "input":
      return "";
    default:
      return "";
  }
};

export function ConfigOptions({
  selectedServices,
  onServiceToggle,
  siteMode,
  onSiteModeChange,
  deviceType,
  onDeviceTypeChange,
  endPoint,
  onEndPointChange,
  customEndpoint,
  onCustomEndpointChange,
}: ConfigOptionsProps) {
  const handleEndPointChange = (value: "default" | "default2" | "input") => {
    onEndPointChange(value);
    if (value === "input") {
      onCustomEndpointChange("");
    }
  };

  const handleCustomEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (endPoint === "input") {
      onCustomEndpointChange(e.target.value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">

        {/* Режим сайта */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium pb-[5px]">Тип конфигурации</span>
          <Select value={siteMode} onValueChange={onSiteModeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все сайты</SelectItem>
              <SelectItem value="specific">Определенные сайты</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Выбор сервисов */}
        {siteMode === "specific" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {services.map((service) => {
              const Icon = service.icon || TbBoxMultipleFilled;

              return (
                <Button
                  key={service.key}
                  variant={selectedServices.includes(service.key) ? "default" : "outline"}
                  onClick={() => onServiceToggle(service.key)}
                  className="justify-start gap-2"
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  {service.name}
                  {service.type === "new" && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        )}

        {/* Настройки соединения */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium pb-[5px]">Настройки соединения</span>
          <Select value={deviceType} onValueChange={onDeviceTypeChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="computer">Оптимальный</SelectItem>
              <SelectItem value="phone">Альтернативный</SelectItem>
              <SelectItem value="awg15">AmneziaWG 1.5</SelectItem>
            </SelectContent>
          </Select>

          {/* Предупреждение для AmneziaWG 1.5 */}
          {deviceType === "awg15" && (
            <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-md">
              <div className="flex items-start gap-2">
                <span className="text-orange-600 dark:text-orange-400 text-sm font-medium">⚠️</span>
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  <p className="font-medium mb-1">AmneziaWG 1.5 - данный параметр позволяет использовать конфиг с AmneziaVPN.</p>
                  <p>Импортируйте конфиг в приложение <strong>AmneziaVPN</strong>! Приложение <strong>AmneziaWG</strong> пока что не поддерживает этот формат!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Endpoint */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium pb-[5px]">Конечная точка</span>
          <Select value={endPoint} onValueChange={handleEndPointChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">По умолчанию</SelectItem>
              <SelectItem value="default2">Альтернативный</SelectItem>
              <SelectItem value="input">Указать свой адрес</SelectItem>
            </SelectContent>
          </Select>

          {/* Поле ввода - всегда видимое, но с разными состояниями */}
          <Input
            value={endPoint === "input" ? customEndpoint : getEndpointDisplayValue(endPoint)}
            onChange={handleCustomEndpointChange}
            placeholder={endPoint === "input" ? "Введите адрес сервера" : ""}
            className="mt-2"
            disabled={endPoint !== "input"}
            readOnly={endPoint !== "input"}
          />
        </div>

      </div>
    </div>
  );
}
