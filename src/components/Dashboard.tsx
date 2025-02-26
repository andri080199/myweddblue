'use client';
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

interface Guest {
  id: number;
  name: string;
  isAttending: boolean;
  responseDate: string;
}

type FilterType = "all" | "attending" | "notAttending";

const Dashboard = () => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8; // Menampilkan 9 data per halaman

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch("/api/rsvp");
        if (!response.ok) {
          throw new Error("Failed to fetch guests");
        }
        const data: Guest[] = await response.json();
        setGuests(data);
      } catch (error) {
        setError("Failed to load guests");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  // Filter data berdasarkan kategori yang dipilih
  const filteredGuests = guests.filter((guest) => {
    if (filter === "attending") return guest.isAttending;
    if (filter === "notAttending") return !guest.isAttending;
    return true;
  });

  // Hitung jumlah halaman
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);

  // Ambil data berdasarkan halaman
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGuests = filteredGuests.slice(indexOfFirstItem, indexOfLastItem);

  // Hitung jumlah total
  const totalGuests = guests.length;
  const attendingGuests = guests.filter((guest) => guest.isAttending).length;
  const notAttendingGuests = guests.filter((guest) => !guest.isAttending).length;

  // Navigasi halaman
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Reset halaman ke 1 saat filter diubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Fungsi untuk mengekspor data ke PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Nama", "Kehadiran", "Tanggal Input"];
    const tableRows: string[][] = [];

    filteredGuests.forEach((guest) => {
      const guestData = [
        guest.name,
        guest.isAttending ? "Hadir" : "Tidak Hadir",
        new Date(guest.responseDate).toLocaleString(),
      ];
      tableRows.push(guestData);
    });

    doc.text("RSVP Dashboard", 14, 10);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("RSVP_Guests.pdf");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 bg-primarylight text-textprimary shadow-md rounded-md font-mono">
      <h2 className="text-2xl font-semibold mb-4">Reservasi</h2>

      {/* Tombol Filter */}
      <div className="flex space-x-6 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`flex flex-col items-left px-4 py-2 rounded bg-blue-700 w-28 ${
            filter === "all"
              ? "scale-110 shadow-lg shadow-blue-700 text-primarylight transition-transform duration-300"
              : "text-primarylight"
          }`}
        >
          <span className="font-bold text-yellow-300 text-2xl text-left">{totalGuests}</span>
          <span className="text-sm">Semua</span>
        </button>
        <button
          onClick={() => setFilter("attending")}
          className={`flex flex-col items-left px-4 py-2 rounded bg-green-600 w-28 ${
            filter === "attending" ? "scale-110 shadow-lg shadow-green-600 text-primarylight transition-transform duration-300" : "text-primarylight"
          }`}
        >
          <span className="font-bold text-yellow-300 text-2xl text-left">{attendingGuests}</span>
          <span className="text-sm">Hadir</span> 
        </button>
        <button
          onClick={() => setFilter("notAttending")}
          className={`flex flex-col items-left px-4 py-2 rounded bg-red-600 w-28 ${
            filter === "notAttending" ? "scale-110 shadow-lg shadow-red-600 text-primarylight transition-transform duration-300" : "text-primarylight"
          }`}
        >
          <span className="font-bold text-yellow-300 text-2xl text-left">{notAttendingGuests}</span> 
          <span className="text-sm">Tidak Hadir</span>
        </button>
        {/* Tombol Export */}
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-fuchsia-800 text-white rounded hover:scale-110 transition-transform duration-300"
        >
          Export to PDF
        </button>
      </div>

      {/* Tabel Data Tamu */}
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-darkprimary text-left text-primarylight">
            <th className="px-4 py-2">Nama</th>
            <th className="px-4 py-2">Kehadiran</th>
            <th className="px-4 py-2">Tanggal Input</th>
          </tr>
        </thead>
        <tbody>
          {currentGuests.length > 0 ? (
            currentGuests.map((guest) => (
              <tr key={guest.id} className="border-b border-textprimary">
                <td className="px-4 py-2 md:w-1/3">{guest.name}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    guest.isAttending ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {guest.isAttending ? "Hadir" : "Tidak Hadir"}
                </td>
                <td className="px-4 py-2">
                  {new Date(guest.responseDate).toLocaleString()}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4">
                Tidak ada data tamu.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Tombol Navigasi dan Export */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-textprimary text-white"
          }`}
        >
          Prev
        </button>
        <span>
           {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-textprimary text-white"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
