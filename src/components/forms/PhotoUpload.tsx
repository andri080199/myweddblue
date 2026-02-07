'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface PhotoUploadProps {
  clientSlug: string;
  maxPhotos?: number;
  onPhotosChange?: (photos: any[]) => void;
  currentPhotos?: any[];
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ 
  clientSlug, 
  maxPhotos = 10, 
  onPhotosChange,
  currentPhotos = []
}) => {
  const [photos, setPhotos] = useState<any[]>(currentPhotos);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync dengan currentPhotos prop saat berubah
  useEffect(() => {
    setPhotos(currentPhotos);
  }, [currentPhotos]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (photos.length + files.length > maxPhotos) {
      alert(`Maksimal ${maxPhotos} foto diizinkan`);
      return;
    }

    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Convert file to base64 untuk sementara (nanti bisa diganti dengan cloud storage)
        const base64 = await fileToBase64(file);
        
        const response = await fetch('/api/client-gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientSlug,
            imageUrl: base64,
            imageOrder: photos.length + i
          }),
        });

        if (response.ok) {
          const newPhoto = await response.json();
          setPhotos(prev => {
            const updated = [...prev, newPhoto];
            // Use setTimeout to avoid setState during render
            setTimeout(() => {
              onPhotosChange?.(updated);
            }, 0);
            return updated;
          });
        }
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Gagal upload foto');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    try {
      const response = await fetch(`/api/client-gallery?clientSlug=${clientSlug}&imageId=${photoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const filteredPhotos = photos.filter(photo => photo.id !== photoId);
        setPhotos(filteredPhotos);
        // Use setTimeout to avoid setState during render
        setTimeout(() => {
          onPhotosChange?.(filteredPhotos);
        }, 0);
      }
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Gagal hapus foto');
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-textprimary">Gallery Photos ({photos.length}/{maxPhotos})</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || photos.length >= maxPhotos}
          className="px-4 py-2 bg-blue-500  text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {uploading ? 'Uploading...' : 'Tambah Foto'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group">
            <div className="aspect-square relative overflow-hidden rounded-lg">
              <Image
                src={photo.image_url}
                alt={`Gallery photo ${photo.id}`}
                fill
                className="object-cover"
              />
            </div>
            <button
              onClick={() => handleDeletePhoto(photo.id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {photos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Belum ada foto. Klik "Add Photos" untuk menambahkan.
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;