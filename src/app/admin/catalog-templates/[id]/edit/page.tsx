'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Save, Image as ImageIcon, Layout, Tag, Globe, ShieldCheck, CheckCircle, XCircle, AlertCircle, ChevronDown, Check } from 'lucide-react';
import { getTemplate, updateTemplate, compressImage, CATEGORIES, BADGES, CatalogTemplate } from '@/lib/catalogApi';

// --- COMPONENT: PREMIUM DROPDOWN (Reusable) ---
interface DropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  icon: React.ElementType;
}

function PremiumDropdown({ label, value, options, onChange, icon: Icon }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button" // Prevent form submission
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3.5 bg-[#F8FAFC] border rounded-xl transition-all duration-300 group outline-none ${
          isOpen 
            ? 'border-[#1C4D8D] ring-2 ring-[#BDE8F5] bg-white shadow-lg shadow-[#1C4D8D]/5' 
            : 'border-slate-200 hover:border-[#1C4D8D] hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Icon className={`w-5 h-5 transition-colors ${value ? 'text-[#1C4D8D]' : 'text-slate-400'}`} />
          <span className={`text-sm font-medium truncate ${value ? 'text-[#0F2854]' : 'text-slate-400'}`}>
            {value ? (value.charAt(0).toUpperCase() + value.slice(1)) : `Pilih ${label}`}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1C4D8D]' : ''}`} />
      </button>

      <div className={`absolute z-50 top-[calc(100%+8px)] left-0 right-0 bg-white rounded-xl border border-[#1C4D8D]/10 shadow-2xl shadow-[#0F2854]/15 overflow-hidden transition-all duration-200 origin-top transform ${
        isOpen 
          ? 'opacity-100 scale-100 translate-y-0 visible' 
          : 'opacity-0 scale-95 -translate-y-2 invisible'
      }`}>
        <div className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar space-y-1">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => { onChange(option); setIsOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                value === option 
                  ? 'bg-[#0F2854] text-white font-medium shadow-md shadow-[#0F2854]/20' 
                  : 'text-[#0F2854] hover:bg-[#F0F9FF] hover:pl-5'
              }`}
            >
              <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              {value === option && <Check className="w-4 h-4 text-[#BDE8F5]" />}
            </button>
          ))}
          
          {/* Option to clear selection (only for Badge usually) */}
          {label === 'Badge' && (
             <button
              type="button"
              onClick={() => { onChange(''); setIsOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-red-500 transition-colors mt-1 border-t border-slate-50"
            >
              <span>Tanpa Badge</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [template, setTemplate] = useState<CatalogTemplate | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  const [notification, setNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'modern',
    price: '',
    url: '',
    badge: '',
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification(prev => prev ? { ...prev, show: false } : null);
    }, 3000);
  };

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  async function fetchTemplate() {
    try {
      const response = await getTemplate(templateId);
      if (response.success) {
        setTemplate(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          category: response.data.category,
          price: response.data.price,
          url: response.data.url,
          badge: response.data.badge || '',
        });
        setImagePreview(response.data.image_base64);
      } else {
        showNotification('error', `Gagal memuat template: ${response.error}`);
        setTimeout(() => router.push('/admin/catalog-templates'), 2000);
      }
    } catch (error) {
      console.error(error);
      showNotification('error', 'Terjadi kesalahan sistem saat memuat data.');
    } finally {
      setLoading(false);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification('error', 'Mohon pilih file gambar yang valid.');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showNotification('error', 'Ukuran gambar maksimal 15MB.');
      return;
    }

    setNewImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price || !formData.url) {
      showNotification('error', 'Mohon lengkapi semua kolom wajib.');
      return;
    }

    setSaving(true);
    try {
      const updateData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: formData.price.trim(),
        url: formData.url.trim(),
        badge: formData.badge || null,
      };

      if (newImageFile) {
        const compressedBase64 = await compressImage(newImageFile, 800, 0.8);
        updateData.image_base64 = compressedBase64;
      }

      const response = await updateTemplate(templateId, updateData);

      if (response.success) {
        showNotification('success', 'Template berhasil diperbarui!');
        setTimeout(() => {
          router.push('/admin/catalog-templates');
        }, 1500);
      } else {
        showNotification('error', `Gagal memperbarui: ${response.error}`);
      }
    } catch (error) {
      console.error(error);
      showNotification('error', 'Terjadi kesalahan sistem saat menyimpan.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#BDE8F5] border-t-[#1C4D8D] rounded-full animate-spin mb-4"></div>
        <p className="text-[#1C4D8D] font-medium animate-pulse">Memuat Editor Template...</p>
      </div>
    );
  }

  if (!template) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F2854] pb-20 selection:bg-[#BDE8F5] selection:text-[#0F2854] relative">
      
      {/* --- CUSTOM NOTIFICATION TOAST --- */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
        notification?.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      }`}>
        <div className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-2xl border bg-white min-w-[300px] ${
          notification?.type === 'success' ? 'border-emerald-100' : 'border-red-100'
        }`}>
          <div className={`p-2 rounded-full shrink-0 ${
            notification?.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
          }`}>
            {notification?.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <h4 className={`font-bold text-sm ${notification?.type === 'success' ? 'text-emerald-800' : 'text-red-800'}`}>
              {notification?.type === 'success' ? 'Berhasil Disimpan' : 'Terjadi Kesalahan'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{notification?.message}</p>
          </div>
        </div>
      </div>

      {/* 1. HERO HEADER */}
      <div className="bg-[#0F2854] pt-8 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Link
            href="/admin/catalog-templates"
            className="inline-flex items-center gap-2 text-[#BDE8F5]/80 hover:text-[#BDE8F5] transition-colors mb-6 group"
          >
            <div className="p-1.5 rounded-full border border-[#4988C4]/50 group-hover:border-[#BDE8F5]">
               <ArrowLeft size={16} />
            </div>
            <span className="text-sm font-medium">Kembali ke Katalog</span>
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Edit Template <span className="text-[#4988C4]">#{templateId}</span>
              </h1>
              <p className="text-[#BDE8F5]/70 mt-2 max-w-2xl font-light">
                Perbarui detail template, harga, dan aset visual untuk katalog Anda.
              </p>
            </div>
            
            <div className="flex items-center gap-3 text-xs font-mono text-[#BDE8F5]/50 bg-[#1C4D8D]/30 px-4 py-2 rounded-lg border border-[#4988C4]/20">
              <span>CREATED: {new Date(template.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-20 relative z-10">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: Image & Preview */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 shadow-xl shadow-[#0F2854]/5 border border-[#1C4D8D]/10">
                <h3 className="font-bold text-[#0F2854] mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#1C4D8D]" />
                  Thumbnail Katalog
                </h3>
                
                <div className="relative group w-full aspect-[3/4] bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-[#1C4D8D] transition-all">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  
                  {/* Upload Overlay */}
                  <label className="absolute inset-0 bg-[#0F2854]/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer backdrop-blur-sm">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Upload className="w-6 h-6 text-[#1C4D8D]" />
                    </div>
                    <span className="text-white font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                      Ganti Gambar
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                
                <div className="mt-4 p-3 bg-[#F0F9FF] rounded-xl border border-[#BDE8F5] flex items-start gap-3">
                  <div className="p-1.5 bg-white rounded-full text-[#1C4D8D] mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <p className="text-xs text-[#1C4D8D]/80 leading-relaxed">
                    {newImageFile 
                      ? `File baru dipilih: ${newImageFile.name}` 
                      : "Gunakan gambar rasio 3:4 atau 4:3 kualitas tinggi untuk hasil terbaik."}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Form Fields */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-[#0F2854]/5 border border-[#1C4D8D]/10">
                
                {/* Section 1: Basic Info */}
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider mb-2 block">Judul Template</label>
                    <div className="relative">
                      <Layout className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        required
                        maxLength={100}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Contoh: Royal Blue Wedding"
                        className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BDE8F5] focus:border-[#1C4D8D] transition-all text-[#0F2854] font-medium placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider mb-2 block">Deskripsi</label>
                    <textarea
                      required
                      maxLength={500}
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Jelaskan fitur, gaya desain, dan keunggulan template ini..."
                      className="w-full px-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BDE8F5] focus:border-[#1C4D8D] transition-all text-[#0F2854] leading-relaxed resize-none"
                    />
                    <div className="text-right mt-2 text-xs text-slate-400 font-mono">
                      {formData.description.length}/500 karakter
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-slate-100" />

                {/* Section 2: Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Dropdown Kategori (New Component) */}
                  <div>
                    <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider mb-2 block">Kategori</label>
                    <PremiumDropdown 
                      label="Kategori"
                      value={formData.category}
                      options={[...CATEGORIES]}
                      onChange={(val) => setFormData({...formData, category: val})}
                      icon={Tag}
                    />
                  </div>

                  {/* Dropdown Badge (New Component) */}
                  <div>
                    <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider mb-2 block">Badge (Opsional)</label>
                    <PremiumDropdown 
                      label="Badge"
                      value={formData.badge}
                      options={[...BADGES]}
                      onChange={(val) => setFormData({...formData, badge: val})}
                      icon={ShieldCheck}
                    />
                  </div>

                  {/* Input Harga (IDR) */}
                  <div>
                    <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider mb-2 block">Harga</label>
                    <div className="relative">
                      {/* IDR Icon Replacement */}
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 tracking-tighter">
                        IDR
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="Contoh: 99k"
                        className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BDE8F5] focus:border-[#1C4D8D] transition-all text-[#0F2854] font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider mb-2 block">URL Preview</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="url"
                        required
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        placeholder="https://undangan.com/preview/..."
                        className="w-full pl-12 pr-4 py-3.5 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BDE8F5] focus:border-[#1C4D8D] transition-all text-[#0F2854] text-sm"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Link
                  href="/admin/catalog-templates"
                  className="px-8 py-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-white hover:border-[#1C4D8D]/30 hover:text-[#1C4D8D] transition-all"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-[#0F2854] to-[#1C4D8D] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#1C4D8D]/30 hover:shadow-[#1C4D8D]/50 hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Menyimpan Perubahan...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Simpan Template
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}