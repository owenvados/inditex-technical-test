import { APP_ENV } from '@config/env';

/**
 * Exposes HTTP utilities for infrastructure adapters with optional CORS proxy support.
 */
export interface HttpClientConfig {
  corsProxy?: string;
}

export interface HttpRequestOptions {
  timeoutMs?: number;
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
  private async fetchJson<T>(url: string, timeoutMs = APP_ENV.HTTP_TIMEOUT_MS): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

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

  private async fetchText(url: string, timeoutMs = APP_ENV.HTTP_TIMEOUT_MS): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { method: 'GET', signal: controller.signal });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.text();
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private buildProxyUrl(url: string): string {
    if (!this.corsProxy) {
      throw new Error('CORS proxy not configured');
    }

    return `${this.corsProxy}${encodeURIComponent(url)}`;
  }

  /**
   * Retrieves the payload using the configured CORS proxy.
   */
  private async fetchJsonViaProxy<T>(url: string, timeoutMs = APP_ENV.HTTP_TIMEOUT_MS): Promise<T> {
    const proxyUrl = this.buildProxyUrl(url);
    const payload = await this.fetchJson<{ contents?: string } | string>(proxyUrl, timeoutMs);

    if (typeof payload === 'string') {
      try {
        return JSON.parse(payload) as T;
      } catch {
        throw new Error('Invalid proxy response format');
      }
    }

    if (payload && typeof payload.contents === 'string') {
      try {
        return JSON.parse(payload.contents) as T;
      } catch {
        throw new Error('Invalid proxy response format');
      }
    }

    throw new Error('Invalid proxy response format');
  }

  private async fetchTextViaProxy(
    url: string,
    timeoutMs = APP_ENV.HTTP_TIMEOUT_MS,
  ): Promise<string> {
    const proxyUrl = this.buildProxyUrl(url);
    return this.fetchText(proxyUrl, timeoutMs);
  }

  /**
   * Performs a GET request returning the parsed JSON payload.
   *
   * @param url Target endpoint URL.
   * @param useCorsProxy Enable/disable proxy usage for the request.
   * @param options Optional request options.
   * @returns Promise resolving to the parsed payload.
   */
  async get<T>(url: string, useCorsProxy = false, options: HttpRequestOptions = {}): Promise<T> {
    if (useCorsProxy) {
      return this.fetchJsonViaProxy<T>(url, options.timeoutMs);
    }

    try {
      return await this.fetchJson<T>(url, options.timeoutMs);
    } catch (error) {
      const isAbortError = error instanceof DOMException && error.name === 'AbortError';
      const isNetworkError = error instanceof TypeError || isAbortError;

      if (!isNetworkError || !this.corsProxy) {
        throw error;
      }

      console.warn('[HttpClient] Direct request failed, retrying via proxy', error);
      return this.fetchJsonViaProxy<T>(url, options.timeoutMs);
    }
  }

  async getText(
    url: string,
    useCorsProxy = false,
    options: HttpRequestOptions = {},
  ): Promise<string> {
    if (useCorsProxy) {
      return this.fetchTextViaProxy(url, options.timeoutMs);
    }

    try {
      return await this.fetchText(url, options.timeoutMs);
    } catch (error) {
      const isAbortError = error instanceof DOMException && error.name === 'AbortError';
      const isNetworkError = error instanceof TypeError || isAbortError;

      if (!isNetworkError || !this.corsProxy) {
        throw error;
      }

      console.warn('[HttpClient] Direct text request failed, retrying via proxy', error);
      return this.fetchTextViaProxy(url, options.timeoutMs);
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
