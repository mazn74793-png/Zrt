import React from 'react';
import { Search, Bell, Settings, Command } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';

export const TopNav: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 glass border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-neon-cyan transition-colors" />
           <input 
             type="text" 
             placeholder="Global Search Protocol..."
             className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-neon-cyan/50 focus:bg-white/10 transition-all"
           />
           <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] text-white/20 font-bold uppercase tracking-tighter">
              <Command size={10} />
              <span>K</span>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-white/60 hover:text-white transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-neon-cyan rounded-full shadow-[0_0_8px_rgba(0,245,255,0.8)]" />
        </button>
        <button className="p-2 text-white/60 hover:text-white transition-colors">
          <Settings size={20} />
        </button>
        
        <div className="h-8 w-[1px] bg-white/10 mx-2" />
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-white uppercase italic tracking-tighter">
              {user?.displayName || 'GUEST_01'}
            </p>
            <p className="text-[10px] text-white/30 uppercase tracking-widest leading-none">
              LEVEL 14 ACCESS
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
