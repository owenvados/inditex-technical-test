import {
  LoadingStateProvider,
  type LoadingStateProviderProps,
  useLoadingState,
} from '@shared/hooks/useLoadingState';
import { renderHook, act } from '@testing-library/react';
import React from 'react';

const createWrapper = (props: Partial<LoadingStateProviderProps> = {}) =>
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <LoadingStateProvider {...props}>{children}</LoadingStateProvider>;
  };

describe('useLoadingState', () => {
  it('provides loading helpers and defaults to false', () => {
    const { result } = renderHook(() => useLoadingState(), { wrapper: createWrapper() });

    expect(result.current.isLoading).toBe(false);
    act(() => result.current.startLoading());
    expect(result.current.isLoading).toBe(true);
    act(() => result.current.stopLoading());
    expect(result.current.isLoading).toBe(false);
  });

  it('allows starting in loading state via provider prop', () => {
    const { result } = renderHook(() => useLoadingState(), {
      wrapper: createWrapper({ initialLoading: true }),
    });

    expect(result.current.isLoading).toBe(true);
    act(() => result.current.stopLoading());
    expect(result.current.isLoading).toBe(false);
  });
});
