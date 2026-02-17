import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaDiscord, FaYoutube, FaTwitter, FaFacebook } from "react-icons/fa";
import { FaTelegram, FaSignalMessenger } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { RiInstagramFill } from "react-icons/ri";
import { SiPatreon, SiCanva, SiProtonvpn, SiModrinth } from "react-icons/si";
import { RiNetflixFill } from "react-icons/ri";
import { TbBoxMultipleFilled } from "react-icons/tb";
import { 
  ViberIcon, NNMClubIcon, KinozalIcon, 
  CopilotIcon, AnimeGoIcon, PornhubIcon, 
  JutsuIcon, YummyAnimeIcon, XVideosIcon,
  PornoLabIcon, FicBookIcon, RuTrackerIcon
} from "@/components/icons/custom-icons";
import servicesConfig from "@/data/services-config.json";
import { CONFIG_FORMATS, type ConfigFormat, type DeviceType, type SiteMode, type EndPointType } from "@/lib/types";
import ReactCountryFlag from "react-country-flag";
import { useMobile } from "@/hooks/use-mobile" // путь под твой проект

// Icon mapping для динамического импорта
const iconMap = {
  // React Icons FA
  "FaDiscord": FaDiscord,
  "FaYoutube": FaYoutube,
  "FaTwitter": FaTwitter,
  "FaFacebook": FaFacebook,
  "FaSignalMessenger": FaSignalMessenger,
  // React Icons FA6
  "FaTelegram": FaTelegram,
  // React Icons IO
  "IoLogoWhatsapp": IoLogoWhatsapp,
  // React Icons RI
  "RiInstagramFill": RiInstagramFill,
  "RiNetflixFill": RiNetflixFill,
  // React Icons SI
  "SiPatreon": SiPatreon,
  "SiCanva": SiCanva,
  "SiProtonvpn": SiProtonvpn,
  "SiModrinth": SiModrinth,
  // Custom Icons
  "ViberIcon": ViberIcon,
  "NNMClubIcon": NNMClubIcon,
  "KinozalIcon": KinozalIcon,
  "CopilotIcon": CopilotIcon,
  "AnimeGoIcon": AnimeGoIcon,
  "PornhubIcon": PornhubIcon,
  "JutsuIcon": JutsuIcon,
  "YummyAnimeIcon": YummyAnimeIcon,
  "XVideosIcon": XVideosIcon,
  "PornoLabIcon": PornoLabIcon,
  "FicBookIcon": FicBookIcon,
  "RuTrackerIcon": RuTrackerIcon,
  // Default fallback
  "TbBoxMultipleFilled": TbBoxMultipleFilled
};

interface EnhancedConfigOptionsProps {
  selectedServices: string[]
  onServiceToggle: (service: string) => void
  siteMode: SiteMode
  onSiteModeChange: (mode: SiteMode) => void
  deviceType: DeviceType
  onDeviceTypeChange: (type: DeviceType) => void
  endPoint: EndPointType
  onEndPointChange: (point: EndPointType) => void
  customEndpoint: string
  onCustomEndpointChange: (endpoint: string) => void
  configFormat: ConfigFormat
  onConfigFormatChange: (format: ConfigFormat) => void
}

const getEndpointDisplayValue = (endPointValue: string) => {
  switch (endPointValue) {
    case "default":
      return "engage.cloudflareclient.com:4500";
    case "default2":
      return "engage.cloudflareclient.com:2408";
    case "input":
      return "";
    default:
      return "";
  }
};

export function EnhancedConfigOptions({
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
  configFormat,
  onConfigFormatChange,
}: EnhancedConfigOptionsProps) {
  const isMobile = useMobile();
  const handleEndPointChange = (value: EndPointType) => {
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

  const selectedFormatInfo = CONFIG_FORMATS.find(f => f.id === configFormat);

const countries = [
  { name: "Германия", code: "DE" },
  { name: "Нидерланды", code: "NL" },
  { name: "Финляндия", code: "FI" },
];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">

        {/* Формат конфигурации */}
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium pb-[5px]">Формат конфигурации</span>
          <Select value={configFormat} onValueChange={onConfigFormatChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONFIG_FORMATS.map((format) => (
                <SelectItem key={format.id} value={format.id}>
                  <div className="flex items-center gap-2">
                    <span>{format.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedFormatInfo && (
            <p className="text-xs text-muted-foreground mt-1">
              {selectedFormatInfo.description}
            </p>
          )}
        </div>

        {/* Предупреждения для специфических форматов */}
        {configFormat === "throne" && (
          <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">ℹ️</span>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                <p className="font-medium mb-1">Throne - специальный URL формат</p>
                <p>Конфигурация будет в виде wg:// ссылки для импорта в Throne клиент</p>
              </div>
            </div>
          </div>
        )}

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
            {servicesConfig.services.map((service) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap] || TbBoxMultipleFilled;

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
              <SelectItem value="phone">AmneziaWG 1.0</SelectItem>
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
          <div className={`mt-4 ${isMobile ? "flex flex-col gap-2" : "grid grid-cols-2 md:grid-cols-3 gap-3"}`}>
            {countries.map((c, i) => (
              <a
                key={i}
                href="https://t.me/findllimonix/69"
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border bg-gradient-to-br from-muted/50 to-muted p-4 hover:from-primary/10 hover:to-primary/5 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg">
                    <ReactCountryFlag countryCode={c.code} svg className="mr-2" />
                    {c.name}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}