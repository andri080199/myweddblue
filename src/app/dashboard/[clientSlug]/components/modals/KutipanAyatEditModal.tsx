'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Loader, RotateCcw, BookOpen, Quote, ScrollText, AlertCircle } from 'lucide-react';
import { useEditing } from '@/contexts/EditingContext';

// Default kutipan ayat (same as in KutipanAyat component)
const DEFAULT_AYAT = `"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berfikir."`;
const DEFAULT_SUMBER = '(Q.S. Ar-Rum : 21)';

interface KutipanAyatEditModalProps {
  clientSlug: string;
  sectionId: string;
  initialAyat?: string;
  initialSumber?: string;
  onClose: () => void;
  onSaveSuccess?: () => void;
}

const KutipanAyatEditModal: React.FC<KutipanAyatEditModalProps> = ({
  clientSlug,
  sectionId,
  initialAyat = '',
  initialSumber = '',
  onClose,
  onSaveSuccess,
}) => {
  const { setSaveStatus, unlockEditing } = useEditing();
  const [ayat, setAyat] = useState(initialAyat || DEFAULT_AYAT);
  const [sumber, setSumber] = useState(initialSumber || DEFAULT_SUMBER);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSaving]);

  const handleClose = () => {
    unlockEditing(sectionId);
    onClose();
  };

  const handleReset = () => {
    setAyat(initialAyat || DEFAULT_AYAT);
    setSumber(initialSumber || DEFAULT_SUMBER);
    setError(null);
    setSuccessMessage(null);
  };

  const handleRestoreDefault = () => {
    setAyat(DEFAULT_AYAT);
    setSumber(DEFAULT_SUMBER);
    setError(null);
    setSuccessMessage('Kutipan ayat dikembalikan ke default');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleSave = async () => {
    if (!ayat.trim()) {
      setError('Kutipan ayat tidak boleh kosong');
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus(sectionId, 'saving');
      setError(null);

      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug,
          contentType: 'kutipan_ayat',
          contentData: {
            ayat: ayat.trim(),
            sumber: sumber.trim(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setSaveStatus(sectionId, 'saved');
      setSuccessMessage('Berhasil disimpan!');

      if (onSaveSuccess) {
        onSaveSuccess();
      }

      // Close modal after short delay to show success
      setTimeout(() => {
        handleClose();
      }, 800);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus(sectionId, 'error');
      setError('Gagal menyimpan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop with Blur */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" 
        onClick={!isSaving ? handleClose : undefined} 
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
        <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl ring-1 ring-black/5 flex flex-col max-h-[90vh] pointer-events-auto overflow-hidden transition-all transform duration-300">
          
          {/* 1. Header Section - Emerald Theme */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 text-white">
            {/* Texture */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                  <BookOpen className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">Edit Kutipan Ayat</h2>
                  <p className="text-white/80 text-sm font-medium">Ayat suci atau quotes pembuka</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 border border-white/10"
                disabled={isSaving}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-gray-50/50">
            
            {/* Notifications */}
            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-emerald-700 font-medium text-sm">{successMessage}</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                </div>
                <span className="text-red-700 font-medium text-sm">{error}</span>
              </div>
            )}

            {/* Main Form Fields */}
            <div className="space-y-6">
              
              {/* Ayat Field - Card Style */}
              <div className="relative group">
                <label htmlFor="ayat" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 ml-1">
                  <Quote className="w-4 h-4 text-emerald-500 fill-current" />
                  Isi Kutipan / Ayat <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    id="ayat"
                    value={ayat}
                    onChange={(e) => setAyat(e.target.value)}
                    placeholder="Masukkan kutipan ayat..."
                    rows={6}
                    className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-y shadow-sm text-base leading-relaxed italic"
                    disabled={isSaving}
                  />
                  <div className="absolute top-4 right-4 text-gray-300 pointer-events-none">
                     <Quote className="w-6 h-6 opacity-20 rotate-180" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 ml-1">
                   Disarankan menggunakan terjemahan Bahasa Indonesia agar mudah dipahami tamu undangan.
                </p>
              </div>

              {/* Sumber Field */}
              <div>
                <label htmlFor="sumber" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2 ml-1">
                  <ScrollText className="w-4 h-4 text-emerald-500" />
                  Sumber Kutipan
                </label>
                <input
                  type="text"
                  id="sumber"
                  value={sumber}
                  onChange={(e) => setSumber(e.target.value)}
                  placeholder="Contoh: (Q.S. Ar-Rum : 21)"
                  className="w-full px-5 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm font-medium"
                  disabled={isSaving}
                />
              </div>

              {/* Default Restore Box - Modern Style */}
              <div className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 relative overflow-hidden group">
                 <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-100/50 rounded-full blur-xl group-hover:scale-110 transition-transform duration-700" />
                 
                 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                   <div className="space-y-1">
                     <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                       <RotateCcw className="w-4 h-4 text-amber-600" />
                       Kembalikan ke Default
                     </h4>
                     <p className="text-xs text-amber-700/80 leading-relaxed max-w-sm">
                       Gunakan kutipan standar pernikahan (Q.S. Ar-Rum : 21) jika Anda bingung ingin mengisi apa.
                     </p>
                   </div>
                   <button
                     onClick={handleRestoreDefault}
                     className="px-4 py-2 bg-white border border-amber-200 hover:border-amber-300 text-amber-700 hover:text-amber-800 text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95 whitespace-nowrap"
                     disabled={isSaving}
                   >
                     Pakai Default
                   </button>
                 </div>
              </div>

            </div>
          </div>

          {/* 3. Footer Actions */}
          <div className="p-4 sm:p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-20">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between items-center">
              <button
                onClick={handleReset}
                className="text-sm text-gray-400 hover:text-gray-600 font-medium px-4 py-2 transition-colors flex items-center gap-2"
                disabled={isSaving}
              >
                <RotateCcw className="w-4 h-4" />
                Reset Form
              </button>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleClose}
                  className="flex-1 sm:flex-none px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all focus:ring-2 focus:ring-gray-200"
                  disabled={isSaving}
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  disabled={isSaving || !ayat.trim()}
                >
                  {isSaving ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Simpan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default KutipanAyatEditModal;