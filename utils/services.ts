import { Service, ServicesConfig, IPRanges } from '@/types/services';
import servicesConfig from '@/data/services-config.json';
import ipRanges from '@/data/ip-ranges.json';

export class ServicesManager {
  private static instance: ServicesManager;
  private services: Service[];
  private ipRanges: IPRanges;

  private constructor() {
    this.services = (servicesConfig as ServicesConfig).services;
    this.ipRanges = ipRanges as IPRanges;
  }

  public static getInstance(): ServicesManager {
    if (!ServicesManager.instance) {
      ServicesManager.instance = new ServicesManager();
    }
    return ServicesManager.instance;
  }

  /**
   * Получить все сервисы
   */
  public getAllServices(): Service[] {
    return this.services;
  }

  /**
   * Получить сервис по ключу
   */
  public getServiceByKey(key: string): Service | undefined {
    return this.services.find(service => service.key === key);
  }

  /**
   * Получить IP диапазоны для сервиса
   */
  public getIPRangesForService(serviceKey: string): string | undefined {
    return this.ipRanges[serviceKey];
  }

  /**
   * Получить все IP диапазоны для выбранных сервисов
   */
  public getIPRangesForServices(serviceKeys: string[]): string[] {
    const allIPs = new Set<string>();
    
    serviceKeys.forEach(key => {
      const ranges = this.getIPRangesForService(key);
      if (ranges) {
        ranges.split(', ').forEach(ip => allIPs.add(ip.trim()));
      }
    });
    
    return Array.from(allIPs);
  }

  /**
   * Получить сервисы с пометкой "new"
   */
  public getNewServices(): Service[] {
    return this.services.filter(service => service.type === 'new');
  }

  /**
   * Получить сервисы по библиотеке иконок
   */
  public getServicesByIconLibrary(library: string): Service[] {
    return this.services.filter(service => service.iconLibrary === library);
  }

  /**
   * Проверить, существует ли сервис
   */
  public serviceExists(key: string): boolean {
    return this.services.some(service => service.key === key);
  }

  /**
   * Валидировать выбранные сервисы
   */
  public validateSelectedServices(serviceKeys: string[]): {
    valid: string[];
    invalid: string[];
  } {
    const valid: string[] = [];
    const invalid: string[] = [];
    
    serviceKeys.forEach(key => {
      if (this.serviceExists(key)) {
        valid.push(key);
      } else {
        invalid.push(key);
      }
    });
    
    return { valid, invalid };
  }
}

// Экспорт singleton instance для удобства
export const servicesManager = ServicesManager.getInstance();

// Хелпер функции для прямого использования
export const getAllServices = () => servicesManager.getAllServices();
export const getServiceByKey = (key: string) => servicesManager.getServiceByKey(key);
export const getIPRangesForServices = (keys: string[]) => servicesManager.getIPRangesForServices(keys);