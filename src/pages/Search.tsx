import React, { useState } from 'react';
import { Search as SearchIcon, Globe, Loader2, Music2, AlertCircle } from 'lucide-react';
import { searchGlobalMusic } from '../services/musicService';
import { Song } from '../types';
import { SongCard } from '../components/SongCard';
import { motion, AnimatePresence } from 'motion/react';

export const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    const music = await searchGlobalMusic(query);
    setResults(music);
    setLoading(false);
  };

  return (
    <div className="p-8 space-y-12 pb-32">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase">
            Global <span className="text-neon-cyan glow-cyan">Search</span>
          </h1>
          <p className="text-white/40 uppercase tracking-[0.3em] text-xs">Access the world's music archive</p>
        </header>

        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-x-0 -bottom-2 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity blur-md" />
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-neon-cyan group-focus-within:glow-cyan transition-colors" />
          <input 
            type="text" 
            placeholder="Search titles, artists, or frequencies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-6 text-xl text-white placeholder:text-white/20 focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all"
          />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-neon-cyan text-black font-black px-6 py-3 rounded-2xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'FETCH'}
          </button>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {!import.meta.env.VITE_YOUTUBE_API_KEY && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 glass border-neon-violet/50 rounded-2xl text-center space-y-4 max-w-xl mx-auto"
          >
            <AlertCircle className="w-12 h-12 text-neon-violet mx-auto" />
            <h3 className="text-xl font-bold uppercase italic tracking-tighter">API Protocol Offline</h3>
            <p className="text-white/40 text-xs uppercase tracking-widest leading-loose">
              Global search requires a <span className="text-white">YouTube Data API v3 Key</span>. Please add <span className="text-neon-cyan">VITE_YOUTUBE_API_KEY</span> to your secrets panel to synchronize with the world archive.
            </p>
          </motion.div>
        )}
        
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-6"
          >
            <div className="relative">
               <Loader2 className="w-20 h-20 text-neon-cyan animate-spin opacity-20" />
               <Globe className="absolute inset-0 m-auto w-10 h-10 text-neon-cyan glow-cyan animate-pulse" />
            </div>
            <p className="text-neon-cyan font-bold uppercase tracking-[0.5em] animate-pulse">Syncing with satellite...</p>
          </motion.div>
        ) : results.length > 0 ? (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-4">
               <Music2 className="text-neon-violet" />
               <h2 className="text-2xl font-bold uppercase tracking-tighter">Results Found: {results.length}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {results.map((song, i) => (
                <SongCard key={song.id} song={song} index={i} />
              ))}
            </div>
          </motion.section>
        ) : hasSearched && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass rounded-[3rem] border-dashed border-white/10 max-w-xl mx-auto"
          >
            <p className="text-white/40 uppercase tracking-widest">No matching frequencies detected.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!hasSearched && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            {['Cyberpunk', 'Synthwave', 'Phonk'].map(genre => (
              <button 
                key={genre}
                onClick={() => { setQuery(genre); }}
                className="glass p-8 rounded-[2rem] border border-white/5 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 text-center group transition-all"
              >
                <h4 className="text-2xl font-black italic uppercase text-white/60 group-hover:text-neon-cyan transition-colors">{genre}</h4>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] mt-2 group-hover:text-white/40">Select Channel</p>
              </button>
            ))}
        </div>
      )}
    </div>
  );
};
