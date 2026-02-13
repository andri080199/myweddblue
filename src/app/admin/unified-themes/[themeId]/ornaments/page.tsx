'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import EditableOrnament from '@/components/admin/EditableOrnament';
import AnimationControlPanel from '@/components/admin/AnimationControlPanel';
import { Ornament, SectionId, DEFAULT_ANIMATION_VALUES } from '@/types/ornament';
import { UnifiedTheme } from '@/types/unified-theme';
import { compressImage } from '@/utils/imageCompression';
import { ArrowLeft, Save, Upload, Eye, EyeOff, Palette, ImageIcon, Sparkles } from 'lucide-react';

export default function UnifiedThemeOrnamentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const themeId = params.themeId as string;

  const [theme, setTheme] = useState<UnifiedTheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(true);
  const [selectedOrnamentId, setSelectedOrnamentId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<SectionId>('fullscreen');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [localOrnaments, setLocalOrnaments] = useState<Ornament[]>([]);
  const [libraryOrnaments, setLibraryOrnaments] = useState<any[]>([]);
  const [showLibrary, setShowLibrary] = useState(true);
  const [libraryCategory, setLibraryCategory] = useState('all');

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch theme data
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/unified-themes?themeId=${themeId}`);
        const data = await response.json();

        if (data.success && data.theme) {
          setTheme(data.theme);
          setLocalOrnaments(data.theme.ornaments?.ornaments || []);
        } else {
          alert('Failed to load theme');
          router.push('/admin/theme-backgrounds');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        alert('Error loading theme');
        router.push('/admin/theme-backgrounds');
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, [themeId, router]);

  // Fetch ornament library
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const url = libraryCategory === 'all'
          ? '/api/ornament-library'
          : `/api/ornament-library?category=${libraryCategory}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
          setLibraryOrnaments(data.ornaments);
        }
      } catch (error) {
        console.error('Error loading ornament library:', error);
      }
    };

    fetchLibrary();
  }, [libraryCategory]);

  // Get ornaments for selected section
  const sectionOrnaments = localOrnaments.filter(o => o.section === selectedSection);

  // Handle ornament update
  const handleOrnamentUpdate = (updated: Ornament) => {
    setLocalOrnaments(prev => prev.map(o => o.id === updated.id ? updated : o));
  };

  // Handle ornament delete
  const handleOrnamentDelete = (id: string) => {
    setLocalOrnaments(prev => prev.filter(o => o.id !== id));
    if (selectedOrnamentId === id) {
      setSelectedOrnamentId(null);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      setSaving(true);

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
        alert('Ornaments saved successfully!');
      } else {
        alert(`Failed to save: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to save ornaments:', error);
      alert('Failed to save ornaments. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle image upload - also saves to library
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);

      // Compress image
      const compressed = await compressImage(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
        useWebWorker: true
      });

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Save to ornament library
        try {
          const libraryResponse = await fetch('/api/ornament-library', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ornament_name: file.name.replace(/\.[^/.]+$/, ''),
              ornament_image: base64Image,
              category: 'general'
            })
          });

          const libraryData = await libraryResponse.json();

          if (libraryData.success) {
            // Refresh library list
            const refreshResponse = await fetch('/api/ornament-library');
            const refreshData = await refreshResponse.json();
            if (refreshData.success) {
              setLibraryOrnaments(refreshData.ornaments);
            }
          }
        } catch (error) {
          console.error('Failed to save to library:', error);
          // Continue even if library save fails
        }

        // Create new ornament for theme
        const newOrnament: Ornament = {
          id: `orn-${Date.now()}`,
          section: selectedSection,
          name: file.name.replace(/\.[^/.]+$/, ''),
          image: base64Image,
          position: { top: '10%', left: '10%', right: null, bottom: null },
          transform: { scale: 1, rotate: 0 },
          style: { width: '150px', height: 'auto', opacity: 1, zIndex: 15 },
          isVisible: true,
          createdAt: new Date().toISOString()
        };

        setLocalOrnaments(prev => [...prev, newOrnament]);
        setSelectedOrnamentId(newOrnament.id);
      };

      reader.readAsDataURL(compressed);

    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle add ornament from library
  const handleAddFromLibrary = (libraryOrnament: any) => {
    const newOrnament: Ornament = {
      id: `orn-${Date.now()}`,
      section: selectedSection,
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
  };

  const selectedOrnament = localOrnaments.find(o => o.id === selectedOrnamentId);

  const sections: { id: SectionId; label: string }[] = [
    { id: 'fullscreen', label: 'Fullscreen' },
    { id: 'kutipan', label: 'Kutipan Ayat' },
    { id: 'welcome', label: 'Welcome' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'event', label: 'Event' },
    { id: 'gift', label: 'Gift' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'rsvp', label: 'RSVP' },
    { id: 'guestbook', label: 'Guestbook' },
    { id: 'thankyou', label: 'Thank You' },
    { id: 'footer', label: 'Footer' }
  ];

  // Get background for current section
  const getSectionBackground = () => {
    if (!theme) return null;
    const sectionBg = theme.backgrounds[selectedSection as keyof typeof theme.backgrounds];
    return sectionBg || theme.backgrounds.fullscreen || null;
  };

  const sectionBackground = getSectionBackground();

  if (loading || !theme) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading theme...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="bg-white border-b border-gray-200 px-6 py-4"
        style={{
          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primarylight} 100%)`
        }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/theme-backgrounds')}
              className="flex items-center gap-2 text-white/90 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Themes</span>
            </button>
            <div className="h-6 w-px bg-white/30" />
            <div className="text-white">
              <h1 className="text-xl font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                {theme.theme_name} - Ornament Editor
              </h1>
              <p className="text-sm text-white/80">{theme.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Stats */}
            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg text-white text-sm">
              <div className="flex items-center gap-1">
                <Palette className="w-4 h-4" />
                <span>{Object.keys(theme.colors).length}</span>
              </div>
              <div className="flex items-center gap-1">
                <ImageIcon className="w-4 h-4" />
                <span>{Object.keys(theme.backgrounds).length}</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                <span>{localOrnaments.length}</span>
              </div>
            </div>

            <button
              onClick={() => window.open(`/undangan/preview/${themeId}`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              title="Preview Full Invitation"
            >
              <Eye className="w-4 h-4" />
              <span>Preview Undangan</span>
            </button>

            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isEditMode
                  ? 'bg-white text-gray-900 hover:bg-white/90'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {isEditMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>{isEditMode ? 'Edit Mode' : 'Preview Mode'}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-white/90 disabled:opacity-50 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-89px)]">
        {/* Left Sidebar - Controls */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Section Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section
              </label>
              <select
                value={selectedSection}
                onChange={(e) => {
                  setSelectedSection(e.target.value as SectionId);
                  setSelectedOrnamentId(null);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                style={{ borderColor: theme.colors.primary }}
              >
                {sections.map(section => (
                  <option key={section.id} value={section.id}>
                    {section.label} ({localOrnaments.filter(o => o.section === section.id).length})
                  </option>
                ))}
              </select>
              {sectionBackground && (
                <p className="mt-1 text-xs text-gray-500">
                  ✓ Has background image
                </p>
              )}
            </div>

            {/* Upload Button */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-all"
                style={{ backgroundColor: theme.colors.primary }}
              >
                <Upload className="w-5 h-5" />
                <span>{uploadingImage ? 'Uploading...' : 'Upload New & Save to Library'}</span>
              </button>
              <p className="mt-1 text-xs text-gray-500 text-center">
                Uploads are auto-compressed to &lt; 500KB and saved to library
              </p>
            </div>

            {/* Ornament Library */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700">
                  Ornament Library ({libraryOrnaments.length})
                </h3>
                <button
                  onClick={() => setShowLibrary(!showLibrary)}
                  className="text-xs text-indigo-600 hover:text-indigo-700"
                >
                  {showLibrary ? 'Hide' : 'Show'}
                </button>
              </div>

              {showLibrary && (
                <>
                  <select
                    value={libraryCategory}
                    onChange={(e) => setLibraryCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg mb-3"
                  >
                    <option value="all">All Categories</option>
                    <option value="flowers">Flowers</option>
                    <option value="borders">Borders</option>
                    <option value="corners">Corners</option>
                    <option value="dividers">Dividers</option>
                    <option value="decorations">Decorations</option>
                    <option value="frames">Frames</option>
                    <option value="general">General</option>
                  </select>

                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {libraryOrnaments.map((libOrn) => (
                      <div
                        key={libOrn.id}
                        onClick={() => handleAddFromLibrary(libOrn)}
                        className="p-2 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                      >
                        <div className="bg-gray-100 rounded p-2 mb-1 flex items-center justify-center h-16">
                          <Image
                            src={libOrn.ornament_image}
                            alt={libOrn.ornament_name}
                            width={48}
                            height={48}
                            className="object-contain max-h-full"
                            unoptimized
                          />
                        </div>
                        <p className="text-xs font-medium text-gray-900 truncate group-hover:text-indigo-600" title={libOrn.ornament_name}>
                          {libOrn.ornament_name}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{libOrn.category}</p>
                      </div>
                    ))}
                    {libraryOrnaments.length === 0 && (
                      <p className="col-span-2 text-xs text-gray-500 text-center py-4">
                        No ornaments in library. Upload one to get started!
                      </p>
                    )}
                  </div>

                  <div className="mt-3">
                    <a
                      href="/admin/ornament-library"
                      target="_blank"
                      className="text-xs text-indigo-600 hover:text-indigo-700 underline"
                    >
                      Manage Ornament Library →
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Ornament List */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Ornaments in this section ({sectionOrnaments.length})
              </h3>
              <div className="space-y-2">
                {sectionOrnaments.map(ornament => (
                  <div
                    key={ornament.id}
                    onClick={() => setSelectedOrnamentId(ornament.id)}
                    className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedOrnamentId === ornament.id
                        ? 'bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      borderColor: selectedOrnamentId === ornament.id ? theme.colors.primary : undefined
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        <Image
                          src={ornament.image}
                          alt={ornament.name}
                          width={48}
                          height={48}
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {ornament.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Rotate: {ornament.transform.rotate}° | Scale: {ornament.transform.scale}x
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {sectionOrnaments.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No ornaments yet. Upload one to get started!
                  </p>
                )}
              </div>
            </div>

            {/* Selected Ornament Properties */}
            {selectedOrnament && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Properties
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={selectedOrnament.name}
                      onChange={(e) => handleOrnamentUpdate({
                        ...selectedOrnament,
                        name: e.target.value
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': theme.colors.primary } as React.CSSProperties}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Scale: {selectedOrnament.transform.scale}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={selectedOrnament.transform.scale}
                      onChange={(e) => handleOrnamentUpdate({
                        ...selectedOrnament,
                        transform: { ...selectedOrnament.transform, scale: parseFloat(e.target.value) }
                      })}
                      className="w-full"
                      style={{
                        accentColor: theme.colors.primary
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Opacity: {Math.round(selectedOrnament.style.opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={selectedOrnament.style.opacity}
                      onChange={(e) => handleOrnamentUpdate({
                        ...selectedOrnament,
                        style: { ...selectedOrnament.style, opacity: parseFloat(e.target.value) }
                      })}
                      className="w-full"
                      style={{
                        accentColor: theme.colors.primary
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Anchor Vertical</label>
                      <select
                        value={selectedOrnament.position.anchorY || 'top'}
                        onChange={(e) => handleOrnamentUpdate({
                          ...selectedOrnament,
                          position: {
                            ...selectedOrnament.position,
                            anchorY: e.target.value as 'top' | 'bottom'
                          }
                        })}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': theme.colors.primary } as React.CSSProperties}
                      >
                        <option value="top">⬆️ Top</option>
                        <option value="bottom">⬇️ Bottom</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Anchor Horizontal</label>
                      <select
                        value={selectedOrnament.position.anchorX || 'left'}
                        onChange={(e) => handleOrnamentUpdate({
                          ...selectedOrnament,
                          position: {
                            ...selectedOrnament.position,
                            anchorX: e.target.value as 'left' | 'right'
                          }
                        })}
                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': theme.colors.primary } as React.CSSProperties}
                      >
                        <option value="left">⬅️ Left</option>
                        <option value="right">➡️ Right</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Z-Index</label>
                    <input
                      type="number"
                      min="5"
                      max="20"
                      value={selectedOrnament.style.zIndex}
                      onChange={(e) => handleOrnamentUpdate({
                        ...selectedOrnament,
                        style: { ...selectedOrnament.style, zIndex: parseInt(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:border-transparent"
                      style={{ '--tw-ring-color': theme.colors.primary } as React.CSSProperties}
                    />
                  </div>

                  {/* Animation Controls */}
                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Pengaturan Animasi
                    </h4>
                    <AnimationControlPanel
                      animation={selectedOrnament.animation || DEFAULT_ANIMATION_VALUES}
                      onChange={(animation) => {
                        handleOrnamentUpdate({
                          ...selectedOrnament,
                          animation
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-100 overflow-auto">
          {/* Exact Invitation Container Match */}
          <div className="w-full min-h-screen bg-white md:max-w-[480px] md:mx-auto md:shadow-[0_0_50px_rgba(0,0,0,0.1)] lg:max-w-none lg:mx-0 lg:shadow-none">
            {/* Canvas Container with Overflow Visible */}
            <div className="relative" style={{ minHeight: '100vh' }}>
              <div
                ref={canvasRef}
                onClick={() => setSelectedOrnamentId(null)}
                className="relative bg-white"
                style={{
                  width: '100%',
                  minHeight: '600px',
                  backgroundImage: sectionBackground
                    ? `url(${sectionBackground})`
                    : 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                  backgroundSize: sectionBackground ? 'cover' : '20px 20px',
                  backgroundPosition: sectionBackground ? 'center' : '0 0, 0 10px, 10px -10px, -10px 0px',
                  overflow: 'visible', // Allow ornaments to go outside
                }}
              >
                {/* Section Preview Text */}
                <div
                  className="absolute top-4 left-4 px-3 py-1 rounded text-sm text-white font-medium z-[100]"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  {sections.find(s => s.id === selectedSection)?.label}
                </div>

                {/* Render Editable Ornaments */}
                {sectionOrnaments.map(ornament => (
                  <EditableOrnament
                    key={ornament.id}
                    ornament={ornament}
                    isEditMode={isEditMode}
                    isSelected={selectedOrnamentId === ornament.id}
                    containerWidth={canvasRef.current?.clientWidth || 480}
                    containerHeight={canvasRef.current?.clientHeight || 600}
                    onSelect={() => setSelectedOrnamentId(ornament.id)}
                    onUpdate={handleOrnamentUpdate}
                    onDelete={() => handleOrnamentDelete(ornament.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* View Size Indicator */}
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-xs text-gray-600">
                  Preview: <strong>Mobile (max 480px)</strong> on desktop
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-xs text-gray-500">
                Width: {canvasRef.current?.clientWidth || 0}px
              </span>
            </div>
          </div>

          {/* Help Text */}
          {isEditMode && (
            <div className="mt-4 mx-auto max-w-4xl">
              <div
                className="p-4 border rounded-lg"
                style={{
                  backgroundColor: `${theme.colors.lightblue}`,
                  borderColor: theme.colors.primary
                }}
              >
                <p className="text-sm" style={{ color: theme.colors.textprimary }}>
                  <strong>💡 Tips:</strong> Ornaments dapat keluar dari batas section untuk lebih fleksibel. Drag untuk pindah, gunakan corner handles untuk resize, dan tombol rotasi untuk memutar. Klik di luar untuk deselect.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
