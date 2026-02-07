'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; // Import Portal
import {
  X, Check, Loader, Trash2, Plus, Image as ImageIcon,
  Youtube, Camera, Film, Play, AlertCircle
} from 'lucide-react';
import { useEditing } from '@/contexts/EditingContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Image from 'next/image';
import { compressImage, formatFileSize } from '@/utils/imageCompression';

interface GalleryPhoto {
  id: number;
  image_url: string;
  image_order: number;
}

interface GalleryEditModalProps {
  clientSlug: string;
  sectionId: string;
  galleryPhotos: GalleryPhoto[];
  youtubeUrl?: string;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

// --- PORTAL WRAPPER COMPONENT ---
// Ini memastikan modal dirender di luar hierarchy komponen saat ini
const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  // Render langsung ke body agar z-index dihitung dari root document
  return createPortal(children, document.body);
};

const GalleryEditModal: React.FC<GalleryEditModalProps> = ({
  clientSlug,
  sectionId,
  galleryPhotos = [],
  youtubeUrl = '',
  onClose,
  onSaveSuccess,
}) => {
  const { setSaveStatus, unlockEditing } = useEditing();
  const [photos, setPhotos] = useState<GalleryPhoto[]>(galleryPhotos);
  const [videoUrl, setVideoUrl] = useState(youtubeUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Confirm dialog states
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);
  const [showDeleteVideoConfirm, setShowDeleteVideoConfirm] = useState(false);

  // Lock body scroll
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving && !isUploading) handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSaving, isUploading]);

  const handleClose = () => {
    unlockEditing(sectionId);
    onClose();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (photos.length >= 10) {
      setError('Maksimal 10 foto untuk gallery');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const originalSize = file.size;
      console.log(`[Gallery] Original size: ${formatFileSize(originalSize)}`);

      // Compress image (90% quality, keep resolution)
      const compressedBase64 = await compressImage(file, {
        quality: 0.9,          // 90% quality (visually lossless)
        maxSizeMB: 5,          // Target max 5MB after compression
              });

      // Calculate compressed size from base64
      const compressedSize = (compressedBase64.length * 3) / 4;
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      console.log(`[Gallery] Compressed size: ${formatFileSize(compressedSize)} (${reduction}% reduction)`);

      const galleryResponse = await fetch('/api/client-gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug,
          imageUrl: compressedBase64,
          imageOrder: photos.length,
        }),
      });

      if (!galleryResponse.ok) {
        const errorData = await galleryResponse.json();
        throw new Error(errorData.error || 'Gagal menyimpan ke gallery');
      }

      const newPhoto = await galleryResponse.json();
      setPhotos([...photos, newPhoto]);
      setSuccessMessage('Foto berhasil ditambahkan');
      setTimeout(() => setSuccessMessage(null), 2000);

      if (onSaveSuccess) onSaveSuccess();
    } catch (err: any) {
      setError(err.message || 'Gagal upload foto');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeletePhotoConfirm = async () => {
    // ... logic delete sama seperti sebelumnya ...
    if (!photoToDelete) return;
    try {
      setIsSaving(true);
      setError(null);
      const response = await fetch(
        `/api/client-gallery?clientSlug=${clientSlug}&imageId=${photoToDelete}`,
        { method: 'DELETE' }
      );
      if (!response.ok) throw new Error('Gagal menghapus foto');

      setPhotos(photos.filter((p) => p.id !== photoToDelete));
      setPhotoToDelete(null);
      setSuccessMessage('Foto berhasil dihapus');
      setTimeout(() => setSuccessMessage(null), 2000);
      if (onSaveSuccess) onSaveSuccess();
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus foto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveVideo = async () => {
    // ... logic save video sama ...
    try {
      setIsSaving(true);
      setSaveStatus(sectionId, 'saving');
      setError(null);
      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug,
          contentType: 'gallery_video',
          contentData: { youtubeUrl: videoUrl },
        }),
      });
      if (!response.ok) throw new Error('Gagal menyimpan');
      
      setSaveStatus(sectionId, 'saved');
      setSuccessMessage('Video berhasil disimpan');
      setTimeout(() => setSuccessMessage(null), 2000);
      if (onSaveSuccess) onSaveSuccess();
    } catch (err: any) {
      setSaveStatus(sectionId, 'error');
      setError(err.message || 'Gagal menyimpan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVideoConfirm = async () => {
    // ... logic delete video sama ...
    setVideoUrl('');
    setShowDeleteVideoConfirm(false);
    try {
      setIsSaving(true);
      setSaveStatus(sectionId, 'saving');
      setError(null);
      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug,
          contentType: 'gallery_video',
          contentData: { youtubeUrl: '' },
        }),
      });
      if (!response.ok) throw new Error('Gagal menghapus video');
      
      setSaveStatus(sectionId, 'saved');
      setSuccessMessage('Video dihapus');
      setTimeout(() => setSuccessMessage(null), 2000);
      if (onSaveSuccess) onSaveSuccess();
    } catch (err: any) {
      setSaveStatus(sectionId, 'error');
      setError(err.message || 'Gagal menghapus video');
    } finally {
      setIsSaving(false);
    }
  };

  // Bungkus seluruh return dengan ModalPortal
  return (
    <ModalPortal>
      {/* Backdrop dengan z-index sangat tinggi */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99998] transition-opacity" 
        onClick={!isSaving && !isUploading ? handleClose : undefined} 
      />

      {/* Container Modal dengan z-index tertinggi + 1 */}
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 pointer-events-none">
        
        {/* Modal Content */}
        <div className="bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto overflow-hidden animate-in zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="relative bg-slate-900 p-6 sm:p-8 shrink-0 text-white overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 border border-white/10">
                  <Camera className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Gallery Editor</h2>
                  <p className="text-slate-400 text-sm font-medium">Kurasi momen terbaik Anda</p>
                </div>
              </div>
              <button 
                onClick={handleClose} 
                disabled={isSaving || isUploading} 
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all border border-white/5 cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-slate-50">
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Notifications */}
              {successMessage && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-4 h-4 text-emerald-600" /></div>
                  <span className="text-emerald-700 font-medium">{successMessage}</span>
                </div>
              )}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <div className="p-1 bg-red-100 rounded-full"><AlertCircle className="w-4 h-4 text-red-600" /></div>
                  <span className="text-red-700 font-medium">{error}</span>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* LEFT: Photo Grid */}
                <div className="flex-1 space-y-5">
                   <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-violet-500" />
                        Koleksi Foto
                        <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-1 rounded-full">{photos.length}/10</span>
                      </h3>
                      {photos.length > 0 && (
                         <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                              style={{ width: `${(photos.length / 10) * 100}%` }}
                            />
                         </div>
                      )}
                   </div>

                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {/* Upload Card */}
                      <label 
                        className={`aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-violet-500 bg-white hover:bg-violet-50/50 flex flex-col items-center justify-center cursor-pointer transition-all group ${
                          photos.length >= 10 || isUploading ? 'opacity-50 cursor-not-allowed border-slate-200 bg-slate-50' : ''
                        }`}
                      >
                         <input
                           type="file"
                           accept="image/*"
                           onChange={handlePhotoUpload}
                           className="hidden"
                           disabled={photos.length >= 10 || isUploading}
                         />
                         {isUploading ? (
                           <div className="flex flex-col items-center gap-2">
                              <Loader className="w-6 h-6 text-violet-500 animate-spin" />
                              <span className="text-xs font-medium text-violet-600">Uploading...</span>
                           </div>
                         ) : (
                           <>
                              <div className="w-10 h-10 bg-slate-100 group-hover:bg-violet-100 rounded-full flex items-center justify-center mb-2 transition-colors">
                                <Plus className="w-5 h-5 text-slate-400 group-hover:text-violet-600" />
                              </div>
                              <span className="text-xs font-semibold text-slate-500 group-hover:text-violet-700">Tambah Foto</span>
                           </>
                         )}
                      </label>

                      {/* Photo Cards */}
                      {photos.map((photo, index) => (
                        <div key={photo.id} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all ring-1 ring-black/5 bg-white">
                           <Image
                             src={photo.image_url}
                             alt={`Gallery ${index}`}
                             fill
                             className="object-cover transition-transform duration-700 group-hover:scale-110"
                             unoptimized
                           />
                           {/* Gradient Overlay */}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                           
                           {/* Badge */}
                           <div className="absolute top-2 left-2 px-2 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10">
                              #{index + 1}
                           </div>

                           {/* Delete Button */}
                           <button
                             onClick={() => setPhotoToDelete(photo.id)}
                             disabled={isSaving}
                             className="absolute top-2 right-2 p-2 bg-white text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white transform scale-90 hover:scale-100 shadow-lg cursor-pointer z-10"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                      ))}
                   </div>
                   
                   {photos.length === 0 && !isUploading && (
                      <div className="text-center py-8 text-slate-400 text-sm italic">
                        Belum ada foto. Mulai dengan menambahkan foto terbaikmu.
                      </div>
                   )}
                </div>

                {/* RIGHT: Video Section */}
                <div className="w-full lg:w-1/3 space-y-5">
                   <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Film className="w-5 h-5 text-red-500" />
                      Video Teaser
                   </h3>

                   <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50">
                      <div className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden mb-4 group border border-slate-200 flex items-center justify-center">
                         {videoUrl ? (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center relative">
                               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                               <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-red-500/50 z-10">
                                  <Play className="w-6 h-6 text-white ml-1 fill-white" />
                               </div>
                               <p className="absolute bottom-4 text-xs text-white/50 font-medium tracking-widest uppercase">Video Active</p>
                            </div>
                         ) : (
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                               <Youtube className="w-10 h-10 opacity-50" />
                               <span className="text-xs font-medium">No Video Added</span>
                            </div>
                         )}
                      </div>

                      <div className="space-y-3">
                         <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                               <Link2Icon className="w-4 h-4" />
                            </div>
                            <input 
                              type="text" 
                              value={videoUrl}
                              onChange={(e) => setVideoUrl(e.target.value)}
                              placeholder="Paste YouTube Link"
                              className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                            />
                         </div>
                         
                         <div className="flex gap-2">
                            <button
                              onClick={handleSaveVideo}
                              disabled={isSaving}
                              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-slate-900/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                            >
                               {isSaving ? <Loader className="w-3 h-3 animate-spin"/> : <Check className="w-3 h-3" />}
                               Simpan
                            </button>
                            {videoUrl && (
                               <button
                                 onClick={() => setShowDeleteVideoConfirm(true)}
                                 disabled={isSaving}
                                 className="px-3 py-2.5 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all cursor-pointer"
                               >
                                  <Trash2 className="w-4 h-4" />
                               </button>
                            )}
                         </div>
                      </div>
                   </div>

                   <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100 text-xs text-violet-700 leading-relaxed">
                      <strong>Tips:</strong> Video akan muncul sebagai highlight di galeri. Pastikan link video bersifat "Public" atau "Unlisted".
                   </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 bg-white border-t border-slate-100 shrink-0 flex justify-end z-10">
            <button
              onClick={handleClose}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-5 h-5" />
              Selesai Edit
            </button>
          </div>

        </div>
      </div>

      <ConfirmDialog
        isOpen={photoToDelete !== null}
        onClose={() => setPhotoToDelete(null)}
        onConfirm={handleDeletePhotoConfirm}
        title="Hapus Foto?"
        message="Foto ini akan dihapus permanen dari galeri."
        confirmText="Hapus"
        cancelText="Batal"
        type="delete"
        isLoading={isSaving}
      />

      <ConfirmDialog
        isOpen={showDeleteVideoConfirm}
        onClose={() => setShowDeleteVideoConfirm(false)}
        onConfirm={handleDeleteVideoConfirm}
        title="Hapus Video?"
        message="Video teaser akan dihapus dari galeri."
        confirmText="Hapus"
        cancelText="Batal"
        type="delete"
        isLoading={isSaving}
      />
    </ModalPortal>
  );
};

// Helper Icon for input
const Link2Icon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 17H7A5 5 0 0 1 7 7h2"></path><path d="M15 7h2a5 5 0 0 1 5 5 5 0 0 1-5 5h-2"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);

export default GalleryEditModal;