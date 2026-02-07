'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Edit, Eye } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { compressImage, formatFileSize } from '@/utils/imageCompression';

interface SinglePhotoUploadProps {
  clientSlug: string;
  photoType: 'brideImage' | 'groomImage' | 'weddingImage';
  currentPhoto?: string;
  onPhotoChange?: (photoUrl: string) => void;
  label: string;
}

const SinglePhotoUpload: React.FC<SinglePhotoUploadProps> = ({
  clientSlug,
  photoType,
  currentPhoto,
  onPhotoChange,
  label
}) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentPhoto || '');
  const [showFullImage, setShowFullImage] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    if (!uploading) {
      fileInputRef.current?.click();
    }
  };

  // Update preview when currentPhoto changes
  useEffect(() => {
    setPreviewUrl(currentPhoto || '');
  }, [currentPhoto]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Pilih file gambar yang valid');
      return;
    }

    // --- HARDCODED LIMIT 15MB (before compression) ---
    const MAX_SIZE_MB = 15;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Ukuran file terlalu besar. Maksimal ${MAX_SIZE_MB}MB`);
      return;
    }

    setUploading(true);

    try {
      const originalSize = file.size;
      console.log(`[${photoType}] Original size: ${formatFileSize(originalSize)}`);

      // Compress image (90% quality, keep resolution)
      const compressedBase64 = await compressImage(file, {
        quality: 0.9,          // 90% quality (visually lossless)
        maxSizeMB: 10,         // Target max 10MB after compression
              });

      // Calculate compressed size from base64
      const compressedSize = (compressedBase64.length * 3) / 4;
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      console.log(`[${photoType}] Compressed size: ${formatFileSize(compressedSize)} (${reduction}% reduction)`);

      const response = await fetch('/api/upload-photo-base64', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientSlug,
          photoType,
          imageData: compressedBase64,
          oldPhotoData: previewUrl // untuk cleanup jika ada foto lama
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewUrl(data.imageData);
        onPhotoChange?.(data.imageData);
      } else {
        const errorData = await response.text();
        console.error('Upload failed:', errorData);
        alert(`Gagal upload foto: ${errorData}`);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert(`Error upload foto: ${error}`);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    if (!previewUrl || deleting) return;
    setShowDeleteConfirm(true);
  };

  const confirmDeletePhoto = async () => {
    setShowDeleteConfirm(false);
    setDeleting(true);
    try {
      const response = await fetch('/api/upload-photo-base64', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientSlug,
          photoType
        }),
      });

      if (response.ok) {
        setPreviewUrl('');
        onPhotoChange?.('');
      } else {
        alert('Gagal menghapus foto');
      }
    } catch (error) {
      console.error('Error removing photo:', error);
      alert('Error menghapus foto');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800">{label}</h4>
          {previewUrl && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFullImage(true)}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                title="Lihat gambar penuh"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={handleRemovePhoto}
                disabled={deleting}
                className={`p-2 text-white rounded-lg transition-colors ${
                  deleting ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                }`}
                title="Hapus gambar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* Preview Area - Clickable */}
        <div
          className="relative cursor-pointer group"
          onClick={triggerFileInput}
        >
          {previewUrl ? (
            <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={previewUrl}
                alt={label}
                fill
                className="object-cover transition-transform group-hover:scale-105 duration-300"
              />
              {/* Hover overlay with edit icon */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center text-white">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
                    <Edit className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium">Klik untuk ganti foto</span>
                </div>
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="flex flex-col items-center text-white">
                    <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin mb-2" />
                    <span className="text-sm font-medium">Mengupload...</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${
              uploading
                ? 'border-blue-400 bg-blue-50'
                : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 group-hover:border-blue-400 group-hover:bg-blue-50'
            }`}>
              {uploading ? (
                <>
                  <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3" />
                  <p className="text-sm font-medium text-blue-600">Mengupload foto...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center mb-3 transition-colors duration-300">
                    <Upload className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors duration-300 mb-1">
                    Klik untuk upload {label}
                  </p>
                  <p className="text-xs text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                    JPG, PNG, WEBP (Maks. 15MB)
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            onClick={triggerFileInput}
            disabled={uploading}
            className={`flex-1 rounded-xl px-4 py-3 text-center font-medium transition-all duration-200 ${
              uploading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : previewUrl
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Mengupload...</span>
                </>
              ) : (
                <>
                  {previewUrl ? <Edit className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                  <span>{previewUrl ? 'Ganti Foto' : 'Upload Foto'}</span>
                </>
              )}
            </div>
          </button>
        </div>
        
        {/* File Info */}
        {previewUrl && (
          <div className="mt-3 text-xs text-gray-500 text-center">
            ✅ Foto berhasil diupload dan tersimpan
          </div>
        )}
      </div>

      {/* Full Image Modal */}
      {showFullImage && previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-6 right-6 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative w-full h-full">
              <Image
                src={previewUrl}
                alt={label}
                width={800}
                height={600}
                className="object-contain rounded-xl shadow-2xl"
              />
            </div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              <p className="text-sm font-medium">{label}</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeletePhoto}
        title="Hapus Foto"
        message={`Apakah Anda yakin ingin menghapus ${label}? Foto yang dihapus tidak dapat dikembalikan.`}
        confirmText="Ya, Hapus"
        cancelText="Batal"
        type="delete"
        isLoading={deleting}
      />
    </>
  );
};

export default SinglePhotoUpload;