"use client";

import { useState, useEffect } from 'react';
import {
  User, Check, Trash2, Plus, Users,
  Calendar, ChevronLeft, ChevronRight, Copy, Search,
  ExternalLink, Sparkles, ShieldCheck, Lock, Eye, EyeOff, Palette, ImageIcon, Layers
} from 'lucide-react';
import { ToastContainer } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { UnifiedThemeWithStats } from '@/types/unified-theme';
import Image from 'next/image';

interface Client {
  id: number;
  slug: string;
  unified_theme_id?: string;
  created_at: string;
}

// Loader component
const Loader = ({ className = "" }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function CreateClientPage() {
  // Basic form state
  const [slug, setSlug] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Unified theme selection
  const [selectedThemeId, setSelectedThemeId] = useState('original');
  const [themes, setThemes] = useState<UnifiedThemeWithStats[]>([]);
  const [loadingThemes, setLoadingThemes] = useState(true);

  // Client list state
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Delete modal
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    clientId?: number;
    clientSlug?: string;
    isLoading?: boolean;
  }>({ isOpen: false });

  // Get selected theme details
  const selectedTheme = themes.find(t => t.theme_id === selectedThemeId);

  // Get theme display info for client cards
  const getThemeDisplayInfo = (client: Client) => {
    const theme = themes.find(t => t.theme_id === client.unified_theme_id);

    if (!theme) {
      return {
        name: 'No Theme',
        gradient: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
        stats: { colors: 0, backgrounds: 0, ornaments: 0 }
      };
    }

    return {
      name: theme.theme_name,
      gradient: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primarylight} 50%, ${theme.colors.darkprimary} 100%)`,
      stats: {
        colors: theme.stats?.color_count || 0,
        backgrounds: theme.stats?.background_count || 0,
        ornaments: theme.stats?.ornament_count || 0
      },
      isBuiltin: theme.is_builtin
    };
  };

  // Initialize - fetch themes and clients
  useEffect(() => {
    fetchThemes();
    fetchClients();
  }, []);

  // Fetch unified themes
  const fetchThemes = async () => {
    try {
      setLoadingThemes(true);
      const response = await fetch('/api/unified-themes?includeOrnaments=true');
      const data = await response.json();

      if (data.success) {
        setThemes(data.themes || []);
      } else {
        console.error('Failed to fetch themes:', data.error);
        (window as any).toast?.showError('Error', 'Gagal load themes');
      }
    } catch (error) {
      console.error('Error fetching themes:', error);
      (window as any).toast?.showError('Error', 'Gagal load themes');
    } finally {
      setLoadingThemes(false);
    }
  };

  // Fetch clients
  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      const res = await fetch('/api/clients');
      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.error('Gagal mengambil data klien:', error);
    } finally {
      setLoadingClients(false);
    }
  };

  // Delete modal handlers
  const openDeleteModal = (clientId: number, clientSlug: string) => {
    setDeleteModal({ isOpen: true, clientId, clientSlug, isLoading: false });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false });
  };

  const handleDeleteClient = async () => {
    if (!deleteModal.clientId || !deleteModal.clientSlug) return;
    setDeleteModal(prev => ({ ...prev, isLoading: true }));
    try {
      const res = await fetch(`/api/clients?id=${deleteModal.clientId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        (window as any).toast?.showSuccess('Dihapus', `Klien "${deleteModal.clientSlug}" berhasil dihapus`);
        fetchClients();
        closeDeleteModal();
      } else {
        (window as any).toast?.showError('Gagal', data.message || 'Gagal menghapus data');
      }
    } catch (error) {
      (window as any).toast?.showError('Error', 'Terjadi kesalahan sistem');
    } finally {
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Copy dashboard URL
  const handleCopyDashboardUrl = async (clientSlug: string) => {
    const dashboardUrl = `${window.location.origin}/dashboard/${clientSlug}`;
    try {
      await navigator.clipboard.writeText(dashboardUrl);
      (window as any).toast?.showSuccess('Disalin!', 'URL Dashboard berhasil disalin');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = dashboardUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      (window as any).toast?.showSuccess('Disalin!', 'URL Dashboard berhasil disalin');
    }
  };

  // Pagination
  const filteredClients = clients.filter(client =>
    client.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  const goToPage = (page: number) => setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  // SUBMIT - UNIFIED THEME SYSTEM
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestBody = {
        slug,
        unifiedThemeId: selectedThemeId,
        password: password || 'client123'
      };

      const res = await fetch('/api/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (data.success) {
        if (data.wasModified) {
          (window as any).toast?.showSuccess(
            'Berhasil!',
            `Klien dibuat dengan slug "${data.slug}" (nama sudah ada, ditambahkan suffix unik)`
          );
        } else {
          (window as any).toast?.showSuccess('Berhasil!', `Klien "${data.slug}" telah dibuat`);
        }

        // Reset form
        setSlug('');
        setPassword('');
        setSelectedThemeId('original');
        fetchClients();
      } else {
        (window as any).toast?.showError('Gagal', data.message);
      }
    } catch (error) {
      (window as any).toast?.showError('Error', 'Gagal membuat klien baru');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-[#BDE8F5] selection:text-[#0F2854]">

      {/* HERO SECTION */}
      <div className="relative pt-8 bg-[#0F2854] pb-32 sm:pb-40 overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#1C4D8D]/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[#4988C4]/20 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4D8D]/30 border border-[#4988C4]/30 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#BDE8F5]" />
                <span className="text-[10px] font-bold text-[#BDE8F5] tracking-widest uppercase">Unified Theme System</span>
              </div>

              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Manajemen <span className="text-[#4988C4]">Klien</span>
                </h1>
                <p className="mt-4 text-lg text-[#BDE8F5]/80 font-light leading-relaxed max-w-xl">
                  Buat klien baru dengan tema lengkap: warna + background + ornamen dalam satu paket.
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center relative group">
              <div className="absolute inset-0 bg-[#4988C4] rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rotate-6"></div>
              <div className="relative w-28 h-28 rounded-3xl bg-gradient-to-br from-[#0F2854] to-[#1C4D8D] border border-[#4988C4]/30 shadow-2xl flex items-center justify-center transform -rotate-6 transition-transform group-hover:-rotate-3 duration-500">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 rounded-3xl"></div>
                <Users className="w-12 h-12 text-[#BDE8F5] drop-shadow-[0_0_15px_rgba(189,232,245,0.5)]" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-[#4988C4] rounded-xl flex items-center justify-center shadow-lg animate-bounce delay-700">
                   <Plus className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">

        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN: Create Form */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(28,77,141,0.15)] border border-[#1C4D8D]/10 backdrop-blur-sm overflow-hidden">
              <div className="p-6 sm:p-8 bg-[#0F2854]/5 border-b border-[#1C4D8D]/10">
                <h2 className="text-lg font-bold text-[#0F2854] flex items-center gap-3">
                  <div className="p-2.5 bg-[#1C4D8D]/10 rounded-xl">
                    <Plus className="w-5 h-5 text-[#1C4D8D]" />
                  </div>
                  Buat Klien Baru
                </h2>
                <p className="text-xs text-[#4988C4] mt-2">Pilih tema unified lengkap</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">

                {/* Slug Input */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    Nama Klien (Slug URL)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="contoh: john-dan-jane"
                    required
                    className="w-full px-4 py-3.5 bg-[#F8FAFC] border-2 border-[#1C4D8D]/10 rounded-xl text-sm focus:border-[#4988C4] focus:ring-2 focus:ring-[#BDE8F5] text-[#0F2854] placeholder:text-[#1C4D8D]/40 transition-all font-medium"
                  />
                  <p className="text-xs text-[#4988C4]/70 ml-1">URL: /undangan/{slug || 'nama-klien'}/tamu</p>
                </div>

                {/* Password Input */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    Password Dashboard
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Biarkan kosong untuk default"
                      className="w-full px-4 py-3.5 bg-[#F8FAFC] border-2 border-[#1C4D8D]/10 rounded-xl text-sm focus:border-[#4988C4] focus:ring-2 focus:ring-[#BDE8F5] text-[#0F2854] placeholder:text-[#1C4D8D]/40 transition-all font-medium pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-[#BDE8F5]/30 rounded-lg transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-[#4988C4]" /> : <Eye className="w-4 h-4 text-[#4988C4]" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#4988C4]/70 ml-1">Kosongkan untuk default: client123</p>
                </div>

                {/* UNIFIED THEME SELECTOR */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Unified Theme
                  </label>

                  {loadingThemes ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 text-[#1C4D8D]" />
                    </div>
                  ) : (
                    <>
                      {/* Theme Grid */}
                      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                        {themes.map((theme) => (
                          <div
                            key={theme.theme_id}
                            onClick={() => setSelectedThemeId(theme.theme_id)}
                            className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 border-2 ${
                              selectedThemeId === theme.theme_id
                                ? 'border-[#1C4D8D] bg-[#BDE8F5]/30 ring-2 ring-[#1C4D8D]/20 shadow-lg'
                                : 'border-[#1C4D8D]/10 hover:border-[#4988C4] hover:shadow-md'
                            }`}
                          >
                            {/* Gradient Preview */}
                            <div
                              className="h-16 relative"
                              style={{
                                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primarylight} 50%, ${theme.colors.darkprimary} 100%)`
                              }}
                            >
                              {theme.is_builtin && (
                                <div className="absolute top-2 right-2 bg-slate-800/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                  <span className="text-[9px] font-bold text-white uppercase">🔒 Built-in</span>
                                </div>
                              )}

                              {/* Background thumbnail overlay */}
                              {theme.backgrounds.fullscreen && (
                                <div className="absolute bottom-0 left-0 right-0 h-6 overflow-hidden opacity-40">
                                  <Image
                                    src={theme.backgrounds.fullscreen}
                                    alt="Background preview"
                                    fill
                                    className="object-cover"
                                    sizes="200px"
                                  />
                                </div>
                              )}

                              {selectedThemeId === theme.theme_id && (
                                <div className="absolute top-2 left-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50">
                                  <Check className="w-3 h-3 text-[#1C4D8D]" />
                                </div>
                              )}
                            </div>

                            {/* Theme Info */}
                            <div className="p-3 bg-white">
                              <h4 className="font-bold text-sm text-[#0F2854] truncate">{theme.theme_name}</h4>
                              <p className="text-[10px] text-[#4988C4] line-clamp-1 mb-2">{theme.description}</p>

                              {/* Stats */}
                              <div className="flex items-center gap-2 text-[10px] text-[#1C4D8D]">
                                <div className="flex items-center gap-1">
                                  <Palette className="w-3 h-3" />
                                  <span>{theme.stats?.color_count || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <ImageIcon className="w-3 h-3" />
                                  <span>{theme.stats?.background_count || 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Layers className="w-3 h-3" />
                                  <span>{theme.stats?.ornament_count || 0}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Selected Theme Preview */}
                      {selectedTheme && (
                        <div className="mt-4 p-4 bg-gradient-to-br from-[#BDE8F5]/20 to-[#4988C4]/10 rounded-xl border border-[#4988C4]/20">
                          <p className="text-xs font-bold text-[#0F2854] mb-2">Preview: {selectedTheme.theme_name}</p>
                          <div className="grid grid-cols-8 gap-1">
                            {Object.entries(selectedTheme.colors).map(([key, color]) => (
                              <div
                                key={key}
                                className="aspect-square rounded shadow-sm ring-1 ring-black/5"
                                style={{ backgroundColor: color }}
                                title={key}
                              />
                            ))}
                          </div>
                          <div className="flex items-center justify-between mt-3 text-[10px] text-[#4988C4]">
                            <span>{selectedTheme.stats?.color_count || 0} colors</span>
                            <span>{selectedTheme.stats?.background_count || 0} backgrounds</span>
                            <span>{selectedTheme.stats?.ornament_count || 0} ornaments</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !slug || loadingThemes}
                  className="w-full py-4 bg-[#0F2854] hover:bg-[#1C4D8D] text-white font-bold rounded-xl shadow-lg shadow-[#0F2854]/20 hover:shadow-[#1C4D8D]/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  Buat Proyek Klien
                </button>

              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Client List */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-[#1C4D8D]/10 shadow-[0_10px_30px_-10px_rgba(28,77,141,0.05)]">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Cari klien..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[#F8FAFC] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#BDE8F5] text-[#0F2854] placeholder:text-[#1C4D8D]/40 transition-all font-medium"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4988C4]" />
              </div>
              <div className="flex items-center gap-2 px-4 py-2.5 bg-[#BDE8F5]/20 rounded-xl text-sm font-bold text-[#1C4D8D]">
                <Users className="w-4 h-4" />
                <span>{filteredClients.length} Klien Aktif</span>
              </div>
            </div>

            {/* Client Cards */}
            {loadingClients ? (
              <div className="text-center py-20">
                <Loader className="w-8 h-8 mx-auto text-[#1C4D8D]" />
                <p className="text-sm text-[#4988C4] mt-4">Memuat klien...</p>
              </div>
            ) : currentClients.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2rem] border border-[#1C4D8D]/10">
                <Users className="w-16 h-16 text-[#4988C4]/30 mx-auto mb-4" />
                <p className="text-sm font-medium text-[#0F2854]">
                  {searchTerm ? 'Tidak ada hasil' : 'Belum ada klien'}
                </p>
                <p className="text-xs text-[#4988C4] mt-1">
                  {searchTerm ? 'Coba kata kunci lain' : 'Buat klien pertama Anda'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-4">
                  {currentClients.map((client) => {
                    const themeInfo = getThemeDisplayInfo(client);

                    return (
                      <div
                        key={client.id}
                        className="group bg-white rounded-[2rem] border border-[#1C4D8D]/10 hover:border-[#4988C4]/40 shadow-[0_10px_30px_-10px_rgba(28,77,141,0.05)] hover:shadow-[0_15px_40px_-10px_rgba(28,77,141,0.15)] transition-all duration-300 overflow-hidden"
                      >
                        <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">

                          {/* Theme Preview */}
                          <div className="relative flex-shrink-0">
                            <div
                              className="w-14 h-14 rounded-2xl shadow-md ring-1 ring-black/5"
                              style={{ background: themeInfo.gradient }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                              {themeInfo.isBuiltin ? <span className="text-xs">🔒</span> : <Sparkles className="w-3 h-3 text-indigo-600" />}
                            </div>
                          </div>

                          {/* Client Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-[#0F2854] mb-1 truncate">{client.slug}</h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
                              <span className="px-2 py-1 bg-[#BDE8F5]/30 text-[#1C4D8D] rounded-md font-medium">
                                {themeInfo.name}
                              </span>
                              <div className="flex items-center gap-1.5 text-[#4988C4]">
                                <Palette className="w-3 h-3" />
                                <span>{themeInfo.stats.colors}</span>
                                <ImageIcon className="w-3 h-3 ml-1" />
                                <span>{themeInfo.stats.backgrounds}</span>
                                <Layers className="w-3 h-3 ml-1" />
                                <span>{themeInfo.stats.ornaments}</span>
                              </div>
                            </div>
                            <p className="text-xs text-[#4988C4] flex items-center gap-1.5">
                              <Calendar className="w-3 h-3" />
                              {new Date(client.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 w-full sm:w-auto">
                            <button
                              onClick={() => handleCopyDashboardUrl(client.slug)}
                              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#BDE8F5]/20 hover:bg-[#BDE8F5]/40 text-[#1C4D8D] rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                              title="Salin URL Dashboard"
                            >
                              <Copy className="w-4 h-4" />
                              <span className="sm:hidden">Salin</span>
                            </button>
                            <a
                              href={`/dashboard/${client.slug}`}
                              target="_blank"
                              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#1C4D8D]/10 hover:bg-[#1C4D8D]/20 text-[#1C4D8D] rounded-xl transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="sm:hidden">Buka</span>
                            </a>
                            <button
                              onClick={() => openDeleteModal(client.id, client.slug)}
                              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors flex items-center justify-center"
                              title="Hapus Klien"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-xl hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5 text-[#1C4D8D]" />
                    </button>

                    {getPageNumbers().map((page, index) => (
                      typeof page === 'number' ? (
                        <button
                          key={index}
                          onClick={() => goToPage(page)}
                          className={`min-w-[2.5rem] h-10 rounded-xl font-bold text-sm transition-all ${
                            currentPage === page
                              ? 'bg-[#1C4D8D] text-white shadow-lg'
                              : 'hover:bg-white text-[#1C4D8D]'
                          }`}
                        >
                          {page}
                        </button>
                      ) : (
                        <span key={index} className="px-2 text-[#4988C4]">...</span>
                      )
                    ))}

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-xl hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-[#1C4D8D]" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteClient}
        title="Hapus Klien"
        message={`Yakin ingin menghapus klien "${deleteModal.clientSlug}"? Semua data terkait akan terhapus permanen.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isLoading={deleteModal.isLoading}
      />

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}
