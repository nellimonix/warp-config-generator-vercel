export interface Service {
  name: string;
  key: string;
  icon: string;
  iconLibrary: 'react-icons/fa' | 'react-icons/fa6' | 'react-icons/io' | 'react-icons/ri' | 'react-icons/si' | 'custom';
  type?: 'new';
}

export interface ServicesConfig {
  services: Service[];
}

export interface IPRanges {
  [key: string]: string;
}

// Типы для компонентов
export type SiteMode = 'all' | 'specific';
export type DeviceType = 'computer' | 'phone' | 'awg15';
export type EndPointType = 'default' | 'default2' | 'input';

export interface WarpConfigResponse {
  configBase64: string;
  qrCodeBase64: string;
}

export interface ApiResponse {
  success: boolean;
  content?: WarpConfigResponse;
  message?: string;
}