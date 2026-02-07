"use client";

import { useState, useEffect } from 'react';
import { getThemeList } from '@/themes';
import { getBackgroundThemeList, getBackgroundTheme } from '@/themes/backgroundThemes';
import { getColorTheme } from '@/themes/colorThemes';
import {
  User, Check, Trash2, Plus, Users,
  Calendar, ChevronLeft, ChevronRight, Copy, Layout, Search,
  ExternalLink, Sparkles, ShieldCheck, Lock, Eye, EyeOff
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

interface CustomTheme {
  id: string;
  name: string;
  description?: string;
  colors: any;
  backgrounds: any;
}

export default function CreateClientPage() {
  const [slug, setSlug] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('original');
  const [selectedBackgroundTheme, setSelectedBackgroundTheme] = useState('original');
  const [selectedCustomTheme, setSelectedCustomTheme] = useState<string | null>(null);
  const [themeType, setThemeType] = useState<'builtin' | 'custom'>('builtin'); // Track which type of theme is selected
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    clientId?: number;
    clientSlug?: string;
    isLoading?: boolean;
  }>({ isOpen: false });

  const builtinThemes = getThemeList();
  const builtinBackgrounds = getBackgroundThemeList();

  // Merge built-in and custom themes for display
  const allThemes = [
    ...builtinThemes,
    ...customThemes.map(ct => ({
      id: ct.id,
      name: ct.name,
      description: ct.description || 'Custom theme',
      colors: ct.colors,
      isCustom: true
    }))
  ];

  const allBackgroundThemes = builtinBackgrounds; // Custom themes have backgrounds built-in

  const getThemeDisplayInfo = (client: Client) => {
    let display = 'No Theme';
    let subDisplay = '-';
    let backgroundStyle = 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)';
    let backgroundTheme = null;

    if (client.color_theme && client.background_theme) {
      const colorTheme = getColorTheme(client.color_theme);
      backgroundTheme = getBackgroundTheme(client.background_theme);

      display = colorTheme.name;
      subDisplay = backgroundTheme.name;
      backgroundStyle = `linear-gradient(135deg, ${colorTheme.colors.primary} 0%, ${colorTheme.colors.darkprimary || colorTheme.colors.primary} 100%)`;

    } else if (client.theme) {
      const legacyTheme = allThemes.find((t: any) => t.id === client.theme);
      backgroundTheme = client.background_theme ? getBackgroundTheme(client.background_theme) : null;

      display = legacyTheme ? legacyTheme.name : client.theme;
      subDisplay = backgroundTheme ? backgroundTheme.name : 'Legacy';

      if (legacyTheme && legacyTheme.colors) {
        backgroundStyle = `linear-gradient(135deg, ${legacyTheme.colors.primary} 0%, ${legacyTheme.colors.darkprimary || legacyTheme.colors.primary} 100%)`;
      } else {
        backgroundStyle = 'linear-gradient(135deg, #64748b 0%, #475569 100%)';
      }
    }

    return { display, subDisplay, backgroundStyle, backgroundTheme };
  };

  useEffect(() => {
    fetchClients();
    fetchCustomThemes();
  }, []);

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

  const fetchCustomThemes = async () => {
    try {
      const res = await fetch('/api/custom-themes');
      const data = await res.json();
      if (data.success) {
        const formatted = data.themes.map((t: any) => ({
          id: t.themeId,
          name: t.themeName,
          description: t.description,
          colors: t.colors,
          backgrounds: t.backgrounds
        }));
        setCustomThemes(formatted);
      }
    } catch (error) {
      console.error('Gagal mengambil custom themes:', error);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestBody = themeType === 'custom'
        ? {
            slug,
            theme: selectedCustomTheme, // Custom theme ID
            backgroundTheme: 'original', // Optional background for custom themes
            password: password || 'client123'
          }
        : {
            slug,
            theme: selectedTheme, // Built-in theme ID
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
        // Show different message if slug was modified (due to duplicate)
        if (data.wasModified) {
          (window as any).toast?.showSuccess(
            'Berhasil!',
            `Klien dibuat dengan slug "${data.slug}" (nama sudah ada, ditambahkan suffix unik)`
          );
        } else {
          (window as any).toast?.showSuccess('Berhasil!', `Klien "${data.slug}" telah dibuat`);
        }
        setSlug('');
        setPassword('');
        setSelectedTheme('original');
        setSelectedBackgroundTheme('original');
        setSelectedCustomTheme(null);
        setThemeType('builtin');
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

  const SelectionCard = ({ 
    isSelected, 
    onClick, 
    title, 
    subtitle, 
    previewContent 
  }: { 
    isSelected: boolean, 
    onClick: () => void, 
    title: string, 
    subtitle?: string, 
    previewContent: React.ReactNode 
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
        {previewContent}
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold text-sm truncate ${isSelected ? 'text-[#0F2854]' : 'text-[#1C4D8D]'}`}>{title}</h4>
          {subtitle && <p className="text-xs text-[#4988C4] line-clamp-1">{subtitle}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-[#BDE8F5] selection:text-[#0F2854]">
      
      {/* 1. HERO SECTION */}
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

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Create Form */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(28,77,141,0.15)] border border-[#1C4D8D]/10 backdrop-blur-sm overflow-hidden">
              <div className="p-6 sm:p-8 bg-[#0F2854]/5 border-b border-[#1C4D8D]/10">
                <h2 className="text-lg font-bold text-[#0F2854] flex items-center gap-3">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm border border-[#1C4D8D]/10 text-[#1C4D8D]">
                    <Plus className="w-5 h-5" />
                  </div>
                  Buat Klien Baru
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1">Slug Klien (URL)</label>
                  <div className="relative group">
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="contoh: romeo-juliet"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-[#1C4D8D]/20 rounded-xl text-[#0F2854] placeholder:text-[#1C4D8D]/40 focus:bg-[#BDE8F5]/10 focus:outline-none focus:ring-2 focus:ring-[#BDE8F5] focus:border-[#4988C4] transition-all font-medium"
                      required
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4988C4] group-focus-within:text-[#1C4D8D] transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs text-[#4988C4]/70 ml-1">Slug akan menjadi username untuk login dashboard klien</p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1">Password Klien</label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password untuk dashboard klien"
                      className="w-full pl-12 pr-12 py-4 bg-white border border-[#1C4D8D]/20 rounded-xl text-[#0F2854] placeholder:text-[#1C4D8D]/40 focus:bg-[#BDE8F5]/10 focus:outline-none focus:ring-2 focus:ring-[#BDE8F5] focus:border-[#4988C4] transition-all font-medium"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4988C4] group-focus-within:text-[#1C4D8D] transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1C4D8D]/50 hover:text-[#1C4D8D] transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-[#4988C4]/70 ml-1">Kosongkan untuk default: client123</p>
                </div>

                {/* Theme Type Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1">Pilih Jenis Tema</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setThemeType('builtin');
                        setSelectedCustomTheme(null);
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        themeType === 'builtin'
                          ? 'border-[#1C4D8D] bg-[#BDE8F5]/30 ring-1 ring-[#1C4D8D]/20'
                          : 'border-gray-200 hover:border-[#4988C4]'
                      }`}
                    >
                      <Layout className={`w-6 h-6 mx-auto mb-2 ${themeType === 'builtin' ? 'text-[#1C4D8D]' : 'text-gray-400'}`} />
                      <p className={`text-sm font-bold ${themeType === 'builtin' ? 'text-[#0F2854]' : 'text-gray-500'}`}>
                        Built-in Themes
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Warna + Background</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setThemeType('custom');
                        setSelectedTheme('original');
                        setSelectedBackgroundTheme('original');
                      }}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        themeType === 'custom'
                          ? 'border-pink-500 bg-pink-50 ring-1 ring-pink-500/20'
                          : 'border-gray-200 hover:border-pink-300'
                      }`}
                    >
                      <Sparkles className={`w-6 h-6 mx-auto mb-2 ${themeType === 'custom' ? 'text-pink-600' : 'text-gray-400'}`} />
                      <p className={`text-sm font-bold ${themeType === 'custom' ? 'text-pink-700' : 'text-gray-500'}`}>
                        Custom Themes
                      </p>
                      <p className="text-xs text-gray-400 mt-1">All-in-one</p>
                    </button>
                  </div>
                </div>

                {/* Built-in Themes Section */}
                {themeType === 'builtin' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1">Tema Warna</label>
                      <span className="text-xs font-bold text-white bg-[#1C4D8D] px-2.5 py-1 rounded-lg shadow-sm">
                        {builtinThemes.find(t => t.id === selectedTheme)?.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-3 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                      {builtinThemes.map((theme) => (
                        <SelectionCard
                          key={theme.id}
                          isSelected={selectedTheme === theme.id}
                          onClick={() => setSelectedTheme(theme.id)}
                          title={theme.name}
                          subtitle={theme.description}
                          previewContent={
                            <div
                              className="w-10 h-10 rounded-xl shadow-sm flex-shrink-0 ring-1 ring-black/5"
                              style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.darkprimary || theme.colors.primary} 100%)` }}
                            />
                          }
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Themes Section */}
                {themeType === 'custom' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-pink-600 uppercase tracking-wider ml-1 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Custom Themes
                      </label>
                      {selectedCustomTheme && (
                        <span className="text-xs font-bold text-white bg-pink-600 px-2.5 py-1 rounded-lg shadow-sm">
                          {customThemes.find(t => t.id === selectedCustomTheme)?.name}
                        </span>
                      )}
                    </div>
                    {customThemes.length === 0 ? (
                      <div className="text-center py-8 px-4 bg-pink-50 rounded-xl border border-pink-200">
                        <Sparkles className="w-12 h-12 text-pink-300 mx-auto mb-3" />
                        <p className="text-sm font-medium text-pink-700">Belum ada custom theme</p>
                        <p className="text-xs text-pink-500 mt-1">Buat custom theme di menu Theme Backgrounds</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                        {customThemes.map((theme) => (
                          <SelectionCard
                            key={theme.id}
                            isSelected={selectedCustomTheme === theme.id}
                            onClick={() => setSelectedCustomTheme(theme.id)}
                            title={theme.name}
                            subtitle={theme.description || 'Custom theme'}
                            previewContent={
                              <div className="relative">
                                <div
                                  className="w-10 h-10 rounded-xl shadow-sm flex-shrink-0 ring-1 ring-pink-300"
                                  style={{ background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.darkprimary || theme.colors.primary} 100%)` }}
                                />
                                <div className="absolute -top-1 -right-1 bg-pink-500 rounded-full p-0.5">
                                  <Sparkles className="w-2.5 h-2.5 text-white" />
                                </div>
                              </div>
                            }
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Background Theme Selection - Only for Built-in Themes */}
                {themeType === 'builtin' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1">Gaya Latar</label>
                      <span className="text-xs font-bold text-[#0F2854] bg-[#BDE8F5] px-2.5 py-1 rounded-lg shadow-sm">
                        {allBackgroundThemes.find(t => t.id === selectedBackgroundTheme)?.name}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {allBackgroundThemes.map((bgTheme) => (
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
                            style={{ backgroundImage: `url(${bgTheme.images.hero})` }}
                          />
                          <div className={`absolute inset-0 transition-opacity ${selectedBackgroundTheme === bgTheme.id ? 'bg-[#0F2854]/60' : 'bg-black/20 group-hover:bg-black/10'}`} />

                          {selectedBackgroundTheme === bgTheme.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-[#1C4D8D] rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}

                          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-[#0F2854] to-transparent">
                            <p className="text-xs font-bold text-white text-center truncate drop-shadow-md">{bgTheme.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !slug || (themeType === 'custom' && !selectedCustomTheme)}
                  className="w-full py-4 bg-[#0F2854] hover:bg-[#1C4D8D] text-white font-bold rounded-xl shadow-lg shadow-[#0F2854]/20 hover:shadow-[#1C4D8D]/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
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

            <div className="bg-white rounded-[2.5rem] border border-[#1C4D8D]/10 shadow-[0_20px_50px_-20px_rgba(28,77,141,0.08)] overflow-hidden min-h-[500px]">
              {loadingClients ? (
                <div className="p-20 text-center flex flex-col items-center">
                  <Loader className="w-10 h-10 text-[#4988C4] animate-spin mb-4" />
                  <p className="text-[#1C4D8D] font-medium">Memuat database klien...</p>
                </div>
              ) : currentClients.length === 0 ? (
                <div className="p-24 text-center flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#F8FAFC] rounded-3xl flex items-center justify-center mb-4 border border-[#1C4D8D]/10">
                    <Users className="w-10 h-10 text-[#4988C4]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F2854]">Tidak ada klien ditemukan</h3>
                  <p className="text-[#1C4D8D]/70 mt-2 max-w-xs">Tidak ada data yang cocok dengan pencarian Anda. Coba buat yang baru.</p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#F8FAFC]/80 border-b border-[#1C4D8D]/10 text-xs uppercase tracking-wider text-[#1C4D8D] font-bold">
                          <th className="px-8 py-6 pl-10">Identitas Klien</th>
                          <th className="px-8 py-6">Konfigurasi Tema</th>
                          <th className="px-8 py-6">Dibuat Pada</th>
                          <th className="px-8 py-6 pr-10 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1C4D8D]/5">
                        {currentClients.map((client) => {
                          const theme = getThemeDisplayInfo(client);
                          return (
                            <tr key={client.id} className="group hover:bg-[#BDE8F5]/10 transition-colors duration-200">
                              <td className="px-8 py-5 pl-10">
                                <div className="flex items-center gap-4">
                                  {/* UPDATE: Garis Vertikal (Transparent -> Teal on Hover) */}
                                  <div className="h-10 w-1 rounded-full bg-transparent group-hover:bg-teal-500 transition-colors duration-300"></div>
                                  
                                  <div>
                                    <p className="font-bold text-[#0F2854] capitalize text-base">{client.slug.replace('-', ' ')}</p>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      <p className="text-xs text-[#4988C4] font-mono">/{client.slug}</p>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                  <div 
                                    className="w-10 h-10 rounded-xl shadow-sm ring-1 ring-black/5 flex-shrink-0"
                                    style={{ background: theme.backgroundStyle }}
                                  />
                                  <div className="flex flex-col">
                                    <p className="text-sm font-bold text-[#0F2854]">{theme.display}</p>
                                    <p className="text-xs text-[#1C4D8D]/70">{theme.subDisplay}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1C4D8D] bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#1C4D8D]/5">
                                  <Calendar className="w-3.5 h-3.5 text-[#4988C4]" />
                                  {new Date(client.created_at).toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-8 py-5 pr-10 text-right">
                                {/* UPDATE: Opacity dihapus (selalu terlihat) */}
                                <div className="flex items-center justify-end gap-2">
                                  <a
                                    href={`/dashboard/${client.slug}/`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2.5 bg-white border border-[#1C4D8D]/10 text-[#1C4D8D] rounded-xl hover:bg-[#0F2854] hover:text-white hover:border-[#0F2854] transition-all shadow-sm"
                                    title="Lihat Dashboard"
                                  >
                                    <Layout className="w-4 h-4" />
                                  </a>
                                  <button
                                    onClick={() => handleCopyDashboardUrl(client.slug)}
                                    className="p-2.5 bg-white border border-[#1C4D8D]/10 text-[#4988C4] rounded-xl hover:bg-[#4988C4] hover:text-white hover:border-[#4988C4] transition-all shadow-sm"
                                    title="Salin URL"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(client.id, client.slug)}
                                    className="p-2.5 bg-white border border-[#1C4D8D]/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile List View - Card Style */}
                  <div className="md:hidden divide-y divide-[#1C4D8D]/5">
                    {currentClients.map((client) => {
                      const theme = getThemeDisplayInfo(client);
                      return (
                        <div key={client.id} className="p-5">
                          {/* Tambahkan group di sini agar hover trigger bekerja di mobile/desktop view card */}
                          <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#1C4D8D]/10 shadow-sm group">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-3">
                                {/* UPDATE: Garis Vertikal (Transparent -> Teal on Hover) */}
                                <div className="h-10 w-1 rounded-full bg-transparent group-hover:bg-teal-500 transition-colors duration-300"></div>
                                <div>
                                  <h3 className="font-bold text-[#0F2854] capitalize text-lg">{client.slug.replace('-', ' ')}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                     <p className="text-xs text-[#4988C4] flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {new Date(client.created_at).toLocaleDateString()}
                                     </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <a href={`/undangan/${client.slug}/admin`} target="_blank" className="p-2.5 bg-white text-[#1C4D8D] rounded-xl shadow-sm border border-[#1C4D8D]/10">
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                                <button onClick={() => openDeleteModal(client.id, client.slug)} className="p-2.5 bg-white text-rose-500 rounded-xl shadow-sm border border-[#1C4D8D]/10">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#1C4D8D]/5">
                              <div 
                                className="w-8 h-8 rounded-lg shadow-sm ring-1 ring-black/5" 
                                style={{ background: theme.backgroundStyle }} 
                              />
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#0F2854]">{theme.display}</span>
                                <span className="text-xs font-medium text-[#4988C4]">{theme.subDisplay}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="p-6 border-t border-[#1C4D8D]/10 flex justify-between items-center bg-[#F8FAFC]">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-3 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-[#1C4D8D]/10 disabled:opacity-30 disabled:hover:shadow-none disabled:hover:bg-transparent transition-all text-[#1C4D8D]"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <div className="flex gap-2">
                        {getPageNumbers().map((page, i) => (
                          <button
                            key={i}
                            onClick={() => typeof page === 'number' && goToPage(page)}
                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                              page === currentPage 
                                ? 'bg-[#0F2854] text-white shadow-lg shadow-[#0F2854]/20' 
                                : 'text-[#4988C4] hover:bg-white hover:text-[#0F2854]'
                            }`}
                            disabled={page === '...'}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-3 rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-[#1C4D8D]/10 disabled:opacity-30 disabled:hover:shadow-none disabled:hover:bg-transparent transition-all text-[#1C4D8D]"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      <ToastContainer />
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteClient}
        title="Hapus Klien?"
        message={`Ini akan menghapus klien "${deleteModal.clientSlug}" secara permanen. Apakah Anda yakin?`}
        confirmText="Hapus Permanen"
        cancelText="Batal"
        confirmButtonClass="bg-rose-600 hover:bg-rose-700"
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}

// Simple Helper for Loader
function Loader({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
  );
}