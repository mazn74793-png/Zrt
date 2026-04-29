export interface Song {
  id?: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
  category: string;
  uploaderId: string;
  uploaderName: string;
  viewCount: number;
  createdAt: any;
  duration?: number;
  isLocal: boolean;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin?: boolean;
}

export type PlaybackState = 'playing' | 'paused' | 'stopped';

export interface PlayerContextType {
  currentSong: Song | null;
  playbackState: PlaybackState;
  volume: number;
  progress: number;
  setCurrentSong: (song: Song | null) => void;
  setPlaybackState: (state: PlaybackState) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
}
