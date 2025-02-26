import { useState, useEffect } from "react";

interface GuestEntry {
  name: string;
  message: string;
  timestamp: string;
}

const Guestbook = () => {
  const [guestbookEntries, setGuestbookEntries] = useState<GuestEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  // Fungsi untuk mengambil data dari API
  const fetchGuestbookEntries = async () => {
    try {
      const response = await fetch("/api/guestbook");
      const data = await response.json();
      setGuestbookEntries(data);
    } catch (error) {
      console.error("Error fetching guestbook entries:", error);
    }
  };

  // Mengambil data guestbook saat komponen pertama kali dimuat
  useEffect(() => {
    fetchGuestbookEntries();
  }, []);

  // Menghitung total halaman
  const totalPages = Math.ceil(guestbookEntries.length / entriesPerPage);

  // Menampilkan entri untuk halaman saat ini
  const currentEntries = guestbookEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Guestbook</h2>
      <div className="overflow-auto h-full">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Message</th>
              <th className="border px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {currentEntries.map((entry, index) => (
              <tr key={index} className="border-b">
                <td className="border px-4 py-2">{entry.name}</td>
                <td className="border px-4 py-2">{entry.message}</td>
                <td className="border px-4 py-2">{entry.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Previous
        </button>
        <span className="self-center">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded-md"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Guestbook;
