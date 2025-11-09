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
   * Builds the effective URL by applying the configured CORS proxy when required.
   *
   * @param url Target endpoint URL.
   * @param useCorsProxy Enable/disable proxy usage for the request.
   * @returns Resolved URL string ready for fetch.
   */
  private buildUrl(url: string, useCorsProxy: boolean): string {
    if (!useCorsProxy || !this.corsProxy) {
      return url;
    }

    return `${this.corsProxy}${encodeURIComponent(url)}`;
  }

  /**
   * Performs a GET request returning the parsed JSON payload.
   *
   * @param url Target endpoint URL.
   * @param useCorsProxy Enable/disable proxy usage for the request.
   * @returns Promise resolving to the parsed payload.
   */
  async get<T>(url: string, useCorsProxy = true): Promise<T> {
    const targetUrl = this.buildUrl(url, useCorsProxy);

    try {
      const response = await fetch(targetUrl, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } catch (error) {
      console.error('[HttpClient] GET error:', error);
      throw error;
    }
  }
}

export const httpClient = new HttpClient({
  corsProxy: APP_ENV.CORS_PROXY_BASE_URL,
});
