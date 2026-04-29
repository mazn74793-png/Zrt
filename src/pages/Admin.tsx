import React, { useState } from 'react';
import { Upload, Music, Image as ImageIcon, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { storage, db } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export const Admin: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [category, setCategory] = useState('Local');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [honeyPot, setHoneyPot] = useState(''); // Protection

  if (!isAdmin) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="glass p-12 rounded-[3rem] border border-red-500/30 text-center space-y-6 max-w-lg">
          <AlertCircle className="w-20 h-20 text-red-500 mx-auto glow-red" />
          <h2 className="text-4xl font-black italic tracking-tighter uppercase text-white">Access Denied</h2>
          <p className="text-white/40 uppercase tracking-widest text-xs leading-loose">
            You do not have the required authorization levels to access the central mainframe. Your signal has been logged.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-white text-black font-black uppercase text-sm tracking-widest rounded-2xl"
          >
            RETURN TO SECTOR 0
          </button>
        </div>
      </div>
    );
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeyPot) return; // Silent fail for bots
    if (!audioFile || !imageFile || !title || !artist) return;

    setUploading(true);
    try {
      // 1. Upload Audio
      const audioRef = ref(storage, `songs/${Date.now()}_${audioFile.name}`);
      const audioTask = uploadBytesResumable(audioRef, audioFile);
      
      // 2. Upload Image
      const imageRef = ref(storage, `covers/${Date.now()}_${imageFile.name}`);
      const imageTask = uploadBytesResumable(imageRef, imageFile);

      // Track audio progress for UI
      audioTask.on('state_changed', (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      });

      await Promise.all([audioTask, imageTask]);
      
      const audioUrl = await getDownloadURL(audioRef);
      const coverUrl = await getDownloadURL(imageRef);

      // 3. Save to Firestore
      await addDoc(collection(db, 'songs'), {
        title,
        artist,
        category,
        audioUrl,
        coverUrl,
        uploaderId: user?.uid,
        uploaderName: user?.displayName,
        viewCount: 0,
        isLocal: true,
        createdAt: serverTimestamp(),
      });

      // Reset
      setTitle('');
      setArtist('');
      setAudioFile(null);
      setImageFile(null);
      setProgress(0);
      alert('Satellite Uplink Successful. Track deployed.');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Signal lost. Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-12 max-w-4xl mx-auto space-y-12 pb-32">
       <header className="space-y-4">
          <div className="flex items-center gap-4">
             <div className="w-12 h-[2px] bg-neon-violet" />
             <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">System <span className="text-neon-violet glow-violet">Control</span></h1>
          </div>
          <p className="text-white/40 uppercase tracking-[0.4em] text-xs">Manual frequency override and data injection</p>
       </header>

       <form onSubmit={handleUpload} className="space-y-8">
          {/* Honey Pot */}
          <input 
            type="text" 
            className="hidden" 
            value={honeyPot} 
            onChange={e => setHoneyPot(e.target.value)} 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Track Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-neon-violet/50 focus:outline-none transition-all"
                  placeholder="Enter designation..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Artist / Protocol</label>
                <input 
                  type="text"
                  value={artist}
                  onChange={e => setArtist(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-neon-violet/50 focus:outline-none transition-all"
                  placeholder="System signature..."
                />
              </div>
            </div>

            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Channel</label>
                    <select 
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-neon-violet/50 focus:outline-none transition-all appearance-none"
                    >
                      <option value="Local">LOCAL SYNC</option>
                      <option value="Cyberpunk">CYBERPUNK</option>
                      <option value="Synthwave">SYNTHWAVE</option>
                    </select>
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <label className="cursor-pointer group">
              <input type="file" accept="audio/*" className="hidden" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
              <div className="h-48 glass rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center p-6 group-hover:border-neon-cyan/50 transition-all">
                <Music className="w-12 h-12 text-white/20 group-hover:text-neon-cyan mb-4 transition-colors" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white">
                  {audioFile ? audioFile.name : 'Inject Audio Data'}
                </p>
              </div>
            </label>

            <label className="cursor-pointer group">
              <input type="file" accept="image/*" className="hidden" onChange={e => setImageFile(e.target.files?.[0] || null)} />
              <div className="h-48 glass rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center p-6 group-hover:border-neon-violet/50 transition-all">
                <ImageIcon className="w-12 h-12 text-white/20 group-hover:text-neon-violet mb-4 transition-colors" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white">
                  {imageFile ? imageFile.name : 'Upload Visual Patch'}
                </p>
              </div>
            </label>
          </div>

          {uploading && (
             <div className="space-y-4">
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: `${progress}%` }}
                     className="h-full bg-gradient-to-r from-neon-cyan to-neon-violet shadow-[0_0_10px_rgba(0,245,255,0.8)]"
                   />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-neon-cyan">
                   <span>Uplinking to Satellite...</span>
                   <span>{Math.round(progress)}%</span>
                </div>
             </div>
          )}

          <button 
            type="submit"
            disabled={uploading || !audioFile || !imageFile}
            className="w-full py-6 glass rounded-2xl border border-neon-violet/50 text-neon-violet font-black uppercase tracking-[0.5em] text-lg hover:bg-neon-violet hover:text-white hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all shadow-[0_0_30px_rgba(157,0,255,0.2)]"
          >
            {uploading ? (
              <div className="flex items-center justify-center gap-4">
                <Loader2 className="animate-spin" />
                <span>TRANSFERRING DATA</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <Upload size={24} />
                <span>EXECUTE DEPLOYMENT</span>
              </div>
            )}
          </button>
       </form>
    </div>
  );
};
