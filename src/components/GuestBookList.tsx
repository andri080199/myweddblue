'use client';
import { useState, useEffect } from "react";
import GuestBookForm from "./GuestBookForm";
import ScrollReveal from "./ScrollReveal";
import Image from "next/image";

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
    <div className="relative space-y-4 p-4 pb-20 px-6">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/PohonPutih.jpg" // Ganti dengan path gambar Anda
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        {/* Overlay untuk memastikan teks terbaca */}
        <div className="absolute inset-0 bg-white/50"></div>
      </div>

      <GuestBookForm onNewEntry={handleNewEntry} />
      <ScrollReveal>
        <h2 className="text-5xl text-center text-gold font-bold font-lavishly">
          Ucapan Doa
        </h2>
      </ScrollReveal>
      {entries.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada ucapan doa.</p>
      ) : (
        <ScrollReveal>
          <ul className="space-y-4 overflow-y-auto h-96 w-full border-4 border-darkprimary rounded-xl p-2">
            {entries.map((entry, index) => (
              <li
                key={index}
                className="shadow-md rounded-xl p-4 bg-primarylight border-2 border-darkprimary shadow-darkprimary"
              >
                <p className="font-bold text-textprimary font-poppins">
                  <span className="font-bold"></span> {entry.name}
                </p>
                <p className="text-textprimary font-thin font-merienda mt-1">
                  <span className="font-bold"></span> {entry.message}
                </p>
                <p className="text-sm text-textprimary mt-2">
                  Dikirim pada: {new Date(entry.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      )}
    </div>
  );
};

export default GuestBookList;
