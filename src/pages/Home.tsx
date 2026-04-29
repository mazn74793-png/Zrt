import React, { useEffect, useState } from 'react';
import { collection, query, limit, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Song } from '../types';
import { SongCard } from '../components/SongCard';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Clock, Zap } from 'lucide-react';

export const Home: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'songs'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const songsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
      setSongs(songsData);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="p-8 space-y-12 pb-32">
      {/* Hero Bento Section */}
      <section className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[500px]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2.5rem] glass neon-border-cyan p-10 flex flex-col justify-end"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=1200" 
            alt="Neon" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="relative z-20 space-y-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-neon-cyan/20 border border-neon-cyan/50 rounded-full w-fit">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-[10px] font-bold text-neon-cyan tracking-widest uppercase">FEATURED RELEASE</span>
            </div>
            <h2 className="text-6xl font-black italic tracking-tighter text-white leading-none">
              NEURAL <br /> <span className="text-neon-cyan glow-cyan">OVERDRIVE</span>
            </h2>
            <p className="text-white/60 max-w-sm uppercase text-xs tracking-widest leading-loose">
              Experience the pulse of the digital underground. Fresh syncs directly from the mainframe.
            </p>
            <button className="mt-6 px-8 py-4 bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-neon-cyan transition-colors rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              LISTEN NOW
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 glass rounded-[2rem] border border-white/10 p-8 flex flex-col justify-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
            <TrendingUp className="w-12 h-12 text-neon-violet opacity-20" />
          </div>
          <h3 className="text-3xl font-bold text-white uppercase italic tracking-tighter mb-2">
            Trending <span className="text-neon-violet">Global</span>
          </h3>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-6">Real-time sync from worldwide charts</p>
          <div className="flex -space-x-4">
             {[1,2,3,4,5].map(i => (
               <img key={i} src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${i}`} className="w-10 h-10 rounded-full border-2 border-deep-black" />
             ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2rem] border border-white/10 p-6 flex flex-col items-center justify-center text-center group transition-colors hover:border-neon-cyan/30"
        >
          <Zap className="w-8 h-8 text-neon-cyan mb-4 group-hover:scale-125 transition-transform" />
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Fast Lane</p>
          <h4 className="text-xl font-bold text-white">HI-FI</h4>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2rem] border border-white/10 p-6 flex flex-col items-center justify-center text-center group transition-colors hover:border-white/30"
        >
          <Clock className="w-8 h-8 text-white/60 mb-4 group-hover:rotate-12 transition-transform" />
          <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Recent</p>
          <h4 className="text-xl font-bold text-white">HISTORY</h4>
        </motion.div>
      </section>

      {/* Fresh Drops */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
            Fresh <span className="text-neon-cyan">Drops</span>
          </h2>
          <div className="h-[2px] flex-1 mx-8 bg-gradient-to-r from-neon-cyan/50 to-transparent" />
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="aspect-square glass rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="py-20 text-center glass rounded-3xl border-dashed border-white/10">
            <p className="text-white/30 uppercase tracking-[0.2em] text-sm">No songs found in the mainframe.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {songs.map((song, i) => (
              <SongCard key={song.id} song={song} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
