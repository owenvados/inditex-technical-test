import React from 'react';

import './AudioPlayer.css';

/**
 * Props for the `AudioPlayer` component.
 */
export interface AudioPlayerProps {
  src: string;
  type?: string;
  preload?: 'auto' | 'metadata' | 'none';
  controlsList?: string;
  className?: string;
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
