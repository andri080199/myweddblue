'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Palette,
  Image as ImageIcon,
  Save,
  RefreshCw,
  Upload,
  Copy,
  Trash2,
  Sparkles,
  Settings,
  Eye
} from 'lucide-react';
import { compressImage, formatFileSize } from '@/utils/imageCompression';

// Color presets
const COLOR_PRESETS = [
  {
    id: 'blue',
    name: 'Ocean Blue',
    colors: {
      primary: '#3295c5',
      primarylight: '#5db3d9',
      darkprimary: '#2a7ca8',
      textprimary: '#1a4d6b',
      gold: '#f59e0b',
      lightblue: '#dbeafe',
      secondary: '#06b6d4',
      accent: '#0284c7',
    },
  },
  {
    id: 'pink',
    name: 'Romantic Pink',
    colors: {
      primary: '#f472b6',
      primarylight: '#f9a8d4',
      darkprimary: '#ec4899',
      textprimary: '#831843',
      gold: '#fbbf24',
      lightblue: '#fce7f3',
      secondary: '#db2777',
      accent: '#be185d',
    },
  },
  {
    id: 'purple',
    name: 'Royal Purple',
    colors: {
      primary: '#a855f7',
      primarylight: '#c084fc',
      darkprimary: '#9333ea',
      textprimary: '#581c87',
      gold: '#f59e0b',
      lightblue: '#f3e8ff',
      secondary: '#7c3aed',
      accent: '#6b21a8',
    },
  },
  {
    id: 'green',
    name: 'Emerald Green',
    colors: {
      primary: '#10b981',
      primarylight: '#34d399',
      darkprimary: '#059669',
      textprimary: '#064e3b',
      gold: '#fbbf24',
      lightblue: '#d1fae5',
      secondary: '#14b8a6',
      accent: '#0d9488',
    },
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    colors: {
      primary: '#f97316',
      primarylight: '#fb923c',
      darkprimary: '#ea580c',
      textprimary: '#7c2d12',
      gold: '#fbbf24',
      lightblue: '#fed7aa',
      secondary: '#f59e0b',
      accent: '#d97706',
    },
  },
];

// Section backgrounds
const SECTION_BACKGROUNDS = [
  { id: 'fullscreen', name: 'Fullscreen / Hero', description: 'Gambar pembuka fullscreen' },
  { id: 'kutipan', name: 'Kutipan Ayat', description: 'Background section kutipan' },
  { id: 'welcome', name: 'Welcome / Mempelai', description: 'Background info mempelai' },
  { id: 'timeline', name: 'Timeline / Love Story', description: 'Background cerita cinta' },
  { id: 'event', name: 'Event / Acara', description: 'Background detail acara' },
  { id: 'gift', name: 'Gift / Hadiah', description: 'Background hadiah pernikahan' },
  { id: 'gallery', name: 'Gallery / Galeri', description: 'Background galeri foto' },
  { id: 'rsvp', name: 'RSVP', description: 'Background form RSVP' },
  { id: 'guestbook', name: 'Guestbook / Buku Tamu', description: 'Background buku tamu' },
  { id: 'thankyou', name: 'Thank You', description: 'Background ucapan terima kasih' },
  { id: 'footer', name: 'Footer', description: 'Background footer' },
];

