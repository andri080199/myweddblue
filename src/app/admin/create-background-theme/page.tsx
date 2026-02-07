'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Image as ImageIcon, Save, RefreshCw, Upload, Copy, Trash2 } from 'lucide-react';
import { compressImage, formatFileSize } from '@/utils/imageCompression';

// Section backgrounds yang bisa diupload
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

export default function CreateBackgroundThemePage() {
  console.log('🎨 CreateBackgroundThemePage component loaded!');

  const searchParams = useSearchParams();
  const router = useRouter();
  const editThemeId = searchParams.get('edit');

  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [themeId, setThemeId] = useState('');
  const [description, setDescription] = useState('');

  // Backgrounds state (section_id -> base64 string)
  const [backgrounds, setBackgrounds] = useState<Record<string, string>>({});
  const [uploadingSection, setUploadingSection] = useState<string | null>(null);

  // Load theme data if edit mode
  useEffect(() => {
    const loadThemeData = async () => {
      if (!editThemeId) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/custom-background-themes?themeId=${editThemeId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.theme) {
            setIsEditMode(true);
            setThemeName(data.theme.themeName);
            setThemeId(data.theme.themeId);
            setDescription(data.theme.description || '');
            setBackgrounds(data.theme.backgrounds || {});
          }
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

  // Handle file upload with compression
  const handleFileUpload = async (sectionId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar!');
      return;
    }

    // Check file size (max 15MB before compression)
    if (file.size > 15 * 1024 * 1024) {
      alert('Ukuran file maksimal 15MB!');
      return;
    }

    setUploadingSection(sectionId);
    console.log(`🚀 [${sectionId}] Starting upload process...`);
    console.log(`📁 [${sectionId}] File name: ${file.name}`);
    console.log(`📄 [${sectionId}] File type: ${file.type}`);
    console.log(`📊 [${sectionId}] File size: ${formatFileSize(file.size)}`);

    try {
      console.log(`⚙️ [${sectionId}] Calling compressImage function...`);

      // Compress image (90% quality, always convert to JPEG for best compression)
      const compressedBase64 = await compressImage(file, {
        quality: 0.9,          // 90% quality (visually lossless)
        maxSizeMB: 10,         // Target max 10MB after compression
      });

      console.log(`✅ [${sectionId}] Compression completed!`);
      console.log(`📦 [${sectionId}] Base64 prefix: ${compressedBase64.substring(0, 50)}...`);

      // Calculate compressed size from base64
      const compressedSize = (compressedBase64.length * 3) / 4; // Approximate base64 size
      const reduction = ((1 - compressedSize / file.size) * 100).toFixed(1);

      console.log(`📊 [${sectionId}] Original: ${formatFileSize(file.size)} → Compressed: ${formatFileSize(compressedSize)} (${reduction}% reduction)`);

      // Verify it's JPEG
      if (compressedBase64.startsWith('data:image/jpeg')) {
        console.log(`✅ [${sectionId}] Verified: Image is JPEG format`);
      } else if (compressedBase64.startsWith('data:image/png')) {
        console.warn(`⚠️ [${sectionId}] WARNING: Image is still PNG! Compression may have failed.`);
      } else {
        console.log(`ℹ️ [${sectionId}] Format: ${compressedBase64.substring(0, 30)}`);
      }

      setBackgrounds(prev => ({
        ...prev,
        [sectionId]: compressedBase64,
      }));

      console.log(`💾 [${sectionId}] Background saved to state`);
      setUploadingSection(null);
    } catch (error) {
      console.error(`❌ [${sectionId}] ERROR during upload:`, error);
      console.error(`❌ [${sectionId}] Error details:`, {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
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

  // Save theme
  const handleSave = async () => {
    if (!themeName.trim() || !themeId.trim()) {
      alert('Nama tema dan ID tema harus diisi!');
      return;
    }

    if (Object.keys(backgrounds).length === 0) {
      const confirm = window.confirm('Belum ada background yang diupload. Lanjutkan?');
      if (!confirm) return;
    }

    setLoading(true);
    try {
      const url = '/api/custom-background-themes';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          themeId,
          themeName,
          description,
          backgrounds,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(isEditMode ? 'Tema berhasil diupdate!' : 'Tema berhasil dibuat!');
        router.push('/admin/theme-backgrounds');
      } else {
        alert(`Gagal: ${data.message}`);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
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
              <ImageIcon className="w-8 h-8 text-purple-600" />
              {isEditMode ? 'Edit Background Theme' : 'Create Background Theme'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isEditMode ? 'Update tema background custom' : 'Upload background untuk setiap section undangan'}
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="text-right">
            <div className="text-sm font-medium text-gray-700">
              {progress.uploaded} / {progress.total} sections
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        </div>

        {loading && !isEditMode ? (
          <div className="text-center py-12">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Theme Info Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Theme Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Tema *
                  </label>
                  <input
                    type="text"
                    value={themeName}
                    onChange={(e) => handleThemeNameChange(e.target.value)}
                    placeholder="Contoh: Nature Paradise Backgrounds"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    placeholder="nature-paradise-backgrounds"
                    disabled={isEditMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
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
                    placeholder="Background alam dengan pemandangan indah..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Background Upload Sections */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Section Backgrounds</h2>
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
                      className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors"
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
                                  console.log(`📂 [${section.id}] File input onChange triggered!`);
                                  const file = e.target.files?.[0];
                                  console.log(`📂 [${section.id}] File selected:`, file ? file.name : 'NO FILE');
                                  if (file) {
                                    console.log(`📂 [${section.id}] Calling handleFileUpload...`);
                                    handleFileUpload(section.id, file);
                                  } else {
                                    console.warn(`📂 [${section.id}] No file selected!`);
                                  }
                                }}
                                className="hidden"
                              />
                              <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium flex items-center gap-2">
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

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end sticky bottom-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {isEditMode ? 'Update Theme' : 'Create Theme'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
