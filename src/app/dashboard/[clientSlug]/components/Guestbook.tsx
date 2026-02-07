import { useState, useEffect } from "react";
import { MessageCircle, Heart, Calendar, User, Search, Download, Sparkles, ChevronLeft, ChevronRight, Loader2, Quote, Send } from "lucide-react";

interface GuestEntry {
  name: string;
  message: string;
  timestamp: string;
}

const capitalizeWords = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

interface GuestbookProps {
  clientSlug: string;
}

const Guestbook = ({ clientSlug }: GuestbookProps) => {
  const [guestbookEntries, setGuestbookEntries] = useState<GuestEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const entriesPerPage = 8;

  const fetchGuestbookEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/guestbook?clientSlug=${clientSlug}`);
      const data = await response.json();
      setGuestbookEntries(data);
    } catch (error) {
      console.error("Error fetching guestbook entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuestbookEntries();
  }, [clientSlug]);

  const filteredEntries = Array.isArray(guestbookEntries) 
    ? guestbookEntries.filter(entry => 
        entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Message', 'Date'],
      ...guestbookEntries.map(entry => [
        entry.name,
        entry.message.replace(/,/g, ';'),
        new Date(entry.timestamp).toLocaleDateString("id-ID")
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guestbook-${clientSlug}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-[#1C4D8D]/10 p-12 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-[#4988C4] animate-spin mb-4" />
        <p className="text-[#1C4D8D] font-medium animate-pulse">Memuat ucapan doa...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0F2854] shadow-xl shadow-[#1C4D8D]/10 border border-[#1C4D8D]/10 overflow-hidden relative">
      
      {/* 1. Header Section - Deep Navy Premium Style */}
      <div className="relative p-8 overflow-hidden bg-[#0F2854]">
         {/* Abstract Shapes */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#1C4D8D]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4988C4]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
         
         <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
           
           {/* Title & Stats */}
           <div className="flex items-center gap-5">
             <div className="relative group">
               <div className="w-16 h-16 bg-gradient-to-br from-[#1C4D8D] to-[#0F2854] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1C4D8D]/20 border border-[#4988C4]/30">
                 <MessageCircle className="w-8 h-8 text-[#BDE8F5]" />
               </div>
               <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md">
                 <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
               </div>
             </div>
             
             <div>
               <div className="flex items-center gap-2 mb-1">
                 <h2 className="text-2xl font-black text-white tracking-tight">Ucapan & Doa</h2>
                 <span className="px-2 py-0.5 bg-[#1C4D8D]/50 border border-[#4988C4]/30 text-[#BDE8F5] text-[10px] font-bold uppercase tracking-wider rounded-md">
                    Live Feed
                 </span>
               </div>
               <p className="text-[#BDE8F5]/70 text-sm font-medium">
                 Total <span className="text-white font-bold">{guestbookEntries.length}</span> pesan masuk
               </p>
             </div>
           </div>

           {/* Action Toolbar */}
           <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
             
             {/* Search Input */}
             <div className="relative flex-1 sm:w-72 group">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                 <Search className="w-4 h-4 text-[#4988C4] group-focus-within:text-[#BDE8F5] transition-colors" />
               </div>
               <input
                 type="text"
                 placeholder="Cari nama atau pesan..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full pl-11 pr-4 py-3.5 bg-[#1C4D8D]/20 border border-[#4988C4]/20 rounded-xl text-white placeholder:text-[#BDE8F5]/30 focus:outline-none focus:bg-[#1C4D8D]/30 focus:border-[#BDE8F5]/50 transition-all text-sm font-medium"
               />
             </div>

             {/* Export Button */}
             <button
               onClick={exportToCSV}
               className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-[#0F2854] rounded-xl hover:bg-[#BDE8F5] transition-all font-bold text-sm shadow-lg active:scale-95 group"
             >
               <div className="p-1 bg-[#0F2854]/10 rounded-lg group-hover:bg-[#0F2854]/20 transition-colors">
                 <Download className="w-4 h-4" />
               </div>
               <span>Export CSV</span>
             </button>
           </div>
         </div>
      </div>

      {/* 2. Messages Content Area */}
      <div className="bg-[#F8FAFC] min-h-screen border-t border-[#1C4D8D]/10">
        
        {/* Empty State */}
        {currentEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center px-4">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-[#1C4D8D]/5">
              <Send className="w-10 h-10 text-[#4988C4] opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-[#0F2854]">Belum Ada Pesan</h3>
            <p className="text-[#1C4D8D]/60 max-w-sm mt-2 leading-relaxed">
              {searchTerm 
                ? `Tidak ditemukan pesan yang cocok dengan kata kunci "${searchTerm}"` 
                : "Belum ada tamu yang mengirimkan ucapan doa. Pesan baru akan muncul di sini."}
            </p>
          </div>
        ) : (
          /* Grid Layout */
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            {currentEntries.map((entry, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 border border-[#1C4D8D]/5 shadow-sm hover:shadow-xl hover:shadow-[#1C4D8D]/5 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Header Card */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F8FAFC] to-white flex items-center justify-center border border-[#1C4D8D]/10 shadow-inner">
                            <span className="text-lg font-black text-[#1C4D8D]">{entry.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-[#F8FAFC]">
                            <User className="w-3 h-3 text-[#4988C4]" />
                        </div>
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-[#0F2854] text-base leading-tight group-hover:text-[#1C4D8D] transition-colors">
                        {capitalizeWords(entry.name)}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-[#1C4D8D]/50 font-medium bg-[#F8FAFC] px-2 py-0.5 rounded-md inline-block">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(entry.timestamp).toLocaleDateString("id-ID", {
                            day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quote Icon Decor */}
                  <div className="text-[#1C4D8D]/10 group-hover:text-[#1C4D8D]/20 transition-colors">
                     <Quote className="w-8 h-8 fill-current" />
                  </div>
                </div>

                {/* Message Body */}
                <div className="relative">
                  <div className="pl-4 border-l-2 border-[#1C4D8D]/10 group-hover:border-[#4988C4] transition-colors duration-300">
                    <p className="text-[#0F2854]/80 text-sm leading-relaxed italic">
                      "{entry.message}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Pagination Footer */}
        {filteredEntries.length > entriesPerPage && (
          <div className="p-6 border-t border-[#1C4D8D]/5 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-xs sm:text-sm text-[#1C4D8D]/60 font-medium bg-[#F8FAFC] px-4 py-2 rounded-xl border border-[#1C4D8D]/5">
              Menampilkan <span className="text-[#0F2854] font-bold">{indexOfFirstEntry + 1}-{Math.min(indexOfLastEntry, filteredEntries.length)}</span> dari {filteredEntries.length} pesan
            </span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                className="p-3 rounded-xl border border-[#1C4D8D]/10 text-[#1C4D8D] hover:bg-[#0F2854] hover:text-white hover:border-[#0F2854] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1C4D8D] disabled:hover:border-[#1C4D8D]/10 transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="h-11 px-5 flex items-center justify-center bg-[#0F2854] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#0F2854]/20 border border-[#0F2854]">
                {currentPage} <span className="mx-1 text-[#BDE8F5]/50">/</span> {totalPages}
              </div>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl border border-[#1C4D8D]/10 text-[#1C4D8D] hover:bg-[#0F2854] hover:text-white hover:border-[#0F2854] disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#1C4D8D] disabled:hover:border-[#1C4D8D]/10 transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Guestbook;