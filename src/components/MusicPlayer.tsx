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


const Player = ReactPlayer as any;

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
      setDur(0);
      setPlayed(0);
      setProgress(0);
    }
  }, [currentSong?.id]);

  const getCleanUrl = (url: string) => {
    if (!url) return '';
    return url.replace('music.youtube.com', 'www.youtube.com');
  };

  // Sync volume manually when ready or when volume changes
  useEffect(() => {
    const syncInternal = () => {
      if (isReady && playerRef.current) {
        try {
          const internal = playerRef.current.getInternalPlayer();
          if (internal) {
            if (typeof internal.setVolume === 'function') {
              // YouTube uses 0-100
              internal.setVolume(isMuted ? 0 : volume * 100);
            } else if ('volume' in internal) {
              internal.volume = isMuted ? 0 : volume;
            }
          }
        } catch (err) {}
      }
    };

    syncInternal();
    const timeout = setTimeout(syncInternal, 500);
    return () => clearTimeout(timeout);
  }, [isReady, volume, isMuted, playbackState]);

  // Sync playback state manually
  useEffect(() => {
    let timeout: any;
    if (isReady && playerRef.current && playbackState === 'playing') {
      timeout = setTimeout(() => {
        try {
          const internal = playerRef.current.getInternalPlayer();
          if (internal) {
            // Force volume again on play start
            if (typeof internal.setVolume === 'function') {
              internal.setVolume(isMuted ? 0 : volume * 100);
            }
            
            if (typeof internal.playVideo === 'function') {
               const state = internal.getPlayerState?.();
               if (state !== 1 && state !== 3) {
                 internal.playVideo();
               }
            }
          }
        } catch (err) {}
      }, 300);
    }
    return () => clearTimeout(timeout);
  }, [isReady, playbackState, currentSong?.id, volume, isMuted]);

  if (!currentSong) return null;

  const handlePlayPause = () => {
    setPlaybackState(playbackState === 'playing' ? 'paused' : 'playing');
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setPlayed(val);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e: any) => {
    setSeeking(false);
    const val = parseFloat(e.target.value);
    playerRef.current?.seekTo(val);
  };

  const handleProgress = (state: any) => {
    if (!seeking) {
      setPlayed(state.played);
      setProgress(state.playedSeconds);
      
      // Secondary duration fallback
      if (dur === 0 && playerRef.current) {
        try {
          const d = playerRef.current.getDuration();
          if (d && d > 0) setDur(d);
        } catch (e) {}
      }
    }
  };

  const handleDuration = (duration: number) => {
    if (duration && duration > 0) setDur(duration);
  };

  const handleError = (e: any) => {
    console.error('Playback Error:', e);
    setError('Playback Error - Reconnecting...');
    setIsReady(false);
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 h-24 glass border-t border-neon-cyan/30 flex items-center px-6 z-50 shadow-[0_-10px_40px_rgba(0,245,255,0.15)]"
    >
      {/* Background Signal Processor */}
      <div 
        className="opacity-0 pointer-events-none absolute"
        style={{ 
          width: '200px', 
          height: '150px', 
          left: '-2000px',
          top: '0'
        }}
      >
        <Player
          ref={playerRef}
          url={getCleanUrl(currentSong.audioUrl)}
          playing={playbackState === 'playing'}
          volume={volume}
          muted={isMuted}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={() => {
            console.log("Audio Signal Locked");
            setIsReady(true);
            setError(null);
            try {
              const d = playerRef.current?.getDuration();
              if (d && d > 0) setDur(d);
            } catch(e) {}
          }}
          onStart={() => {
            console.log("Playback Started");
            setIsReady(true);
            try {
              const d = playerRef.current?.getDuration();
              if (d && d > 0) setDur(d);
            } catch(e) {}
          }}
          onEnded={() => setPlaybackState('stopped')}
          onError={handleError}
          width="100%"
          height="100%"
          playsinline
          config={{
            youtube: {
              enablejsapi: 1,
              origin: window.location.origin,
              rel: 0,
              cc_load_policy: 0,
              iv_load_policy: 3,
              disablekb: 1
            }
          } as any}
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
