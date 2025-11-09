import { APP_ENV } from '@config/env';

/**
 * Exposes HTTP utilities for infrastructure adapters with optional CORS proxy support.
 */
export interface HttpClientConfig {
  corsProxy?: string;
}

export class HttpClient {
  private readonly corsProxy?: string;

  /**
   * @param config Optional configuration overriding default proxy behaviour.
   */
  constructor(config: HttpClientConfig = {}) {
    this.corsProxy = config.corsProxy ?? APP_ENV.CORS_PROXY_BASE_URL;
  }

  /**
   * Executes a fetch request with timeout protection and returns the parsed JSON payload.
   */
  private async fetchJson<T>(url: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), APP_ENV.HTTP_TIMEOUT_MS);

    try {
      const response = await fetch(url, { method: 'GET', signal: controller.signal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Retrieves the payload using the configured CORS proxy.
   */
  private async fetchJsonViaProxy<T>(url: string): Promise<T> {
    if (!this.corsProxy) {
      throw new Error('CORS proxy not configured');
    }

    const proxyUrl = `${this.corsProxy}${encodeURIComponent(url)}`;
    const payload = await this.fetchJson<{ contents?: string } | string>(proxyUrl);

    if (typeof payload === 'string') {
      return JSON.parse(payload) as T;
    }

    if (payload && typeof payload.contents === 'string') {
      return JSON.parse(payload.contents) as T;
    }

    throw new Error('Invalid proxy response format');
  }

  /**
   * Performs a GET request returning the parsed JSON payload.
   *
   * @param url Target endpoint URL.
   * @param useCorsProxy Enable/disable proxy usage for the request.
   * @returns Promise resolving to the parsed payload.
   */
  async get<T>(url: string, useCorsProxy = false): Promise<T> {
    if (useCorsProxy) {
      return this.fetchJsonViaProxy<T>(url);
    }

    try {
      return await this.fetchJson<T>(url);
    } catch (error) {
      const isAbortError = error instanceof DOMException && error.name === 'AbortError';
      const isNetworkError = error instanceof TypeError || isAbortError;

      if (!isNetworkError || !this.corsProxy) {
        throw error;
      }

      console.warn('[HttpClient] Direct request failed, retrying via proxy', error);
      return this.fetchJsonViaProxy<T>(url);
    }
  }

  /**
   * Performs a GET request forcing the usage of the configured CORS proxy.
   *
   * @param url Target endpoint URL.
   * @returns Promise resolving to the parsed payload.
   */
}

export const httpClient = new HttpClient({
  corsProxy: APP_ENV.CORS_PROXY_BASE_URL,
});
