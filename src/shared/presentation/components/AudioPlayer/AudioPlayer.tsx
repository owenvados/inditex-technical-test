import React from 'react';

import './AudioPlayer.css';

/**
 * Props for the `AudioPlayer` component.
 */
export interface AudioPlayerProps {
  /**
   * Source URL of the audio track.
   */
  src: string;
  /**
   * MIME type of the audio source.
   */
  type?: string;
  /**
   * Preload behaviour for the audio element.
   */
  preload?: 'auto' | 'metadata' | 'none';
  /**
   * Optional controls list passed directly to the native element.
   */
  controlsList?: string;
  /**
   * Additional class names applied to the audio element.
   */
  className?: string;
  /**
   * Optional test id forwarded to the audio element.
   */
  dataTestId?: string;
}

/**
 * Shared audio player wrapper around the native HTML audio element.
 *
 * @param props Configuration describing where to load the audio file from and how the player behaves.
 * @returns Configured audio element ready to render.
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  type = 'audio/mpeg',
  preload = 'metadata',
  controlsList,
  className,
  dataTestId,
}) => {
  const audioClassName = ['audio-player', className].filter(Boolean).join(' ');

  return (
    <audio
      controls
      preload={preload}
      className={audioClassName}
      data-testid={dataTestId}
      controlsList={controlsList}
    >
      <source src={src} type={type} />
      Your browser does not support the audio element.
    </audio>
  );
};

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer;
