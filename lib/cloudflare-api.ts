/**
 * Клиент для работы с API Cloudflare WARP
 */

import type {
  WarpRegistrationRequest,
  WarpRegistrationResponse,
  WarpConfigResponse
} from './types';

export class CloudflareWarpClient {
  private static readonly BASE_URL = 'https://api.cloudflareclient.com/v0i1909051800';
  private static readonly DEFAULT_HEADERS = {
    'User-Agent': 'okhttp/3.12.1',
    'Content-Type': 'application/json',
  };

  /**
   * Регистрация нового клиента WARP
   */
  public async registerClient(publicKey: string): Promise<{ id: string; token: string }> {
    const requestBody: WarpRegistrationRequest = {
      install_id: '',
      tos: new Date().toISOString(),
      key: publicKey,
      fcm_token: '',
      type: 'ios',
      locale: 'en_US',
    };

    const response = await this.makeRequest<WarpRegistrationResponse>('POST', 'reg', requestBody);
    
    if (!response.result?.id || !response.result?.token) {
      throw new Error('Invalid registration response structure');
    }

    return {
      id: response.result.id,
      token: response.result.token,
    };
  }

  /**
   * Включение WARP для зарегистрированного клиента
   */
  public async enableWarp(clientId: string, token: string): Promise<WarpConfigResponse> {
    const headers = {
      ...CloudflareWarpClient.DEFAULT_HEADERS,
      'Authorization': `Bearer ${token}`,
    };

    const response = await this.makeRequest<WarpConfigResponse>(
      'PATCH',
      `reg/${clientId}`,
      { warp_enabled: true },
      headers
    );

    if (!response.result?.config?.peers?.[0] || !response.result?.config?.interface) {
      throw new Error('Invalid WARP configuration response structure');
    }

    return response;
  }

  /**
   * Универсальный метод для выполнения HTTP запросов к API
   */
  private async makeRequest<T>(
    method: 'GET' | 'POST' | 'PATCH',
    endpoint: string,
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    const url = `${CloudflareWarpClient.BASE_URL}/${endpoint}`;
    const headers = customHeaders || CloudflareWarpClient.DEFAULT_HEADERS;

    const options: RequestInit = {
      method,
      headers,
    };

    if (body && (method === 'POST' || method === 'PATCH')) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Cloudflare API request failed: ${error.message}`);
      }
      throw new Error('Unknown error during Cloudflare API request');
    }
  }
}