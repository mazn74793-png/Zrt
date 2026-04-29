import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Maximize2,
  Repeat,
  Shuffle,
  AlertTriangle
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../lib/utils';
import { motion } from 'motion/react';

export const MusicPlayer: React.FC = () => {
  const { 
    currentSong, 
    playbackState, 
    setPlaybackState, 
    volume, 
    setVolume,
    progress,
    setProgress 
  } = usePlayer();

  const [dur, setDur] = useState(0);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<any>(null);

  if (!currentSong) return null;

  const handlePlayPause = () => {
    setPlaybackState(playbackState === 'playing' ? 'paused' : 'playing');
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: any) => {
    setSeeking(false);
    playerRef.current?.seekTo(parseFloat(e.target.value));
  };

  const handleProgress = (state: any) => {
    if (!seeking) {
      setPlayed(state.played);
      setProgress(state.playedSeconds);
    }
  };

  const handleDuration = (duration: number) => {
    console.log('Track Duration Loaded:', duration);
    setDur(duration);
    setError(null);
  };

  const handleReady = () => {
    console.log('Player Ready');
    if (playerRef.current) {
      const duration = playerRef.current.getDuration();
      if (duration) setDur(duration);
    }
  };

  const handleError = (e: any) => {
    console.error('Core Playback Error:', e);
    setError('Signal Blocked by Host');
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-24 glass border-t border-neon-cyan/30 flex items-center px-6 z-50 shadow-[0_-10px_40px_rgba(0,245,255,0.15)]"
    >
      {/* Container for the actual video player - must be somewhat "visible" to bypass autoplay blocks */}
      <div className="fixed bottom-24 right-4 w-[200px] h-[120px] pointer-events-none opacity-0 overflow-hidden rounded-lg shadow-2xl border border-white/10">
        <ReactPlayer
          key={currentSong.id}
          ref={playerRef}
          url={currentSong.audioUrl}
          playing={playbackState === 'playing'}
          volume={isMuted ? 0 : volume}
          onProgress={handleProgress}
          onReady={handleReady}
          onStart={() => console.log('Playback Started')}
          onDuration={handleDuration}
          onEnded={() => setPlaybackState('stopped')}
          onError={handleError}
          width="100%"
          height="100%"
          playsinline
          config={{
            youtube: {
              playerVars: { 
                autoplay: 1, 
                controls: 0,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                origin: window.location.origin
              }
            }
          }}
        />
      </div>

      {/* Song Info */}
      <div className="flex items-center gap-4 w-1/4">
        <motion.div 
          animate={playbackState === 'playing' ? { rotate: 360 } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-neon-violet shadow-[0_0_15px_rgba(157,0,255,0.4)]"
        >
          <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-2 h-2 bg-black rounded-full border border-neon-cyan" />
          </div>
        </motion.div>
        <div className="truncate">
          <h4 className="font-bold text-white uppercase tracking-tighter truncate">{currentSong.title}</h4>
          <p className="text-xs text-white/50 uppercase tracking-widest truncate">{currentSong.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center max-w-2xl px-8">
        <div className="flex items-center gap-6 mb-2">
          <button className="text-white/40 hover:text-neon-violet transition-colors">
            <Shuffle size={18} />
          </button>
          <button className="text-white hover:text-neon-cyan transition-colors">
            <SkipBack size={24} fill="currentColor" />
          </button>
          <button 
            onClick={handlePlayPause}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-black hover:scale-110 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            {playbackState === 'playing' ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
          </button>
          <button className="text-white hover:text-neon-cyan transition-colors">
            <SkipForward size={24} fill="currentColor" />
          </button>
          <button className="text-white/40 hover:text-neon-violet transition-colors">
            <Repeat size={18} />
          </button>
        </div>

        <div className="w-full flex items-center gap-3">
          <span className="text-[10px] font-mono text-neon-cyan">{formatTime(progress)}</span>
          <div className="relative flex-1 h-1.5 group cursor-pointer">
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              className="absolute inset-0 w-full opacity-0 z-10 cursor-pointer"
            />
            <div className="absolute inset-0 bg-white/10 rounded-full" />
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-violet rounded-full shadow-[0_0_10px_rgba(0,245,255,0.5)]"
              style={{ width: `${played * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-neon-violet">{formatTime(dur)}</span>
        </div>
      </div>

      {/* Volume & Extras */}
      <div className="w-1/4 flex items-center justify-end gap-4">
        <div className="flex items-center gap-2 group">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-white/60 hover:text-neon-cyan"
          >
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-neon-cyan h-1"
          />
        </div>
        <button className="text-white/60 hover:text-neon-violet">
          <Maximize2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};
