/**
 * Главный сервис для генерации WARP конфигураций
 */

import { CloudflareWarpClient } from './cloudflare-api';
import { QRCodeGenerator } from './qr-generator';
import { CryptoUtils } from './crypto-utils';
import { ipRangesManager } from './ip-ranges';
import { WarpConfigBuilder } from './builder/warp-config-builder';
import type { 
  WarpGenerationRequest, 
  WarpGenerationResult, 
  WarpConfigParams 
} from './types';

export type { WarpGenerationRequest, WarpGenerationResult } from './types';

export class WarpService {
  private cloudflareClient: CloudflareWarpClient;

  constructor() {
    this.cloudflareClient = new CloudflareWarpClient();
  }

  /**
   * Генерация WARP конфигурации
   */
  public async generateConfig(request: WarpGenerationRequest): Promise<WarpGenerationResult> {
    try {
      // Валидация входных данных
      this.validateRequest(request);

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
      console.log('Building WireGuard configuration...');
      const config = WarpConfigBuilder.build(configParams);
      const configForQR = WarpConfigBuilder.buildForQR(configParams);

      // Генерация QR кода
      console.log('Generating QR code...');
      const qrCodeBase64 = await QRCodeGenerator.generate(configForQR);

      console.log('WARP configuration generated successfully');
      
      return {
        configBase64: CryptoUtils.stringToBase64(config),
        qrCodeBase64,
      };
    } catch (error) {
      console.error('Failed to generate WARP configuration:', error);
      throw new WarpGenerationError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  /**
   * Валидация входящего запроса
   */
  private validateRequest(request: WarpGenerationRequest): void {
    const { selectedServices, siteMode, deviceType, endpoint } = request;

    if (!['all', 'specific'].includes(siteMode)) {
      throw new WarpGenerationError(`Invalid site mode: ${siteMode}`);
    }

    if (!['computer', 'phone', 'awg15'].includes(deviceType)) {
      throw new WarpGenerationError(`Invalid device type: ${deviceType}`);
    }

    if (!endpoint?.trim()) {
      throw new WarpGenerationError('Endpoint is required');
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
    warpConfig: any,
    keyPair: { privateKey: string; publicKey: string },
    request: WarpGenerationRequest
  ): WarpConfigParams {
    const peer = warpConfig.result.config.peers[0];
    const interfaceConfig = warpConfig.result.config.interface;

    const allowedIPs = this.generateAllowedIPs(request);

    return {
      privateKey: keyPair.privateKey,
      publicKey: peer.public_key,
      clientIPv4: interfaceConfig.addresses.v4,
      clientIPv6: interfaceConfig.addresses.v6,
      allowedIPs,
      endpoint: request.endpoint,
      deviceType: request.deviceType,
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