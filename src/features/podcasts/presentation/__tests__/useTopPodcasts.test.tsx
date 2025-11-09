import { MOCK_PODCASTS } from '@podcasts/presentation/__mocks__/podcastMocks';
import { useTopPodcasts } from '@podcasts/presentation/hooks/useTopPodcasts';
import { LoadingStateProvider } from '@shared/hooks/useLoadingState';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

const executeTopPodcastsMock = jest.fn();

jest.mock('@podcasts/application/use-cases/GetTopPodcasts', () => ({
  GetTopPodcasts: jest.fn().mockImplementation(() => ({
    execute: executeTopPodcastsMock,
  })),
}));

jest.mock('@podcasts/infrastructure/repositories/ITunesPodcastRepository');

const wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => (
  <LoadingStateProvider>{children}</LoadingStateProvider>
);

describe('useTopPodcasts', () => {
  beforeEach(() => {
    executeTopPodcastsMock.mockReset();
  });

  it('loads podcasts and returns them once resolved', async () => {
    executeTopPodcastsMock.mockResolvedValue(MOCK_PODCASTS);

    const { result } = renderHook(() => useTopPodcasts(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.podcasts).toEqual(MOCK_PODCASTS);
    expect(executeTopPodcastsMock).toHaveBeenCalledTimes(1);
  });

  it('returns an empty list when loading fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    executeTopPodcastsMock.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTopPodcasts(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.podcasts).toEqual([]);
    expect(executeTopPodcastsMock).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });
});
