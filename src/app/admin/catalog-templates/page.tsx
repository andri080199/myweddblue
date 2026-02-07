'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Trash2, Edit, Plus, Search, Filter, LayoutGrid, Tag, Layers, ChevronLeft, ChevronRight, Package, Check, ChevronDown, AlertTriangle, X } from 'lucide-react';
import { getTemplates, deleteTemplate, CatalogTemplate, CATEGORIES, BADGES } from '@/lib/catalogApi';

// --- COMPONENT: PREMIUM DROPDOWN (Tetap Dipertahankan) ---
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
    <div className="relative min-w-[200px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-[#F8FAFC] border rounded-xl transition-all duration-300 group ${
          isOpen 
            ? 'border-[#1C4D8D] ring-2 ring-[#BDE8F5] shadow-lg shadow-[#1C4D8D]/10' 
            : 'border-slate-200 hover:border-[#1C4D8D]/50 hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Icon className={`w-4 h-4 transition-colors ${value ? 'text-[#1C4D8D]' : 'text-slate-400'}`} />
          <span className={`text-sm font-medium truncate ${value ? 'text-[#0F2854]' : 'text-slate-500'}`}>
            {value ? (value.charAt(0).toUpperCase() + value.slice(1)) : label}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#1C4D8D]' : ''}`} />
      </button>

      <div className={`absolute z-50 top-full left-0 right-0 mt-2 bg-white rounded-xl border border-[#1C4D8D]/10 shadow-2xl shadow-[#0F2854]/15 overflow-hidden transition-all duration-200 origin-top ${
        isOpen ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'
      }`}>
        <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
          <button
            onClick={() => { onChange(''); setIsOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors mb-1 ${
              value === '' ? 'bg-[#F0F9FF] text-[#1C4D8D] font-bold' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <span>Semua {label.replace('Pilih ', '')}</span>
            {value === '' && <Check className="w-4 h-4" />}
          </button>

          {options.map((option) => (
            <button
              key={option}
              onClick={() => { onChange(option); setIsOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                value === option 
                  ? 'bg-[#0F2854] text-white font-bold shadow-md shadow-[#0F2854]/20' 
                  : 'text-[#0F2854] hover:bg-[#F8FAFC] hover:text-[#1C4D8D]'
              }`}
            >
              <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
              {value === option && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT: DELETE CONFIRMATION MODAL ---
interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting: boolean;
}

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, isDeleting }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-[#0F2854]/60 backdrop-blur-sm transition-opacity" 
        onClick={!isDeleting ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-white/20">
        <button 
          onClick={onClose} 
          disabled={isDeleting}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#0F2854] transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Warning Icon with Ripple Effect */}
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
          </div>

          <h3 className="text-xl font-black text-[#0F2854] mb-2">Hapus Template?</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-1">
            Anda akan menghapus template:
          </p>
          <p className="text-[#1C4D8D] font-bold text-sm mb-6 bg-[#F0F9FF] px-3 py-1 rounded-lg border border-[#BDE8F5]">
            "{title}"
          </p>
          
          <p className="text-slate-400 text-xs mb-6">
            Tindakan ini tidak dapat dibatalkan. Data template akan hilang permanen dari database.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 hover:text-[#0F2854] transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Menghapus...</span>
                </>
              ) : (
                'Hapus Permanen'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---

export default function CatalogTemplatesPage() {
  const [templates, setTemplates] = useState<CatalogTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Delete
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filters
  const [category, setCategory] = useState('');
  const [badge, setBadge] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchTemplates();
  }, [currentPage, category, badge]);

  async function fetchTemplates() {
    setLoading(true);
    try {
      const response = await getTemplates({
        page: currentPage,
        limit: itemsPerPage,
        ...(category && { category }),
        ...(badge && { badge }),
      });

      if (response.success) {
        setTemplates(response.data.catalogs);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.total);
      } else {
        console.error('Failed to load templates');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // Fungsi membuka modal
  function confirmDelete(id: number, title: string) {
    setDeleteTarget({ id, title });
  }

  // Fungsi eksekusi delete
  async function executeDelete() {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const response = await deleteTemplate(deleteTarget.id);
      if (response.success) {
        fetchTemplates(); // Refresh data
        setDeleteTarget(null); // Tutup modal
      } else {
        alert(`Gagal menghapus: ${response.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Terjadi kesalahan saat menghapus.');
    } finally {
      setIsDeleting(false);
    }
  }

  const filteredTemplates = templates.filter(template =>
    searchTerm === '' ||
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F2854] pb-20 selection:bg-[#BDE8F5] selection:text-[#0F2854]">
      
      {/* Modal Delete */}
      <DeleteConfirmationModal 
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={executeDelete}
        title={deleteTarget?.title || ''}
        isDeleting={isDeleting}
      />

      {/* 1. HERO SECTION */}
      <div className="relative bg-[#0F2854] pt-12 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1C4D8D]/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4988C4]/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4D8D]/30 border border-[#4988C4]/30 backdrop-blur-md">
                <LayoutGrid className="w-3.5 h-3.5 text-[#BDE8F5]" />
                <span className="text-xs font-bold text-[#BDE8F5] tracking-widest uppercase">Catalog Manager</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                Template <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4988C4] to-[#BDE8F5]">Katalog</span>
              </h1>
              <p className="text-slate-300 max-w-xl text-lg font-light">
                Kelola desain undangan pernikahan eksklusif Anda dengan mudah dan elegan.
              </p>
            </div>

            <Link
              href="/admin/catalog-templates/create"
              className="group flex items-center gap-2 px-6 py-3.5 bg-[#BDE8F5] text-[#0F2854] rounded-xl font-bold shadow-[0_0_20px_rgba(28,77,141,0.3)] hover:shadow-[0_0_30px_rgba(28,77,141,0.5)] transition-all hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Buat Template Baru
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 -mt-20 relative z-20">
        
        {/* 2. STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Katalog', value: totalItems, icon: Package },
            { label: 'Halaman', value: `${currentPage} / ${totalPages}`, icon: Layers },
            { label: 'Ditampilkan', value: filteredTemplates.length, icon: LayoutGrid },
            { label: 'Kategori', value: CATEGORIES.length, icon: Tag },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl shadow-lg shadow-[#0F2854]/5 border border-[#1C4D8D]/10 hover:border-[#1C4D8D]/30 transition-colors">
              <p className="text-xs font-bold text-[#4988C4] uppercase tracking-wider mb-1">{stat.label}</p>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#BDE8F5]/30 rounded-lg text-[#1C4D8D]"><stat.icon className="w-5 h-5" /></div>
                <span className="text-2xl font-black text-[#0F2854]">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. FILTERS BAR */}
        <div className="bg-white rounded-2xl shadow-xl shadow-[#0F2854]/10 border border-[#1C4D8D]/10 p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-5">
            
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4988C4] group-focus-within:text-[#1C4D8D] transition-colors" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari template berdasarkan judul..."
                className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#BDE8F5] focus:border-[#1C4D8D] transition-all text-[#0F2854] placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <PremiumDropdown 
                label="Pilih Kategori" 
                value={category} 
                options={[...CATEGORIES]} 
                onChange={setCategory} 
                icon={Filter}
              />
              
              <PremiumDropdown 
                label="Pilih Badge" 
                value={badge} 
                options={[...BADGES]} 
                onChange={setBadge} 
                icon={Tag}
              />
            </div>
          </div>
        </div>

        {/* 4. TEMPLATES GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-dashed border-[#1C4D8D]/20 animate-pulse">
            <div className="w-16 h-16 border-4 border-[#BDE8F5] border-t-[#1C4D8D] rounded-full animate-spin mb-6" />
            <p className="text-[#1C4D8D] font-bold text-lg">Memuat koleksi template...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-[#1C4D8D]/10 shadow-sm text-center">
            <div className="w-24 h-24 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-6">
              <Search className="w-12 h-12 text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-[#0F2854]">Tidak ada template ditemukan</h3>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
              Coba gunakan kata kunci lain atau reset filter kategori dan badge Anda.
            </p>
            <button 
              onClick={() => {setSearchTerm(''); setCategory(''); setBadge('');}}
              className="mt-6 text-[#1C4D8D] font-bold hover:underline"
            >
              Reset Semua Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div 
                key={template.id}
                className="group bg-white rounded-2xl border border-[#1C4D8D]/10 overflow-hidden hover:shadow-2xl hover:shadow-[#1C4D8D]/15 hover:-translate-y-1 transition-all duration-500 flex flex-col h-full"
              >
                {/* Image Area */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img 
                    src={template.image_base64} 
                    alt={template.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F2854]/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

                  {template.badge && (
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-[#BDE8F5]/90 backdrop-blur-sm text-[#0F2854] text-[10px] font-extrabold uppercase tracking-wider rounded-full shadow-lg border border-white/20">
                        {template.badge}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3">
                    <div className="px-3 py-1.5 bg-[#0F2854]/80 backdrop-blur-md rounded-lg border border-[#4988C4]/30">
                      <span className="text-[#BDE8F5] font-bold text-sm">{template.price}</span>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="mb-auto">
                    <h3 className="font-bold text-[#0F2854] text-lg leading-tight line-clamp-1 mb-2 group-hover:text-[#1C4D8D] transition-colors" title={template.title}>
                      {template.title}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#F0F9FF] text-[#1C4D8D] text-xs font-bold border border-[#BDE8F5]">
                        {template.category}
                      </span>
                    </div>

                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">
                      {template.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                    <Link
                      href={`/admin/catalog-templates/${template.id}/edit`}
                      className="flex items-center justify-center gap-2 py-2.5 bg-[#F8FAFC] hover:bg-[#BDE8F5]/30 text-[#1C4D8D] border border-[#1C4D8D]/10 hover:border-[#1C4D8D]/30 rounded-xl font-bold text-sm transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Template
                    </Link>

                    <Link
                      href={`/admin/catalog-templates/${template.id}/ornaments`}
                      className="flex items-center justify-center gap-2 py-2.5 bg-[#F0F9FF] hover:bg-[#E0F2FE] text-[#1C4D8D] border border-[#1C4D8D]/20 hover:border-[#1C4D8D]/40 rounded-xl font-bold text-sm transition-all"
                    >
                      <Layers className="w-4 h-4" />
                      Edit Ornaments
                    </Link>

                    <button
                      onClick={() => confirmDelete(template.id, template.title)}
                      className="flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 rounded-xl transition-all font-bold text-sm"
                      title="Hapus Template"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 5. PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-[#1C4D8D]/20 text-[#1C4D8D] hover:bg-[#BDE8F5] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-[#1C4D8D]/10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full font-bold text-sm transition-all ${
                    currentPage === page
                      ? 'bg-[#1C4D8D] text-white shadow-lg shadow-[#1C4D8D]/30 scale-110'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-[#0F2854]'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white border border-[#1C4D8D]/20 text-[#1C4D8D] hover:bg-[#BDE8F5] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}