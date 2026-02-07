'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Image as ImageIcon, Smartphone } from 'lucide-react';
import { useEditing } from '@/contexts/EditingContext';
import SinglePhotoUpload from '@/components/forms/SinglePhotoUpload';

interface FullScreenImageEditModalProps {
  clientSlug: string;
  sectionId: string;
  currentImage?: string;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

const FullScreenImageEditModal: React.FC<FullScreenImageEditModalProps> = ({
  clientSlug,
  sectionId,
  currentImage = '',
  onClose,
  onSaveSuccess,
}) => {
  const { unlockEditing, setSaveStatus } = useEditing();
  const [weddingImage, setWeddingImage] = useState(currentImage);

  // Lock body scroll
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleClose = () => {
    unlockEditing(sectionId);
    onClose();
  };

  const handlePhotoChange = (photoUrl: string) => {
    setWeddingImage(photoUrl);
    setSaveStatus(sectionId, 'saved');
    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" 
        onClick={handleClose} 
      />

      {/* Modal Wrapper - Flex center untuk vertical alignment */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        
        {/* Modal Content */}
        {/* max-h-[90vh] memastikan modal tidak pernah lebih tinggi dari 90% layar */}
        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
          
          {/* 1. Header (Fixed Height, Compact) */}
          <div className="shrink-0 relative bg-gradient-to-r from-violet-600 to-indigo-700 p-5 flex items-center justify-between text-white shadow-md z-10">
            {/* Texture halus agar tidak terlalu polos */}
            <div className="absolute inset-0 bg-white/5 opacity-50" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/10">
                <ImageIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">Cover Undangan</h2>
                <div className="flex items-center gap-1 text-indigo-100 text-xs font-medium opacity-90">
                  <Smartphone className="w-3 h-3" />
                  <span>Layar Pembuka</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="relative z-10 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 2. Scrollable Body */}
          {/* overflow-y-auto memungkinkan scroll jika konten (seperti form upload) terlalu tinggi */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-gray-50/50">
            
            {/* Upload Area Wrapper */}
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100">
               <div className="p-4 border-2 border-dashed border-violet-100 rounded-lg bg-violet-50/30">
                  <SinglePhotoUpload
                    clientSlug={clientSlug}
                    photoType="weddingImage"
                    currentPhoto={weddingImage}
                    onPhotoChange={handlePhotoChange}
                    label="Pilih Foto Cover"
                  />
               </div>
            </div>

            {/* Info Box - Compact */}
            <div className="text-xs text-gray-500 bg-white p-3 rounded-lg border border-gray-100 text-center leading-relaxed">
               <span className="font-semibold text-violet-600 block mb-1">Tips Tampilan Terbaik:</span>
               Gunakan foto <strong>Portrait (9:16)</strong> resolusi tinggi.
            </div>
          </div>

          {/* 3. Footer (Fixed Height) */}
          <div className="shrink-0 p-4 bg-white border-t border-gray-100 z-10">
             <button 
               onClick={handleClose} 
               className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
             >
                <Check className="w-4 h-4" />
                Selesai
             </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default FullScreenImageEditModal;