import React, { createContext, useContext, useState } from 'react';
import { Song, PlaybackState, PlayerContextType } from '../types';

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('stopped');
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);

  return (
    <PlayerContext.Provider value={{
      currentSong,
      playbackState,
      volume,
      progress,
      setCurrentSong,
      setPlaybackState,
      setVolume,
      setProgress
    }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};
