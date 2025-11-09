import { AudioPlayer } from '@shared/presentation/components/AudioPlayer';
import { render, screen } from '@testing-library/react';

describe('AudioPlayer', () => {
  it('renders an audio element with controls', () => {
    render(<AudioPlayer src="https://example.com/audio.mp3" dataTestId="audio-player" />);

    const audio = screen.getByTestId('audio-player') as HTMLAudioElement;
    expect(audio).toBeInTheDocument();
    expect(audio).toHaveAttribute('controls');
    expect(audio.preload).toBe('metadata');
  });

  it('applies custom class names', () => {
    render(
      <AudioPlayer
        src="https://example.com/audio.mp3"
        dataTestId="audio-player"
        className="custom-class"
      />,
    );

    expect(screen.getByTestId('audio-player')).toHaveClass('custom-class');
  });
});
