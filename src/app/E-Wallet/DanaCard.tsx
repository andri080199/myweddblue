"use client";

import React, { useState } from "react";
import Image from "next/image";

const DanaCard: React.FC = () => {
  const rekening = "0852-7960-0131";
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rekening); // Menyalin teks ke clipboard
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000); // Reset pesan setelah 1 detik
    } catch (error) {
      console.error("Gagal menyalin teks ke clipboard:", error);
    }
  };

  return (
    <div className="w-72 h-52 px-6 pt-8 bg-primary rounded-xl shadow-lg text-white items-center mx-auto"
    style={{
      backgroundImage: "url('/images/bgcard.jpg')", // URL gambar di folder public
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}>
      {/* Logo BRI */}
      <div className="flex justify-end">
        
        <div className="">

        <Image
          src={"/logo/dana.png"}
          alt="Dana Logo"
          width={96} // Lebar gambar
          height={96} // Tinggi gambar
          className=""
        />
        </div>
      </div>

      {/* Nomor Rekening */}
      <div className="mb-2 pt-8 ml-2">
        {/* <p className="text-sm font-semibold text-darkprimary">Nomor Rekening:</p> */}
        <p className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent font-mono text-left tracking-wider leading-relaxed">{rekening}</p>
      </div>

      {/* Tombol Salin Nomor Rekening */}
      <div className="relative w-full h-16">
        <button
          onClick={handleCopy}
          className="absolute bottom-2 -right-2 px-4 py-2 bg-primary rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-800 bg-clip-text text-transparent hover:scale-105 shadow-md shadow-darkprimary font-semibold text-sm leading-relaxed"
        >
          {isCopied ? "Berhasil Disalin" : "Salin No. Dana"}
        </button>
      </div>
    </div>
  );
};

export default DanaCard;
