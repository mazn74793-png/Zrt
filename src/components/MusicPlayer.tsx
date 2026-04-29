import React, { useState, useRef, useEffect } from 'react';
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
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (currentSong) {
      setIsReady(false);
      setError(null);
    }
  }, [currentSong?.id]);

  if (!currentSong) return null;

  // Use a stable key for the player to ensure it remounts on song change
  const playerKey = currentSong.id;
  const Player = ReactPlayer as any;

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
    if (duration > 0) setIsReady(true);
  };

  const handleReady = () => {
    console.log('Signal Linked Successfully');
    setIsReady(true);
    setError(null);
    
    // Safety check for duration
    if (playerRef.current) {
      const duration = playerRef.current.getDuration();
      if (duration > 0) setDur(duration);
    }
  };

  const handlePlay = () => {
    console.log('Audio Stream Active');
    setIsReady(true);
    setError(null);
  };

  const handleError = (e: any) => {
    console.error('Playback Tech Error:', e);
    // 150/101 are "embedding restricted" errors
    if (playbackState === 'playing') {
      setError('Signal restricted by source');
      setIsReady(false);
    }
  };

  // Build the effective URL - Standard YouTube is more reliable for iframe embedding
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    // Standardize to www.youtube.com for maximum compatibility
    if (url.includes('music.youtube.com')) {
      return url.replace('music.youtube.com', 'www.youtube.com');
    }
    return url;
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-24 glass border-t border-neon-cyan/30 flex items-center px-6 z-50 shadow-[0_-10px_40px_rgba(0,245,255,0.15)]"
    >
      {/* Hidden but semi-visible player container - Necessary size to bypass browser autoplay/sound blocks */}
      <div className="fixed bottom-0 right-0 w-[200px] h-[200px] pointer-events-none opacity-[0.001] z-[-1] overflow-hidden">
        <Player
          ref={playerRef}
          url={getEmbedUrl(currentSong.audioUrl)}
          playing={playbackState === 'playing'}
          volume={isMuted ? 0 : volume}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          onStart={handlePlay}
          onBuffer={() => setIsReady(false)}
          onBufferEnd={() => setIsReady(true)}
          onEnded={() => {
            setPlaybackState('stopped');
            setPlayed(0);
            setProgress(0);
            setIsReady(false);
          }}
          onError={handleError}
          width="100%"
          height="100%"
          playsinline
          controls={false}
          config={{
            youtube: {
              playerVars: {
                rel: 0,
                iv_load_policy: 3,
                enablejsapi: 1,
                origin: window.location.origin,
                autoplay: 1,
                mute: 0,
                controls: 0,
                modestbranding: 1,
                showinfo: 0,
                autohide: 1
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

      {/* Volume & Extras / Status */}
      <div className="w-1/4 flex items-center justify-end gap-6">
        <div className="flex flex-col items-end gap-1 px-4 border-r border-white/10">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono">
             <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-neon-cyan shadow-[0_0_8px_#00f5ff]' : 'bg-white/20'}`} />
             <span className={isReady ? 'text-neon-cyan' : 'text-white/30'}>{isReady ? 'Signal: Linked' : 'Signal: Offline'}</span>
          </div>
          {error && (
            <div className="flex items-center gap-1 text-[9px] text-red-500 font-mono uppercase">
              <AlertTriangle size={10} />
              <span>{error}</span>
            </div>
          )}
        </div>

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
        <button 
          onClick={() => window.open(currentSong.audioUrl, '_blank')}
          className="text-white/60 hover:text-neon-violet"
          title="Open Source Signal"
        >
          <Maximize2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};
