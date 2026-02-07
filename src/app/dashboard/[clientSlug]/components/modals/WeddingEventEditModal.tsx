'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Check, Loader, CalendarDays, MapPin, 
  Building2, Link2, Map, Sparkles, Gem, ChevronDown 
} from 'lucide-react';
import { useEditing } from '@/contexts/EditingContext';

interface WeddingEventEditModalProps {
  clientSlug: string;
  sectionId: string;
  initialAkadData?: {
    weddingDate?: string;
    akadTime?: string;
    venue?: string;
    address?: string;
    mapsLink?: string;
  };
  initialResepsiData?: {
    weddingDate?: string;
    resepsiTime?: string;
    venue?: string;
    address?: string;
    mapsLink?: string;
  };
  onClose: () => void;
  onSaveSuccess?: () => void;
}

const WeddingEventEditModal: React.FC<WeddingEventEditModalProps> = ({
  clientSlug,
  sectionId,
  initialAkadData = {},
  initialResepsiData = {},
  onClose,
  onSaveSuccess,
}) => {
  const { setSaveStatus, unlockEditing } = useEditing();
  const [activeTab, setActiveTab] = useState<'akad' | 'resepsi'>('akad');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [akadData, setAkadData] = useState({
    weddingDate: initialAkadData.weddingDate || '',
    akadTime: initialAkadData.akadTime || '',
    venue: initialAkadData.venue || '',
    address: initialAkadData.address || '',
    mapsLink: initialAkadData.mapsLink || '',
  });

  const [resepsiData, setResepsiData] = useState({
    weddingDate: initialResepsiData.weddingDate || '',
    resepsiTime: initialResepsiData.resepsiTime || '',
    venue: initialResepsiData.venue || '',
    address: initialResepsiData.address || '',
    mapsLink: initialResepsiData.mapsLink || '',
  });

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
      if (e.key === 'Escape' && !isSaving) handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSaving]);

  const handleClose = () => {
    unlockEditing(sectionId);
    onClose();
  };

  const handleReset = () => {
    setAkadData({
      weddingDate: initialAkadData.weddingDate || '',
      akadTime: initialAkadData.akadTime || '',
      venue: initialAkadData.venue || '',
      address: initialAkadData.address || '',
      mapsLink: initialAkadData.mapsLink || '',
    });
    setResepsiData({
      weddingDate: initialResepsiData.weddingDate || '',
      resepsiTime: initialResepsiData.resepsiTime || '',
      venue: initialResepsiData.venue || '',
      address: initialResepsiData.address || '',
      mapsLink: initialResepsiData.mapsLink || '',
    });
  };

  const handleAkadChange = (field: string, value: string) => {
    setAkadData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResepsiChange = (field: string, value: string) => {
    setResepsiData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setSaveStatus(sectionId, 'saving');
      setError(null);

      await Promise.all([
        fetch('/api/client-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientSlug,
            contentType: 'akad_info',
            contentData: akadData,
          }),
        }),
        fetch('/api/client-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientSlug,
            contentType: 'resepsi_info',
            contentData: resepsiData,
          }),
        })
      ]);

      setSaveStatus(sectionId, 'saved');
      if (onSaveSuccess) onSaveSuccess();

      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus(sectionId, 'error');
      setError('Gagal menyimpan data acara. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- REFINED CUSTOM TIME PICKER ---
  const CustomTimePicker = ({ 
    value, 
    onChange, 
    focusClass 
  }: { 
    value: string; 
    onChange: (val: string) => void;
    focusClass: string;
  }) => {
    const [hours, minutes] = (value || '00:00').split(':');
    
    const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(`${e.target.value}:${minutes || '00'}`);
    };

    const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(`${hours || '00'}:${e.target.value}`);
    };

    const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    const minuteOptions = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    // Common style for the select boxes
    const selectBoxClass = `
      w-full appearance-none bg-gray-50 border border-gray-200 
      rounded-lg py-2.5 pl-3 pr-8 
      text-center font-mono text-base font-semibold text-gray-800
      focus:outline-none focus:ring-2 focus:bg-white transition-all cursor-pointer
      ${focusClass}
    `;

    return (
      <div className="flex items-center gap-2">
        {/* Hour Select */}
        <div className="relative flex-1 min-w-[80px]">
           <select value={hours} onChange={handleHourChange} className={selectBoxClass}>
             {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
           </select>
           <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
           <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-gray-400 font-medium rounded">Jam</span>
        </div>

        <span className="text-gray-300 font-bold text-lg px-1">:</span>

        {/* Minute Select */}
        <div className="relative flex-1 min-w-[80px]">
           <select value={minutes} onChange={handleMinuteChange} className={selectBoxClass}>
             {minuteOptions.map(m => <option key={m} value={m}>{m}</option>)}
           </select>
           <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
           <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] text-gray-400 font-medium rounded">Menit</span>
        </div>

        {/* WIB Label */}
        <div className="bg-gray-100 text-gray-500 text-xs font-bold px-2.5 py-2.5 rounded-lg border border-gray-200">
          WIB
        </div>
      </div>
    );
  };

  // Helpers
  const isAkad = activeTab === 'akad';
  const gradientClass = isAkad 
    ? 'from-amber-500 via-orange-500 to-yellow-500' 
    : 'from-pink-500 via-rose-500 to-red-500';
  const focusRingClass = isAkad ? 'focus:ring-amber-500/30 focus:border-amber-500' : 'focus:ring-pink-500/30 focus:border-pink-500';

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={!isSaving ? handleClose : undefined} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* 1. Header */}
          <div className={`relative bg-gradient-to-r ${gradientClass} p-6 text-white shrink-0 transition-colors duration-500`}>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

             <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-inner">
                      {isAkad ? <Gem className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
                   </div>
                   <div>
                      <h2 className="text-lg font-bold tracking-tight">Detail Acara</h2>
                      <p className="text-white/90 text-xs font-medium opacity-90">
                        {isAkad ? 'Jadwal Akad Nikah' : 'Jadwal Resepsi'}
                      </p>
                   </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all backdrop-blur-sm border border-white/10"
                  disabled={isSaving}
                >
                  <X className="w-5 h-5" />
                </button>
             </div>
          </div>

          {/* 2. Tabs */}
          <div className="px-6 pt-5 pb-2 bg-white">
            <div className="p-1 bg-gray-50 rounded-xl flex gap-1 relative border border-gray-100">
               <button
                 onClick={() => setActiveTab('akad')}
                 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                   isAkad 
                     ? 'bg-white text-amber-600 shadow-sm ring-1 ring-black/5' 
                     : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                 }`}
               >
                 <Gem className="w-4 h-4" />
                 Akad Nikah
               </button>
               <button
                 onClick={() => setActiveTab('resepsi')}
                 className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                   !isAkad 
                     ? 'bg-white text-pink-600 shadow-sm ring-1 ring-black/5' 
                     : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                 }`}
               >
                 <Sparkles className="w-4 h-4" />
                 Resepsi
               </button>
            </div>
          </div>

          {/* 3. Form Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
             
             {error && (
               <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm font-medium flex items-center gap-2">
                 <X className="w-4 h-4" /> {error}
               </div>
             )}

             <div className="space-y-6">
                
                {/* Row 1: Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Date */}
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Tanggal Acara</label>
                      <div className="relative group">
                         <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <CalendarDays className="w-5 h-5" />
                         </div>
                         <input
                           type="date"
                           value={isAkad ? akadData.weddingDate : resepsiData.weddingDate}
                           onChange={(e) => isAkad ? handleAkadChange('weddingDate', e.target.value) : handleResepsiChange('weddingDate', e.target.value)}
                           className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:bg-white focus:outline-none focus:ring-2 transition-all font-medium ${focusRingClass}`}
                           disabled={isSaving}
                         />
                      </div>
                   </div>

                   {/* Custom 24H Time Picker */}
                   <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                        Waktu (24 Jam)
                      </label>
                      <CustomTimePicker 
                        value={isAkad ? akadData.akadTime : resepsiData.resepsiTime}
                        onChange={(val) => isAkad ? handleAkadChange('akadTime', val) : handleResepsiChange('resepsiTime', val)}
                        focusClass={focusRingClass}
                      />
                   </div>
                </div>

                {/* Row 2: Venue Name */}
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Lokasi / Nama Gedung</label>
                   <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                         <Building2 className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        value={isAkad ? akadData.venue : resepsiData.venue}
                        onChange={(e) => isAkad ? handleAkadChange('venue', e.target.value) : handleResepsiChange('venue', e.target.value)}
                        placeholder="Contoh: Masjid Agung / Hotel Aston"
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${focusRingClass}`}
                        disabled={isSaving}
                      />
                   </div>
                </div>

                {/* Row 3: Full Address */}
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Alamat Lengkap</label>
                   <div className="relative group">
                      <div className="absolute left-3 top-3 text-gray-400">
                         <MapPin className="w-5 h-5" />
                      </div>
                      <textarea
                        value={isAkad ? akadData.address : resepsiData.address}
                        onChange={(e) => isAkad ? handleAkadChange('address', e.target.value) : handleResepsiChange('address', e.target.value)}
                        placeholder="Masukkan alamat lengkap lokasi acara..."
                        rows={3}
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all resize-none ${focusRingClass}`}
                        disabled={isSaving}
                      />
                   </div>
                </div>

                {/* Row 4: Maps Link */}
                <div className="space-y-1">
                   <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Link Google Maps</label>
                   <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                         <Link2 className="w-5 h-5" />
                      </div>
                      <input
                        type="url"
                        value={isAkad ? akadData.mapsLink : resepsiData.mapsLink}
                        onChange={(e) => isAkad ? handleAkadChange('mapsLink', e.target.value) : handleResepsiChange('mapsLink', e.target.value)}
                        placeholder="http://googleusercontent.com/maps.google.com/..."
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-blue-600 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 transition-all ${focusRingClass}`}
                        disabled={isSaving}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        {(isAkad ? akadData.mapsLink : resepsiData.mapsLink).includes('http') && (
                           <a 
                             href={isAkad ? akadData.mapsLink : resepsiData.mapsLink} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded hover:bg-blue-100 transition-colors"
                             title="Cek Link"
                           >
                              <Map className="w-3 h-3" />
                              Cek
                           </a>
                        )}
                      </div>
                   </div>
                </div>

             </div>
          </div>

          {/* 4. Footer */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between items-center">
               <button
                 onClick={handleReset}
                 className="text-sm text-gray-400 hover:text-gray-600 font-medium px-4 py-2 transition-colors w-full sm:w-auto text-center"
                 disabled={isSaving}
               >
                 Reset
               </button>

               <div className="flex gap-3 w-full sm:w-auto">
                 <button
                   onClick={handleClose}
                   className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm"
                   disabled={isSaving}
                 >
                   Batal
                 </button>
                 <button
                   onClick={handleSave}
                   className={`flex-1 sm:flex-none px-8 py-2.5 text-white font-semibold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-sm bg-gradient-to-r ${isAkad ? 'from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/30' : 'from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-pink-500/30'}`}
                   disabled={isSaving}
                 >
                   {isSaving ? (
                     <>
                       <Loader className="w-4 h-4 animate-spin" />
                       Simpan...
                     </>
                   ) : (
                     <>
                       <Check className="w-4 h-4" />
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

export default WeddingEventEditModal;