/**
 * Расширенный сервис WARP с поддержкой множественных форматов конфигураций
 */

import { CloudflareWarpClient } from './cloudflare-api';
import { QRCodeGenerator } from './qr-generator';
import { CryptoUtils } from './crypto-utils';
import { ipRangesManager } from './ip-ranges';
import { EnhancedWarpConfigBuilder } from './builder/warp-config-builder';
import type { 
  WarpGenerationRequest, 
  WarpGenerationResult, 
  ExtendedWarpConfigParams,
  ConfigFormat,
  WarpConfigResponse
} from './types';
import { getFileName, getConfigFormatInfo, getFormatsWithQRSupport } from './types';

export type { WarpGenerationRequest, WarpGenerationResult } from './types';

export class EnhancedWarpService {
  private cloudflareClient: CloudflareWarpClient;

  constructor() {
    this.cloudflareClient = new CloudflareWarpClient();
  }

  /**
   * Генерация WARP конфигурации с поддержкой различных форматов
   */
  public async generateConfig(request: WarpGenerationRequest): Promise<WarpGenerationResult> {
    try {
      // Валидация входных данных
      this.validateRequest(request);

      const configFormat = request.configFormat || 'wireguard';
      const formatInfo = getConfigFormatInfo(configFormat);

      console.log(`Generating ${formatInfo?.name || configFormat} configuration...`);

      // Генерация ключей
      console.log('Generating cryptographic keys...');
      const keyPair = CryptoUtils.generateKeyPair();

      // Регистрация клиента в Cloudflare
      console.log('Registering client with Cloudflare...');
      const { id: clientId, token } = await this.cloudflareClient.registerClient(keyPair.publicKey);

      // Включение WARP
      console.log('Enabling WARP...');
      const warpConfig = await this.cloudflareClient.enableWarp(clientId, token);

      // Извлечение параметров конфигурации
      const configParams = this.extractConfigParams(warpConfig, keyPair, request);

      // Построение конфигурации
      console.log(`Building ${configFormat} configuration...`);
      const config = EnhancedWarpConfigBuilder.build(configParams);
      
      // Генерация QR кода только для поддерживаемых форматов
      let qrCodeBase64 = '';
      const supportsQR = getFormatsWithQRSupport().includes(configFormat);
      
      if (supportsQR) {
        console.log('Generating QR code...');
        const configForQR = EnhancedWarpConfigBuilder.buildForQR(configParams);
        qrCodeBase64 = await QRCodeGenerator.generate(configForQR);
      } else {
        // Генерируем заглушку для форматов без поддержки QR
        qrCodeBase64 = await this.generateUnsupportedQR(configFormat);
      }

      const fileName = getFileName(configFormat);

      console.log(`${formatInfo?.name || configFormat} configuration generated successfully`);
      
      return {
        configBase64: CryptoUtils.stringToBase64(config),
        qrCodeBase64,
        configFormat,
        fileName
      };
    } catch (error) {
      console.error('Failed to generate WARP configuration:', error);
      throw new WarpGenerationError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  /**
   * Получение списка поддерживаемых форматов
   */
  public getSupportedFormats(): ConfigFormat[] {
    return EnhancedWarpConfigBuilder.getSupportedFormats();
  }

  /**
   * Валидация входящего запроса
   */
  private validateRequest(request: WarpGenerationRequest): void {
    const { selectedServices, siteMode, deviceType, endpoint, configFormat } = request;

    if (!['all', 'specific'].includes(siteMode)) {
      throw new WarpGenerationError(`Invalid site mode: ${siteMode}`);
    }

    if (!['computer', 'phone', 'awg15'].includes(deviceType)) {
      throw new WarpGenerationError(`Invalid device type: ${deviceType}`);
    }

    if (!endpoint?.trim()) {
      throw new WarpGenerationError('Endpoint is required');
    }

    if (configFormat && !this.getSupportedFormats().includes(configFormat)) {
      throw new WarpGenerationError(`Unsupported config format: ${configFormat}`);
    }

    if (siteMode === 'specific') {
      if (!Array.isArray(selectedServices) || selectedServices.length === 0) {
        throw new WarpGenerationError('Services must be selected for specific mode');
      }

      // Проверяем, что все выбранные сервисы поддерживаются
      const unsupportedServices = selectedServices.filter(
        service => !ipRangesManager.isServiceSupported(service)
      );

      if (unsupportedServices.length > 0) {
        console.warn(`Unsupported services found: ${unsupportedServices.join(', ')}`);
      }
    }
  }

  /**
   * Извлечение параметров конфигурации из ответа Cloudflare
   */
  private extractConfigParams(
    warpConfig: WarpConfigResponse,
    keyPair: { privateKey: string; publicKey: string },
    request: WarpGenerationRequest
  ): ExtendedWarpConfigParams {
    const peer = warpConfig.result.config.peers[0];
    const interfaceConfig = warpConfig.result.config.interface;
    const configFormat = request.configFormat || 'wireguard';

    const allowedIPs = this.generateAllowedIPs(request);

    // Извлекаем reserved из client_id если доступен
    let reserved = '';
    if (warpConfig.result.config.client_id) {
      reserved = warpConfig.result.config.client_id;
    }

    return {
      privateKey: keyPair.privateKey,
      publicKey: peer.public_key,
      clientIPv4: interfaceConfig.addresses.v4,
      clientIPv6: interfaceConfig.addresses.v6,
      allowedIPs,
      endpoint: request.endpoint,
      deviceType: request.deviceType,
      configFormat,
      reserved
    };
  }

  /**
   * Генерация списка разрешенных IP адресов
   */
  private generateAllowedIPs(request: WarpGenerationRequest): string {
    const { selectedServices, siteMode } = request;

    if (siteMode === 'all') {
      return '0.0.0.0/0, ::/0';
    }

    // Фильтруем только поддерживаемые сервисы
    const supportedServices = selectedServices.filter(service => 
      ipRangesManager.isServiceSupported(service)
    );

    if (supportedServices.length === 0) {
      console.warn('No supported services found, defaulting to all traffic');
      return '0.0.0.0/0, ::/0';
    }

    return ipRangesManager.generateAllowedIPs(supportedServices);
  }

  /**
   * Генерация QR заглушки для неподдерживаемых форматов
   */
  private async generateUnsupportedQR(format: ConfigFormat): Promise<string> {
    const formatInfo = getConfigFormatInfo(format);
    const formatName = formatInfo?.name || format;
    
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200" style="border: 1px solid #ccc;">
        <rect width="200" height="200" fill="white"/>
        <!-- Warning triangle -->
        <polygon points="100,30 170,150 30,150" fill="none" stroke="#f59e0b" stroke-width="3"/>
        <text x="100" y="140" text-anchor="middle" font-family="Arial" font-size="24" fill="#f59e0b">!</text>
        <!-- Format name -->
        <text x="100" y="175" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">${formatName}</text>
        <text x="100" y="190" text-anchor="middle" font-family="Arial" font-size="10" fill="#9ca3af">QR не поддерживается</text>
      </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
}

/**
 * Кастомная ошибка для генерации WARP конфигураций
 */
export class WarpGenerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WarpGenerationError';
  }
}

/**
 * Фабрика для создания сервисов WARP
 */
export class WarpServiceFactory {
  /**
   * Создание экземпляра enhanced сервиса
   */
  public static createEnhancedService(): EnhancedWarpService {
    return new EnhancedWarpService();
  }

  /**
   * Создание экземпляра legacy сервиса (для обратной совместимости)
   */
  public static createLegacyService() {
    // Можно импортировать старый WarpService если нужно
    return new EnhancedWarpService();
  }
}