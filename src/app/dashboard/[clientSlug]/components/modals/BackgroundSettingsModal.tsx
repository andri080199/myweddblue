'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Upload, RotateCcw, ImageIcon, Check, Loader2 } from 'lucide-react';
import { compressImage, formatFileSize } from '@/utils/imageCompression';

interface SectionBackgrounds {
  fullscreen?: string;
  kutipan?: string;
  welcome?: string;
  timeline?: string;
  event?: string;
  gift?: string;
  gallery?: string;
  rsvp?: string;
  guestbook?: string;
}

interface BackgroundSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSlug: string;
  onSaveSuccess?: () => void;
  themeBackground?: string; // Default theme background for preview
}

const SECTIONS = [
  { id: 'fullscreen', name: 'Opening', description: 'Layar pembuka undangan' },
  { id: 'kutipan', name: 'Kutipan Ayat', description: 'Section kutipan Al-Quran' },
  { id: 'welcome', name: 'Mempelai', description: 'Profil pengantin pria & wanita' },
  { id: 'timeline', name: 'Love Story', description: 'Timeline cerita cinta' },
  { id: 'event', name: 'Akad & Resepsi', description: 'Informasi acara pernikahan' },
  { id: 'gift', name: 'Wedding Gift', description: 'Informasi rekening & kado' },
  { id: 'gallery', name: 'Gallery', description: 'Galeri foto & video' },
  { id: 'rsvp', name: 'RSVP', description: 'Form konfirmasi kehadiran' },
  { id: 'guestbook', name: 'Guestbook', description: 'Ucapan & doa tamu' },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

export default function BackgroundSettingsModal({
  isOpen,
  onClose,
  clientSlug,
  onSaveSuccess,
  themeBackground = '/images/originaltheme/PohonPutih.jpg'
}: BackgroundSettingsModalProps) {
  const [backgrounds, setBackgrounds] = useState<SectionBackgrounds>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<SectionId | null>(null);
  const [uploadingSection, setUploadingSection] = useState<SectionId | null>(null);
  const [successSection, setSuccessSection] = useState<SectionId | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  // Fetch existing backgrounds
  useEffect(() => {
    if (isOpen && clientSlug) {
      fetchBackgrounds();
    }
  }, [isOpen, clientSlug]);

  const fetchBackgrounds = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/client-content?clientSlug=${clientSlug}&contentType=section_backgrounds&t=${Date.now()}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0 && data[0].content_data) {
          setBackgrounds(data[0].content_data);
        }
      }
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (sectionId: SectionId, file: File) => {
    if (!file) return;

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      alert('Ukuran file maksimal 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar');
      return;
    }

    setUploadingSection(sectionId);

    try {
      const originalSize = file.size;
      console.log(`[${sectionId}] Original size: ${formatFileSize(originalSize)}`);

      // Compress image (90% quality, keep resolution)
      const compressedBase64 = await compressImage(file, {
        quality: 0.9,          // 90% quality (visually lossless)
        maxSizeMB: 5,          // Target max 5MB after compression
              });

      // Calculate compressed size from base64
      const compressedSize = (compressedBase64.length * 3) / 4; // Approximate base64 size
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      console.log(`[${sectionId}] Compressed size: ${formatFileSize(compressedSize)} (${reduction}% reduction)`);

      // Update local state immediately with compressed image
      const newBackgrounds = { ...backgrounds, [sectionId]: compressedBase64 };
      setBackgrounds(newBackgrounds);

      // Save to database
      await saveBackgrounds(newBackgrounds, sectionId);
    } catch (error) {
      console.error('Error uploading background:', error);
      alert('Gagal mengupload gambar. Coba gambar lain atau ukuran lebih kecil.');
      setUploadingSection(null);
    }
  };

  const saveBackgrounds = async (data: SectionBackgrounds, sectionId?: SectionId) => {
    try {
      if (sectionId) setSaving(sectionId);

      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug,
          contentType: 'section_backgrounds',
          contentData: data
        })
      });

      if (response.ok) {
        if (sectionId) {
          setSuccessSection(sectionId);
          setTimeout(() => setSuccessSection(null), 2000);
        }
        onSaveSuccess?.();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving backgrounds:', error);
      alert('Gagal menyimpan background');
    } finally {
      setSaving(null);
      setUploadingSection(null);
    }
  };

  const handleResetSection = async (sectionId: SectionId) => {
    const newBackgrounds = { ...backgrounds };
    delete newBackgrounds[sectionId];
    setBackgrounds(newBackgrounds);
    await saveBackgrounds(newBackgrounds, sectionId);
  };

  const handleResetAll = async () => {
    if (confirm('Reset semua background ke default tema?')) {
      setBackgrounds({});
      await saveBackgrounds({});
      onSaveSuccess?.();
    }
  };

  const triggerFileInput = (sectionId: SectionId) => {
    fileInputRefs.current[sectionId]?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Pengaturan Background</h2>
            <p className="text-sm text-gray-500 mt-1">Kustomisasi background untuk setiap section undangan</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetAll}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Semua
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SECTIONS.map((section) => {
                const customBg = backgrounds[section.id];
                const isUploading = uploadingSection === section.id;
                const isSaving = saving === section.id;
                const isSuccess = successSection === section.id;

                return (
                  <div
                    key={section.id}
                    className="relative group bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:border-blue-300 transition-all"
                  >
                    {/* Background Preview */}
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={customBg || themeBackground}
                        alt={section.name}
                        fill
                        className="object-cover"
                        unoptimized={customBg?.startsWith('data:')}
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Custom badge */}
                      {customBg && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
                          Custom
                        </div>
                      )}

                      {/* Status indicators */}
                      {(isUploading || isSaving) && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                      )}

                      {isSuccess && (
                        <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                          <Check className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Section Info */}
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-900 text-sm">{section.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{section.description}</p>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => triggerFileInput(section.id)}
                          disabled={isUploading || isSaving}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          {customBg ? 'Ganti' : 'Upload'}
                        </button>

                        {customBg && (
                          <button
                            onClick={() => handleResetSection(section.id)}
                            disabled={isUploading || isSaving}
                            className="flex items-center justify-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                            title="Reset ke default"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Hidden file input */}
                      <input
                        ref={(el) => { fileInputRefs.current[section.id] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileChange(section.id, file);
                          e.target.value = '';
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              <ImageIcon className="w-4 h-4 inline mr-1" />
              Maksimal 5MB per gambar. Gambar yang tidak di-custom akan menggunakan background dari tema.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
