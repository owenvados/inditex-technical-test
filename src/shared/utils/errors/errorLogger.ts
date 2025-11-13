/**
 * Logs error information in a consistent manner exposing only message and stack trace.
 * Silently ignores AbortError as it represents intentional request cancellation.
 *
 * @param context Identifier describing where the error originated.
 * @param error Arbitrary error payload to log.
 */
export const logError = (context: string, error: unknown): void => {
  // Ignore AbortError - it's an intentional cancellation, not a real error
  if (error instanceof DOMException && error.name === 'AbortError') {
    return;
  }

  if (error instanceof Error) {
    console.error(`[${context}] ${error.message}`, error.stack ?? 'Stack trace unavailable');
    return;
  }

  if (typeof error === 'string') {
    console.error(`[${context}] ${error}`);
    return;
  }

  console.error(`[${context}] Unexpected error`, error);
};
