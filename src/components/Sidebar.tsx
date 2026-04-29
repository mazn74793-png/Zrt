import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, ShieldAlert, Disc } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export const Sidebar: React.FC = () => {
  const { isAdmin, user, login } = useAuth();

  const links = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Search', icon: Search, path: '/search' },
    { name: 'Library', icon: Library, path: '/library' },
  ];

  return (
    <aside className="w-64 glass border-r border-white/10 flex flex-col h-full overflow-y-auto">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <Disc className="w-10 h-10 text-neon-cyan glow-cyan animate-spin-slow" />
          <h1 className="text-2xl font-bold tracking-tighter text-white font-syncopation">
            NEON<span className="text-neon-violet">VIBE</span>
          </h1>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-white/10 text-neon-cyan neon-border-cyan" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )
            }
          >
            <link.icon className="w-5 h-5 group-hover:glow-cyan" />
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 mt-8",
                isActive 
                  ? "bg-neon-violet/20 text-neon-violet neon-border-violet" 
                  : "text-neon-violet/60 hover:text-neon-violet hover:bg-neon-violet/5 border border-transparent hover:border-neon-violet/30"
              )
            }
          >
            <ShieldAlert className="w-5 h-5" />
            <span className="font-medium">Admin Console</span>
          </NavLink>
        )}
      </nav>

      <div className="p-4 mt-auto">
        {!user ? (
          <button 
            onClick={login}
            className="w-full py-3 px-4 rounded-xl bg-neon-cyan text-black font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,245,255,0.5)]"
          >
            Sign In
          </button>
        ) : (
          <div className="flex items-center gap-3 p-2 bg-white/5 rounded-2xl border border-white/10">
            <img 
              src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
              alt={user.displayName || 'User'} 
              className="w-10 h-10 rounded-full border border-neon-cyan"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white uppercase italic tracking-tighter">
                {user.displayName}
              </p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">
                {isAdmin ? 'SYSTEM OVERSEER' : 'OPERATIVE'}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 12s linear infinite;
  }
`;
document.head.appendChild(style);
