'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Trash2, Image as ImageIcon, Filter, Plus, 
  Search, Package, FileImage, X, CheckCircle 
} from 'lucide-react';
import { compressImage } from '@/utils/imageCompression';

interface OrnamentLibraryItem {
  id: number;
  ornament_name: string;
  ornament_image: string;
  category: string;
  file_size: number;
  created_at: string;
}

const CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'flowers', label: 'Flowers' },
  { value: 'borders', label: 'Borders' },
  { value: 'corners', label: 'Corners' },
  { value: 'dividers', label: 'Dividers' },
  { value: 'decorations', label: 'Decorations' },
  { value: 'frames', label: 'Frames' },
  { value: 'general', label: 'General' },
];

export default function OrnamentLibraryPage() {
  const [ornaments, setOrnaments] = useState<OrnamentLibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Upload form state
  const [uploadName, setUploadName] = useState('');
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchOrnaments();
  }, [selectedCategory]);

  async function fetchOrnaments() {
    try {
      setLoading(true);
      const url = selectedCategory === 'all'
        ? '/api/ornament-library'
        : `/api/ornament-library?category=${selectedCategory}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setOrnaments(data.ornaments);
      }
    } catch (error) {
      console.error('Error fetching ornaments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert(`File too large. Max size is ${maxSize / 1024 / 1024}MB`);
      return;
    }

    try {
      const compressedBase64 = await compressImage(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        quality: 0.85,
        preserveTransparency: true
      });

      setUploadPreview(compressedBase64);
      setUploadImage(compressedBase64);
      // Auto fill name if empty
      if (!uploadName) {
        setUploadName(file.name.split('.')[0].replace(/[-_]/g, ' '));
      }
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image');
    }
  }

  async function handleUploadOrnament() {
    if (!uploadName || !uploadImage) return;

    try {
      setUploading(true);
      const response = await fetch('/api/ornament-library', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ornament_name: uploadName,
          ornament_image: uploadImage,
          category: uploadCategory,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setUploadName('');
        setUploadCategory('general');
        setUploadImage(null);
        setUploadPreview(null);
        fetchOrnaments();
      } else {
        alert(`Failed to upload: ${data.error}`);
      }
    } catch (error) {
      console.error('Error uploading ornament:', error);
      alert('Failed to upload ornament');
    } finally {
      setUploading(false);
    }
  }

  async function handleDeleteOrnament(id: number, name: string) {
    if (!confirm(`Delete "${name}" permanently?`)) return;

    try {
      const response = await fetch(`/api/ornament-library?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) fetchOrnaments();
      else alert(`Failed to delete: ${data.error}`);
    } catch (error) {
      console.error('Error deleting ornament:', error);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Filter ornaments by search query
  const filteredOrnaments = ornaments.filter(orn => 
    orn.ornament_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- HEADER --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Package className="w-6 h-6 text-indigo-600" />
              Ornament Library
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage assets for wedding themes</p>
          </div>
          
          <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 w-full md:w-auto">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ornaments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* --- LEFT SIDEBAR: UPLOAD & FILTER --- */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            
            {/* Upload Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-indigo-600" />
                  Upload New
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Image Preview / Dropzone */}
                <div className="relative group">
                  {uploadPreview ? (
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat">
                      <img src={uploadPreview} alt="Preview" className="w-full h-48 object-contain bg-white/50 backdrop-blur-sm" />
                      <button 
                        onClick={() => { setUploadImage(null); setUploadPreview(null); }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-48 border-2 border-dashed border-indigo-100 rounded-xl bg-indigo-50/30 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all group-hover:scale-[1.02]"
                    >
                      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 text-indigo-500">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-medium text-indigo-900">Click to Browse</span>
                      <span className="text-xs text-indigo-400 mt-1">PNG, SVG (Max 5MB)</span>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </div>

                {/* Form Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Name</label>
                    <input
                      type="text"
                      value={uploadName}
                      onChange={(e) => setUploadName(e.target.value)}
                      placeholder="e.g. Gold Flower"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Category</label>
                    <div className="relative">
                      <select
                        value={uploadCategory}
                        onChange={(e) => setUploadCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                      >
                        {CATEGORIES.filter(c => c.value !== 'all').map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                      <Filter className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleUploadOrnament}
                  disabled={!uploadName || !uploadImage || uploading}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-lg font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {uploading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Plus className="w-4 h-4" />}
                  {uploading ? 'Uploading...' : 'Save to Library'}
                </button>
              </div>
            </div>

            {/* Category Filter (Desktop Sidebar) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 hidden lg:block">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Categories</h3>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex justify-between items-center ${
                      selectedCategory === cat.value 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                    {selectedCategory === cat.value && <CheckCircle className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* --- MAIN CONTENT: GRID --- */}
          <div className="lg:col-span-8 xl:col-span-9">
            
            {/* Mobile Category Select */}
            <div className="lg:hidden mb-6">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
              </select>
            </div>

            {/* Gallery Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                    <div className="h-32 bg-slate-100 rounded-xl animate-pulse mb-3"></div>
                    <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse mb-2"></div>
                    <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : filteredOrnaments.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <FileImage className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No ornaments found</h3>
                <p className="text-slate-500 mt-1">Try changing category or upload a new one.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredOrnaments.map((ornament) => (
                  <div 
                    key={ornament.id} 
                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Image Area with Checkered Background */}
                    <div className="relative h-40 w-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-slate-50 border-b border-slate-100 p-4 flex items-center justify-center overflow-hidden">
                      <img
                        src={ornament.ornament_image}
                        alt={ornament.ornament_name}
                        className="max-w-full max-h-full object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors flex items-start justify-end p-2 opacity-0 group-hover:opacity-100">
                        <button
                          onClick={() => handleDeleteOrnament(ornament.id, ornament.ornament_name)}
                          className="p-2 bg-white text-red-500 rounded-lg shadow-lg hover:bg-red-50 transition-transform hover:scale-105"
                          title="Delete Ornament"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Info Area */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                            {ornament.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-800 text-sm truncate" title={ornament.ornament_name}>
                          {ornament.ornament_name}
                        </h3>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span>{formatFileSize(ornament.file_size)}</span>
                        <span>{new Date(ornament.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}