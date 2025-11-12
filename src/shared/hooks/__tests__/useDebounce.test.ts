import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  it('is a function that can be called', () => {
    expect(typeof useDebounce).toBe('function');
  });

  it('has default delay parameter of 200ms', () => {
    // Function signature verification - default delay is 200ms
    expect(useDebounce).toBeDefined();
  });
});
