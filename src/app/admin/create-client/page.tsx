"use client";

import { useState, useEffect } from 'react';
import { getAllColorThemes } from '@/themes/colorThemes';
import { getAllBackgroundThemes } from '@/themes/backgroundThemes';
import {
  User, Check, Trash2, Plus, Users,
  Calendar, ChevronLeft, ChevronRight, Copy, Layout, Search,
  ExternalLink, Sparkles, ShieldCheck, Lock, Eye, EyeOff, Palette, ImageIcon
} from 'lucide-react';
import { ToastContainer } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface Client {
  id: number;
  slug: string;
  theme: string;
  background_theme?: string;
  color_theme?: string;
  created_at: string;
}

interface ColorTheme {
  id: string;
  name: string;
  description?: string;
  colors: any;
  primary?: string;
}

interface BackgroundTheme {
  id: string;
  name: string;
  description?: string;
  images: any;
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

  // Theme selection state - SIMPLIFIED (always color + background)
  const [selectedColorTheme, setSelectedColorTheme] = useState('original');
  const [selectedBackgroundTheme, setSelectedBackgroundTheme] = useState('original');

  // Theme lists state
  const [colorThemes, setColorThemes] = useState<ColorTheme[]>([]);
  const [backgroundThemes, setBackgroundThemes] = useState<BackgroundTheme[]>([]);
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

  // Get theme display info for client cards
  const getThemeDisplayInfo = (client: Client) => {
    let display = 'No Theme';
    let subDisplay = '-';
    let backgroundStyle = 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)';

    if (client.color_theme && client.background_theme) {
      const colorTheme = colorThemes.find(t => t.id === client.color_theme);
      const bgTheme = backgroundThemes.find(t => t.id === client.background_theme);

      display = colorTheme?.name || client.color_theme;
      subDisplay = bgTheme?.name || client.background_theme;

      if (colorTheme?.colors) {
        backgroundStyle = `linear-gradient(135deg, ${colorTheme.colors.primary} 0%, ${colorTheme.colors.darkprimary || colorTheme.colors.primary} 100%)`;
      }
    } else if (client.theme) {
      // Legacy theme
      display = client.theme;
      subDisplay = 'Legacy';
      backgroundStyle = 'linear-gradient(135deg, #64748b 0%, #475569 100%)';
    }

