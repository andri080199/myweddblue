'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Upload, Trash2, Plus, Image as ImageIcon, CheckCircle, XCircle, FileImage, CloudUpload, RefreshCw } from 'lucide-react';

// Color Palette
const colors = {
  deepNavy: '#0F2854',
  mediumDarkBlue: '#1C4D8D',
  mediumLightBlue: '#4988C4',
  veryLightBlue: '#BDE8F5',
};

interface BankLogo {
  name: string;
  path: string;
  fileName: string;
}

interface ToastMessage {
  type: 'success' | 'error';
  message: string;
}

const BankLogoManager: React.FC = () => {
  const [logos, setLogos] = useState<BankLogo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [bankName, setBankName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; logo: BankLogo | null }>({
    show: false,
    logo: null,
  });

  useEffect(() => {
    fetchLogos();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const fetchLogos = async () => {
    try {
      const response = await fetch('/api/bank-logos');
      if (response.ok) {
        const data = await response.json();
        setLogos(data);
      }
    } catch (error) {
      console.error('Error fetching logos:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !bankName) {
      showToast('error', 'Pilih file dan masukkan nama bank');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('bankName', bankName);

      const response = await fetch('/api/bank-logos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        showToast('success', 'Logo berhasil diupload!');
        setBankName('');
        setSelectedFile(null);
        setPreviewUrl('');
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        fetchLogos();
      } else {
        const error = await response.json();
        showToast('error', error.error || 'Gagal upload logo');
      }
    } catch (error) {
      console.error('Error uploading logo:', error);
      showToast('error', 'Gagal upload logo');
    } finally {
      setUploading(false);
    }
  };

  const openDeleteModal = (logo: BankLogo) => {
    setDeleteModal({ show: true, logo });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, logo: null });
  };

  const confirmDelete = async () => {
    if (!deleteModal.logo) return;

    const { fileName, name } = deleteModal.logo;
    setDeleting(fileName);
    closeDeleteModal();

    try {
      const response = await fetch(`/api/bank-logos?fileName=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('success', `Logo ${name} berhasil dihapus`);
        fetchLogos();
      } else {
        const error = await response.json();
        showToast('error', error.error || 'Gagal menghapus logo');
      }
    } catch (error) {
      console.error('Error deleting logo:', error);
      showToast('error', 'Gagal menghapus logo');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
              : 'bg-rose-50 border-rose-100 text-rose-800'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && deleteModal.logo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
                <Trash2 className="w-8 h-8 text-rose-500" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F2854] mb-2">Delete Asset?</h3>
              <p className="text-[#1C4D8D]/70 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-[#0F2854]">"{deleteModal.logo.name}"</span>?
                <br />This action cannot be undone.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 flex flex-col items-center">
              <div className="relative w-24 h-24 mb-3">
                <Image
                  src={deleteModal.logo.path}
                  alt={deleteModal.logo.name}
                  fill
                  className="object-contain"
                />
              </div>
              <code className="text-xs font-mono text-gray-400 bg-white px-2 py-1 rounded border border-gray-200">
                {deleteModal.logo.fileName}
              </code>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-6 py-3.5 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-200"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Upload Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-[#1C4D8D]/5 border border-[#1C4D8D]/10 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-[#1C4D8D]/10 bg-[#BDE8F5]/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white rounded-xl shadow-sm border border-[#1C4D8D]/20 text-[#1C4D8D]">
                  <CloudUpload className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-[#0F2854]">Upload New Logo</h2>
              </div>
            </div>

            <form onSubmit={handleUpload} className="p-6 sm:p-8 space-y-6">
              
              {/* Preview Area */}
              <div className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group hover:border-[#4988C4] hover:bg-[#BDE8F5]/10 transition-all">
                {previewUrl ? (
                  <div className="relative w-3/4 h-3/4 animate-in zoom-in-50 duration-300">
                    <Image src={previewUrl} alt="Preview" fill className="object-contain" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium backdrop-blur-sm">
                      Change File
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-gray-400 group-hover:text-[#4988C4] group-hover:scale-110 transition-all">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-500 group-hover:text-[#1C4D8D]">No file selected</p>
                    <p className="text-xs text-gray-400">PNG/JPG up to 15MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  required
                />
              </div>

              {/* Bank Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wider ml-1">
                  Bank / Wallet Name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. bca, mandiri, gopay"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-[#BDE8F5] focus:border-[#4988C4] transition-all font-medium text-[#0F2854] placeholder:text-gray-400"
                  required
                />
                <p className="text-[10px] text-gray-400 ml-1">Use lowercase, no spaces (e.g. "bni" not "Bank BNI")</p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3.5 bg-[#1C4D8D] hover:bg-[#0F2854] text-white font-bold rounded-xl shadow-lg shadow-[#1C4D8D]/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Add to Library</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Guidelines Card */}
          <div className="bg-[#0F2854] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#4988C4]/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 relative z-10">
              <span className="w-6 h-6 rounded-full bg-[#4988C4] flex items-center justify-center text-xs">i</span>
              Guidelines
            </h3>
            
            <ul className="space-y-3 text-sm text-[#BDE8F5]/80 relative z-10">
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4988C4] mt-2 shrink-0" />
                <span>Format <strong>PNG Transparent</strong> is highly recommended for best results.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4988C4] mt-2 shrink-0" />
                <span>Keep resolution around <strong>200x200px</strong>.</span>
              </li>
              <li className="flex gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4988C4] mt-2 shrink-0" />
                <span>Naming convention: use shortcode (e.g. <strong>bca</strong>, not Bank BCA).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT: Logo Grid */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-[#1C4D8D]/5 border border-[#1C4D8D]/10 overflow-hidden min-h-[600px]">
            
            {/* Grid Header */}
            <div className="p-6 sm:p-8 border-b border-[#1C4D8D]/10 flex justify-between items-center bg-white">
              <div>
                <h2 className="text-xl font-bold text-[#0F2854]">Active Assets</h2>
                <p className="text-sm text-[#1C4D8D]/60 mt-1">Manage existing bank logos</p>
              </div>
              <div className="px-4 py-1.5 bg-[#BDE8F5]/30 rounded-full text-[#1C4D8D] font-bold text-sm border border-[#BDE8F5]">
                {logos.length} Items
              </div>
            </div>

            {/* Grid Content */}
            <div className="p-6 sm:p-8 bg-gray-50/50 min-h-[500px]">
              {logos.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                    <FileImage className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-400">No logos yet</h3>
                  <p className="text-gray-400 max-w-xs mt-2">Upload your first bank logo to populate this library.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {logos.map((logo) => (
                    <div
                      key={logo.name}
                      className="group relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Delete Action */}
                      <button
                        onClick={() => openDeleteModal(logo)}
                        disabled={deleting === logo.fileName}
                        className="absolute top-2 right-2 p-2 bg-rose-50 text-rose-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white shadow-lg z-10"
                      >
                        {deleting === logo.fileName ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>

                      {/* Image Container */}
                      <div className="relative aspect-square mb-3 bg-gray-50 rounded-xl overflow-hidden group-hover:bg-[#BDE8F5]/10 transition-colors">
                        <Image
                          src={logo.path}
                          alt={logo.name}
                          fill
                          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>

                      {/* Info */}
                      <div className="text-center">
                        <h4 className="font-bold text-[#0F2854] uppercase tracking-wide text-sm">{logo.name}</h4>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5 font-mono bg-gray-50 rounded px-1.5 py-0.5 inline-block max-w-full">
                          {logo.fileName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BankLogoManager;