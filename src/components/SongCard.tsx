import React from 'react';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { Song } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { motion } from 'motion/react';

interface SongCardProps {
  song: Song;
  index?: number;
}

export const SongCard: React.FC<SongCardProps> = ({ song, index }) => {
  const { currentSong, setCurrentSong, playbackState, setPlaybackState } = usePlayer();
  const isPlaying = currentSong?.id === song.id && playbackState === 'playing';

  const handlePlay = () => {
    if (currentSong?.id === song.id) {
      setPlaybackState(playbackState === 'playing' ? 'paused' : 'playing');
    } else {
      setCurrentSong(song);
      setPlaybackState('playing');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (index || 0) * 0.05 }}
      className="group relative p-4 glass rounded-2xl border border-white/5 hover:border-neon-cyan/50 transition-all duration-500 overflow-hidden"
    >
      <div className="relative aspect-square mb-4 rounded-xl overflow-hidden">
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <button 
            onClick={handlePlay}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-neon-cyan text-black shadow-[0_0_20px_rgba(0,245,255,0.8)] scale-90 group-hover:scale-100 transition-transform duration-300"
          >
            {isPlaying ? <div className="flex gap-1 items-end h-5">
              <div className="w-1.5 bg-black animate-[audiowave_1s_infinite_0.1s]" />
              <div className="w-1.5 bg-black animate-[audiowave_1s_infinite_0.3s]" />
              <div className="w-1.5 bg-black animate-[audiowave_1s_infinite_0.5s]" />
            </div> : <Play fill="currentColor" />}
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-white truncate text-sm uppercase italic tracking-tighter group-hover:text-neon-cyan transition-colors">
          {song.title}
        </h3>
        <p className="text-xs text-white/50 truncate uppercase tracking-widest font-medium">
          {song.artist}
        </p>
      </div>

      <div className="absolute top-6 right-6 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 glass rounded-full text-white/70 hover:text-neon-violet hover:border-neon-violet/50">
          <Heart size={16} />
        </button>
        <button className="p-2 glass rounded-full text-white/70 hover:text-neon-white">
          <MoreHorizontal size={16} />
        </button>
      </div>
      
      {song.isLocal && (
        <div className="absolute top-6 left-6 px-2 py-1 rounded bg-neon-violet/80 text-[8px] font-bold text-white tracking-widest uppercase shadow-[0_0_10px_rgba(157,0,255,0.5)]">
          LOCAL
        </div>
      )}
    </motion.div>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes audiowave {
    0%, 100% { height: 10%; }
    50% { height: 100%; }
  }
`;
document.head.appendChild(style);
