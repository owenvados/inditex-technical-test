import { LocalStorageCache } from '../LocalStorageCache';

describe('LocalStorageCache', () => {
  let cache: LocalStorageCache;
  const namespace = 'test-namespace';

  beforeEach(() => {
    cache = new LocalStorageCache(namespace);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('get', () => {
    it('returns null when key does not exist', () => {
      const result = cache.get<string>('non-existent-key');
      expect(result).toBeNull();
    });

    it('returns cached data when entry exists and is not expired', () => {
      const testData = { name: 'test', value: 123 };
      cache.set('test-key', testData, 1000);

      const result = cache.get<typeof testData>('test-key');
      expect(result).toEqual(testData);
    });

    it('returns null when entry is expired', () => {
      jest.useFakeTimers();
      const testData = { name: 'test' };
      const now = Date.now();
      jest.spyOn(Date, 'now').mockReturnValue(now);

      cache.set('test-key', testData, 100);

      jest.spyOn(Date, 'now').mockReturnValue(now + 200);
      const result = cache.get<typeof testData>('test-key');

      expect(result).toBeNull();
      jest.useRealTimers();
    });

    it('returns null when entry is malformed', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      localStorage.setItem(`${namespace}:malformed`, 'invalid-json');

      const result = cache.get<string>('malformed');
      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });

    it('handles localStorage errors gracefully', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      const result = cache.get<string>('test-key');
      expect(result).toBeNull();

      localStorage.getItem = originalGetItem;
    });
  });

  describe('set', () => {
    it('stores data with TTL', () => {
      const testData = { name: 'test', value: 456 };
      cache.set('test-key', testData, 1000);

      const result = cache.get<typeof testData>('test-key');
      expect(result).toEqual(testData);
    });

    it('removes entry when TTL is zero or negative', () => {
      const testData = { name: 'test' };
      cache.set('test-key', testData, 1000);
      cache.set('test-key', testData, 0);

      const result = cache.get<typeof testData>('test-key');
      expect(result).toBeNull();
    });

    it('handles localStorage errors gracefully', () => {
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage quota exceeded');
      });

      expect(() => {
        cache.set('test-key', { data: 'test' }, 1000);
      }).not.toThrow();

      localStorage.setItem = originalSetItem;
    });
  });

  describe('remove', () => {
    it('removes entry from cache', () => {
      const testData = { name: 'test' };
      cache.set('test-key', testData, 1000);
      cache.remove('test-key');

      const result = cache.get<typeof testData>('test-key');
      expect(result).toBeNull();
    });

    it('handles localStorage errors gracefully', () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        cache.remove('test-key');
      }).not.toThrow();

      localStorage.removeItem = originalRemoveItem;
    });
  });

  describe('namespace isolation', () => {
    it('uses namespace in storage keys', () => {
      const testData = { name: 'test' };
      cache.set('key', testData, 1000);

      const storageKey = `${namespace}:key`;
      expect(localStorage.getItem(storageKey)).toBeTruthy();
    });

    it('isolates data between different namespaces', () => {
      const cache1 = new LocalStorageCache('ns1');
      const cache2 = new LocalStorageCache('ns2');

      cache1.set('key', { data: 'ns1' }, 1000);
      cache2.set('key', { data: 'ns2' }, 1000);

      expect(cache1.get('key')).toEqual({ data: 'ns1' });
      expect(cache2.get('key')).toEqual({ data: 'ns2' });
    });
  });
});
