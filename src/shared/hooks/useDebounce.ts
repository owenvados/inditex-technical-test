/**
 * Delays the update of a value to avoid triggering heavy computations on every change.
 *
 * @template T Type of the value to debounce.
 * @param value Current value that should be debounced.
 * @param delay Time in milliseconds before the debounced value updates.
 * @returns A debounced version of the provided value.
 */
import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delay = 200): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = window.setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      window.clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
