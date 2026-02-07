'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Check, Loader, MapPin, Eye, EyeOff, CreditCard, 
  Wallet, Gift, ChevronDown, Building, User
} from 'lucide-react';
import { useEditing } from '@/contexts/EditingContext';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Image from 'next/image';

// --- Interfaces ---
interface WeddingGiftEditModalProps {
  clientSlug: string;
  sectionId: string;
  initialData?: {
    bankType1?: string;
    accountNumber?: string;
    accountName?: string;
    bankType2?: string;
    accountNumber2?: string;
    accountName2?: string;
  };
  initialAddressData?: {
    address?: string;
  };
  onClose: () => void;
  onSaveSuccess?: () => void;
}

interface BankLogo {
  name: string;
  path: string;
  fileName: string;
}

const DEFAULT_ADDRESS = 'Jl. DR. Sumarno No 1 (Sentra Primer), Penggilingan, Cakung, Jakarta Timur.';

// --- Sub-Components (Defined OUTSIDE to fix focus issue) ---

const ToggleSwitch = ({ checked, onChange, disabled }: { checked: boolean, onChange: (v: boolean) => void, disabled?: boolean }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    disabled={disabled}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${checked ? 'bg-emerald-500' : 'bg-gray-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const InputField = ({ 
  label, icon: Icon, value, onChange, placeholder, type = "text", disabled 
}: { 
  label: string, icon: any, value: string, onChange: (val: string) => void, placeholder: string, type?: string, disabled?: boolean 
}) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed"
      />
    </div>
  </div>
);

// --- Main Component ---

