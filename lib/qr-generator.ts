/**
 * Генератор QR кодов с fallback стратегиями
 */

import type { QRCodeOptions } from './types';

export class QRCodeGenerator {
  private static readonly API_BASE_URL = 'https://api.qrserver.com/v1/create-qr-code/';
  private static readonly DEFAULT_SIZE = 200;
  private static readonly DEFAULT_FORMAT = 'png';

  /**
   * Генерация QR кода с автоматическим fallback
   */
  public static async generate(text: string, options: QRCodeOptions = {}): Promise<string> {
    const { size = QRCodeGenerator.DEFAULT_SIZE, format = QRCodeGenerator.DEFAULT_FORMAT } = options;

    try {
      // Попытка генерации через внешний API
      const apiResult = await QRCodeGenerator.generateViaAPI(text, size, format);
      if (apiResult) {
        return apiResult;
      }
    } catch (error) {
      console.warn('QR generation via API failed:', error);
    }

    // Fallback - генерация SVG заглушки
    return QRCodeGenerator.generateFallbackSVG(size);
  }

  /**
   * Генерация QR кода через внешний API
   */
  private static async generateViaAPI(
    text: string, 
    size: number, 
    format: string
  ): Promise<string | null> {
    const url = new URL(QRCodeGenerator.API_BASE_URL);
    url.searchParams.set('size', `${size}x${size}`);
    url.searchParams.set('format', format);
    url.searchParams.set('data', text);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; WarpGenerator/1.0)',
      },
      // Таймаут 10 секунд
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = QRCodeGenerator.arrayBufferToBase64(arrayBuffer);
    
    return `data:image/${format};base64,${base64}`;
  }

  /**
   * Генерация SVG заглушки при недоступности API
   */
  private static generateFallbackSVG(size: number): string {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="border: 1px solid #ccc;">
        <rect width="${size}" height="${size}" fill="white"/>
        <!-- Sad face outline -->
        <circle cx="${size/2}" cy="${size/2}" r="${size*0.35}" fill="none" stroke="black" stroke-width="2"/>
        <!-- Left eye -->
        <circle cx="${size*0.4}" cy="${size*0.425}" r="5" fill="none" stroke="black" stroke-width="2"/>
        <!-- Right eye -->
        <circle cx="${size*0.6}" cy="${size*0.425}" r="5" fill="none" stroke="black" stroke-width="2"/>
        <!-- Sad mouth -->
        <path d="M ${size*0.375} ${size*0.625} Q ${size/2} ${size*0.55} ${size*0.625} ${size*0.625}" fill="none" stroke="black" stroke-width="2"/>
        <text x="${size/2}" y="${size*0.9}" text-anchor="middle" font-family="Arial" font-size="10" fill="gray">QR код недоступен</text>
      </svg>
    `.trim();

    return QRCodeGenerator.svgToDataUrl(svg);
  }

  /**
   * Конвертация ArrayBuffer в Base64
   */
  private static arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return btoa(binary);
  }

  /**
   * Конвертация SVG в Data URL
   */
  private static svgToDataUrl(svg: string): string {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
}