'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider } from '@/contexts/MusicContext';
import { useUnifiedTheme } from '@/hooks/useUnifiedTheme';
import { useContainerDimensions } from '@/hooks/useContainerHeight';
import { Ornament, SectionId, DEFAULT_ANIMATION_VALUES } from '@/types/ornament';
import { Save, X, Layers, ArrowLeft, Info, LayoutDashboard, MousePointer2, Menu, Sparkles, ChevronDown, Plus } from 'lucide-react';
import EditableOrnament from '@/components/admin/EditableOrnament';
import AnimationControlPanel from '@/components/admin/AnimationControlPanel';
import '@/styles/theme-backgrounds.css';
import '@/styles/inline-editor.css';

// Import all section components
import FullScreenImage from '@/components/media/FullScreenImage';
import KutipanAyat from '@/components/wedding/KutipanAyat';
import Welcome from '@/components/wedding/Welcome';
import Timeline from '@/components/wedding/Timeline';
import WeddingEvent from '@/components/wedding/WeddingEvent';
import WeddingGift from '@/components/wedding/WeddingGift';
import OurGallery from '@/components/media/OurGallery';
import RSVPForm from '@/components/forms/RSVPForm';
import GuestBookList from '@/components/interactive/GuestBookList';
import ThankYouMessage from '@/components/wedding/ThankYouMessage';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import MusicCircle from '@/components/media/MusicCircle';
import EnhancedLoading from '@/components/ui/EnhancedLoading';

