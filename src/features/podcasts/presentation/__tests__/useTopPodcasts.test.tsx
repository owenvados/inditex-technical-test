import { renderHook, waitFor } from '@testing-library/react';
import { resetDependencyContainer } from '@core/di/container';
import { ITunesPodcastRepository } from '@podcasts/infrastructure/repositories/ITunesPodcastRepository';
import { MOCK_PODCASTS } from '@podcasts/presentation/__mocks__/podcastMocks';
import { useTopPodcasts } from '@podcasts/presentation/hooks/useTopPodcasts';
import { createHookWrapper } from '@tests/utils/testProviders';

const wrapper = createHookWrapper();

describe('useTopPodcasts', () => {
  const getTopPodcastsSpy = jest.spyOn(ITunesPodcastRepository.prototype, 'getTopPodcasts');

  beforeEach(() => {
    getTopPodcastsSpy.mockReset();
    window.localStorage.clear();
    resetDependencyContainer();
  });

  afterAll(() => {
    getTopPodcastsSpy.mockRestore();
  });

  it('loads podcasts and returns them once resolved', async () => {
    getTopPodcastsSpy.mockResolvedValue(MOCK_PODCASTS);

    const { result } = renderHook(() => useTopPodcasts(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.podcasts).toEqual(MOCK_PODCASTS);
    expect(getTopPodcastsSpy).toHaveBeenCalledTimes(1);
  });

  it('returns an empty list when loading fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getTopPodcastsSpy.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useTopPodcasts(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.podcasts).toEqual([]);
    expect(getTopPodcastsSpy).toHaveBeenCalledTimes(1);

    consoleErrorSpy.mockRestore();
  });
});
