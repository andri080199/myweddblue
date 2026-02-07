"use client";

import React, { useState } from "react";
import * as XLSX from "xlsx";

interface Guest {
  guestName: string;
  phone: string;
}

export default function UploadGuestExcel() {
  const [, setGuests] = useState<Guest[]>([]);
  const [message, setMessage] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet);

    // Pastikan kolom Excel: "name" dan "phone"
    const parsedGuests: Guest[] = jsonData
      .filter((row) => row.name && row.phone)
      .map((row) => ({
        guestName: String(row.name),
        phone: String(row.phone),
      }));

    setGuests(parsedGuests);

    if (parsedGuests.length === 0) {
      setMessage("Tidak ada data tamu valid di file Excel.");
      return;
    }

    try {
      const res = await fetch("/api/guestNames", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsedGuests),
      });

      const result = await res.json();
      if (res.ok) {
        setMessage(`${result.message}`);
      } else {
        setMessage(result.message || "Gagal mengunggah data tamu.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Terjadi kesalahan saat mengunggah data.");
    }
  };

  return (
    <div className="p-4 border rounded shadow w-full max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-2">Upload File Excel Tamu</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />
      {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
    </div>
  );
}
