/**
 * Утилиты для работы с криптографией и ключами
 */

import nacl from 'tweetnacl';
import { Buffer } from 'buffer';
import type { KeyPair } from './types';

export class CryptoUtils {
  /**
   * Генерация пары ключей для WireGuard
   */
  public static generateKeyPair(): KeyPair {
    const keyPair = nacl.box.keyPair();
    
    return {
      privateKey: Buffer.from(keyPair.secretKey).toString('base64'),
      publicKey: Buffer.from(keyPair.publicKey).toString('base64'),
    };
  }

  /**
   * Конвертация строки в Base64
   */
  public static stringToBase64(str: string): string {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str).toString('base64');
    }
    
    // Fallback для браузерной среды
    return btoa(unescape(encodeURIComponent(str)));
  }

  /**
   * Конвертация Base64 в строку
   */
  public static base64ToString(base64: string): string {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(base64, 'base64').toString('utf8');
    }
    
    // Fallback для браузерной среды
    return decodeURIComponent(escape(atob(base64)));
  }

  /**
   * Валидация Base64 ключа WireGuard
   */
  public static isValidWireGuardKey(key: string): boolean {
    try {
      const decoded = Buffer.from(key, 'base64');
      return decoded.length === 32; // WireGuard ключи всегда 32 байта
    } catch {
      return false;
    }
  }

  /**
   * Генерация случайного ID
   */
  public static generateRandomId(length: number = 16): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
}