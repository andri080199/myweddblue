'use client';

import { useState, useEffect } from 'react';
import { Palette, ImageIcon, Trash2, RefreshCw, Edit, AlertCircle, Sparkles, Plus, Eye, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { colorThemes as builtinColorThemes } from '@/themes/colorThemes';
import { backgroundThemes as builtinBackgroundThemes } from '@/themes/backgroundThemes';


// --- INTERFACES ---
interface ColorTheme {
  themeId: string;
  themeName: string;
  description: string;
  colors: {
    primary: string;
    primarylight: string;
    darkprimary: string;
    textprimary: string;
    gold: string;
    lightblue: string;
    secondary: string;
    accent: string;
  };
  customStyles?: any;
  isCustom: boolean;
}

interface BackgroundTheme {
  themeId: string;
  themeName: string;
  description: string;
  backgrounds?: { [sectionId: string]: string };
  thumbnail?: string;
  isCustom: boolean;

}

const BUILTIN_COLOR_THEMES = [
  { id: 'original', name: 'Original Blue', description: 'Biru laut elegant klasik' },
  { id: 'romantic', name: 'Romantic Rose', description: 'Pink romantis lembut' },
  { id: 'sunset', name: 'Sunset Orange', description: 'Orange hangat senja' },
  { id: 'city', name: 'City Modern', description: 'Biru modern metropolitan' },
  { id: 'classic', name: 'Classic Beige', description: 'Coklat krem elegant' },
  { id: 'coral', name: 'Coral Fresh', description: 'Merah coral segar' },
  { id: 'emerald', name: 'Emerald Green', description: 'Hijau zamrud natural' },
  { id: 'lavender', name: 'Lavender Purple', description: 'Ungu lavender tenang' },
  { id: 'modern', name: 'Modern Gray', description: 'Abu-abu minimalis' },
  { id: 'sapphire', name: 'Sapphire Blue', description: 'Biru safir mewah' },
  { id: 'vintage', name: 'Vintage Brown', description: 'Coklat vintage retro' },
];

const BUILTIN_BACKGROUND_THEMES = [
  { id: 'original', name: 'Original', description: 'Background bawaan sistem' },
  { id: 'city', name: 'City Modern', description: 'Cityscape urban modern' },
  { id: 'flora', name: 'Flora Garden', description: 'Bunga & taman natural' },
  { id: 'tropical', name: 'Tropical Paradise', description: 'Pantai tropis eksotis' },
];

export default function ThemeManagementPage() {
  const [activeTab, setActiveTab] = useState<'colors' | 'backgrounds'>('colors');
  const [colorThemes, setColorThemes] = useState<ColorTheme[]>([]);
  const [backgroundThemes, setBackgroundThemes] = useState<BackgroundTheme[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'color' | 'background', id: string } | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<ColorTheme | BackgroundTheme | null>(null);

  // Fetch all themes
  const fetchThemes = async () => {
    setLoading(true);
    try {
      // Fetch custom color themes
      const colorRes = await fetch('/api/custom-color-themes');
      const colorData = await colorRes.json();

      const customColorThemes: ColorTheme[] = colorData.success
        ? colorData.themes.map((t: any) => ({
          themeId: t.themeId,
          themeName: t.themeName,
          description: t.description || 'Custom color theme',
          colors: t.colors,
          customStyles: t.customStyles,
          isCustom: true,
        }))
        : [];

      // Merge built-in + custom color themes
      const allColorThemes: ColorTheme[] = [
        ...BUILTIN_COLOR_THEMES.map(t => ({
          themeId: t.id,
          themeName: t.name,
          description: t.description,
          colors: builtinColorThemes[t.id] ? builtinColorThemes[t.id].colors : {
            primary: '#3295c5',
            primarylight: '#5db3d9',
            darkprimary: '#2a7ca8',
            textprimary: '#1a4d6b',
            gold: '#f59e0b',
            lightblue: '#dbeafe',
            secondary: '#06b6d4',
            accent: '#0284c7',
          },
          isCustom: false,
        })),
        ...customColorThemes,
      ];
      setColorThemes(allColorThemes);

      // Fetch custom background themes (without backgrounds data for performance)
      const bgRes = await fetch('/api/custom-background-themes?includeBackgrounds=false');
      const bgData = await bgRes.json();

      const customBgThemes: BackgroundTheme[] = bgData.success
        ? bgData.themes.map((t: any) => ({
          themeId: t.themeId,
          themeName: t.themeName,
          description: t.description || 'Custom background theme',
          thumbnail: t.thumbnail,
          isCustom: true,

        }))
        : [];

      // Merge built-in + custom background themes
      const allBgThemes: BackgroundTheme[] = [
        ...BUILTIN_BACKGROUND_THEMES.map(t => ({
          themeId: t.id,
          themeName: t.name,
          description: t.description,
          thumbnail: builtinBackgroundThemes[t.id]?.images?.hero,
          isCustom: false,

        })),
        ...customBgThemes,
      ];
      setBackgroundThemes(allBgThemes);

    } catch (error) {
      console.error('Error fetching themes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  // Delete handlers
  const handleDeleteClick = (type: 'color' | 'background', id: string) => {
    setDeleteTarget({ type, id });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const endpoint = deleteTarget.type === 'color'
        ? '/api/custom-color-themes'
        : '/api/custom-background-themes';

      const res = await fetch(`${endpoint}?themeId=${deleteTarget.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        fetchThemes();
        setShowDeleteModal(false);
        setDeleteTarget(null);
      } else {
        alert(`Gagal hapus: ${data.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Terjadi error saat menghapus tema');
    }
  };

  // Preview handlers
  const handlePreview = async (theme: ColorTheme | BackgroundTheme, type: 'color' | 'background') => {
    if (type === 'background' && theme.isCustom && !('backgrounds' in theme && theme.backgrounds)) {
      // Fetch full background data for preview
      const res = await fetch(`/api/custom-background-themes?themeId=${theme.themeId}&includeBackgrounds=true`);
      const data = await res.json();
      if (data.success && data.theme) {
        setPreviewTheme({ ...theme, backgrounds: data.theme.backgrounds });
      }
    } else {
      setPreviewTheme(theme);
    }
    setShowPreviewModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F2854]">

      {/* Premium Hero Section */}
      <div className="relative bg-[#0F2854] pt-8 pb-32 overflow-hidden">
        {/* Abstract Background Mesh */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#1C4D8D] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#4988C4] rounded-full mix-blend-screen filter blur-[100px] opacity-40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4D8D]/30 border border-[#4988C4]/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#BDE8F5]" />
              <span className="text-xs font-semibold text-[#BDE8F5] tracking-wider uppercase">Theme Studio</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Kelola <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4988C4] to-[#BDE8F5]">Tema Custom</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl font-light leading-relaxed">
              Lihat, edit, dan hapus tema warna & background yang sudah kamu buat
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/create-theme"
              className="group flex items-center gap-2 px-6 py-3 bg-[#BDE8F5] text-[#0F2854] rounded-xl font-bold shadow-[0_0_20px_rgba(28,77,141,0.3)] hover:shadow-[0_0_30px_rgba(28,77,141,0.5)] transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Buat Tema Baru
            </Link>
            <button
              onClick={fetchThemes}
              className="p-3 bg-[#1C4D8D]/30 border border-[#4988C4]/30 rounded-xl text-[#BDE8F5] hover:bg-[#1C4D8D]/50 transition-colors backdrop-blur-sm"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Floating Card Effect */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-20">

        {/* Tab Navigation */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-[#0F2854]/5 p-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('colors')}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'colors'
                ? 'bg-[#1C4D8D] text-white shadow-lg shadow-[#1C4D8D]/30'
                : 'text-slate-600 hover:bg-[#F8FAFC]'
                }`}
            >
              <Palette className="w-5 h-5" />
              Color Themes ({colorThemes.filter(t => t.isCustom).length} Custom)
            </button>
            <button
              onClick={() => setActiveTab('backgrounds')}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${activeTab === 'backgrounds'
                ? 'bg-[#1C4D8D] text-white shadow-lg shadow-[#1C4D8D]/30'
                : 'text-slate-600 hover:bg-[#F8FAFC]'
                }`}
            >
              <ImageIcon className="w-5 h-5" />
              Background Themes ({backgroundThemes.filter(t => t.isCustom).length} Custom)
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-[#0F2854]/5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-[#BDE8F5] rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#1C4D8D] rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-[#1C4D8D] font-medium tracking-wide animate-pulse">Loading themes...</p>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl shadow-[#0F2854]/5 p-8">

            {/* Color Themes Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#0F2854] mb-2">Color Themes</h2>
                  <p className="text-slate-600">Kelola tema warna untuk undangan (built-in read-only, custom editable)</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

                  {colorThemes.map((theme) => (
                    <div
                      key={theme.themeId}
                      className={`relative group bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${theme.isCustom
                        ? 'border-[#4988C4]/30 hover:border-[#4988C4] hover:shadow-xl hover:shadow-[#1C4D8D]/10'
                        : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      {/* Color Preview */}
                      <div
                        className="h-24 relative"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primarylight} 50%, ${theme.colors.darkprimary} 100%)`
                        }}
                      >
                        {theme.isCustom && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                            <Sparkles className="w-3 h-3 text-[#1C4D8D]" />
                            <span className="text-[10px] font-bold text-[#1C4D8D] uppercase tracking-wide">Custom</span>
                          </div>
                        )}
                        {!theme.isCustom && (
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">Built-in</span>
                          </div>
                        )}
                      </div>

                      {/* Theme Info */}
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-bold text-[#0F2854] text-sm leading-tight">{theme.themeName}</h3>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{theme.description}</p>
                          </div>
                        </div>

                        {/* Color Swatches */}
                        <div className="flex gap-1 mb-3">
                          {Object.values(theme.colors).slice(0, 5).map((color, i) => (
                            <div
                              key={i}
                              className="w-4 h-4 rounded-full border border-white shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => handlePreview(theme, 'color')}
                            className="flex-1 py-1.5 px-2 bg-[#F8FAFC] hover:bg-[#BDE8F5]/30 border border-slate-200 hover:border-[#4988C4]/50 rounded text-[#1C4D8D] transition-colors flex items-center justify-center"
                            title="Preview Theme"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {theme.isCustom ? (
                            <>
                              <Link
                                href={`/admin/create-color-theme?edit=${theme.themeId}`}
                                className="flex-1 py-1.5 px-2 bg-[#1C4D8D] hover:bg-[#0F2854] text-white rounded transition-colors flex items-center justify-center"
                                title="Edit Theme"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteClick('color', theme.themeId)}
                                className="py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors flex items-center justify-center"
                                title="Delete Theme"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <div className="flex-1 py-1.5 px-2 bg-slate-50 text-slate-300 rounded flex items-center justify-center cursor-not-allowed" title="Read-only">
                              <Edit className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {colorThemes.filter(t => t.isCustom).length === 0 && (
                  <div className="text-center py-12">
                    <Palette className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 mb-4">Belum ada custom color theme</p>
                    <Link
                      href="/admin/create-color-theme"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C4D8D] text-white rounded-xl font-bold hover:bg-[#0F2854] transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Buat Color Theme
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Background Themes Tab */}
            {activeTab === 'backgrounds' && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-[#0F2854] mb-2">Background Themes</h2>
                  <p className="text-slate-600">Kelola tema background untuk setiap section (built-in read-only, custom editable)</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">


                  {backgroundThemes.map((theme) => (
                    <div
                      key={theme.themeId}
                      className={`relative group bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${theme.isCustom
                        ? 'border-[#4988C4]/30 hover:border-[#4988C4] hover:shadow-xl hover:shadow-[#1C4D8D]/10'
                        : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      {/* Background Preview */}
                      <div className="h-24 bg-slate-100 relative items-center justify-center overflow-hidden">
                        {theme.thumbnail ? (
                          <Image
                            src={theme.thumbnail}
                            alt={theme.themeName}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                          </div>
                        )}

                        {/* Overlay Gradient for Text readability if needed, or just status badge */}
                        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {theme.isCustom && (
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm z-10">
                            <Sparkles className="w-2.5 h-2.5 text-[#1C4D8D]" />
                          </div>
                        )}
                        {!theme.isCustom && (
                          <div className="absolute top-2 right-2 bg-slate-800/80 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm z-10">
                            <span className="text-[8px] font-bold text-white uppercase tracking-wider">Built-in</span>
                          </div>
                        )}
                      </div>

                      {/* Theme Info */}
                      <div className="p-3">
                        <h3 className="font-bold text-[#0F2854] text-sm mb-0.5 leading-tight">{theme.themeName}</h3>
                        <p className="text-[10px] text-slate-500 mb-3 line-clamp-1">{theme.description}</p>

                        {theme.isCustom && theme.backgrounds && (
                          <p className="text-[10px] text-[#1C4D8D] font-semibold mb-3">
                            {Object.keys(theme.backgrounds).length} / 11 sections
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex gap-1">
                          <button
                            onClick={() => handlePreview(theme, 'background')}
                            className="flex-1 py-1.5 px-2 bg-[#F8FAFC] hover:bg-[#BDE8F5]/30 border border-slate-200 hover:border-[#4988C4]/50 rounded text-[#1C4D8D] transition-colors flex items-center justify-center"
                            title="Preview Theme"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {theme.isCustom ? (
                            <>
                              <Link
                                href={`/admin/create-background-theme?edit=${theme.themeId}`}
                                className="flex-1 py-1.5 px-2 bg-[#1C4D8D] hover:bg-[#0F2854] text-white rounded transition-colors flex items-center justify-center"
                                title="Edit Theme"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => handleDeleteClick('background', theme.themeId)}
                                className="py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors flex items-center justify-center"
                                title="Delete Theme"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          ) : (
                            <div className="flex-1 py-1.5 px-2 bg-slate-50 text-slate-300 rounded flex items-center justify-center cursor-not-allowed" title="Read-only">
                              <Edit className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {backgroundThemes.filter(t => t.isCustom).length === 0 && (
                  <div className="text-center py-12">
                    <ImageIcon className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 mb-4">Belum ada custom background theme</p>
                    <Link
                      href="/admin/create-background-theme"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C4D8D] text-white rounded-xl font-bold hover:bg-[#0F2854] transition-all"
                    >
                      <Plus className="w-5 h-5" />
                      Buat Background Theme
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2854]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/20">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2854]">Hapus Tema?</h3>
              <p className="text-slate-500 mt-2 mb-6 text-sm">
                Tema <strong>{deleteTarget.type === 'color' ? 'warna' : 'background'}</strong> ini akan dihapus permanen. Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold shadow-lg shadow-red-200 transition-all hover:scale-[1.02]"
                >
                  Hapus Permanen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2854]/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-3xl w-full shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#0F2854]">{previewTheme.themeName}</h3>
                <p className="text-slate-500 text-sm">{previewTheme.description}</p>
              </div>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewTheme(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Color Theme Preview */}
            {'colors' in previewTheme && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {Object.entries(previewTheme.colors).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div
                        className="w-full h-20 rounded-lg mb-2 shadow-md"
                        style={{ backgroundColor: value }}
                      />
                      <p className="text-xs font-medium text-slate-600 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">{value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">Gradient Preview</p>
                  <div
                    className="h-24 rounded-lg shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${previewTheme.colors.primary} 0%, ${previewTheme.colors.primarylight} 100%)`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Background Theme Preview */}
            {'backgrounds' in previewTheme && previewTheme.backgrounds && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(previewTheme.backgrounds).map(([sectionId, bgUrl]) => (
                  <div key={sectionId} className="space-y-2">
                    <div className="relative aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden">
                      <Image
                        src={bgUrl}
                        alt={sectionId}
                        fill
                        className="object-cover"
                        unoptimized={bgUrl.startsWith('data:')}
                      />
                    </div>
                    <p className="text-xs font-medium text-slate-600 text-center capitalize">{sectionId}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