export default function PreviewEditPage() {
  const params = useParams();
  const router = useRouter();
  const themeId = params?.themeId as string;

  const { theme: unifiedTheme, loading: themeLoading } = useUnifiedTheme(themeId);
  const [localOrnaments, setLocalOrnaments] = useState<Ornament[]>([]);
  const [selectedOrnamentId, setSelectedOrnamentId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionId>('welcome');
  const [showLibrary, setShowLibrary] = useState(false);
  const [libraryOrnaments, setLibraryOrnaments] = useState<any[]>([]);
  const [copiedOrnament, setCopiedOrnament] = useState<Ornament | null>(null);

  // Measure container dimensions for accurate ornament positioning
  const { ref: welcomeRef, width: welcomeWidth, height: welcomeHeight } = useContainerDimensions();

  // --- Sample Data ---
  const sampleCoupleInfo = {
    bride: {
      name: 'Sarah',
      fullName: 'Sarah Wijaya',
      parent: 'Putri kedua dari Bapak Budi Wijaya & Ibu Siti Wijaya',
      image: '/images/groom_and_bride.png'
    },
    groom: {
      name: 'David',
      fullName: 'David Chen',
      parent: 'Putra pertama dari Bapak Michael Chen & Ibu Linda Chen',
      image: '/images/groom_and_bride.png'
    },
    wedding: {
      date: '2025-06-15',
      venue: 'Gedung Pernikahan Megah',
      address: 'Jl. Sudirman No. 456, Jakarta'
    }
  };

  const sampleContent = {
    couple_info: {
      brideName: 'Sarah',
      brideFullName: 'Sarah Wijaya',
      brideFatherName: 'Budi Wijaya',
      brideMotherName: 'Siti Wijaya',
      brideChildOrder: '2',
      groomName: 'David',
      groomFullName: 'David Chen',
      groomFatherName: 'Michael Chen',
      groomMotherName: 'Linda Chen',
      groomChildOrder: '1',
      weddingImage: '/images/groom_and_bride.png'
    },
    kutipan_ayat: {
      ayat: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri.',
      sumber: 'QS. Ar-Rum: 21'
    },
    love_story: {
      story1: '2020 - Pertemuan Pertama: Kami pertama kali bertemu di sebuah acara kampus.',
      story1Visible: true,
      story2: '2022 - Hubungan Serius: Memutuskan untuk melangkah ke jenjang yang lebih serius.',
      story2Visible: true,
      story3: '2024 - Lamaran: Hari bahagia di mana kami mengikat janji untuk sehidup semati.',
      story3Visible: true,
      story4: 'tets', // Kosongkan jika tidak ada
      story4Visible: false
    },
    akad_info: {
      date: '2025-06-15',
      startTime: '08:00',
      endTime: '10:00',
      location: 'Masjid Al-Ikhlas',
      address: 'Jl. Raya No. 123, Jakarta'
    },
    resepsi_info: {
      date: '2025-06-15',
      startTime: '11:00',
      endTime: '14:00',
      location: 'Gedung Pernikahan Megah',
      address: 'Jl. Sudirman No. 456, Jakarta'
    }
  };

  const sampleGalleryPhotos = [
    { id: 1, photo_url: '/images/Wedding1.png', caption: 'Photo 1' },
    { id: 2, photo_url: '/images/Wedding2.png', caption: 'Photo 2' },
    { id: 3, photo_url: '/images/Wedding1.png', caption: 'Photo 3' },
    { id: 4, photo_url: '/images/Wedding2.png', caption: 'Photo 4' },
    { id: 5, photo_url: '/images/Wedding1.png', caption: 'Photo 5' },
    { id: 6, photo_url: '/images/Wedding2.png', caption: 'Photo 6' }
  ];

  // Load ornaments
  useEffect(() => {
    if (unifiedTheme?.ornaments?.ornaments) {
      setLocalOrnaments(unifiedTheme.ornaments.ornaments);
    }
  }, [unifiedTheme]);

  // Fetch library
  useEffect(() => {
    fetchLibrary();
  }, []);

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC - Deselect ornament
      if (event.key === 'Escape' && selectedOrnamentId) {
        event.preventDefault();
        setSelectedOrnamentId(null);
        return;
      }

      // Delete or Backspace - Delete selected ornament
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedOrnamentId) {
        event.preventDefault();
        handleOrnamentDelete(selectedOrnamentId);
        return;
      }

      // Ctrl+C / Cmd+C - Copy selected ornament
      if ((event.ctrlKey || event.metaKey) && event.key === 'c' && selectedOrnamentId) {
        event.preventDefault();
        const ornamentToCopy = localOrnaments.find(o => o.id === selectedOrnamentId);
        if (ornamentToCopy) {
          setCopiedOrnament(ornamentToCopy);
          // Visual feedback
          const notification = document.createElement('div');
          notification.textContent = '📋 Ornament copied!';
          notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; font-weight: 500; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
          document.body.appendChild(notification);
          setTimeout(() => notification.remove(), 2000);
        }
        return;
      }

      // Ctrl+V / Cmd+V - Paste copied ornament
      if ((event.ctrlKey || event.metaKey) && event.key === 'v' && copiedOrnament) {
        event.preventDefault();
        // Create new ornament with offset position
        const newOrnament: Ornament = {
          ...copiedOrnament,
          id: `ornament-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          position: {
            ...copiedOrnament.position,
            // Offset by 5% to make it visible
            top: copiedOrnament.position.top
              ? `${Math.min(parseFloat(copiedOrnament.position.top) + 5, 90)}%`
              : copiedOrnament.position.top,
            left: copiedOrnament.position.left
              ? `${Math.min(parseFloat(copiedOrnament.position.left) + 5, 90)}%`
              : copiedOrnament.position.left,
            bottom: copiedOrnament.position.bottom
              ? `${Math.min(parseFloat(copiedOrnament.position.bottom) + 5, 90)}%`
              : copiedOrnament.position.bottom,
            right: copiedOrnament.position.right
              ? `${Math.min(parseFloat(copiedOrnament.position.right) + 5, 90)}%`
              : copiedOrnament.position.right,
          },
          createdAt: new Date().toISOString()
        };

        setLocalOrnaments(prev => [...prev, newOrnament]);
        setSelectedOrnamentId(newOrnament.id);

        // Visual feedback
        const notification = document.createElement('div');
        notification.textContent = '✅ Ornament pasted!';
        notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #3b82f6; color: white; padding: 12px 20px; border-radius: 8px; z-index: 9999; font-weight: 500; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
        return;
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedOrnamentId, localOrnaments, copiedOrnament]); // Dependencies

  async function fetchLibrary() {
    try {
      const response = await fetch('/api/ornament-library');
      const data = await response.json();
      if (data.success) {
        setLibraryOrnaments(data.ornaments);
      }
    } catch (error) {
      console.error('Error fetching library:', error);
    }
  }

  const handleSaveOrnaments = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/unified-themes/ornaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId,
          ornaments: localOrnaments
        })
      });

      const data = await response.json();
      if (data.success) {
        alert('✅ Ornaments saved successfully!');
      } else {
        alert('❌ Failed to save: ' + data.error);
      }
    } catch (error) {
      console.error('Error saving ornaments:', error);
      alert('❌ Failed to save ornaments');
    } finally {
      setSaving(false);
    }
  };

  const handleOrnamentUpdate = (updated: Ornament) => {
    setLocalOrnaments(prev => prev.map(o => o.id === updated.id ? updated : o));
  };

  const handleOrnamentDelete = useCallback((id: string) => {
    setLocalOrnaments(prev => prev.filter(o => o.id !== id));
    setSelectedOrnamentId(null);
  }, []);

  const handleAddFromLibrary = (libraryOrnament: any) => {
    const newOrnament: Ornament = {
      id: `orn-${Date.now()}`,
      section: currentSection,
      name: libraryOrnament.ornament_name,
      image: libraryOrnament.ornament_image,
      position: {
        top: '10%',
        left: '10%',
        right: null,
        bottom: null,
        anchorY: 'top',
        anchorX: 'left'
      },
      transform: { scale: 1, rotate: 0 },
      style: { width: '150px', height: 'auto', opacity: 1, zIndex: 15 },
      isVisible: true,
      createdAt: new Date().toISOString()
    };

    setLocalOrnaments(prev => [...prev, newOrnament]);
    setSelectedOrnamentId(newOrnament.id);
    setShowLibrary(false);
  };

  if (themeLoading) {
    return <EnhancedLoading message="Loading theme preview..." type="wedding" size="lg" />;
  }

  const legacyTheme = unifiedTheme ? {
    id: unifiedTheme.theme_id,
    name: unifiedTheme.theme_name,
    description: unifiedTheme.description || '',
    colors: unifiedTheme.colors,
    images: {
      hero: unifiedTheme.backgrounds.fullscreen || '/images/Wedding1.png',
      background: unifiedTheme.backgrounds.welcome || '/images/Wedding2.png',
      gallery: [],
      couple: {
        bride: '/images/groom_and_bride.png',
        groom: '/images/groom_and_bride.png'
      }
    },
    typography: {
      primaryFont: 'Merienda, cursive',
      secondaryFont: 'Poppins, sans-serif',
      headingFont: 'Lavishly Yours, cursive',
      scriptFont: 'Great Vibes, cursive'
    },
    customStyles: unifiedTheme.custom_styles,
  } : null;

  const sections: { id: SectionId; label: string }[] = [
    { id: 'fullscreen-image', label: 'Gambar Pembuka' },
    { id: 'kutipan-ayat', label: 'Kutipan Ayat' },
    { id: 'welcome', label: 'Info Mempelai' },
    { id: 'love-story', label: 'Cerita Cinta' },
    { id: 'wedding-event', label: 'Detail Acara' },
    { id: 'wedding-gift', label: 'Hadiah Pernikahan' },
    { id: 'gallery', label: 'Galeri' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'guestbook', label: 'Buku Tamu' },
    { id: 'thankyou', label: 'Terima Kasih' },
    { id: 'footer', label: 'Footer' }
  ];

  const sampleComponentSettings = {
    showFullScreenImage: true,
    showKutipanAyat: true,
    showWelcome: true,
    showLoveStory: true,
    showTimeline: true,
    showWeddingEvent: true,
    showAkadInfo: true,
    showResepsiInfo: true,
    showWeddingGift: true,
    showBankCards: true,
    showGiftAddress: true,
    showGallery: true,
    showRSVP: true,
    showGuestBook: true,
    showFooter: true,
    showNavbar: true,
    showMusic: true
  };

  return (
    <MusicProvider>
      <ThemeProvider theme={legacyTheme} coupleInfo={sampleCoupleInfo}>
        
        {/* === MAIN LAYOUT === */}
        <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-gray-100">

            {/* --- 1a. MOBILE HEADER (Visible only on LG down) --- */}
            <header className="lg:hidden flex-none h-16 bg-white border-b border-gray-200 z-[60] flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.push('/admin/theme-backgrounds')} className="p-2 -ml-2 text-gray-600">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-gray-800 text-sm truncate max-w-[120px]">
                        {unifiedTheme?.theme_name}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setShowLibrary(!showLibrary)} className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                        <Layers className="w-5 h-5" />
                    </button>
                    <button onClick={handleSaveOrnaments} disabled={saving} className="p-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400">
                        <Save className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* --- 1b. DESKTOP SIDEBAR (Visible only on LG up) --- */}
            <aside className="hidden lg:flex w-72 bg-white border-r border-gray-200 shadow-xl z-[60] flex-col h-full flex-shrink-0">
                <div className="p-6 border-b border-gray-100">
                    <button
                        onClick={() => router.push('/admin/theme-backgrounds')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm">Back to Themes</span>
                    </button>
                    <div>
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block mb-1">EDIT MODE</span>
                        <h1 className="text-xl font-bold text-gray-800 leading-tight">{unifiedTheme?.theme_name}</h1>
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
                    {/* Selected Ornament Properties */}
                    {selectedOrnamentId && localOrnaments.find(o => o.id === selectedOrnamentId) ? (
                        <div className="space-y-4">
                            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                                <div className="flex items-center gap-2 text-green-700 mb-2">
                                    <MousePointer2 className="w-4 h-4" />
                                    <span className="font-bold text-sm">Ornament Terpilih</span>
                                </div>
                                <p className="text-xs text-green-800">
                                    {localOrnaments.find(o => o.id === selectedOrnamentId)?.name}
                                </p>
                            </div>

                            {/* Style Controls */}
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-blue-500" />
                                    Pengaturan Tampilan
                                </h3>

                                {/* Z-Index Control */}
                                <div>
                                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                                        Layer (Z-Index): {localOrnaments.find(o => o.id === selectedOrnamentId)?.style.zIndex || 15}
                                    </label>
                                    <input
                                        type="range"
                                        min="5"
                                        max="30"
                                        step="1"
                                        value={localOrnaments.find(o => o.id === selectedOrnamentId)?.style.zIndex || 15}
                                        onChange={(e) => {
                                            const ornament = localOrnaments.find(o => o.id === selectedOrnamentId);
                                            if (ornament) {
                                                handleOrnamentUpdate({
                                                    ...ornament,
                                                    style: {
                                                        ...ornament.style,
                                                        zIndex: parseInt(e.target.value)
                                                    }
                                                });
                                            }
                                        }}
                                        className="w-full accent-blue-500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Belakang (5)</span>
                                        <span>Depan (30)</span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">Mengontrol urutan layer ornament</p>
                                </div>
                            </div>

                            {/* Animation Controls */}
                            <div>
                                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-500" />
                                    Pengaturan Animasi
                                </h3>
                                <AnimationControlPanel
                                    animation={localOrnaments.find(o => o.id === selectedOrnamentId)?.animation || DEFAULT_ANIMATION_VALUES}
                                    onChange={(animation) => {
                                        const ornament = localOrnaments.find(o => o.id === selectedOrnamentId);
                                        if (ornament) {
                                            handleOrnamentUpdate({
                                                ...ornament,
                                                animation
                                            });
                                        }
                                    }}
                                />
                            </div>

                            <button
                                onClick={() => setSelectedOrnamentId(null)}
                                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                            >
                                Deselect Ornament
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2 text-blue-700 mb-2">
                                    <Info className="w-4 h-4" />
                                    <span className="font-bold text-sm">Editor Guide</span>
                                </div>
                                <ul className="text-xs text-blue-800 space-y-2 list-disc list-inside opacity-80">
                                    <li>Pilih <strong>Section</strong> dari Library.</li>
                                    <li>Klik ornamen untuk <strong>Memilih</strong>.</li>
                                    <li><strong>Geser</strong> untuk memindahkan.</li>
                                </ul>
                            </div>

                            {/* Ornament List */}
                            {localOrnaments.length > 0 && (
                                <div className="bg-white p-4 rounded-xl border border-gray-200">
                                    <h3 className="text-sm font-semibold mb-3 text-gray-800">
                                        Semua Ornament ({localOrnaments.length})
                                    </h3>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {localOrnaments.map((ornament) => (
                                            <div
                                                key={ornament.id}
                                                className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-pointer ${
                                                    selectedOrnamentId === ornament.id
                                                        ? 'bg-blue-50 border-blue-300'
                                                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                                                }`}
                                                onClick={() => setSelectedOrnamentId(ornament.id)}
                                            >
                                                <img
                                                    src={ornament.image}
                                                    alt={ornament.name}
                                                    className="w-8 h-8 object-contain rounded"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-medium text-gray-800 truncate">
                                                        {ornament.name}
                                                    </p>
                                                    <p className="text-[10px] text-gray-500">
                                                        {ornament.section} • z:{ornament.style.zIndex}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm(`Delete "${ornament.name}"?`)) {
                                                            handleOrnamentDelete(ornament.id);
                                                        }
                                                    }}
                                                    className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                                    title="Delete ornament"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => setShowLibrary(!showLibrary)}
                                className={`flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-xl font-semibold transition-all border shadow-sm ${showLibrary ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                            >
                                <Layers className="w-5 h-5" />
                                <span>Ornament Library</span>
                            </button>
                        </>
                    )}
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={handleSaveOrnaments}
                        disabled={saving}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:bg-gray-400 shadow-md transition-all active:scale-95"
                    >
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </aside>

            {/* --- 2. ORNAMENT LIBRARY (Overlay / Sidebar) --- */}
            
            {/* A. BACKDROP (Layer Redup) */}
            {/* Efek fade-in/out saat sidebar muncul */}
            <div 
                className={`
                    fixed inset-0 z-[60] bg-black/5 backdrop-blur-[2px]
                    transition-opacity duration-500 ease-in-out
                    ${showLibrary ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                onClick={() => setShowLibrary(false)}
            />

            {/* B. SIDEBAR PANEL (Sliding Animation) */}
            <div 
                className={`
                    fixed z-[70] lg:right-0 lg:h-full
                    inset-y-0 right-0 w-80 h-full lg:inset-auto
                    flex flex-col border-l border-white/30
                    bg-white/60 backdrop-blur-xl shadow-2xl
                    transform transition-transform duration-500 ease-in-out
                    ${showLibrary ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200/40 bg-white/40 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-100/50 rounded-lg border border-purple-100/50">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-gray-800 text-base">Assets Library</h3>
                    </div>
                    <button 
                        onClick={() => setShowLibrary(false)} 
                        className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors text-gray-500"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    
                    {/* --- CUSTOM DROPDOWN SECTION --- */}
                    <div className="mb-6 relative z-30">
                        <label className="block text-[10px] font-bold text-gray-800 uppercase tracking-widest mb-2 ml-1 opacity-80">
                            Target Section
                        </label>
                        
                        {/* Custom Dropdown Trigger */}
                        <div className="relative group">
                            <button
                                onClick={() => {
                                    const dropdown = document.getElementById('section-dropdown');
                                    if (dropdown) {
                                        if (dropdown.classList.contains('hidden')) {
                                            dropdown.classList.remove('hidden');
                                            dropdown.classList.add('block', 'animate-in', 'fade-in', 'zoom-in-95');
                                        } else {
                                            dropdown.classList.add('hidden');
                                            dropdown.classList.remove('block', 'animate-in', 'fade-in', 'zoom-in-95');
                                        }
                                    }
                                }}
                                className="
                                    w-full flex items-center justify-between
                                    px-4 py-3 
                                    bg-white/50 border border-gray-200/60
                                    rounded-2xl text-sm font-semibold text-gray-700
                                    shadow-sm backdrop-blur-sm
                                    hover:bg-white/80 hover:border-purple-300 hover:shadow-md
                                    transition-all duration-300 text-left
                                "
                            >
                                <span className="truncate">
                                    {sections.find(s => s.id === currentSection)?.label || 'Select Section'}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </button>

                            {/* Custom Dropdown Menu */}
                            <div 
                                id="section-dropdown"
                                className="hidden absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl max-h-60 overflow-y-auto z-50 p-1 duration-200 custom-scrollbar"
                            >
                                {sections.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            setCurrentSection(s.id);
                                            document.getElementById('section-dropdown')?.classList.add('hidden');
                                        }}
                                        className={`
                                            w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 flex items-center justify-between
                                            ${currentSection === s.id 
                                                ? 'bg-purple-50 text-purple-700' 
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }
                                        `}
                                    >
                                        {s.label}
                                        {currentSection === s.id && <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- ORNAMENTS GRID --- */}
                    <div className="grid grid-cols-2 gap-3 pb-20 relative z-10">
                        {libraryOrnaments.map((libOrn) => (
                            <div
                                key={libOrn.id}
                                onClick={() => handleAddFromLibrary(libOrn)}
                                className="
                                    group relative cursor-pointer 
                                    bg-white/40 hover:bg-white/90 
                                    border border-darkprimary 
                                    rounded-2xl p-2 
                                    transition-all duration-300 
                                    shadow-sm hover:shadow-lg hover:-translate-y-1
                                    backdrop-blur-sm
                                "
                            >
                                {/* Image Container */}
                                <div 
                                    className="bg-gray-50/40 rounded-xl p-2 mb-2 flex items-center justify-center h-24 overflow-hidden relative border border-gray-100/50"
                                    style={{
                                        backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                                        backgroundSize: '8px 8px'
                                    }}
                                >
                                    <Image
                                        src={libOrn.ornament_image}
                                        alt={libOrn.ornament_name}
                                        width={80}
                                        height={80}
                                        className="object-contain max-h-full z-10 drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                                        unoptimized
                                    />
                                </div>
                                
                                {/* Footer Info */}
                                <div className="flex items-center justify-between px-1">
                                    <p className="text-[10px] font-bold text-gray-600 truncate max-w-[80%] group-hover:text-purple-700 transition-colors">
                                        {libOrn.ornament_name}
                                    </p>
                                    <div className="opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                                        <div className="bg-purple-100/80 text-purple-600 rounded-full p-0.5 shadow-sm">
                                            <Plus className="w-3 h-3" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {libraryOrnaments.length === 0 && (
                            <div className="col-span-2 py-12 text-center border-2 border-dashed border-gray-300/50 rounded-2xl bg-white/10 backdrop-blur-sm">
                                <Sparkles className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-xs text-gray-400 font-medium">No ornaments found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- 3. MAIN EDITOR CANVAS --- */}
            {/* Mobile: pt-0 (Header is fixed above), Desktop: pt-0 (Sidebar left) */}
            <div className={`theme-${legacyTheme?.id?.split('-')[0] || 'original'} flex-1 h-full relative overflow-hidden bg-gray-100 flex items-center justify-center`}>
                
                {/* Background Desktop */}
                <div className="theme-desktop-bg fixed inset-0 z-0 opacity-50"></div>

                {/* Helper Text (Desktop Only) */}
                <div className="absolute bottom-8 left-8 hidden lg:flex flex-col gap-2 z-20 opacity-60">
                    <p className="text-xs font-medium text-gray-500">Last edited: {new Date().toLocaleTimeString()}</p>
                    <div className="text-[10px] text-gray-400">ID: {themeId}</div>
                </div>

                {/* --- PHONE FRAME WRAPPER --- */}
                {/* Mobile: w-full h-full (No margins). Desktop: Max Width & Margins */}
                <div className="relative z-10 w-full h-full lg:max-w-[480px] lg:h-[calc(100vh-1rem)] bg-white lg:shadow-2xl overflow-hidden flex flex-col lg:rounded-[35px]  transition-all duration-300">
                    
                    {/* SCROLL CONTENT */}
                    <div className="mobile-scroll-content absolute inset-0 overflow-y-auto overflow-x-hidden scroll-smooth lg:rounded-[25px] lg:pt-0">
                        
                        {/* 1. Fullscreen Section */}
                        <div id="fullscreen-image" className="relative overflow-hidden flex items-center justify-center min-h-screen bg-gray-100">
                            <FullScreenImage
                                src={legacyTheme?.images.hero || '/images/Wedding1.png'}
                                alt="Preview Full Screen"
                                clientSlug="preview"
                                themeId={themeId}
                                weddingImage={sampleContent.couple_info.weddingImage}
                                hideOverlay={true}
                            />
                            {localOrnaments.filter(o => o.section === 'fullscreen-image').map(ornament => (
                                <EditableOrnament
                                    key={ornament.id}
                                    ornament={ornament}
                                    isEditMode={true}
                                    isSelected={selectedOrnamentId === ornament.id}
                                    containerWidth={480}
                                    containerHeight={800}
                                    onSelect={() => setSelectedOrnamentId(ornament.id)}
                                    onUpdate={handleOrnamentUpdate}
                                    onDelete={() => handleOrnamentDelete(ornament.id)}
                                />
                            ))}
                        </div>

                        {/* 2. Kutipan Section */}
                        <div id="kutipan-ayat" className="relative overflow-hidden">
                            <KutipanAyat
                                quote={sampleContent.kutipan_ayat.ayat}
                                source={sampleContent.kutipan_ayat.sumber}
                                themeId={themeId}
                            />
                            {localOrnaments.filter(o => o.section === 'kutipan-ayat').map(ornament => (
                                <EditableOrnament
                                    key={ornament.id}
                                    ornament={ornament}
                                    isEditMode={true}
                                    isSelected={selectedOrnamentId === ornament.id}
                                    containerWidth={480}
                                    containerHeight={600}
                                    onSelect={() => setSelectedOrnamentId(ornament.id)}
                                    onUpdate={handleOrnamentUpdate}
                                    onDelete={() => handleOrnamentDelete(ornament.id)}
                                />
                            ))}
                        </div>

                        {/* 3. Welcome Section */}
                        <div id="welcome" className="relative overflow-hidden">
                            <Welcome
                                ref={welcomeRef}
                                coupleInfo={sampleContent.couple_info}
                                clientSlug="preview"
                                themeId={themeId}
                            />
                            {localOrnaments.filter(o => o.section === 'welcome').map(ornament => (
                                <EditableOrnament
                                    key={ornament.id}
                                    ornament={ornament}
                                    isEditMode={true}
                                    isSelected={selectedOrnamentId === ornament.id}
                                    containerWidth={welcomeWidth || 480}
                                    containerHeight={welcomeHeight || 800}
                                    onSelect={() => setSelectedOrnamentId(ornament.id)}
                                    onUpdate={handleOrnamentUpdate}
                                    onDelete={() => handleOrnamentDelete(ornament.id)}
                                />
                            ))}
                        </div>

                        {/* 4. Love Story Section */}
                        <div id="love-story" className="relative overflow-hidden">
                            <div className="relative h-max bg-primary">
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={unifiedTheme?.backgrounds.timeline || legacyTheme?.images.background || '/images/Wedding2.png'}
                                        alt="Timeline Background"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="relative z-10">
                                    <Timeline
                                        clientSlug="preview"
                                        themeId={themeId}
                                        loveStoryData={sampleContent.love_story}
                                    />
                                </div>
                            </div>
                            {localOrnaments.filter(o => o.section === 'love-story').map(ornament => (
                                <EditableOrnament
                                    key={ornament.id}
                                    ornament={ornament}
                                    isEditMode={true}
                                    isSelected={selectedOrnamentId === ornament.id}
                                    containerWidth={480}
                                    containerHeight={1000}
                                    onSelect={() => setSelectedOrnamentId(ornament.id)}
                                    onUpdate={handleOrnamentUpdate}
                                    onDelete={() => handleOrnamentDelete(ornament.id)}
                                />
                            ))}
                        </div>

                        {/* 5. Wedding Event Section */}
                        <div id="wedding-event" className="relative overflow-hidden">
                            <WeddingEvent
                                clientSlug="preview"
                                themeId={themeId}
                                akadInfo={sampleContent.akad_info}
                                resepsiInfo={sampleContent.resepsi_info}
                            />
                            {localOrnaments.filter(o => o.section === 'wedding-event').map(ornament => (
                                <EditableOrnament
                                    key={ornament.id}
                                    ornament={ornament}
                                    isEditMode={true}
                                    isSelected={selectedOrnamentId === ornament.id}
                                    containerWidth={480}
                                    containerHeight={800}
                                    onSelect={() => setSelectedOrnamentId(ornament.id)}
                                    onUpdate={handleOrnamentUpdate}
                                    onDelete={() => handleOrnamentDelete(ornament.id)}
                                />
                            ))}
                        </div>

                        {/* 6. Wedding Gift Section */}
                        <div id="wedding-gift" className="relative overflow-hidden">
                            <WeddingGift clientSlug="preview" themeId={themeId} />
                            {localOrnaments.filter(o => o.section === 'wedding-gift').map(ornament => (
                                <EditableOrnament
                                    key={ornament.id}
                                    ornament={ornament}
                                    isEditMode={true}
                                    isSelected={selectedOrnamentId === ornament.id}
                                    containerWidth={480}
                                    containerHeight={600}
                                    onSelect={() => setSelectedOrnamentId(ornament.id)}
                                    onUpdate={handleOrnamentUpdate}
                                    onDelete={() => handleOrnamentDelete(ornament.id)}
                                />
                            ))}
                        </div>

                        {/* 7. Gallery Section */}
                        <div id="gallery" className="relative overflow-hidden">
                            <OurGallery
                                clientSlug="preview"
                                themeId={themeId}
                                galleryPhotos={sampleGalleryPhotos}
                                youtubeUrl=""
                            />
                            {localOrnaments.filter(o => o.section === 'gallery').map(ornament => (
                                <EditableOrnament
                                    key={ornament.id}
                                    ornament={ornament}
                                    isEditMode={true}
                                    isSelected={selectedOrnamentId === ornament.id}
                                    containerWidth={480}
                                    containerHeight={800}
                                    onSelect={() => setSelectedOrnamentId(ornament.id)}
                                    onUpdate={handleOrnamentUpdate}
                                    onDelete={() => handleOrnamentDelete(ornament.id)}
                                />
                            ))}
                        </div>

                        {/* 8. RSVP Section */}
                        <div id="rsvp" className="relative overflow-hidden">
                            <RSVPForm clientSlug="preview" themeId={themeId} />
                            {localOrnaments.filter(o => o.section === 'rsvp').map(ornament => (
                                <EditableOrnament
                                    key={ornament.id}
                                    ornament={ornament}
                                    isEditMode={true}
                                    isSelected={selectedOrnamentId === ornament.id}
                                    containerWidth={480}
                                    containerHeight={600}
                                    onSelect={() => setSelectedOrnamentId(ornament.id)}
                                    onUpdate={handleOrnamentUpdate}
                                    onDelete={() => handleOrnamentDelete(ornament.id)}
                                />
                            ))}
                        </div>

                        {/* 9. Guestbook Section */}
                        <div id="guestbook" className="relative overflow-hidden">
                            <GuestBookList clientSlug="preview" themeId={themeId} />
                            {localOrnaments.filter(o => o.section === 'guestbook').map(ornament => (
                                <EditableOrnament
                                    key={ornament.id}
                                    ornament={ornament}
                                    isEditMode={true}
                                    isSelected={selectedOrnamentId === ornament.id}
                                    containerWidth={480}
                                    containerHeight={600}
                                    onSelect={() => setSelectedOrnamentId(ornament.id)}
                                    onUpdate={handleOrnamentUpdate}
                                    onDelete={() => handleOrnamentDelete(ornament.id)}
                                />
                            ))}
                        </div>

                        {/* 10. Thank You Section */}
                        <div id="thankyou" className="relative overflow-hidden">
                            <ThankYouMessage clientSlug="preview" themeId={themeId} />
                            {localOrnaments.filter(o => o.section === 'thankyou').map(ornament => (
                                <EditableOrnament
                                    key={ornament.id}
                                    ornament={ornament}
                                    isEditMode={true}
                                    isSelected={selectedOrnamentId === ornament.id}
                                    containerWidth={480}
                                    containerHeight={400}
                                    onSelect={() => setSelectedOrnamentId(ornament.id)}
                                    onUpdate={handleOrnamentUpdate}
                                    onDelete={() => handleOrnamentDelete(ornament.id)}
                                />
                            ))}
                        </div>

                        {/* 11. Footer Section */}
                        <div id="footer" className="relative overflow-hidden">
                            <Footer clientSlug="preview" themeId={themeId} />
                            {localOrnaments.filter(o => o.section === 'footer').map(ornament => (
                                <EditableOrnament
                                    key={ornament.id}
                                    ornament={ornament}
                                    isEditMode={true}
                                    isSelected={selectedOrnamentId === ornament.id}
                                    containerWidth={480}
                                    containerHeight={300}
                                    onSelect={() => setSelectedOrnamentId(ornament.id)}
                                    onUpdate={handleOrnamentUpdate}
                                    onDelete={() => handleOrnamentDelete(ornament.id)}
                                />
                            ))}
                        </div>


                    </div>

                    {/* --- NAVBAR (Floating) --- */}
                    <div className="absolute bottom-2 left-0 right-0 z-50 flex justify-center pointer-events-none">
                        <div className="pointer-events-auto">
                            <Navbar componentSettings={sampleComponentSettings} />
                        </div>
                    </div>

                    {/* Musik */}
                    <MusicCircle
                        clientSlug="preview"
                        weddingImage={sampleContent.couple_info.weddingImage}
                    />

                </div>
            </div>
        </div>
      </ThemeProvider>
    </MusicProvider>
  );
}