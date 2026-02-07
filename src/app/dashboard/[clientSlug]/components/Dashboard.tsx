'use client';
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import EnhancedLoading from '@/components/ui/EnhancedLoading';
import { 
  Users, CheckCircle2, XCircle, FileDown, 
  Calendar, PieChart, ChevronLeft, ChevronRight, 
  Search, Filter, ShieldCheck, User
} from "lucide-react";

// --- Color Palette Reference ---
// #0F2854 (Deep Navy) - Primary Text / Headings
// #1C4D8D (Royal Blue) - Actions / Active States
// #4988C4 (Ocean Blue) - Accents
// #BDE8F5 (Pale Cyan) - Backgrounds / Highlights

interface Guest {
  id: number;
  name: string;
  isAttending: boolean;
  responseDate: string;
}

type FilterType = "all" | "attending" | "notAttending";

interface DashboardProps {
  clientSlug: string;
}

const Dashboard = ({ clientSlug }: DashboardProps) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch(`/api/rsvp?clientSlug=${clientSlug}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch guests`);
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setGuests(data);
        } else {
          setGuests([]);
          setError("Invalid data format received from server");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(`Failed to load guests`);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, [clientSlug]);

  // Filter Logic (TETAP)
  const filteredGuests = guests.filter((guest) => {
    if (filter === "attending") return guest.isAttending;
    if (filter === "notAttending") return !guest.isAttending;
    return true;
  });

  // Pagination Logic (TETAP)
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGuests = filteredGuests.slice(indexOfFirstItem, indexOfLastItem);

  // Stats Logic (TETAP)
  const totalGuests = guests.length;
  const attendingGuests = guests.filter((guest) => guest.isAttending).length;
  const notAttendingGuests = guests.filter((guest) => !guest.isAttending).length;

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Export PDF Logic (TETAP)
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Nama Tamu", "Status Kehadiran", "Tanggal Respon"];
    const tableRows: string[][] = [];

    filteredGuests.forEach((guest) => {
      const guestData = [
        guest.name,
        guest.isAttending ? "Hadir" : "Tidak Hadir",
        new Date(guest.responseDate).toLocaleDateString("id-ID", {
          day: "2-digit", month: "long", year: "numeric",
        })
      ];
      tableRows.push(guestData);
    });

    doc.setFontSize(18);
    doc.setTextColor(15, 40, 84); // Deep Navy #0F2854
    doc.text("Laporan RSVP Pernikahan", 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Total Tamu: ${filteredGuests.length} | Filter: ${filter}`, 14, 28);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      headStyles: { fillColor: [28, 77, 141] }, // Royal Blue #1C4D8D
      styles: { fontSize: 10, cellPadding: 3 },
      alternateRowStyles: { fillColor: [240, 247, 255] } // Light blue alternate
    });

    doc.save(`RSVP_Report_${clientSlug}.pdf`);
  };

  if (loading) {
    return <EnhancedLoading message="Memuat dashboard..." type="admin" size="md" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-12 text-center max-w-md shadow-sm">
          <div className="w-20 h-20 bg-rose-100 rounded-full mx-auto mb-6 flex items-center justify-center shadow-inner">
            <XCircle className="w-10 h-10 text-rose-600" />
          </div>
          <h3 className="text-xl font-bold text-[#0F2854] mb-2">Gagal Memuat Data</h3>
          <p className="text-rose-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans selection:bg-[#BDE8F5] selection:text-[#0F2854]">
      
      {/* 1. HERO SECTION - Deep Navy Background */}
      <div className="relative pt-8 bg-[#0F2854] pb-32 sm:pb-40 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#1C4D8D]/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[#4988C4]/20 rounded-full blur-[80px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C4D8D]/30 border border-[#4988C4]/30 backdrop-blur-md">
                <ShieldCheck className="w-3.5 h-3.5 text-[#BDE8F5]" />
                <span className="text-[10px] font-bold text-[#BDE8F5] tracking-widest uppercase">Dashboard Klien Control</span>
              </div>
              
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  Dashboard <span className="text-[#4988C4]">RSVP</span>
                </h1>
                <p className="mt-4 text-lg text-[#BDE8F5]/80 font-light leading-relaxed max-w-xl">
                  Pantau kehadiran tamu undangan secara real-time.
                </p>
              </div>
            </div>

            <button
              onClick={exportToPDF}
              className="group flex items-center gap-3 px-6 py-3.5 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all shadow-lg backdrop-blur-md border border-white/10 active:scale-95"
            >
              <div className="p-1 bg-[#BDE8F5]/20 rounded-lg group-hover:bg-[#BDE8F5]/30 text-[#BDE8F5]">
                <FileDown className="w-5 h-5" />
              </div>
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT WRAPPER - Floating Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20 space-y-8">
        
        {/* Interactive Stats Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Card */}
          <div
            onClick={() => setFilter("all")}
            className={`cursor-pointer relative overflow-hidden rounded-[2rem] p-6 border-2 transition-all duration-300 group ${
              filter === "all" 
                ? "bg-white border-[#1C4D8D] shadow-xl shadow-[#1C4D8D]/10 scale-[1.02]" 
                : "bg-white border-[#1C4D8D]/10 hover:border-[#1C4D8D]/30 hover:shadow-lg"
            }`}
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${filter === "all" ? "text-[#1C4D8D]" : "text-[#1C4D8D]/60"}`}>Total Respon</p>
                <h3 className={`text-4xl font-black ${filter === "all" ? "text-[#0F2854]" : "text-[#0F2854]/80"}`}>{totalGuests}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${filter === "all" ? "bg-[#1C4D8D] text-white" : "bg-[#F0F7FF] text-[#1C4D8D]"}`}>
                <Users className="w-6 h-6" />
              </div>
            </div>
            {filter === "all" && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#1C4D8D]" />}
          </div>

          {/* Attending Card */}
          <div
            onClick={() => setFilter("attending")}
            className={`cursor-pointer relative overflow-hidden rounded-[2rem] p-6 border-2 transition-all duration-300 group ${
              filter === "attending" 
                ? "bg-white border-emerald-500 shadow-xl shadow-emerald-500/10 scale-[1.02]" 
                : "bg-white border-emerald-100 hover:border-emerald-300 hover:shadow-lg"
            }`}
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${filter === "attending" ? "text-emerald-600" : "text-emerald-600/60"}`}>Hadir</p>
                <h3 className={`text-4xl font-black ${filter === "attending" ? "text-[#0F2854]" : "text-[#0F2854]/80"}`}>{attendingGuests}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${filter === "attending" ? "bg-emerald-500 text-white" : "bg-emerald-50 text-emerald-600"}`}>
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>
            {filter === "attending" && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-emerald-500" />}
          </div>

          {/* Not Attending Card */}
          <div
            onClick={() => setFilter("notAttending")}
            className={`cursor-pointer relative overflow-hidden rounded-[2rem] p-6 border-2 transition-all duration-300 group ${
              filter === "notAttending" 
                ? "bg-white border-rose-500 shadow-xl shadow-rose-500/10 scale-[1.02]" 
                : "bg-white border-rose-100 hover:border-rose-300 hover:shadow-lg"
            }`}
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className={`text-sm font-bold uppercase tracking-wider mb-2 ${filter === "notAttending" ? "text-rose-600" : "text-rose-600/60"}`}>Tidak Hadir</p>
                <h3 className={`text-4xl font-black ${filter === "notAttending" ? "text-[#0F2854]" : "text-[#0F2854]/80"}`}>{notAttendingGuests}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${filter === "notAttending" ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-600"}`}>
                <XCircle className="w-6 h-6" />
              </div>
            </div>
            {filter === "notAttending" && <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-rose-500" />}
          </div>
        </div>

        {/* 3. Data Table Section */}
        <div className="bg-white rounded-[2.5rem] border border-[#1C4D8D]/10 shadow-[0_20px_60px_-15px_rgba(28,77,141,0.15)] overflow-hidden">
          
          {/* Table Header Controls */}
          <div className="p-6 sm:p-8 border-b border-[#1C4D8D]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#F8FAFC]/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#BDE8F5]/20 rounded-lg text-[#1C4D8D]">
                <Filter className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm text-[#1C4D8D]/70 font-medium mr-2">Menampilkan:</span>
                <span className="bg-[#1C4D8D]/10 text-[#1C4D8D] px-3 py-1 rounded-full text-sm font-bold capitalize">
                  {filter === 'all' ? 'Semua Tamu' : filter === 'attending' ? 'Hadir' : 'Tidak Hadir'}
                </span>
              </div>
            </div>
          </div>

          {currentGuests.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-[#F8FAFC] rounded-3xl flex items-center justify-center mb-6 border border-[#1C4D8D]/10">
                <Search className="w-10 h-10 text-[#4988C4]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F2854]">Data Tidak Ditemukan</h3>
              <p className="text-[#1C4D8D]/60 mt-2">Belum ada tamu yang sesuai dengan filter ini.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F8FAFC]/80 border-b border-[#1C4D8D]/10 text-xs uppercase tracking-wider text-[#1C4D8D] font-bold">
                      <th className="px-8 py-5 pl-10 w-[40%]">Nama Tamu</th>
                      <th className="px-8 py-5 w-[30%]">Status Kehadiran</th>
                      <th className="px-8 py-5 w-[30%] text-right pr-10">Waktu Respon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C4D8D]/5">
                    {currentGuests.map((guest) => (
                      <tr key={guest.id} className="group hover:bg-[#BDE8F5]/10 transition-colors duration-200">
                        <td className="px-8 py-5 pl-10">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#BDE8F5] to-white flex items-center justify-center text-[#1C4D8D] font-black text-sm shadow-sm border border-[#BDE8F5]/50 shrink-0">
                              {guest.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-[#0F2854] text-base">{guest.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                            guest.isAttending 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-rose-50 text-rose-700 border-rose-100"
                          }`}>
                            {guest.isAttending ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                            {guest.isAttending ? "Hadir" : "Tidak Hadir"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right pr-10">
                          <div className="inline-flex items-center gap-2 text-[#1C4D8D]/70 text-sm font-medium bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#1C4D8D]/5">
                            <Calendar className="w-3.5 h-3.5 text-[#4988C4]" />
                            {new Date(guest.responseDate).toLocaleDateString("id-ID", {
                              day: "numeric", month: "short", year: "numeric"
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-[#1C4D8D]/5 bg-white">
                {currentGuests.map((guest) => (
                  <div key={guest.id} className="p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#BDE8F5] to-white text-[#1C4D8D] flex items-center justify-center font-black text-lg border border-[#BDE8F5]/50 shadow-sm">
                          {guest.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-[#0F2854] text-lg">{guest.name}</h4>
                          <p className="text-xs text-[#1C4D8D]/60 mt-0.5 font-mono">ID: #{guest.id}</p>
                        </div>
                      </div>
                      <span className={`p-2 rounded-full border ${
                        guest.isAttending ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}>
                        {guest.isAttending ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-[#1C4D8D]/5">
                      <span className="text-xs font-bold text-[#1C4D8D] uppercase tracking-wide">Waktu Respon</span>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-[#0F2854]">
                        <Calendar className="w-4 h-4 text-[#4988C4]" />
                        {new Date(guest.responseDate).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric"
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-6 sm:p-8 border-t border-[#1C4D8D]/10 flex justify-between items-center bg-[#F8FAFC]">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-3 rounded-xl border border-[#1C4D8D]/10 text-[#1C4D8D] hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none disabled:hover:bg-transparent transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <span className="text-sm font-bold text-[#0F2854] bg-white border border-[#1C4D8D]/10 px-4 py-2 rounded-xl shadow-sm">
                    Hal {currentPage} dari {totalPages}
                  </span>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="p-3 rounded-xl border border-[#1C4D8D]/10 text-[#1C4D8D] hover:bg-white hover:shadow-md disabled:opacity-30 disabled:hover:shadow-none disabled:hover:bg-transparent transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;