export default function CreateUnifiedThemePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editThemeId = searchParams.get('edit');

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [themeId, setThemeId] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('custom');

  // Color states
  const [colors, setColors] = useState({
    primary: '#3295c5',
    primarylight: '#5db3d9',
    darkprimary: '#2a7ca8',
    textprimary: '#1a4d6b',
    gold: '#f59e0b',
    lightblue: '#dbeafe',
    secondary: '#06b6d4',
    accent: '#0284c7',
  });

  // Custom styles
  const [customStyles, setCustomStyles] = useState({
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    gradient: '', // Auto-generated from colors
  });

  // Backgrounds state
  const [backgrounds, setBackgrounds] = useState<Record<string, string>>({});
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

  // Load theme data if edit mode
  useEffect(() => {
    const loadThemeData = async () => {
      if (!editThemeId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/unified-themes?themeId=${editThemeId}`);
        const data = await response.json();

        if (data.success && data.theme) {
          setIsEditMode(true);
          setThemeName(data.theme.theme_name);
          setThemeId(data.theme.theme_id);
          setDescription(data.theme.description || '');
          setColors(data.theme.colors);
          setCustomStyles(data.theme.custom_styles || customStyles);
          setBackgrounds(data.theme.backgrounds || {});
          setSelectedPreset('custom');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
        alert('Gagal load tema');
      } finally {
        setLoading(false);
      }
    };

    loadThemeData();
  }, [editThemeId]);

  // Auto-generate theme ID from name
  const handleThemeNameChange = (name: string) => {
    setThemeName(name);
    if (!isEditMode) {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setThemeId(slug);
    }
  };

  // Apply color preset
  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    if (presetId !== 'custom') {
      const preset = COLOR_PRESETS.find(p => p.id === presetId);
      if (preset) {
        setColors(preset.colors);
      }
    }
  };

  // Update individual color
  const handleColorChange = (colorKey: string, value: string) => {
    setColors(prev => ({ ...prev, [colorKey]: value }));
    setSelectedPreset('custom');
  };

  // Handle file upload with compression
  const handleFileUpload = async (sectionId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar!');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('Ukuran file maksimal 15MB!');
      return;
    }

    setUploadingSection(sectionId);
    console.log(`🚀 [${sectionId}] Starting upload process...`);

    try {
      const compressedBase64 = await compressImage(file, {
        quality: 0.9,
        maxSizeMB: 10,
      });

      setBackgrounds(prev => ({
        ...prev,
        [sectionId]: compressedBase64,
      }));

      console.log(`💾 [${sectionId}] Background saved to state`);
      setUploadingSection(null);
    } catch (error) {
      console.error(`❌ [${sectionId}] ERROR during upload:`, error);
      alert(`Gagal upload gambar: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setUploadingSection(null);
    }
  };

  // Copy background from another section
  const handleCopyBackground = (fromSection: string, toSection: string) => {
    const sourceBg = backgrounds[fromSection];
    if (sourceBg) {
      setBackgrounds(prev => ({
        ...prev,
        [toSection]: sourceBg,
      }));
    }
  };

  // Remove background
  const handleRemoveBackground = (sectionId: string) => {
    setBackgrounds(prev => {
      const newBg = { ...prev };
      delete newBg[sectionId];
      return newBg;
    });
  };

  // Calculate upload progress
  const uploadProgress = () => {
    const uploaded = Object.keys(backgrounds).length;
    const total = SECTION_BACKGROUNDS.length;
    return { uploaded, total, percentage: (uploaded / total) * 100 };
  };

  // Auto-generate gradient from colors
  const autoGradient = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primarylight} 50%, ${colors.darkprimary} 100%)`;

  // Save theme
  const handleSave = async (redirectToOrnaments = false) => {
    if (!themeName.trim() || !themeId.trim()) {
      alert('Nama tema dan ID tema harus diisi!');
      return;
    }

    setLoading(true);
    try {
      // For PUT requests, include themeId in URL query params
      const url = isEditMode ? `/api/unified-themes?themeId=${themeId}` : '/api/unified-themes';
      const method = isEditMode ? 'PUT' : 'POST';

      // Auto-generate gradient if not set
      const finalCustomStyles = {
        ...customStyles,
        gradient: customStyles.gradient || autoGradient,
      };

      const payload: any = {
        theme_id: themeId,
        theme_name: themeName,
        description,
        colors,
        custom_styles: finalCustomStyles,
        backgrounds,
      };

      // Only include empty ornaments array for new themes (not for updates)
      if (!isEditMode) {
        payload.ornaments = { ornaments: [] };
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert(isEditMode ? 'Tema berhasil diupdate!' : 'Tema berhasil dibuat!');

        if (redirectToOrnaments) {
          router.push(`/admin/unified-themes/${themeId}/ornaments`);
        } else {
          router.push('/admin/theme-backgrounds');
        }
      } else {
        alert(`Gagal: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      alert('Terjadi error saat menyimpan tema');
    } finally {
      setLoading(false);
    }
  };

  const progress = uploadProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              {isEditMode ? 'Edit Unified Theme' : 'Create Unified Theme'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode
                ? 'Update complete wedding theme (colors + backgrounds + ornaments)'
                : 'Buat tema lengkap dengan warna, background, dan ornamen dalam satu paket'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">
              Backgrounds: {progress.uploaded} / {progress.total}
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {loading && !isEditMode ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Theme Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-600" />
                Theme Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Tema *
                  </label>
                  <input
                    type="text"
                    value={themeName}
                    onChange={(e) => handleThemeNameChange(e.target.value)}
                    placeholder="Contoh: Ocean Breeze Wedding"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme ID *
                  </label>
                  <input
                    type="text"
                    value={themeId}
                    onChange={(e) => setThemeId(e.target.value)}
                    placeholder="ocean-breeze-wedding"
                    disabled={isEditMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {isEditMode ? 'ID tidak bisa diubah' : 'Auto-generated dari nama tema'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tema pernikahan dengan nuansa pantai yang menenangkan..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Color Palette Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                Color Palette
              </h2>

              {/* Color Presets */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">Pilih preset atau custom colors:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetChange(preset.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedPreset === preset.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ background: `linear-gradient(135deg, ${preset.colors.primary}, ${preset.colors.primarylight})` }}
                        />
                        <span className="font-medium text-sm text-gray-800">{preset.name}</span>
                      </div>
                      <div className="flex gap-1">
                        {Object.values(preset.colors).slice(0, 8).map((color, i) => (
                          <div
                            key={i}
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={() => setSelectedPreset('custom')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedPreset === 'custom'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Palette className="w-6 h-6 text-purple-600" />
                      <span className="font-medium text-sm text-gray-800">Custom</span>
                    </div>
                    <p className="text-xs text-gray-500">Pilih warna manual</p>
                  </button>
                </div>
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(colors).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="w-14 h-10 rounded cursor-pointer border border-gray-300"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                        />
                      </div>
                    </div>
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 shadow-sm flex-shrink-0"
                      style={{ backgroundColor: value }}
                    />
                  </div>
                ))}
              </div>

              {/* Gradient Preview */}
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Gradient Preview</p>
                <div
                  className="h-20 rounded-lg shadow-md"
                  style={{ background: autoGradient }}
                />
              </div>
            </div>

            {/* Custom Styles Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Custom Styles</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Border Radius
                  </label>
                  <input
                    type="text"
                    value={customStyles.borderRadius}
                    onChange={(e) => setCustomStyles(prev => ({ ...prev, borderRadius: e.target.value }))}
                    placeholder="12px"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Box Shadow
                  </label>
                  <input
                    type="text"
                    value={customStyles.boxShadow}
                    onChange={(e) => setCustomStyles(prev => ({ ...prev, boxShadow: e.target.value }))}
                    placeholder="0 4px 6px rgba(0,0,0,0.1)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                Gradient akan auto-generated dari color palette
              </p>
            </div>

            {/* Background Upload Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                Section Backgrounds
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Upload background untuk setiap section. Rekomendasi: JPG/PNG, max 15MB per file.
              </p>

              <div className="space-y-4">
                {SECTION_BACKGROUNDS.map((section) => {
                  const hasBg = backgrounds[section.id];
                  const isUploading = uploadingSection === section.id;

                  return (
                    <div
                      key={section.id}
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Preview */}
                        <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
                          {hasBg ? (
                            <img
                              src={backgrounds[section.id]}
                              alt={section.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-gray-300" />
                            </div>
                          )}
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <RefreshCw className="w-8 h-8 text-white animate-spin" />
                            </div>
                          )}
                        </div>

                        {/* Info & Actions */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{section.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{section.description}</p>

                          <div className="flex gap-2 mt-3">
                            {/* Upload Button */}
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(section.id, file);
                                  }
                                }}
                                className="hidden"
                              />
                              <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium flex items-center gap-2">
                                <Upload className="w-4 h-4" />
                                {hasBg ? 'Replace' : 'Upload'}
                              </div>
                            </label>

                            {/* Copy Button */}
                            {hasBg && (
                              <button
                                onClick={() => {
                                  const otherSections = SECTION_BACKGROUNDS.filter(s => s.id !== section.id);
                                  const targetSection = prompt(
                                    `Copy ke section mana?\n\n${otherSections.map((s, i) => `${i + 1}. ${s.name}`).join('\n')}\n\nKetik nomor:`
                                  );
                                  if (targetSection) {
                                    const index = parseInt(targetSection) - 1;
                                    if (index >= 0 && index < otherSections.length) {
                                      handleCopyBackground(section.id, otherSections[index].id);
                                    }
                                  }
                                }}
                                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-2"
                              >
                                <Copy className="w-4 h-4" />
                                Copy
                              </button>
                            )}

                            {/* Remove Button */}
                            {hasBg && (
                              <button
                                onClick={() => handleRemoveBackground(section.id)}
                                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ornaments Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Ornaments
              </h2>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 mb-4">
                  Ornaments dapat ditambahkan setelah tema dibuat menggunakan editor drag & drop dengan live preview.
                </p>

                {isEditMode ? (
                  <button
                    onClick={() => router.push(`/admin/unified-themes/${themeId}/ornaments`)}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Edit Ornaments
                  </button>
                ) : (
                  <p className="text-sm text-gray-600 italic">
                    Tombol "Edit Ornaments Now" akan muncul setelah tema disimpan
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end sticky bottom-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-4 -mx-8 px-8">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>

              {isEditMode && themeId && (
                <button
                  onClick={() => window.open(`/undangan/preview/${themeId}`, '_blank')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 shadow-lg"
                  title="Preview Full Invitation"
                >
                  <Eye className="w-5 h-5" />
                  Preview Undangan
                </button>
              )}

              <button
                onClick={() => handleSave(false)}
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isEditMode ? 'Update Theme' : 'Create Theme'}
              </button>

              {!isEditMode && (
                <button
                  onClick={() => handleSave(true)}
                  disabled={loading}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                  Save & Edit Ornaments
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
