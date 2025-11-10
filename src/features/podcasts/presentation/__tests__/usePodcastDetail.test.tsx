import { ITunesPodcastRepository } from '@podcasts/infrastructure/repositories/ITunesPodcastRepository';
import { MOCK_PODCAST_DETAIL } from '@podcasts/presentation/__mocks__/podcastMocks';
import { usePodcastDetail } from '@podcasts/presentation/hooks/usePodcastDetail';
import { LoadingStateProvider } from '@shared/hooks/useLoadingState';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { SWRConfig } from 'swr';

const wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <LoadingStateProvider>{children}</LoadingStateProvider>
  </SWRConfig>
);

describe('usePodcastDetail', () => {
  const getPodcastDetailSpy = jest.spyOn(ITunesPodcastRepository.prototype, 'getPodcastDetail');

  beforeEach(() => {
    getPodcastDetailSpy.mockReset();
    window.localStorage.clear();
  });

  afterAll(() => {
    getPodcastDetailSpy.mockRestore();
  });

  it('loads podcast detail for the provided identifier', async () => {
    getPodcastDetailSpy.mockResolvedValue(MOCK_PODCAST_DETAIL);

    const { result } = renderHook(() => usePodcastDetail('mock-podcast'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.podcastDetail).toEqual(MOCK_PODCAST_DETAIL);
    expect(getPodcastDetailSpy).toHaveBeenCalledWith('mock-podcast');
  });

  it('keeps state empty when podcast identifier is missing', async () => {
    const { result } = renderHook(() => usePodcastDetail(undefined), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.podcastDetail).toBeNull();
    expect(getPodcastDetailSpy).not.toHaveBeenCalled();
  });

  it('returns null detail when loading fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getPodcastDetailSpy.mockRejectedValue(new Error('Failed to load'));

    const { result } = renderHook(() => usePodcastDetail('mock-podcast'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.podcastDetail).toBeNull();
    expect(getPodcastDetailSpy).toHaveBeenCalledWith('mock-podcast');
    consoleErrorSpy.mockRestore();
  });
});
