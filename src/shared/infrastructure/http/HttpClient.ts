import { APP_ENV } from '@config/env';

export interface HttpClientConfig {
  corsProxy?: string;
}

export interface HttpRequestOptions {
  timeoutMs?: number;
}

export class HttpClient {
  private readonly corsProxy?: string;

  constructor(config: HttpClientConfig = {}) {
    this.corsProxy = config.corsProxy ?? APP_ENV.CORS_PROXY_BASE_URL;
  }

  private async fetchWithTimeout(
    url: string,
    timeoutMs = APP_ENV.HTTP_TIMEOUT_MS,
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { method: 'GET', signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response;
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

  private isNetworkError(error: unknown): boolean {
    return (
      error instanceof TypeError || (error instanceof DOMException && error.name === 'AbortError')
    );
  }

  private parseProxyJson<T>(data: unknown): T {
    if (typeof data === 'string') {
      return JSON.parse(data) as T;
    }
    if (
      data &&
      typeof data === 'object' &&
      'contents' in data &&
      typeof data.contents === 'string'
    ) {
      return JSON.parse(data.contents) as T;
    }
    throw new Error('Invalid proxy response format');
  }

  async get<T>(url: string, useCorsProxy = false, options: HttpRequestOptions = {}): Promise<T> {
    const timeoutMs = options.timeoutMs ?? APP_ENV.HTTP_TIMEOUT_MS;
    const targetUrl = useCorsProxy ? this.buildProxyUrl(url) : url;

    try {
      const response = await this.fetchWithTimeout(targetUrl, timeoutMs);
      const data = await response.json();
      return useCorsProxy ? this.parseProxyJson<T>(data) : (data as T);
    } catch (error) {
      // Fallback to proxy if direct request fails with network error
      if (!useCorsProxy && this.isNetworkError(error) && this.corsProxy) {
        console.warn('[HttpClient] Direct request failed, retrying via proxy', error);
        const proxyUrl = this.buildProxyUrl(url);
        const response = await this.fetchWithTimeout(proxyUrl, timeoutMs);
        const data = await response.json();
        return this.parseProxyJson<T>(data);
      }
      throw error;
    }
  }

  async getText(
    url: string,
    useCorsProxy = false,
    options: HttpRequestOptions = {},
  ): Promise<string> {
    const timeoutMs = options.timeoutMs ?? APP_ENV.HTTP_TIMEOUT_MS;
    const targetUrl = useCorsProxy ? this.buildProxyUrl(url) : url;

    try {
      const response = await this.fetchWithTimeout(targetUrl, timeoutMs);
      return await response.text();
    } catch (error) {
      // Fallback to proxy if direct request fails with network error
      if (!useCorsProxy && this.isNetworkError(error) && this.corsProxy) {
        console.warn('[HttpClient] Direct text request failed, retrying via proxy', error);
        const proxyUrl = this.buildProxyUrl(url);
        const response = await this.fetchWithTimeout(proxyUrl, timeoutMs);
        return await response.text();
      }
      throw error;
    }
  }
}

export const httpClient = new HttpClient({
  corsProxy: APP_ENV.CORS_PROXY_BASE_URL,
});
