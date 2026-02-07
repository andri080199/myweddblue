'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, Upload, Music, Save, Trash2, RefreshCw, 
  ChevronDown, Check, Volume2, Library, Settings, Music2, 
  Clock, HardDrive, Disc, User, Sparkles, Mic2 
} from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

// --- INTERFACES ---
interface Client {
  id: number;
  name: string;
  slug: string;
  email: string;
}

interface MusicSettings {
  musicUrl?: string;
  musicTitle?: string;
  showMusicPlayer?: boolean;
}

interface MusicLibraryItem {
  id: number;
  title: string;
  url: string;
  file_name?: string;
  file_size?: number;
  created_at: string;
}

type TabType = 'library' | 'settings';

const MusicManager: React.FC = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<TabType>('library');
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [musicSettings, setMusicSettings] = useState<MusicSettings>({
    musicUrl: '',
    musicTitle: '',
    showMusicPlayer: true
  });
  const [musicLibrary, setMusicLibrary] = useState<MusicLibraryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // UI State
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [musicToDelete, setMusicToDelete] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---
  useEffect(() => {
    fetchClients();
    fetchMusicLibrary();
    setupMusicLibrary();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchMusicSettings(selectedClient);
    }
  }, [selectedClient]);

  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (clientDropdownRef.current && !clientDropdownRef.current.contains(event.target as Node)) {
        setClientDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Audio Progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // --- HELPERS & API ---
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const setupMusicLibrary = async () => {
    try { await fetch('/api/setup-music-library', { method: 'POST' }); } catch (error) { console.error(error); }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) { const data = await response.json(); setClients(data); }
    } catch (error) { console.error(error); }
  };

  const fetchMusicLibrary = async () => {
    setLibraryLoading(true);
    try {
      const response = await fetch('/api/music-library');
      if (response.ok) { const data = await response.json(); setMusicLibrary(data); }
    } catch (error) { console.error(error); } finally { setLibraryLoading(false); }
  };

  const fetchMusicSettings = async (clientSlug: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=music_settings`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content_data) {
          setMusicSettings(data[0].content_data);
        } else {
          setMusicSettings({ musicUrl: '', musicTitle: '', showMusicPlayer: true });
        }
      }
    } catch (error) {
      console.error(error);
      setMusicSettings({ musicUrl: '', musicTitle: '', showMusicPlayer: true });
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('audio/')) { alert('Please select an audio file'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('File size > 10MB'); return; }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/upload-music', { method: 'POST', body: formData });

      if (response.ok) {
        showSuccess('Music uploaded successfully!');
        fetchMusicLibrary();
      } else {
        const errorData = await response.json();
        alert(`Failed: ${errorData.error}`);
      }
    } catch (error) { console.error(error); alert('Upload failed'); } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSelectMusic = (music: MusicLibraryItem) => {
    setMusicSettings(prev => ({ ...prev, musicUrl: music.url, musicTitle: music.title }));
    setDropdownOpen(false);
  };

  const togglePlay = async (music: MusicLibraryItem) => {
    if (!audioRef.current) return;
    try {
      if (isPlaying && currentPlayingId === music.id) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentPlayingId(null);
      } else {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.src = music.url;
        await audioRef.current.play();
        setIsPlaying(true);
        setCurrentPlayingId(music.id);
      }
    } catch (error) { console.error(error); setIsPlaying(false); setCurrentPlayingId(null); }
  };

  const handleSaveSettings = async () => {
    if (!selectedClient) return;
    setSaving(true);
    try {
      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug: selectedClient,
          contentType: 'music_settings',
          contentData: musicSettings
        }),
      });

      if (response.ok) {
        showSuccess('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (error) { console.error(error); alert('Failed to save settings'); } finally { setSaving(false); }
  };

  const confirmDeleteMusic = async () => {
    if (musicToDelete === null) return;
    setDeleting(true);
    try {
      const response = await fetch(`/api/music-library?id=${musicToDelete}`, { method: 'DELETE' });
      if (response.ok) {
        showSuccess('Music deleted successfully!');
        fetchMusicLibrary();
      } else { alert('Failed to delete music'); }
    } catch (error) { console.error(error); } finally {
      setDeleting(false);
      setMusicToDelete(null);
    }
  };

  // --- RENDER ---
  const TabButton = ({ tab, icon: Icon, label }: { tab: TabType; icon: React.ElementType; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 transform active:scale-95 ${
        activeTab === tab
          ? 'bg-[#1C4D8D] text-white shadow-lg shadow-[#1C4D8D]/30'
          : 'bg-white text-[#1C4D8D] hover:bg-[#BDE8F5]/30'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      {tab === 'library' && musicLibrary.length > 0 && (
        <span className={`ml-1 px-2 py-0.5 text-[10px] rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-[#1C4D8D]/10 text-[#1C4D8D]'}`}>
          {musicLibrary.length}
        </span>
      )}
    </button>
  );

  return (
    <div className="w-full font-sans text-[#0F2854]">
      
      {/* 1. HERO SECTION DIHAPUS 
          Kita langsung masuk ke Main Content Wrapper.
          Saya juga menghapus 'min-h-screen' pada wrapper utama agar 
          tidak memaksa tinggi halaman jika di-embed di dalam layout lain.
      */}

      {/* 2. MAIN CONTENT WRAPPER */}
      {/* Hapus -mt-24 dan margin negatif lainnya karena hero section sudah hilang */}
      <div className="relative z-20">
        
        {/* --- FIXED TOAST NOTIFICATION --- */}
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${successMessage ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
          <div className="flex items-center gap-3 px-6 py-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] bg-white border border-emerald-100 text-emerald-800">
            <div className="p-2 rounded-full bg-emerald-100">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Success!</h4>
              <p className="text-xs opacity-90">{successMessage}</p>
            </div>
          </div>
        </div>

        {/* The Card */}
        <div className={`bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(28,77,141,0.15)] border border-[#1C4D8D]/10 backdrop-blur-sm ${activeTab === 'settings' ? 'overflow-visible' : 'overflow-hidden'}`}>
          
          {/* Inner Header / Toolbar */}
          <div className="px-8 py-6 border-b border-[#1C4D8D]/10 bg-[#BDE8F5]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-[#1C4D8D]/10 text-[#1C4D8D]">
                <Disc className="w-5 h-5 animate-[spin_4s_linear_infinite]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0F2854]">Audio Control Center</h3>
                <p className="text-xs text-[#1C4D8D]/70 font-medium">Manage tracks & assignments</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-white/50 p-1.5 rounded-full border border-[#1C4D8D]/5">
              <TabButton tab="library" icon={Library} label="Library" />
              <TabButton tab="settings" icon={Settings} label="Settings" />
            </div>
          </div>

          {/* 3. COMPONENT CONTENT */}
          <div className="p-6 sm:p-10 min-h-[400px]">
            
            {/* AUDIO PLAYER (Global for this component) */}
            <audio
              ref={audioRef}
              onEnded={() => { setIsPlaying(false); setCurrentPlayingId(null); setProgress(0); }}
              onError={() => { setIsPlaying(false); setCurrentPlayingId(null); }}
            />

            {/* Now Playing Bar */}
            {isPlaying && currentPlayingId && (
              <div className="sticky top-0 z-30 mb-6 bg-[#0F2854] text-white rounded-2xl p-4 shadow-xl border border-[#4988C4]/30 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1C4D8D] rounded-xl flex items-center justify-center shrink-0">
                    <Music className="w-6 h-6 animate-pulse text-[#BDE8F5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{musicLibrary.find(m => m.id === currentPlayingId)?.title}</p>
                    <div className="flex items-center gap-2 text-xs text-[#BDE8F5]/70 mt-1">
                      <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                      <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-[#4988C4]" style={{ width: `${progress}%` }}></div>
                      </div>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                  <button onClick={() => audioRef.current?.pause()} className="p-2 hover:bg-white/10 rounded-full"><Pause className="w-6 h-6" /></button>
                </div>
              </div>
            )}

            {activeTab === 'library' ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                {/* Upload Action Bar */}
                <div className="flex justify-between items-center bg-[#F8FAFC] p-4 rounded-2xl border border-[#1C4D8D]/5">
                  <h4 className="font-bold text-[#0F2854]">Your Tracks</h4>
                  <div className="flex gap-2">
                    <button onClick={fetchMusicLibrary} className="p-2 text-[#1C4D8D] hover:bg-white rounded-lg transition-colors"><RefreshCw className={`w-5 h-5 ${libraryLoading ? 'animate-spin' : ''}`} /></button>
                    <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2 bg-[#1C4D8D] text-white rounded-lg font-bold hover:bg-[#0F2854] transition-colors shadow-lg shadow-[#1C4D8D]/20 text-sm">
                      {uploading ? <RefreshCw className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4" />}
                      Upload MP3
                    </button>
                  </div>
                </div>

                {/* Library Grid */}
                {libraryLoading ? (
                  <div className="text-center py-20 text-[#1C4D8D] animate-pulse">Loading library...</div>
                ) : musicLibrary.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <Music className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Library is empty</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {musicLibrary.map((music) => (
                      <div key={music.id} className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl ${currentPlayingId === music.id ? 'bg-[#F0F9FF] border-[#1C4D8D]' : 'bg-white border-gray-100 hover:border-[#BDE8F5]'}`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentPlayingId === music.id ? 'bg-[#1C4D8D] text-white' : 'bg-[#BDE8F5]/30 text-[#1C4D8D]'}`}>
                            <Music className="w-5 h-5" />
                          </div>
                          <button onClick={() => setMusicToDelete(music.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <h4 className="font-bold text-[#0F2854] truncate mb-1">{music.title}</h4>
                        <div className="flex gap-3 text-xs text-gray-500 mb-4">
                          <span className="flex items-center gap-1"><HardDrive className="w-3 h-3"/> {(music.file_size || 0 / 1024 / 1024).toFixed(1)}MB</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {new Date(music.created_at).toLocaleDateString()}</span>
                        </div>
                        <button onClick={() => togglePlay(music)} className={`w-full py-2.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${currentPlayingId === music.id ? 'bg-[#1C4D8D] text-white' : 'bg-gray-100 text-gray-600 hover:bg-[#BDE8F5]'}`}>
                          {currentPlayingId === music.id && isPlaying ? <><Pause className="w-4 h-4"/> Pause</> : <><Play className="w-4 h-4"/> Play</>}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* SETTINGS TAB */
              <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                
                {/* Client Selector */}
                <div className="space-y-3 relative z-20">
                  <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1">Select Client</label>
                  <div className="relative" ref={clientDropdownRef}>
                    <button type="button" onClick={() => setClientDropdownOpen(!clientDropdownOpen)} className="w-full p-4 border border-[#1C4D8D]/20 rounded-xl bg-white text-left flex items-center justify-between hover:border-[#4988C4] focus:ring-4 focus:ring-[#BDE8F5] transition-all group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold transition-colors ${selectedClient ? 'bg-[#1C4D8D]' : 'bg-gray-200'}`}>
                          {selectedClient ? clients.find(c => c.slug === selectedClient)?.name.charAt(0).toUpperCase() : <User className="w-5 h-5"/>}
                        </div>
                        <div>
                          {selectedClient ? (
                            <>
                              <div className="font-bold text-[#0F2854] text-lg">{clients.find(c => c.slug === selectedClient)?.name}</div>
                              <div className="text-xs font-mono text-[#4988C4]">@{selectedClient}</div>
                            </>
                          ) : <div className="text-gray-400 font-medium">Choose a client to configure...</div>}
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-[#4988C4] transition-transform ${clientDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {clientDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-[#1C4D8D]/10 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                        {clients.map((client) => (
                          <button key={client.slug} onClick={() => { setSelectedClient(client.slug); setClientDropdownOpen(false); }} className="w-full text-left px-5 py-3 hover:bg-[#F0F9FF] transition-colors flex items-center justify-between border-b border-gray-50 last:border-0">
                            <span className="font-medium text-[#0F2854]">{client.name}</span>
                            {selectedClient === client.slug && <Check className="w-4 h-4 text-[#1C4D8D]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {selectedClient && (
                  <div className="space-y-6 relative z-10 p-6 bg-[#F8FAFC] rounded-2xl border border-[#1C4D8D]/5">
                    
                    {/* FIXED TOGGLE SWITCH */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-[#0F2854]">Music Player Widget</h4>
                        <p className="text-xs text-gray-500">Show floating play/pause button on invitation</p>
                      </div>
                      <button
                        onClick={() => setMusicSettings(prev => ({ ...prev, showMusicPlayer: !prev.showMusicPlayer }))}
                        className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1C4D8D] ${
                          musicSettings.showMusicPlayer ? 'bg-[#1C4D8D]' : 'bg-gray-300'
                        }`}
                      >
                        <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          musicSettings.showMusicPlayer ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Track Dropdown */}
                    <div className="space-y-3 relative">
                      <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1">Assigned Track</label>
                      <div className="relative" ref={dropdownRef}>
                        <button type="button" onClick={() => setDropdownOpen(!dropdownOpen)} className="w-full p-4 border border-[#1C4D8D]/20 rounded-xl bg-white text-left flex items-center justify-between hover:border-[#4988C4] transition-all">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${musicSettings.musicUrl ? 'bg-[#1C4D8D] text-white' : 'bg-gray-100 text-gray-400'}`}>
                              <Music className="w-5 h-5" />
                            </div>
                            <span className={`font-medium ${musicSettings.musicUrl ? 'text-[#0F2854]' : 'text-gray-400'}`}>
                              {musicSettings.musicTitle || 'No track assigned'}
                            </span>
                          </div>
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        </button>

                        {dropdownOpen && (
                          <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-[#1C4D8D]/80 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                            <button onClick={() => { setMusicSettings(prev => ({ ...prev, musicUrl: '', musicTitle: '' })); setDropdownOpen(false); }} className="w-full text-left px-5 py-3 text-red-500 hover:bg-red-50 border-b border-gray-50 font-medium">Remove Assignment</button>
                            {musicLibrary.map((music) => (
                              <button key={music.id} onClick={() => handleSelectMusic(music)} className="w-full text-left px-5 py-3 hover:bg-[#F0F9FF] border-b border-gray-50 flex justify-between items-center text-[#0F2854]">
                                {music.title}
                                {musicSettings.musicUrl === music.url && <Check className="w-4 h-4 text-[#1C4D8D]" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button onClick={handleSaveSettings} disabled={saving} className="w-full py-4 bg-[#1C4D8D] hover:bg-[#0F2854] text-white font-bold rounded-xl shadow-lg shadow-[#1C4D8D]/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={musicToDelete !== null}
        onClose={() => setMusicToDelete(null)}
        onConfirm={confirmDeleteMusic}
        title="Delete Track?"
        message={`Permanently delete "${musicLibrary.find(m => m.id === musicToDelete)?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="delete"
        isLoading={deleting}
      />
    </div>
  );
};

export default MusicManager;