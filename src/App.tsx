/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { MusicPlayer } from './components/MusicPlayer';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Admin } from './pages/Admin';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <Router>
          <div className="flex h-screen bg-deep-black text-white selection:bg-neon-cyan/30 selection:text-neon-cyan">
            <Sidebar />
            
            <main className="flex-1 flex flex-col min-w-0 relative h-full overflow-hidden">
              {/* Animated Background Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
                 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/20 blur-[120px] rounded-full animate-pulse" />
                 <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-violet/20 blur-[120px] rounded-full animate-pulse-slow" />
              </div>

              <TopNav />
              
              <div className="flex-1 overflow-y-auto scroll-smooth">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/library" element={<div className="p-20 text-center uppercase tracking-widest text-white/20">Library Module Offline</div>} />
                  </Routes>
                </AnimatePresence>
              </div>

              <MusicPlayer />
            </main>
          </div>
        </Router>
      </PlayerProvider>
    </AuthProvider>
  );
}

const style = document.createElement('style');
style.textContent = `
  @keyframes pulse-slow {
    0%, 100% { opacity: 0.1; transform: scale(1); }
    50% { opacity: 0.3; transform: scale(1.1); }
  }
  .animate-pulse-slow {
    animation: pulse-slow 8s ease-in-out infinite;
  }
`;
document.head.appendChild(style);

