/**
 * Менеджер для работы с IP диапазонами сервисов
 */

import ipRangesData from '@/data/ip-ranges.json';
import type { IPRange, RangesStats } from './types';

export type ServiceKey = keyof typeof ipRangesData;

export class IPRangesManager {
  private static instance: IPRangesManager;
  private readonly ipRanges: Record<string, string>;

  private constructor() {
    this.ipRanges = ipRangesData;
  }

  public static getInstance(): IPRangesManager {
    if (!IPRangesManager.instance) {
      IPRangesManager.instance = new IPRangesManager();
    }
    return IPRangesManager.instance;
  }

  /**
   * Получить IP диапазоны для конкретного сервиса
   */
  public getServiceRanges(serviceKey: string): string[] {
    const ranges = this.ipRanges[serviceKey];
    if (!ranges) {
      console.warn(`No IP ranges found for service: ${serviceKey}`);
      return [];
    }

    return ranges
      .split(', ')
      .map(range => range.trim())
      .filter(range => this.isValidIPRange(range));
  }

  /**
   * Получить объединенные IP диапазоны для нескольких сервисов
   */
  public getCombinedRanges(serviceKeys: string[]): string[] {
    const uniqueRanges = new Set<string>();

    serviceKeys.forEach(serviceKey => {
      const ranges = this.getServiceRanges(serviceKey);
      ranges.forEach(range => uniqueRanges.add(range));
    });

    return Array.from(uniqueRanges).sort();
  }

  /**
   * Получить строку AllowedIPs для WireGuard конфигурации
   */
  public generateAllowedIPs(serviceKeys: string[], includeAll: boolean = false): string {
    if (includeAll) {
      return '0.0.0.0/0, ::/0';
    }

    const ranges = this.getCombinedRanges(serviceKeys);
    
    if (ranges.length === 0) {
      console.warn('No IP ranges found for selected services, defaulting to all traffic');
      return '0.0.0.0/0, ::/0';
    }

    return ranges.join(', ');
  }

  /**
   * Проверить, поддерживается ли сервис
   */
  public isServiceSupported(serviceKey: string): boolean {
    return serviceKey in this.ipRanges;
  }

  /**
   * Получить список всех поддерживаемых сервисов
   */
  public getSupportedServices(): string[] {
    return Object.keys(this.ipRanges);
  }

  /**
   * Получить статистику по IP диапазонам
   */
  public getRangesStats(serviceKeys: string[]): RangesStats {
    let totalRanges = 0;
    const uniqueRanges = new Set<string>();

    serviceKeys.forEach(serviceKey => {
      const ranges = this.getServiceRanges(serviceKey);
      totalRanges += ranges.length;
      ranges.forEach(range => uniqueRanges.add(range));
    });

    return {
      totalServices: serviceKeys.length,
      totalRanges,
      uniqueRanges: uniqueRanges.size,
    };
  }

  /**
   * Валидация IP диапазона
   */
  private isValidIPRange(range: string): boolean {
    // Базовая проверка формата IP/CIDR
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}\/\d{1,3}$/;
    
    return ipv4Pattern.test(range) || ipv6Pattern.test(range);
  }
}

// Экспорт singleton instance
export const ipRangesManager = IPRangesManager.getInstance();