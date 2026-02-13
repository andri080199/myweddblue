'use client';

import { useState, useEffect } from 'react';
import { Palette, ImageIcon, Trash2, RefreshCw, Edit, AlertCircle, Sparkles, Plus, Eye, X, Layers } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { UnifiedThemeWithStats } from '@/types/unified-theme';

export default function UnifiedThemeManagementPage() {
  const [themes, setThemes] = useState<UnifiedThemeWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteThemeId, setDeleteThemeId] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<UnifiedThemeWithStats | null>(null);

  // Fetch all unified themes
  const fetchThemes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/unified-themes?includeOrnaments=true');
      const data = await res.json();

      if (data.success) {
        setThemes(data.themes || []);
      } else {
        console.error('Failed to fetch themes:', data.error);
      }
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
  const handleDeleteClick = (themeId: string) => {
    setDeleteThemeId(themeId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteThemeId) return;

    try {
      const res = await fetch(`/api/unified-themes?themeId=${deleteThemeId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        fetchThemes();
        setShowDeleteModal(false);
        setDeleteThemeId(null);
      } else {
        alert(`Gagal hapus: ${data.error || data.message}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Terjadi error saat menghapus tema');
    }
  };

  // Preview handler
  const handlePreview = (theme: UnifiedThemeWithStats) => {
    setPreviewTheme(theme);
    setShowPreviewModal(true);
  };

  // Get theme by ID for modal
  const getThemeById = (themeId: string) => {
    return themes.find(t => t.theme_id === themeId);
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
              <span className="text-xs font-semibold text-[#BDE8F5] tracking-wider uppercase">Unified Theme Studio</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Kelola <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4988C4] to-[#BDE8F5]">Tema Unified</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl font-light leading-relaxed">
              Satu tema lengkap: warna + background + ornamen dalam satu paket
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/ornament-library"
              className="group flex items-center gap-2 px-6 py-3 bg-white text-[#0F2854] rounded-xl font-bold border-2 border-[#1C4D8D]/20 hover:border-[#1C4D8D]/40 hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <Layers className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden md:inline">Ornament Library</span>
              <span className="md:hidden">Library</span>
            </Link>

            <Link
              href="/admin/create-unified-theme"
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

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#0F2854] mb-2">Unified Themes</h2>
              <p className="text-slate-600">
                Kelola tema lengkap (warna + background + ornamen). Built-in themes read-only, custom themes editable.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

              {themes.map((theme) => (
                <div
                  key={theme.theme_id}
                  className={`relative group bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                    theme.is_builtin
                      ? 'border-slate-200 hover:border-slate-300'
                      : 'border-[#4988C4]/30 hover:border-[#4988C4] hover:shadow-xl hover:shadow-[#1C4D8D]/10'
                  }`}
                >
                  {/* Color Gradient Preview */}
                  <div
                    className="h-24 relative"
                    style={{
                      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primarylight} 50%, ${theme.colors.darkprimary} 100%)`
                    }}
                  >
                    {theme.is_builtin ? (
                      <div className="absolute top-3 right-3 bg-slate-800/80 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wide">🔒 Built-in</span>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Sparkles className="w-3 h-3 text-[#1C4D8D]" />
                        <span className="text-[10px] font-bold text-[#1C4D8D] uppercase tracking-wide">Custom</span>
                      </div>
                    )}

                    {/* Background thumbnail overlay */}
                    {theme.backgrounds.fullscreen && (
                      <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden opacity-40">
                        <Image
                          src={theme.backgrounds.fullscreen}
                          alt="Background preview"
                          fill
                          className="object-cover"
                          sizes="200px"
                        />
                      </div>
                    )}
                  </div>

                  {/* Theme Info */}
                  <div className="p-3">
                    <div className="mb-2">
                      <h3 className="font-bold text-[#0F2854] text-sm leading-tight">{theme.theme_name}</h3>
                      <p className="text-[10px] text-slate-500 line-clamp-1">{theme.description}</p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-2 mb-3 text-[10px] text-slate-600">
                      <div className="flex items-center gap-1">
                        <Palette className="w-3 h-3" />
                        <span>{theme.stats?.color_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>{theme.stats?.background_count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>{theme.stats?.ornament_count || 0}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handlePreview(theme)}
                          className="flex-1 py-1.5 px-2 bg-[#F8FAFC] hover:bg-[#BDE8F5]/30 border border-slate-200 hover:border-[#4988C4]/50 rounded text-[#1C4D8D] transition-colors flex items-center justify-center gap-1"
                          title="Preview Theme"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold">Preview</span>
                        </button>

                        {!theme.is_builtin && (
                          <Link
                            href={`/admin/create-unified-theme?edit=${theme.theme_id}`}
                            className="flex-1 py-1.5 px-2 bg-[#1C4D8D] hover:bg-[#0F2854] text-white rounded transition-colors flex items-center justify-center gap-1"
                            title="Edit Theme"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-semibold">Edit</span>
                          </Link>
                        )}
                      </div>

                      <button
                        onClick={() => window.open(`/undangan/preview/${theme.theme_id}`, '_blank')}
                        className="w-full py-1.5 px-2 bg-green-600 hover:bg-green-700 text-white rounded transition-colors flex items-center justify-center gap-1"
                        title="Preview Full Invitation"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-semibold">Preview Undangan</span>
                      </button>

                      <Link
                        href={`/admin/unified-themes/${theme.theme_id}/preview-edit`}
                        className="w-full py-1.5 px-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded transition-all hover:shadow-lg flex items-center justify-center gap-1"
                        title="Edit Ornaments in Preview"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-semibold">Edit Ornaments di Preview</span>
                      </Link>

                      <div className="flex gap-1">
                        <Link
                          href={`/admin/unified-themes/${theme.theme_id}/ornaments`}
                          className="flex-1 py-1.5 px-2 bg-gradient-to-r from-[#4988C4] to-[#1C4D8D] text-white rounded transition-all hover:shadow-lg flex items-center justify-center gap-1"
                          title="Edit Ornaments (Canvas Editor)"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold">Canvas Editor</span>
                        </Link>

                        {!theme.is_builtin && (
                          <button
                            onClick={() => handleDeleteClick(theme.theme_id)}
                            className="py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors flex items-center justify-center"
                            title="Delete Theme"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {themes.length === 0 && (
              <div className="text-center py-12">
                <Palette className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 mb-4">Belum ada tema. Tema built-in akan muncul di sini.</p>
                <Link
                  href="/admin/create-unified-theme"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C4D8D] text-white rounded-xl font-bold hover:bg-[#0F2854] transition-all"
                >
                  <Plus className="w-5 h-5" />
                  Buat Unified Theme
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteThemeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F2854]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-white/20">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2854]">Hapus Tema?</h3>
              <p className="text-slate-500 mt-2 mb-6 text-sm">
                Tema <strong>{getThemeById(deleteThemeId)?.theme_name}</strong> akan dihapus permanen.
                Tindakan ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteThemeId(null);
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
          <div className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#0F2854]">{previewTheme.theme_name}</h3>
                <p className="text-slate-500 text-sm">{previewTheme.description}</p>
                {previewTheme.is_builtin && (
                  <span className="inline-block mt-2 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                    🔒 Built-in Theme
                  </span>
                )}
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

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <Palette className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-blue-900">{previewTheme.stats?.color_count || 0}</p>
                <p className="text-xs text-blue-600">Colors</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <ImageIcon className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold text-green-900">{previewTheme.stats?.background_count || 0}</p>
                <p className="text-xs text-green-600">Backgrounds</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <Sparkles className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-purple-900">{previewTheme.stats?.ornament_count || 0}</p>
                <p className="text-xs text-purple-600">Ornaments</p>
              </div>
            </div>

            {/* Color Preview */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-[#0F2854] mb-3">Color Palette</h4>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(previewTheme.colors).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div
                      className="w-full h-16 rounded-lg mb-2 shadow-md"
                      style={{ backgroundColor: value }}
                    />
                    <p className="text-xs font-medium text-slate-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Background Preview */}
            {Object.keys(previewTheme.backgrounds).length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-bold text-[#0F2854] mb-3">Backgrounds</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(previewTheme.backgrounds).map(([sectionId, bgUrl]) => (
                    bgUrl && (
                      <div key={sectionId} className="space-y-2">
                        <div className="relative aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden">
                          <Image
                            src={bgUrl}
                            alt={sectionId}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        </div>
                        <p className="text-xs font-medium text-slate-600 text-center capitalize">{sectionId}</p>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Gradient Preview */}
            <div>
              <h4 className="text-lg font-bold text-[#0F2854] mb-3">Gradient Preview</h4>
              <div
                className="h-24 rounded-xl shadow-md"
                style={{
                  background: previewTheme.custom_styles.gradient ||
                    `linear-gradient(135deg, ${previewTheme.colors.primary} 0%, ${previewTheme.colors.primarylight} 100%)`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
