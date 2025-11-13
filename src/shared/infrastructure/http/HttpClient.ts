import { APP_ENV } from '@config/env';

export interface HttpClientConfig {
  corsProxy?: string;
}

export interface HttpRequestOptions {
  timeoutMs?: number;
}

/**
 * HTTP client with automatic CORS proxy fallback.
 */
export class HttpClient {
  private readonly corsProxy?: string;

  constructor(config: HttpClientConfig = {}) {
    this.corsProxy = config.corsProxy ?? APP_ENV.CORS_PROXY_BASE_URL;
  }

  private async fetchResponse(url: string, timeoutMs = APP_ENV.HTTP_TIMEOUT_MS): Promise<Response> {
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
    // CORS errors and network failures are TypeError
    // Also check error message for CORS-related errors
    if (error instanceof TypeError) {
      return true;
    }
    // Check for CORS-related error messages
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes('cors') ||
        message.includes('failed to fetch') ||
        message.includes('network error')
      );
    }
    return false;
  }

  private parseProxyJson<T>(data: unknown): T {
    // Proxy /raw endpoint returns content directly as JSON
    // response.json() already parses it, so data is already an object
    if (data && typeof data === 'object') {
      // Check for allorigins.win /get format with contents field (not used with /raw)
      if ('contents' in data && typeof data.contents === 'string') {
        return JSON.parse(data.contents) as T;
      }
      // Already parsed JSON object/array, return as-is
      return data as T;
    }
    // If it's a string, parse it
    if (typeof data === 'string') {
      return JSON.parse(data) as T;
    }
    throw new Error('Invalid proxy response format');
  }

  private async fetchWithFallback<T>(
    url: string,
    useCorsProxy: boolean,
    extractData: (response: Response) => Promise<T>,
    timeoutMs = APP_ENV.HTTP_TIMEOUT_MS,
  ): Promise<T> {
    // If proxy is explicitly requested, use it directly
    if (useCorsProxy) {
      const proxyUrl = this.buildProxyUrl(url);
      const response = await this.fetchResponse(proxyUrl, timeoutMs);
      return await extractData(response);
    }

    // Try direct request first, fallback to proxy on CORS/network errors
    try {
      const response = await this.fetchResponse(url, timeoutMs);
      return await extractData(response);
    } catch (error) {
      // Fallback to proxy only for CORS/network errors (not AbortError)
      const isAbortError = error instanceof DOMException && error.name === 'AbortError';
      if (!isAbortError && this.isNetworkError(error) && this.corsProxy) {
        console.warn('[HttpClient] Direct request failed, retrying via proxy', error);
        try {
          const proxyUrl = this.buildProxyUrl(url);
          const response = await this.fetchResponse(proxyUrl, timeoutMs);
          return await extractData(response);
        } catch (proxyError) {
          console.error('[HttpClient] Proxy request also failed', proxyError);
          throw proxyError;
        }
      }
      throw error;
    }
  }

  async get<T>(url: string, useCorsProxy = false, options: HttpRequestOptions = {}): Promise<T> {
    const timeoutMs = options.timeoutMs ?? APP_ENV.HTTP_TIMEOUT_MS;
    return this.fetchWithFallback(
      url,
      useCorsProxy,
      async (response) => {
        const data = await response.json();
        return useCorsProxy ? this.parseProxyJson<T>(data) : (data as T);
      },
      timeoutMs,
    );
  }

  async getText(
    url: string,
    useCorsProxy = false,
    options: HttpRequestOptions = {},
  ): Promise<string> {
    const timeoutMs = options.timeoutMs ?? APP_ENV.HTTP_TIMEOUT_MS;
    return this.fetchWithFallback(url, useCorsProxy, (response) => response.text(), timeoutMs);
  }
}

export const httpClient = new HttpClient({
  corsProxy: APP_ENV.CORS_PROXY_BASE_URL,
});
