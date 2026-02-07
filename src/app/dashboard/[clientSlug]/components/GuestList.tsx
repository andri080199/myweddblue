"use client";

import { useEffect, useState } from "react";
import { Copy, X, Search, Users, MessageCircle, ChevronLeft, ChevronRight, ExternalLink, Check as CheckIcon, Link as LinkIcon } from "lucide-react";
import { formatWhatsAppMessage, DEFAULT_WHATSAPP_MESSAGE } from '@/utils/whatsappTemplate';

// Color Palette
const colors = {
  deepNavy: '#0F2854',
  mediumDarkBlue: '#1C4D8D',
  mediumLightBlue: '#4988C4',
  veryLightBlue: '#BDE8F5',
};

interface Guest {
  id: number;
  name: string;
  url: string;
}

interface GuestListProps {
  clientSlug: string;
}

export default function GuestList({ clientSlug }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [modalDeleteId, setModalDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [copySuccess, setCopySuccess] = useState<number | null>(null);
  const [whatsappTemplate, setWhatsappTemplate] = useState(DEFAULT_WHATSAPP_MESSAGE);

  const guestsPerPage = 10;

  useEffect(() => {
    fetch(`/api/guestNames?clientSlug=${clientSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGuests(data);
        } else {
          setGuests([]);
        }
      })
      .catch((err) => {
        console.error("Gagal memuat data tamu:", err);
        setGuests([]);
      });

    fetch(`/api/whatsapp-template?clientSlug=${clientSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.template) {
          setWhatsappTemplate(data.template);
        }
      })
      .catch((err) => {
        console.error("Failed to load WhatsApp template:", err);
      });
  }, [clientSlug]);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/guestNames/${id}?clientSlug=${clientSlug}`, { method: "DELETE" });
      if (res.ok) {
        setGuests((prev) => prev.filter((guest) => guest.id !== id));
        setModalDeleteId(null);
      } else {
        console.error("Gagal menghapus tamu");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const filteredGuests = guests.filter((guest) =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredGuests.length / guestsPerPage);
  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const paginatedGuests = filteredGuests.slice(indexOfFirstGuest, indexOfLastGuest);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCopyUrl = async (guest: Guest) => {
    try {
      await navigator.clipboard.writeText(guest.url);
      setCopySuccess(guest.id);
      setTimeout(() => setCopySuccess(null), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  return (
    <div className="bg-[#F8FAFC] rounded-[2.5rem] shadow-xl shadow-[#1C4D8D]/10 border border-[#0F2854] overflow-hidden w-full">
      
      {/* 1. Header & Controls - Slightly Darker Background */}
      <div className="p-6 sm:p-8 bg-[#BDE8F5]/20 border-b border-[#1C4D8D]/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Title Area */}
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#0F2854] rounded-2xl shadow-lg shadow-[#0F2854]/20 text-white">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#0F2854] tracking-tight">Guest List</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-[#1C4D8D]/70">Total Undangan:</span>
                <span className="px-2.5 py-0.5 bg-[#1C4D8D] text-white text-xs font-bold rounded-lg shadow-sm">
                  {guests.length}
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar - Modern & Clean */}
          <div className="relative w-full lg:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-[#4988C4] group-focus-within:text-[#1C4D8D] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Cari nama tamu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#1C4D8D]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F2854] focus:border-[#4988C4] transition-all text-[#0F2854] placeholder:text-[#1C4D8D]/40 text-sm font-medium shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="min-h-[400px] w-full bg-white">
        {paginatedGuests.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center px-4 bg-[#F8FAFC]">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-4 border border-[#1C4D8D]/10 shadow-sm">
              <Users className="w-10 h-10 text-[#4988C4]" />
            </div>
            <h3 className="text-lg font-bold text-[#0F2854]">Belum Ada Tamu</h3>
            <p className="text-[#1C4D8D]/60 max-w-xs mt-2 text-sm">
              {searchTerm ? `Tidak ditemukan tamu dengan nama "${searchTerm}"` : "Mulai tambahkan tamu pada form di atas."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View - Adjusted Layout */}
            <div className="hidden md:block w-full">
              <table className="w-full text-left table-fixed">
                <thead>
                  {/* Table Header - Solid Dark Navy */}
                  <tr className="bg-[#0F2854] text-white text-xs uppercase tracking-wider font-bold">
                    <th className="w-[35%] px-6 py-4 pl-8">Nama Tamu</th>
                    <th className="w-[40%] px-6 py-4">Tautan Undangan</th>
                    <th className="w-[25%] px-6 py-4 text-right pr-8">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C4D8D]/5">
                  {paginatedGuests.map((guest, index) => (
                    <tr 
                      key={guest.id} 
                      className={`group transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]' /* Zebra Striping */
                      } hover:bg-[#BDE8F5]/10`}
                    >
                      {/* Nama Tamu - No Avatar, Full Text */}
                      <td className="px-6 py-5 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-1 h-8 bg-[#1C4D8D] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span className="font-bold text-[#0F2854] text-base break-words leading-tight">
                            {guest.name}
                          </span>
                        </div>
                      </td>
                      
                      {/* Tautan Undangan */}
                      <td className="px-6 py-5">
                        <div 
                          className="flex items-center gap-2 group/link cursor-pointer"
                          onClick={() => handleCopyUrl(guest)}
                        >
                          <div className="p-1.5 bg-[#F0F7FF] rounded text-[#4988C4] group-hover/link:text-[#1C4D8D] transition-colors">
                            <LinkIcon className="w-3.5 h-3.5" />
                          </div>
                          <code className="text-xs font-mono text-[#1C4D8D]/80 truncate hover:text-[#0F2854] transition-colors">
                            {guest.url}
                          </code>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 pr-8 text-right">
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* WhatsApp */}
                          <button
                            onClick={() => {
                              const formattedMessage = formatWhatsAppMessage(whatsappTemplate, guest.name, clientSlug, guest.url);
                              const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(formattedMessage)}`;
                              window.open(whatsappUrl, '_blank');
                            }}
                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm border border-emerald-100"
                            title="Kirim WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          {/* Copy URL */}
                          <button
                            onClick={() => handleCopyUrl(guest)}
                            className={`p-2.5 rounded-xl transition-all shadow-sm border ${
                              copySuccess === guest.id
                                ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                : 'bg-white text-[#1C4D8D] border-[#1C4D8D]/10 hover:bg-[#1C4D8D] hover:text-white'
                            }`}
                            title="Salin Link"
                          >
                            {copySuccess === guest.id ? <CheckIcon className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setModalDeleteId(guest.id)}
                            className="p-2.5 bg-white text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm border border-rose-100"
                            title="Hapus"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-3 p-4 bg-[#F8FAFC]">
              {paginatedGuests.map((guest) => (
                <div key={guest.id} className="p-5 bg-white rounded-2xl shadow-sm border border-[#1C4D8D]/10">
                  <div className="mb-4">
                    <h3 className="font-bold text-[#0F2854] text-lg break-words leading-tight">{guest.name}</h3>
                    <div className="flex items-center gap-2 mt-2 p-2 bg-[#F8FAFC] rounded-lg border border-[#1C4D8D]/5">
                      <LinkIcon className="w-3 h-3 text-[#4988C4]" />
                      <p className="text-xs text-[#1C4D8D]/70 font-mono truncate">
                        {guest.url}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => {
                        const formattedMessage = formatWhatsAppMessage(whatsappTemplate, guest.name, clientSlug, guest.url);
                        window.open(`https://wa.me/?text=${encodeURIComponent(formattedMessage)}`, '_blank');
                      }}
                      className="flex flex-col items-center justify-center gap-1 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors border border-emerald-100"
                    >
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </button>
                    
                    <button
                      onClick={() => handleCopyUrl(guest)}
                      className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl font-bold text-xs transition-colors border ${
                        copySuccess === guest.id 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                          : 'bg-[#F0F7FF] text-[#1C4D8D] border-[#1C4D8D]/10 hover:bg-[#BDE8F5]/50'
                      }`}
                    >
                      {copySuccess === guest.id ? <CheckIcon className="w-4 h-4" /> : <Copy className="w-4 h-4" />} Salin
                    </button>

                    <button
                      onClick={() => setModalDeleteId(guest.id)}
                      className="flex flex-col items-center justify-center gap-1 py-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors border border-rose-100 font-bold text-xs"
                    >
                      <X className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="p-6 border-t border-[#1C4D8D]/10 bg-white flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-[2.5rem]">
              <span className="text-sm text-[#1C4D8D]/70 font-medium bg-[#F8FAFC] px-4 py-2 rounded-xl">
                Halaman <span className="text-[#0F2854] font-bold">{currentPage}</span> dari {totalPages}
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl border border-[#1C4D8D]/20 text-[#1C4D8D] hover:bg-[#0F2854] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1C4D8D] transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl border border-[#1C4D8D]/20 text-[#1C4D8D] hover:bg-[#0F2854] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1C4D8D] transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {modalDeleteId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0F2854]/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setModalDeleteId(null)}></div>
          <div className="relative bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full animate-in zoom-in-95 duration-200 border border-[#1C4D8D]/10">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-rose-100">
              <X className="w-8 h-8 text-rose-500" />
            </div>
            
            <h3 className="text-xl font-black text-[#0F2854] text-center mb-2">Hapus Tamu?</h3>
            <p className="text-center text-[#1C4D8D]/70 mb-8 text-sm leading-relaxed">
              Tindakan ini tidak dapat dibatalkan. Data tamu akan dihapus secara permanen dari daftar.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setModalDeleteId(null)}
                className="flex-1 py-3 bg-white border border-[#1C4D8D]/20 text-[#1C4D8D] font-bold rounded-xl hover:bg-[#F8FAFC] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(modalDeleteId)}
                className="flex-1 py-3 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all transform active:scale-95"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}