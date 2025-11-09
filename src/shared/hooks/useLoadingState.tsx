import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface LoadingStateContextValue {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingStateContext = createContext<LoadingStateContextValue | undefined>(undefined);

export interface LoadingStateProviderProps {
  children: React.ReactNode;
  /**
   * Optional flag enabling the loading state when the provider mounts. Useful for tests.
   */
  initialLoading?: boolean;
}

/**
 * Provider that keeps track of asynchronous operations and exposes a global loading flag.
 */
export const LoadingStateProvider: React.FC<LoadingStateProviderProps> = ({
  children,
  initialLoading = false,
}) => {
  const [isLoading, setIsLoading] = useState(initialLoading);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const value = useMemo<LoadingStateContextValue>(
    () => ({
      isLoading,
      startLoading,
      stopLoading,
    }),
    [isLoading, startLoading, stopLoading],
  );

  return <LoadingStateContext.Provider value={value}>{children}</LoadingStateContext.Provider>;
};

/**
 * Hook returning the global loading state and helpers to control it.
 */
export const useLoadingState = (): LoadingStateContextValue => {
  const context = useContext(LoadingStateContext);

  if (!context) {
    throw new Error('useLoadingState must be used within a LoadingStateProvider');
  }

  return context;
};