    return { display, subDisplay, backgroundStyle };
  };

  // Initialize - fetch themes and clients
  useEffect(() => {
    fetchThemes();
    fetchClients();
  }, []);

  // Fetch all themes (built-in + custom)
  const fetchThemes = async () => {
    try {
      setLoadingThemes(true);

      // Fetch color themes (built-in + custom)
      const colors = await getAllColorThemes();
      setColorThemes(colors);

      // Fetch background themes (built-in + custom)
      const backgrounds = await getAllBackgroundThemes();
      setBackgroundThemes(backgrounds);

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

  // SUBMIT - SIMPLIFIED (always send colorTheme + backgroundTheme)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestBody = {
        slug,
        colorTheme: selectedColorTheme,
        backgroundTheme: selectedBackgroundTheme,
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
        setSelectedColorTheme('original');
        setSelectedBackgroundTheme('original');
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

  // Selection Card Component
  const SelectionCard = ({
    isSelected,
    onClick,
    title,
    subtitle,
    previewContent,
    badge
  }: {
    isSelected: boolean,
    onClick: () => void,
    title: string,
    subtitle?: string,
    previewContent: React.ReactNode,
    badge?: React.ReactNode
  }) => (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer rounded-2xl p-4 transition-all duration-300 border ${
        isSelected
          ? 'border-[#1C4D8D] bg-[#BDE8F5]/30 ring-1 ring-[#1C4D8D]/20 shadow-lg shadow-[#1C4D8D]/10'
          : 'border-[#1C4D8D]/10 bg-white hover:border-[#4988C4] hover:shadow-md hover:shadow-[#1C4D8D]/5'
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-[#1C4D8D] rounded-full flex items-center justify-center shadow-lg z-10 animate-in zoom-in-50 duration-200">
          <Check className="w-3 h-3 text-white stroke-[3]" />
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="relative">
          {previewContent}
          {badge}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-sm truncate ${isSelected ? 'text-[#0F2854]' : 'text-[#1C4D8D]'}`}>{title}</h4>
          {subtitle && <p className="text-xs text-[#4988C4] line-clamp-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

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
                <span className="text-[10px] font-bold text-[#BDE8F5] tracking-widest uppercase">Dashboard Client Control</span>
              </div>

              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Manajemen <span className="text-[#4988C4]">Klien</span>
                </h1>
                <p className="mt-4 text-lg text-[#BDE8F5]/80 font-light leading-relaxed max-w-xl">
                  Atur undangan pernikahan baru dan kelola portofolio klien yang ada dengan presisi dan eksklusif.
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
                <p className="text-xs text-[#4988C4] mt-2">Masukkan informasi dasar & pilih tema</p>
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

                {/* NEW SYSTEM: Unified Color Theme Dropdown */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5" />
                    Color Theme
                  </label>

                  {loadingThemes ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 text-[#1C4D8D]" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {colorThemes.map((theme) => {
                        // Check if it's a custom theme
                        const isCustom = !['original', 'romantic', 'sunset', 'city', 'classic', 'coral', 'emerald', 'lavender', 'modern', 'sapphire', 'vintage'].includes(theme.id);

                        return (
                          <SelectionCard
                            key={theme.id}
                            isSelected={selectedColorTheme === theme.id}
                            onClick={() => setSelectedColorTheme(theme.id)}
                            title={theme.name}
                            subtitle={theme.description || 'Color theme'}
                            previewContent={
                              <div
                                className="w-10 h-10 rounded-xl shadow-sm flex-shrink-0 ring-1 ring-black/5"
                                style={{
                                  background: theme.colors
                                    ? `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.darkprimary || theme.colors.primary} 100%)`
                                    : 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)'
                                }}
                              />
                            }
                            badge={
                              isCustom ? (
                                <div className="absolute -top-1 -right-1 bg-purple-500 rounded-full p-0.5">
                                  <Sparkles className="w-2.5 h-2.5 text-white" />
                                </div>
                              ) : null
                            }
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* NEW SYSTEM: Unified Background Theme Dropdown */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1 flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Background Theme
                  </label>

                  {loadingThemes ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-6 h-6 text-[#1C4D8D]" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
                      {backgroundThemes.map((bgTheme) => {
                        // Check if it's a custom theme
                        const isCustom = !['original', 'city', 'flora', 'tropical'].includes(bgTheme.id);

                        return (
                          <div
                            key={bgTheme.id}
                            onClick={() => setSelectedBackgroundTheme(bgTheme.id)}
                            className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all aspect-video group ${
                              selectedBackgroundTheme === bgTheme.id
                                ? 'border-[#1C4D8D] ring-2 ring-[#BDE8F5] shadow-md'
                                : 'border-transparent hover:border-[#4988C4]'
                            }`}
                          >
                            <div
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                              style={{ backgroundImage: bgTheme.images?.hero ? `url(${bgTheme.images.hero})` : 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)' }}
                            />
                            <div className={`absolute inset-0 transition-opacity ${
                              selectedBackgroundTheme === bgTheme.id ? 'bg-[#0F2854]/60' : 'bg-black/20 group-hover:bg-black/10'
                            }`} />

                            {selectedBackgroundTheme === bgTheme.id && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-[#1C4D8D] rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50">
                                <Check className="w-3 h-3 text-white" />
                              </div>
                            )}

                            {isCustom && (
                              <div className="absolute top-2 left-2 bg-purple-500 rounded-full p-1">
                                <Sparkles className="w-2.5 h-2.5 text-white" />
                              </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-[#0F2854] to-transparent">
                              <p className="text-xs font-bold text-white text-center truncate drop-shadow-md">{bgTheme.name}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
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
                    const { display, subDisplay, backgroundStyle } = getThemeDisplayInfo(client);

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
                              style={{ background: backgroundStyle }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                          </div>

                          {/* Client Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-[#0F2854] mb-1 truncate">{client.slug}</h3>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="px-2 py-1 bg-[#BDE8F5]/30 text-[#1C4D8D] rounded-md font-medium">
                                {display}
                              </span>
                              <span className="text-[#4988C4]">+</span>
                              <span className="px-2 py-1 bg-[#4988C4]/10 text-[#1C4D8D] rounded-md font-medium">
                                {subDisplay}
                              </span>
                            </div>
                            <p className="text-xs text-[#4988C4] mt-2 flex items-center gap-1.5">
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
