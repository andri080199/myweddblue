'use client';
import { useState, useEffect } from "react";
import GuestBookForm from "./GuestBookForm";

interface GuestEntry {
  name: string;
  message: string;
  timestamp: string;
}

const GuestBookList = () => {
  const [entries, setEntries] = useState<GuestEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch("/api/guestbook");
        if (!response.ok) {
          throw new Error("Failed to fetch guestbook entries");
        }
        const data: GuestEntry[] = await response.json();
        setEntries(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  // Callback untuk menambahkan entri baru
  const handleNewEntry = (newEntry: GuestEntry) => {
    setEntries((prevEntries) => [newEntry, ...prevEntries]);
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading entries...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-4 p-4 pb-20 bg-darkprimary px-6">
      <GuestBookForm onNewEntry={handleNewEntry} />
      <h2 className="text-4xl font-semibold text-center text-primarylight font-lavishly pt">Ucapan Doa</h2>
      {entries.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada ucapan doa.</p>
      ) : (
        <ul className="space-y-4 overflow-y-auto h-96 w-full border-4 border-primary rounded-xl p-2">
          {entries.map((entry, index) => (
            <li
              key={index}
              className="shadow-md rounded-xl shadow-primarylight p-4 bg-primarylight"
            >
              <p className="font-bold text-darkprimary font-poppins">
                <span className="font-bold"></span> {entry.name}
              </p>
              <p className="text-darkprimary font-thin font-merienda mt-1">
                <span className="font-bold"></span> {entry.message}
              </p>
              <p className="text-sm text-darkprimary mt-2">
                Dikirim pada: {new Date(entry.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GuestBookList;
