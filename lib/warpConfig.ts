/**
 * Legacy совместимость для существующего API
 * Использует новые модули под капотом
 */

import { WarpService, WarpGenerationError, type WarpGenerationRequest } from './warp-service';
import type { DeviceType } from './types';

/**
 * Legacy функция для обратной совместимости
 * @deprecated Используйте WarpService напрямую
 */
export async function getWarpConfigLink(
  selectedServices: string[],
  siteMode: "all" | "specific",
  deviceType: DeviceType,
  endpoint: string,
) {
  try {
    const warpService = new WarpService();
    
    const request: WarpGenerationRequest = {
      selectedServices: selectedServices || [],
      siteMode,
      deviceType,
      endpoint,
    };

    const result = await warpService.generateConfig(request);
    
    return {
      configBase64: result.configBase64,
      qrCodeBase64: result.qrCodeBase64,
    };
  } catch (error) {
    console.error("Legacy getWarpConfigLink error:", error);
    
    if (error instanceof WarpGenerationError) {
      throw error;
    }
    
    throw new Error("Не удалось сгенерировать конфиг");
  }
}