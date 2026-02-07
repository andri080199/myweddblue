"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { 
  UserPlus, UploadCloud, FileSpreadsheet, Check, 
  Loader2, User, FileUp, X, 
  Plus, CloudUpload
} from "lucide-react";

interface AddGuestFormProps {
  onGuestAdded: () => void;
  clientSlug: string;
}

interface GuestData {
  guestName: string;
}

export default function AddGuestForm({ onGuestAdded, clientSlug }: AddGuestFormProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewGuests, setPreviewGuests] = useState<GuestData[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFormValid = name.trim() !== "";

  // Handle Manual Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/guestNames?clientSlug=${clientSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([{ guestName: name }]),
      });

      if (res.ok) {
        setName("");
        onGuestAdded();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to add guest");
      }
    } catch {
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle File Processing
  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const parsed = (jsonData as Record<string, unknown>[])
        .map((row) => {
          const rawName = row["name"] || row["nama"];
          if (typeof rawName === "string" && rawName.trim() !== "") {
            return { guestName: rawName.trim() };
          }
          return null;
        })
        .filter(Boolean) as GuestData[];

      if (parsed.length === 0) {
        alert("Tidak ada tamu valid di file.");
        return;
      }
      setPreviewGuests(parsed);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // Handle Drag & Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Handle Bulk Upload
  const handleUploadToBackend = async () => {
    if (previewGuests.length === 0) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/guestNames?clientSlug=${clientSlug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(previewGuests),
      });

      if (res.ok) {
        setPreviewGuests([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onGuestAdded();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to upload data.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-[#1C4D8D]/10 border border-[#1C4D8D]/10 overflow-hidden h-full flex flex-col">
      
      {/* Header - Deep Navy Theme */}
      <div className="p-6 sm:p-8 border-b border-[#1C4D8D]/10 bg-[#0F2854]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-2xl shadow-inner border border-white/10 text-[#BDE8F5]">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Tambah Tamu</h3>
            <p className="text-sm text-[#BDE8F5]/70 font-medium">Input manual atau upload Excel</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8 flex-1">
        
        {/* 1. Manual Input Section */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1C4D8D] uppercase tracking-wider mb-2 ml-1">
              Nama Tamu
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Ketik nama tamu..."
                className="w-full pl-12 pr-4 py-4 bg-[#F8FAFC] border border-[#1C4D8D]/20 rounded-xl text-[#0F2854] placeholder:text-[#1C4D8D]/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#BDE8F5]/50 focus:border-[#4988C4] transition-all font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4988C4] group-focus-within:text-[#1C4D8D] transition-colors">
                <User className="w-5 h-5" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
              isFormValid && !isSubmitting
                ? "bg-[#0F2854] text-white hover:bg-[#1C4D8D] shadow-[#0F2854]/20 hover:-translate-y-0.5 active:scale-95"
                : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
            }`}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Simpan Tamu</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-[#1C4D8D]/10"></div>
          <span className="flex-shrink-0 mx-4 text-[10px] font-bold text-[#1C4D8D]/40 uppercase tracking-widest bg-white px-2">
            ATAU IMPORT EXCEL
          </span>
          <div className="flex-grow border-t border-[#1C4D8D]/10"></div>
        </div>

        {/* 2. File Upload Section */}
        <div className="space-y-4">
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 text-center cursor-pointer group ${
              dragActive 
                ? "border-[#1C4D8D] bg-[#BDE8F5]/20 scale-[1.02]" 
                : "border-[#1C4D8D]/20 hover:border-[#4988C4] hover:bg-[#F8FAFC]"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 ${
                dragActive ? "bg-[#1C4D8D] text-white" : "bg-[#F0F7FF] text-[#4988C4] group-hover:bg-[#1C4D8D] group-hover:text-white"
            }`}>
              <CloudUpload className="w-8 h-8" />
            </div>
            
            <h4 className="text-lg font-bold text-[#0F2854] mb-1 group-hover:text-[#1C4D8D] transition-colors">
              Upload File Excel
            </h4>
            <p className="text-xs text-[#1C4D8D]/60 max-w-[200px] mx-auto leading-relaxed">
              Drag & drop file di sini, atau klik untuk memilih. Pastikan header kolom adalah "name".
            </p>
          </div>

          {/* Preview & Upload Action */}
          {previewGuests.length > 0 && (
            <div className="bg-[#BDE8F5]/20 border border-[#BDE8F5] rounded-2xl p-5 animate-in slide-in-from-bottom-2 fade-in shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
                    <Check className="w-5 h-5 text-white stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0F2854]">
                      {previewGuests.length} Data Siap
                    </p>
                    <p className="text-xs text-[#1C4D8D]/70 font-medium">
                      File berhasil dibaca
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setPreviewGuests([]);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="p-2.5 rounded-xl bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-colors shadow-sm"
                    title="Batalkan Upload"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleUploadToBackend}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#1C4D8D] text-white text-sm font-bold rounded-xl hover:bg-[#0F2854] transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileUp className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">Import</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}