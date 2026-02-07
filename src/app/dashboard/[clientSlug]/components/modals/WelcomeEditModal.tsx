'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Loader, User, Heart, Users, Camera, Sparkles, AlertCircle } from 'lucide-react';
import { useEditing } from '@/contexts/EditingContext';
import SinglePhotoUpload from '@/components/forms/SinglePhotoUpload';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Image from 'next/image';

interface WelcomeEditModalProps {
  clientSlug: string;
  sectionId: string;
  initialData?: {
    brideName?: string;
    brideFullName?: string;
    brideFatherName?: string;
    brideMotherName?: string;
    brideChildOrder?: string;
    brideImage?: string;
    groomName?: string;
    groomFullName?: string;
    groomFatherName?: string;
    groomMotherName?: string;
    groomChildOrder?: string;
    groomImage?: string;
    weddingImage?: string;
  };
  onClose: () => void;
  onSaveSuccess?: () => void;
}

const WelcomeEditModal: React.FC<WelcomeEditModalProps> = ({
  clientSlug,
  sectionId,
  initialData = {},
  onClose,
  onSaveSuccess,
}) => {
  const { setSaveStatus, unlockEditing } = useEditing();
  const [activeTab, setActiveTab] = useState<'bride' | 'groom'>('bride');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    brideName: initialData.brideName || '',
    brideFullName: initialData.brideFullName || '',
    brideFatherName: initialData.brideFatherName || '',
    brideMotherName: initialData.brideMotherName || '',
    brideChildOrder: initialData.brideChildOrder || '',
    brideImage: initialData.brideImage || '',
    groomName: initialData.groomName || '',
    groomFullName: initialData.groomFullName || '',
    groomFatherName: initialData.groomFatherName || '',
    groomMotherName: initialData.groomMotherName || '',
    groomChildOrder: initialData.groomChildOrder || '',
    groomImage: initialData.groomImage || '',
    weddingImage: initialData.weddingImage || '',
  });

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

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const handleResetConfirm = () => {
    setFormData({
      brideName: initialData.brideName || '',
      brideFullName: initialData.brideFullName || '',
      brideChildOrder: initialData.brideChildOrder || '',
      brideFatherName: initialData.brideFatherName || '',
      brideMotherName: initialData.brideMotherName || '',
      brideImage: initialData.brideImage || '',
      groomName: initialData.groomName || '',
      groomFullName: initialData.groomFullName || '',
      groomChildOrder: initialData.groomChildOrder || '',
      groomFatherName: initialData.groomFatherName || '',
      groomMotherName: initialData.groomMotherName || '',
      groomImage: initialData.groomImage || '',
      weddingImage: initialData.weddingImage || '',
    });
    setShowResetConfirm(false);
    setSuccessMessage('Data berhasil direset');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (field: string) => (photoUrl: string) => {
    setFormData((prev) => ({ ...prev, [field]: photoUrl }));
  };

  const validateForm = (): boolean => {
    if (!formData.brideFullName.trim() || !formData.groomFullName.trim()) {
      setError('Nama mempelai wajib diisi');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus(sectionId, 'saving');
      setError(null);

      // Auto-set brideName and groomName from full names (extract first name)
      const dataToSave = {
        ...formData,
        brideName: formData.brideFullName.split(' ')[0] || formData.brideFullName,
        groomName: formData.groomFullName.split(' ')[0] || formData.groomFullName,
      };

      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug,
          contentType: 'couple_info',
          contentData: dataToSave,
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

  const currentPhoto = activeTab === 'bride' ? formData.brideImage : formData.groomImage;
  const isBride = activeTab === 'bride';

  // Helper styles based on active tab
  const themeColor = isBride ? 'pink' : 'blue';
  const gradientHeader = isBride 
    ? 'from-pink-500 via-rose-500 to-red-500' 
    : 'from-blue-600 via-indigo-600 to-violet-600';
  const activeTabClass = isBride
    ? 'bg-white text-pink-600 shadow-sm ring-1 ring-black/5'
    : 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5';
  
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
          
          {/* 1. Header Section */}
          <div className={`relative bg-gradient-to-r ${gradientHeader} p-6 sm:p-8 text-white transition-all duration-500`}>
            {/* Abstract Shapes for Texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl" />

            <div className="relative flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                  <Heart className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">Edit Mempelai</h2>
                  <p className="text-white/80 text-sm font-medium">Atur profil pasangan pengantin</p>
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

          {/* 2. Modern Segmented Tab Control */}
          <div className="px-6 sm:px-8 py-5 bg-white border-b border-gray-100 z-10">
            <div className="bg-gray-100/80 p-1.5 rounded-2xl flex relative">
              <button
                className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isBride ? activeTabClass : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                onClick={() => setActiveTab('bride')}
                disabled={isSaving}
              >
                {formData.brideImage ? (
                  <Image src={formData.brideImage} alt="Bride" width={24} height={24} className="w-6 h-6 rounded-full object-cover ring-2 ring-pink-100" />
                ) : (
                   <User className={`w-4 h-4 ${isBride ? 'text-pink-500' : 'text-gray-400'}`} />
                )}
                Mempelai Wanita
              </button>
              
              <button
                className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${!isBride ? activeTabClass : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                onClick={() => setActiveTab('groom')}
                disabled={isSaving}
              >
                 {formData.groomImage ? (
                  <Image src={formData.groomImage} alt="Groom" width={24} height={24} className="w-6 h-6 rounded-full object-cover ring-2 ring-blue-100" />
                ) : (
                   <User className={`w-4 h-4 ${!isBride ? 'text-blue-500' : 'text-gray-400'}`} />
                )}
                Mempelai Pria
              </button>
            </div>
          </div>

          {/* 3. Scrollable Content */}
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

            {/* Photo Section - Card Style */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
               <div className="relative group">
                 <div className={`w-28 h-28 rounded-full p-1 bg-gradient-to-br ${isBride ? 'from-pink-200 to-rose-200' : 'from-blue-200 to-indigo-200'}`}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden relative">
                      {currentPhoto ? (
                        <Image
                          src={currentPhoto}
                          alt="Preview"
                          width={112}
                          height={112}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <Camera className="w-10 h-10 text-gray-300" />
                      )}
                    </div>
                 </div>
                 <div className={`absolute bottom-1 right-1 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-md ${isBride ? 'bg-pink-500' : 'bg-blue-500'}`}>
                    <Sparkles className="w-4 h-4 text-white" />
                 </div>
               </div>
               
               <div className="flex-1 w-full text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">Foto Profil</h3>
                  <p className="text-sm text-gray-500 mb-4">Gunakan foto rasio 1:1 (persegi) untuk hasil terbaik.</p>
                  <div className="w-full">
                    <SinglePhotoUpload
                      clientSlug={clientSlug}
                      photoType={isBride ? 'brideImage' : 'groomImage'}
                      currentPhoto={currentPhoto}
                      onPhotoChange={handlePhotoChange(isBride ? 'brideImage' : 'groomImage')}
                      label="Upload Foto Baru"
                    />
                  </div>
               </div>
            </div>

            {/* Form Fields - Clean Style */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <User className={`w-4 h-4 ${isBride ? 'text-pink-500' : 'text-blue-500'}`} />
                <span className="text-sm font-bold text-gray-900 uppercase tracking-wider">Informasi Utama</span>
              </div>

              {/* Dynamic Form Content */}
              <div className="grid gap-5 animate-in fade-in duration-300 key={activeTab}">
                 {/* Nama Lengkap */}
                 <div className="group">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={isBride ? formData.brideFullName : formData.groomFullName}
                      onChange={(e) => handleInputChange(isBride ? 'brideFullName' : 'groomFullName', e.target.value)}
                      placeholder={isBride ? "Contoh: Siti Nurhaliza" : "Contoh: Ahmad Dahlan"}
                      className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${isBride ? 'focus:ring-pink-500/50' : 'focus:ring-blue-500/50'}`}
                      disabled={isSaving}
                    />
                 </div>

                 <div className="grid grid-cols-12 gap-4">
                    {/* Anak Ke */}
                    <div className="col-span-4 sm:col-span-3">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Anak Ke-</label>
                      <input
                        type="text"
                        value={isBride ? formData.brideChildOrder : formData.groomChildOrder}
                        onChange={(e) => handleInputChange(isBride ? 'brideChildOrder' : 'groomChildOrder', e.target.value)}
                        placeholder="1"
                        className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-center font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${isBride ? 'focus:ring-pink-500/50' : 'focus:ring-blue-500/50'}`}
                        disabled={isSaving}
                      />
                    </div>

                    {/* Nama Ayah */}
                    <div className="col-span-8 sm:col-span-9">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Nama Ayah</label>
                      <input
                        type="text"
                        value={isBride ? formData.brideFatherName : formData.groomFatherName}
                        onChange={(e) => handleInputChange(isBride ? 'brideFatherName' : 'groomFatherName', e.target.value)}
                        placeholder="Nama Ayah Kandung"
                        className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${isBride ? 'focus:ring-pink-500/50' : 'focus:ring-blue-500/50'}`}
                        disabled={isSaving}
                      />
                    </div>
                 </div>

                 {/* Nama Ibu */}
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Nama Ibu</label>
                    <input
                      type="text"
                      value={isBride ? formData.brideMotherName : formData.groomMotherName}
                      onChange={(e) => handleInputChange(isBride ? 'brideMotherName' : 'groomMotherName', e.target.value)}
                      placeholder="Nama Ibu Kandung"
                      className={`w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all ${isBride ? 'focus:ring-pink-500/50' : 'focus:ring-blue-500/50'}`}
                      disabled={isSaving}
                    />
                 </div>
              </div>

              {/* Info Box */}
              <div className="mt-4 bg-amber-50 rounded-xl p-4 border border-amber-100/50 flex gap-3">
                 <Users className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                 <div className="text-xs text-amber-800 leading-relaxed">
                   <strong className="block mb-1 font-semibold">Tampilan di Undangan:</strong>
                   "Putri/Putra ke-<span className="font-mono bg-amber-100 px-1 rounded mx-0.5">{isBride ? (formData.brideChildOrder || 'X') : (formData.groomChildOrder || 'X')}</span> 
                   dari Bapak <span className="font-mono bg-amber-100 px-1 rounded mx-0.5">{isBride ? (formData.brideFatherName || '...') : (formData.groomFatherName || '...')}</span> 
                   & Ibu <span className="font-mono bg-amber-100 px-1 rounded mx-0.5">{isBride ? (formData.brideMotherName || '...') : (formData.groomMotherName || '...')}</span>"
                 </div>
              </div>
            </div>
          </div>

          {/* 4. Footer Actions */}
          <div className="p-4 sm:p-6 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-20">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between items-center">
               <button
                onClick={handleResetClick}
                className="text-sm text-gray-400 hover:text-gray-600 font-medium px-4 py-2 transition-colors flex items-center gap-2"
                disabled={isSaving}
              >
                Reset Data
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
                  className={`flex-1 sm:flex-none px-8 py-3 text-white font-semibold rounded-xl shadow-lg shadow-${themeColor}-500/30 hover:shadow-${themeColor}-500/40 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r ${isBride ? 'from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700' : 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'} flex items-center justify-center gap-2`}
                  disabled={isSaving || !formData.brideFullName.trim() || !formData.groomFullName.trim()}
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

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetConfirm}
        title="Reset Data?"
        message="Semua perubahan yang belum disimpan akan dikembalikan ke data awal. Apakah Anda yakin?"
        confirmText="Ya, Reset"
        cancelText="Batal"
        type="reset"
      />
    </>
  );
};

export default WelcomeEditModal;