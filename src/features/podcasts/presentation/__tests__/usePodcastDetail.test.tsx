import { MOCK_PODCAST_DETAIL } from '@podcasts/presentation/__mocks__/podcastMocks';
import { usePodcastDetail } from '@podcasts/presentation/hooks/usePodcastDetail';
import { LoadingStateProvider } from '@shared/hooks/useLoadingState';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';

const executePodcastDetailMock = jest.fn();

jest.mock('@podcasts/application/use-cases/GetPodcastDetail', () => ({
  GetPodcastDetail: jest.fn().mockImplementation(() => ({
    execute: executePodcastDetailMock,
  })),
}));

jest.mock('@podcasts/infrastructure/repositories/ITunesPodcastRepository');

const wrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => (
  <LoadingStateProvider>{children}</LoadingStateProvider>
);

describe('usePodcastDetail', () => {
  beforeEach(() => {
    executePodcastDetailMock.mockReset();
  });

  it('loads podcast detail for the provided identifier', async () => {
    executePodcastDetailMock.mockResolvedValue(MOCK_PODCAST_DETAIL);

    const { result } = renderHook(() => usePodcastDetail('mock-podcast'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.podcastDetail).toEqual(MOCK_PODCAST_DETAIL);
    expect(executePodcastDetailMock).toHaveBeenCalledWith('mock-podcast');
  });

  it('keeps state empty when podcast identifier is missing', async () => {
    const { result } = renderHook(() => usePodcastDetail(undefined), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.podcastDetail).toBeNull();
    expect(executePodcastDetailMock).not.toHaveBeenCalled();
  });

  it('returns null detail when loading fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    executePodcastDetailMock.mockRejectedValue(new Error('Failed to load'));

    const { result } = renderHook(() => usePodcastDetail('mock-podcast'), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.podcastDetail).toBeNull();
    expect(executePodcastDetailMock).toHaveBeenCalledWith('mock-podcast');
    consoleErrorSpy.mockRestore();
  });
});
