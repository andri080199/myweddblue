'use client';

import React, { useState, useEffect } from 'react';
import { X, Check, Loader, MapPin, Eye, EyeOff } from 'lucide-react';
import { useEditing } from '@/contexts/EditingContext';
import Image from 'next/image';

interface WeddingGiftInlineEditorProps {
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
  onSaveSuccess?: () => void;
}

interface BankLogo {
  name: string;
  path: string;
  fileName: string;
}

// Default address
const DEFAULT_ADDRESS = 'Jl. DR. Sumarno No 1 (Sentra Primer), Penggilingan, Cakung, Jakarta Timur.';

const WeddingGiftInlineEditor: React.FC<WeddingGiftInlineEditorProps> = ({
  clientSlug,
  sectionId,
  initialData = {},
  initialAddressData = {},
  onSaveSuccess,
}) => {
  const { setSaveStatus, unlockEditing } = useEditing();
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isSavingVisibility, setIsSavingVisibility] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [bankLogos, setBankLogos] = useState<BankLogo[]>([]);

  // Visibility settings
  const [showSecondBank, setShowSecondBank] = useState(true);
  const [showGiftAddress, setShowGiftAddress] = useState(true);

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

  // Fetch bank logos
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

  // Fetch visibility settings
  useEffect(() => {
    if (clientSlug) {
      const fetchVisibilitySettings = async () => {
        try {
          const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=gift_visibility`);
          if (response.ok) {
            const data = await response.json();
            if (data.length > 0 && data[0].content_data) {
              const settings = data[0].content_data;
              setShowSecondBank(settings.showSecondBank !== false);
              setShowGiftAddress(settings.showGiftAddress !== false);
            }
          }
        } catch (error) {
          console.error('Error fetching visibility settings:', error);
        }
      };
      fetchVisibilitySettings();
    }
  }, [clientSlug]);

  // Fetch address data if not provided via props
  useEffect(() => {
    if (!initialAddressData.address && clientSlug) {
      const fetchAddressData = async () => {
        try {
          const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=gift_address`);
          if (response.ok) {
            const data = await response.json();
            if (data.length > 0 && data[0].content_data) {
              setAddressData({
                address: data[0].content_data.address || DEFAULT_ADDRESS,
              });
            }
          }
        } catch (error) {
          console.error('Error fetching address data:', error);
        }
      };
      fetchAddressData();
    }
  }, [clientSlug, initialAddressData.address]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (value: string) => {
    setAddressData((prev) => ({ ...prev, address: value }));
  };

  const getBankLogo = (bankName: string) => {
    if (!bankName) return null;
    const bankNameLower = bankName.toLowerCase().trim();
    const logo = bankLogos.find((logo) => logo.name.toLowerCase().trim() === bankNameLower);
    return logo ? `${logo.path}?t=${Date.now()}` : null;
  };

  const handleToggleVisibility = async (field: 'showSecondBank' | 'showGiftAddress', value: boolean) => {
    // Update local state immediately for responsive UI
    if (field === 'showSecondBank') {
      setShowSecondBank(value);
    } else {
      setShowGiftAddress(value);
    }

    try {
      setIsSavingVisibility(true);
      setError(null);

      const visibilityData = {
        showSecondBank: field === 'showSecondBank' ? value : showSecondBank,
        showGiftAddress: field === 'showGiftAddress' ? value : showGiftAddress,
      };

      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug,
          contentType: 'gift_visibility',
          contentData: visibilityData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save visibility settings');
      }

      setSuccessMessage(value ? 'Ditampilkan' : 'Disembunyikan');
      setTimeout(() => setSuccessMessage(null), 1500);

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error('Save visibility error:', err);
      // Revert on error
      if (field === 'showSecondBank') {
        setShowSecondBank(!value);
      } else {
        setShowGiftAddress(!value);
      }
      setError('Gagal menyimpan pengaturan. Silakan coba lagi.');
    } finally {
      setIsSavingVisibility(false);
    }
  };

  const handleSave = async () => {
    if (!formData.bankType1 || !formData.accountNumber) {
      setError('Bank dan nomor rekening utama wajib diisi');
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
          contentType: 'wedding_gift',
          contentData: formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      setSaveStatus(sectionId, 'saved');
      setSuccessMessage('Rekening berhasil disimpan!');
      setTimeout(() => setSuccessMessage(null), 2000);

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error('Save error:', err);
      setSaveStatus(sectionId, 'error');
      setError('Gagal menyimpan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!addressData.address.trim()) {
      setError('Alamat pengiriman tidak boleh kosong');
      return;
    }

    try {
      setIsSavingAddress(true);
      setSaveStatus(sectionId, 'saving');
      setError(null);

      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientSlug,
          contentType: 'gift_address',
          contentData: addressData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      setSaveStatus(sectionId, 'saved');
      setSuccessMessage('Alamat pengiriman berhasil disimpan!');
      setTimeout(() => setSuccessMessage(null), 2000);

      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      console.error('Save address error:', err);
      setSaveStatus(sectionId, 'error');
      setError('Gagal menyimpan alamat. Silakan coba lagi.');
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleReset = () => {
    setFormData({
      bankType1: initialData.bankType1 || '',
      accountNumber: initialData.accountNumber || '',
      accountName: initialData.accountName || '',
      bankType2: initialData.bankType2 || '',
      accountNumber2: initialData.accountNumber2 || '',
      accountName2: initialData.accountName2 || '',
    });
  };

  const handleResetAddress = () => {
    setAddressData({
      address: initialAddressData.address || DEFAULT_ADDRESS,
    });
  };

  // Toggle Switch Component
  const ToggleSwitch = ({
    checked,
    onChange,
    disabled,
    label
  }: {
    checked: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
    label: string;
  }) => (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
        ${checked ? 'bg-blue-500' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
      title={label}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );

  return (
    <div className="space-y-6 bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-2xl border-2 border-blue-400 pointer-events-auto mx-4 md:mx-0 max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Edit Wedding Gift</h3>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm flex items-center gap-2">
          <Check className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Bank 1 (Primary) */}
      <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-900">Rekening Utama</h4>

        <div className="inline-form-field">
          <label className="inline-form-label">
            Bank <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.bankType1}
            onChange={(e) => handleChange('bankType1', e.target.value)}
            className="inline-form-input"
            disabled={isSaving}
          >
            <option value="">Pilih Bank</option>
            {bankLogos.map((logo) => (
              <option key={logo.name} value={logo.name}>
                {logo.name.toUpperCase()}
              </option>
            ))}
          </select>
          {formData.bankType1 && getBankLogo(formData.bankType1) && (
            <div className="mt-2">
              <Image
                src={getBankLogo(formData.bankType1)!}
                alt={formData.bankType1}
                width={60}
                height={60}
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </div>

        <div className="inline-form-field">
          <label className="inline-form-label">
            Nomor Rekening <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.accountNumber}
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            placeholder="1234567890"
            className="inline-form-input"
            disabled={isSaving}
          />
        </div>

        <div className="inline-form-field">
          <label className="inline-form-label">Nama Pemilik Rekening</label>
          <input
            type="text"
            value={formData.accountName}
            onChange={(e) => handleChange('accountName', e.target.value)}
            placeholder="Nama sesuai rekening"
            className="inline-form-input"
            disabled={isSaving}
          />
        </div>
      </div>

      {/* Bank 2 (Optional) with Toggle */}
      <div className={`space-y-4 p-4 rounded-lg transition-all duration-200 ${showSecondBank ? 'bg-gray-50' : 'bg-gray-100 opacity-75'}`}>
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">Rekening Tambahan</h4>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {showSecondBank ? (
                <span className="flex items-center gap-1 text-green-600">
                  <Eye className="w-3 h-3" /> Tampil
                </span>
              ) : (
                <span className="flex items-center gap-1 text-gray-400">
                  <EyeOff className="w-3 h-3" /> Sembunyi
                </span>
              )}
            </span>
            <ToggleSwitch
              checked={showSecondBank}
              onChange={(value) => handleToggleVisibility('showSecondBank', value)}
              disabled={isSavingVisibility}
              label="Toggle rekening tambahan"
            />
          </div>
        </div>

        {showSecondBank && (
          <>
            <div className="inline-form-field">
              <label className="inline-form-label">Bank</label>
              <select
                value={formData.bankType2}
                onChange={(e) => handleChange('bankType2', e.target.value)}
                className="inline-form-input"
                disabled={isSaving}
              >
                <option value="">Pilih Bank</option>
                {bankLogos.map((logo) => (
                  <option key={logo.name} value={logo.name}>
                    {logo.name.toUpperCase()}
                  </option>
                ))}
              </select>
              {formData.bankType2 && getBankLogo(formData.bankType2) && (
                <div className="mt-2">
                  <Image
                    src={getBankLogo(formData.bankType2)!}
                    alt={formData.bankType2}
                    width={60}
                    height={60}
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>

            <div className="inline-form-field">
              <label className="inline-form-label">Nomor Rekening</label>
              <input
                type="text"
                value={formData.accountNumber2}
                onChange={(e) => handleChange('accountNumber2', e.target.value)}
                placeholder="1234567890"
                className="inline-form-input"
                disabled={isSaving}
              />
            </div>

            <div className="inline-form-field">
              <label className="inline-form-label">Nama Pemilik Rekening</label>
              <input
                type="text"
                value={formData.accountName2}
                onChange={(e) => handleChange('accountName2', e.target.value)}
                placeholder="Nama sesuai rekening"
                className="inline-form-input"
                disabled={isSaving}
              />
            </div>
          </>
        )}
      </div>

      {/* Action buttons for Bank */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button onClick={handleReset} className="btn-secondary" disabled={isSaving}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Rekening
        </button>
        <button
          onClick={handleSave}
          className="btn-primary"
          disabled={isSaving || !formData.bankType1 || !formData.accountNumber}
        >
          {isSaving ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Simpan Rekening
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="border-t-2 border-gray-200 pt-6">
        {/* Gift Address Section with Toggle */}
        <div className={`space-y-4 p-4 rounded-lg transition-all duration-200 ${showGiftAddress ? 'bg-purple-50' : 'bg-gray-100 opacity-75'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Alamat Pengiriman Kado</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {showGiftAddress ? (
                  <span className="flex items-center gap-1 text-green-600">
                    <Eye className="w-3 h-3" /> Tampil
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-400">
                    <EyeOff className="w-3 h-3" /> Sembunyi
                  </span>
                )}
              </span>
              <ToggleSwitch
                checked={showGiftAddress}
                onChange={(value) => handleToggleVisibility('showGiftAddress', value)}
                disabled={isSavingVisibility}
                label="Toggle alamat pengiriman"
              />
            </div>
          </div>

          {showGiftAddress && (
            <>
              <p className="text-xs text-gray-500">
                Alamat ini akan ditampilkan di kartu hadiah untuk tamu yang ingin mengirim kado fisik.
              </p>

              <div className="inline-form-field">
                <label className="inline-form-label">
                  Alamat Lengkap <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={addressData.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  placeholder="Masukkan alamat lengkap pengiriman kado..."
                  rows={3}
                  className="inline-form-input resize-y"
                  disabled={isSavingAddress}
                />
              </div>

              {/* Action buttons for Address */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button onClick={handleResetAddress} className="btn-secondary" disabled={isSavingAddress}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Alamat
                </button>
                <button
                  onClick={handleSaveAddress}
                  className="btn-primary"
                  disabled={isSavingAddress || !addressData.address.trim()}
                >
                  {isSavingAddress ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Simpan Alamat
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeddingGiftInlineEditor;
