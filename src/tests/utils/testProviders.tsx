import { LoadingStateProvider } from '@shared/hooks/useLoadingState';
import React from 'react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

type ProvidersProps = {
  children: ReactNode;
  initialEntries?: string[];
};

/**
 * Wraps test subjects with the providers required by the application.
 */
export const TestProviders: React.FC<ProvidersProps> = ({ children, initialEntries = ['/'] }) => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <LoadingStateProvider>
      <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
    </LoadingStateProvider>
  </SWRConfig>
);

/**
 * Creates a hook wrapper that reuses the shared test providers.
 */
export const createHookWrapper = (): React.FC<{ children: ReactNode }> => {
  const cache = new Map();

  const HookWrapper: React.FC<{ children: ReactNode }> = ({ children }) => (
    <SWRConfig value={{ provider: () => cache }}>
      <LoadingStateProvider>{children}</LoadingStateProvider>
    </SWRConfig>
  );

  return HookWrapper;
};
