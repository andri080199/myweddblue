'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import SimpleAlert from '../ui/SuccessModal';

interface ContentEditorProps {
  clientSlug: string;
  contentType: string;
  title: string;
  defaultData: any;
  fields: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'date' | 'time' | 'select';
    placeholder?: string;
    options?: { value: string; label: string; }[];
  }[];
  onSave?: (data: any) => void;
}

interface BankLogo {
  name: string;
  path: string;
  fileName: string;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  clientSlug,
  contentType,
  title,
  defaultData,
  fields,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(defaultData);
  const [saving, setSaving] = useState(false);
  const [currentData, setCurrentData] = useState(defaultData);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    type: 'success' as 'success' | 'error',
    message: 'Konten berhasil disimpan!'
  });
  const [bankLogos, setBankLogos] = useState<BankLogo[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [logoRefreshKey, setLogoRefreshKey] = useState(0);

  useEffect(() => {
    fetchCurrentData();
    fetchBankLogos();
  }, [clientSlug, contentType]);

  // Refresh bank logos when dropdown is opened
  useEffect(() => {
    if (dropdownOpen) {
      fetchBankLogos();
    }
  }, [dropdownOpen]);

  const fetchBankLogos = async () => {
    try {
      // Add timestamp to prevent caching
      const response = await fetch(`/api/bank-logos?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setBankLogos(data);
        setLogoRefreshKey(prev => prev + 1); // Force re-render
      }
    } catch (error) {
      console.error('Error fetching bank logos:', error);
    }
  };

  const fetchCurrentData = async () => {
    try {
      const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=${contentType}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const savedData = data[0].content_data;
          setCurrentData(savedData);
          setFormData(savedData);
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/client-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientSlug,
          contentType,
          contentData: formData
        }),
      });

      if (response.ok) {
        setCurrentData(formData);
        setIsEditing(false);
        onSave?.(formData);
        // Refresh logos after save
        await fetchBankLogos();
        setAlertConfig({
          type: 'success',
          message: 'Konten berhasil disimpan!'
        });
        setShowAlert(true);
      } else {
        setAlertConfig({
          type: 'error',
          message: 'Gagal menyimpan konten'
        });
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setAlertConfig({
        type: 'error',
        message: 'Terjadi kesalahan jaringan'
      });
      setShowAlert(true);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(currentData);
    setIsEditing(false);
  };

  const getBankLogo = (bankName: string) => {
    if (!bankName) return null;
    const bankNameLower = bankName.toLowerCase().trim();
    const logo = bankLogos.find(logo => logo.name.toLowerCase().trim() === bankNameLower);
    // Add timestamp to prevent caching - use Date.now() for always fresh
    return logo ? `${logo.path}?t=${Date.now()}` : null;
  };

  const isBankField = (fieldKey: string) => {
    return fieldKey.includes('bankType') || fieldKey.includes('bank_type');
  };

  const renderField = (field: any) => {
    const value = formData[field.key] || '';

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full p-3 border-2 rounded-xl transition-all duration-300 resize-none shadow-sm ${
              isEditing 
                ? 'bg-white border-gray-300 text-gray-800 placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none' 
                : 'bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed'
            }`}
            rows={3}
            disabled={!isEditing}
          />
        );
      case 'select':
        // Custom dropdown for bank fields
        if (isBankField(field.key)) {
          const selectedOption = field.options?.find(opt => opt.value === value);
          const selectedLogo = value ? getBankLogo(value) : null;
          const isDropdownActive = dropdownOpen === field.key;

          return (
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    setDropdownOpen(isDropdownActive ? null : field.key);
                  }
                }}
                className={`w-full p-3 border-2 rounded-xl transition-all duration-300 shadow-sm text-left flex items-center justify-between ${
                  isEditing
                    ? 'bg-white border-gray-300 text-gray-800 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none'
                    : 'bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed'
                }`}
                disabled={!isEditing}
              >
                <div className="flex items-center gap-3">
                  {selectedLogo && (
                    <div key={`logo-${value}-${logoRefreshKey}`} className="w-8 h-8 relative flex-shrink-0 bg-white rounded-lg p-1 border border-gray-200">
                      <Image
                        src={selectedLogo}
                        alt={value}
                        fill
                        className="object-contain"
                        unoptimized
                        key={`img-${value}-${selectedLogo}`}
                      />
                    </div>
                  )}
                  <span className={selectedOption?.label ? 'font-medium' : 'text-gray-500'}>
                    {selectedOption?.label || field.placeholder || 'Pilih Bank/E-Wallet'}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isDropdownActive ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownActive && isEditing && (
                <div className="absolute z-[9999] w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                  {field.options?.map((option) => {
                    const logo = option.value ? getBankLogo(option.value) : null;
                    const isSelected = value === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          handleInputChange(field.key, option.value);
                          setDropdownOpen(null);
                        }}
                        className={`w-full p-3 flex items-center gap-3 hover:bg-blue-50 transition-colors ${
                          isSelected ? 'bg-blue-100' : ''
                        } ${!option.value ? 'border-b border-gray-200' : ''}`}
                      >
                        {logo ? (
                          <div key={`dropdown-logo-${option.value}-${logoRefreshKey}`} className="w-10 h-10 relative flex-shrink-0 bg-white rounded-lg p-1.5 border border-gray-200 shadow-sm">
                            <Image
                              src={logo}
                              alt={option.value}
                              fill
                              className="object-contain"
                              unoptimized
                              key={`img-${option.value}-${logo}`}
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-400 text-xs">N/A</span>
                          </div>
                        )}
                        <div className="flex-1 text-left">
                          <div className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
                            {option.label}
                          </div>
                          {option.value && (
                            <div className="text-xs text-gray-500 capitalize">
                              {option.value}
                            </div>
                          )}
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Backdrop to close dropdown */}
              {isDropdownActive && (
                <div
                  className="fixed inset-0 z-[9998]"
                  onClick={() => setDropdownOpen(null)}
                />
              )}
            </div>
          );
        }

        // Regular select for non-bank fields
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={`w-full p-3 border-2 rounded-xl transition-all duration-300 shadow-sm ${
              isEditing
                ? 'bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none'
                : 'bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed'
            }`}
            disabled={!isEditing}
          >
            {field.options?.map((option: { value: string; label: string; }) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'date':
      case 'time':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full p-3 border-2 rounded-xl transition-all duration-300 shadow-sm ${
              isEditing 
                ? 'bg-white border-gray-300 text-gray-800 placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none' 
                : 'bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed'
            }`}
            disabled={!isEditing}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full p-3 border-2 rounded-xl transition-all duration-300 shadow-sm ${
              isEditing 
                ? 'bg-white border-gray-300 text-gray-800 placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none' 
                : 'bg-gray-100 border-gray-200 text-gray-700 cursor-not-allowed'
            }`}
            disabled={!isEditing}
          />
        );
    }
  };

  return (
    <>
      <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 space-y-4 relative overflow-visible">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Edit
            </button>
          ) : (
            <div className="space-x-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 disabled:bg-gray-400 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4 overflow-visible">
          {fields.map((field) => (
            <div key={field.key} className="overflow-visible">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                {field.label}
              </label>
              {renderField(field)}
            </div>
          ))}
        </div>
      </div>

      {/* Simple Alert */}
      <SimpleAlert
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        type={alertConfig.type}
        message={alertConfig.message}
      />
    </>
  );
};

export default ContentEditor;