const WeddingGiftEditModal: React.FC<WeddingGiftEditModalProps> = ({
  clientSlug,
  sectionId,
  initialData = {},
  initialAddressData = {},
  onClose,
  onSaveSuccess,
}) => {
  const { setSaveStatus, unlockEditing } = useEditing();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [bankLogos, setBankLogos] = useState<BankLogo[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState<'bank1' | 'bank2' | 'address'>('bank1');

  // Visibility settings
  const [showSecondBank, setShowSecondBank] = useState(true);
  const [showGiftAddress, setShowGiftAddress] = useState(true);

  // Form States
  const [formData, setFormData] = useState({
    bankType1: initialData.bankType1 || '',
    accountNumber: initialData.accountNumber || '',
    accountName: initialData.accountName || '',
    bankType2: initialData.bankType2 || '',
    accountNumber2: initialData.accountNumber2 || '',
    accountName2: initialData.accountName2 || '',
  });

  const [addressData, setAddressData] = useState({
    address: initialAddressData.address || DEFAULT_ADDRESS,
  });

  // --- Effects ---
  useEffect(() => {
    document.body.classList.add('modal-open');
    return () => document.body.classList.remove('modal-open');
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving) handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSaving]);

  // Fetch Bank Logos
  useEffect(() => {
    const fetchBankLogos = async () => {
      try {
        const response = await fetch(`/api/bank-logos?t=${Date.now()}`);
        if (response.ok) {
          const data = await response.json();
          setBankLogos(data);
        }
      } catch (error) {
        console.error('Error fetching bank logos:', error);
      }
    };
    fetchBankLogos();
  }, []);

  // Fetch Visibility & Address
  useEffect(() => {
    if (clientSlug) {
      // Visibility
      fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=gift_visibility`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
            if (data.length > 0 && data[0].content_data) {
                setShowSecondBank(data[0].content_data.showSecondBank !== false);
                setShowGiftAddress(data[0].content_data.showGiftAddress !== false);
            }
        }).catch(console.error);

      // Address
      if (!initialAddressData.address) {
        fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=gift_address`)
          .then(res => res.ok ? res.json() : [])
          .then(data => {
             if (data.length > 0 && data[0].content_data) {
                setAddressData({ address: data[0].content_data.address || DEFAULT_ADDRESS });
             }
          }).catch(console.error);
      }
    }
  }, [clientSlug, initialAddressData.address]);

  // --- Handlers ---
  const handleClose = () => {
    unlockEditing(sectionId);
    onClose();
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetConfirm = () => {
    setFormData({
      bankType1: initialData.bankType1 || '',
      accountNumber: initialData.accountNumber || '',
      accountName: initialData.accountName || '',
      bankType2: initialData.bankType2 || '',
      accountNumber2: initialData.accountNumber2 || '',
      accountName2: initialData.accountName2 || '',
    });
    setAddressData({ address: initialAddressData.address || DEFAULT_ADDRESS });
    setShowResetConfirm(false);
    setSuccessMessage('Data berhasil direset');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  const handleSave = async () => {
    if (!formData.bankType1 || !formData.accountNumber) {
      setError('Rekening utama wajib diisi');
      return;
    }

    try {
      setIsSaving(true);
      setSaveStatus(sectionId, 'saving');
      setError(null);

      await Promise.all([
        fetch('/api/client-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientSlug, contentType: 'wedding_gift', contentData: formData }),
        }),
        fetch('/api/client-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientSlug, contentType: 'gift_visibility', contentData: { showSecondBank, showGiftAddress } }),
        }),
        fetch('/api/client-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clientSlug, contentType: 'gift_address', contentData: addressData }),
        }),
      ]);

      setSaveStatus(sectionId, 'saved');
      setSuccessMessage('Berhasil disimpan!');
      if (onSaveSuccess) onSaveSuccess();
      setTimeout(() => handleClose(), 800);
    } catch (err) {
      setSaveStatus(sectionId, 'error');
      setError('Gagal menyimpan. Coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity" onClick={!isSaving ? handleClose : undefined} />

      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
        <div className="bg-white w-full max-w-2xl h-[85vh] sm:h-auto sm:max-h-[90vh] rounded-t-[2rem] sm:rounded-3xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300">
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 p-6 sm:p-8 shrink-0">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
                  <Gift className="w-6 h-6 text-white drop-shadow-md" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Wedding Gift</h2>
                  <p className="text-emerald-100 text-sm font-medium">Amplop Digital & Kado</p>
                </div>
              </div>
              <button onClick={handleClose} disabled={isSaving} className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all border border-white/10 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-6 pt-4 pb-2 bg-white border-b border-gray-100 shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 min-w-max">
              {[
                { id: 'bank1', label: 'Rekening Utama', icon: CreditCard, color: 'emerald' },
                { id: 'bank2', label: 'Rekening Kedua', icon: Wallet, color: 'cyan' },
                { id: 'address', label: 'Alamat Kirim', icon: MapPin, color: 'purple' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id as any)}
                  disabled={isSaving}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeSection === tab.id
                      ? `bg-${tab.color}-50 text-${tab.color}-700 ring-1 ring-${tab.color}-200 shadow-sm`
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className={`w-4 h-4 ${activeSection === tab.id ? `text-${tab.color}-600` : ''}`} />
                  {tab.label}
                  {tab.id === 'bank2' && showSecondBank && formData.bankType2 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gray-50/50">
            
            {successMessage && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
                <div className="p-1 bg-emerald-100 rounded-full"><Check className="w-4 h-4 text-emerald-600" /></div>
                <span className="text-emerald-700 text-sm font-medium">{successMessage}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm font-medium">
                {error}
              </div>
            )}

            {/* BANK 1 SECTION */}
            {activeSection === 'bank1' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
                   {/* Bank Selector */}
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Bank / E-Wallet</label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Building className="w-5 h-5" /></div>
                        <select
                          value={formData.bankType1}
                          onChange={(e) => handleChange('bankType1', e.target.value)}
                          disabled={isSaving}
                          className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          <option value="">Pilih Bank Tujuan</option>
                          {bankLogos.map(l => <option key={l.name} value={l.name}>{l.name.toUpperCase()}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                      </div>
                   </div>

                   <InputField 
                     label="Nomor Rekening" 
                     icon={CreditCard} 
                     value={formData.accountNumber} 
                     onChange={(v) => handleChange('accountNumber', v)} 
                     placeholder="Contoh: 1234567890"
                     disabled={isSaving}
                   />
                   
                   <InputField 
                     label="Atas Nama" 
                     icon={User} 
                     value={formData.accountName} 
                     onChange={(v) => handleChange('accountName', v)} 
                     placeholder="Nama Pemilik Rekening"
                     disabled={isSaving}
                   />
                </div>
              </div>
            )}

            {/* BANK 2 SECTION */}
            {activeSection === 'bank2' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${showSecondBank ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-100 text-gray-400'}`}>
                         {showSecondBank ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </div>
                      <div className="text-sm font-medium text-gray-700">Tampilkan Rekening Kedua</div>
                   </div>
                   <ToggleSwitch checked={showSecondBank} onChange={setShowSecondBank} disabled={isSaving} />
                </div>

                {showSecondBank && (
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Bank / E-Wallet</label>
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Building className="w-5 h-5" /></div>
                          <select
                            value={formData.bankType2}
                            onChange={(e) => handleChange('bankType2', e.target.value)}
                            disabled={isSaving}
                            className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            <option value="">Pilih Bank Tujuan</option>
                            {bankLogos.map(l => <option key={l.name} value={l.name}>{l.name.toUpperCase()}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <InputField 
                      label="Nomor Rekening" 
                      icon={CreditCard} 
                      value={formData.accountNumber2} 
                      onChange={(v) => handleChange('accountNumber2', v)} 
                      placeholder="Contoh: 08123456789"
                      disabled={isSaving}
                    />
                    
                    <InputField 
                      label="Atas Nama" 
                      icon={User} 
                      value={formData.accountName2} 
                      onChange={(v) => handleChange('accountName2', v)} 
                      placeholder="Nama Pemilik Rekening"
                      disabled={isSaving}
                    />
                  </div>
                )}
              </div>
            )}

            {/* ADDRESS SECTION */}
            {activeSection === 'address' && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${showGiftAddress ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                         {showGiftAddress ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </div>
                      <div className="text-sm font-medium text-gray-700">Tampilkan Alamat Kirim</div>
                   </div>
                   <ToggleSwitch checked={showGiftAddress} onChange={setShowGiftAddress} disabled={isSaving} />
                </div>

                {showGiftAddress && (
                  <div className="bg-white rounded-2xl p-1 shadow-sm border border-gray-100">
                    <div className="relative group p-4 border-2 border-dashed border-purple-100 rounded-xl bg-purple-50/30">
                       <label className="flex items-center gap-2 text-[10px] font-bold text-purple-600 uppercase tracking-wide mb-3">
                         <MapPin className="w-3 h-3" /> Alamat Lengkap Penerima
                       </label>
                       <textarea
                         value={addressData.address}
                         onChange={(e) => setAddressData({ address: e.target.value })}
                         placeholder="Masukkan alamat lengkap pengiriman kado..."
                         rows={5}
                         disabled={isSaving}
                         className="w-full bg-transparent border-none p-0 text-gray-800 placeholder-gray-400 focus:ring-0 text-sm leading-relaxed resize-none font-medium disabled:opacity-70"
                       />
                       <div className="absolute bottom-4 right-4 text-purple-300 pointer-events-none">
                         <MapPin className="w-12 h-12 opacity-10" />
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 sm:p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] z-10">
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between items-center">
               <button
                 onClick={() => setShowResetConfirm(true)}
                 disabled={isSaving}
                 className="text-sm text-gray-400 hover:text-gray-600 font-medium px-4 py-2 transition-colors w-full sm:w-auto text-center"
               >
                 Reset Form
               </button>

               <div className="flex gap-3 w-full sm:w-auto">
                 <button
                   onClick={handleClose}
                   disabled={isSaving}
                   className="flex-1 sm:flex-none px-6 py-3 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all text-sm"
                 >
                   Batal
                 </button>
                 <button
                   onClick={handleSave}
                   disabled={isSaving}
                   className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/40 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                 >
                   {isSaving ? (
                     <>
                       <Loader className="w-4 h-4 animate-spin" />
                       Menyimpan...
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

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetConfirm}
        title="Reset Data?"
        message="Kembalikan semua data ke kondisi awal?"
        confirmText="Ya, Reset"
        cancelText="Batal"
        type="reset"
      />
    </>
  );
};

export default WeddingGiftEditModal;