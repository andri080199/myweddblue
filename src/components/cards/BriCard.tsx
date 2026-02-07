"use client";

import React, { useState } from "react";
import Image from "next/image";

const BriCard: React.FC = () => {
  const rekening = "2838131";
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
    <div className="w-72 h-52 px-6 pt-8 my-6 bg-primary rounded-xl shadow-lg text-white items-center mx-auto"
    style={{
      backgroundImage: "url('/images/bgcard.jpg')", // URL gambar di folder public
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    }}>
      <div className="relative w-full h-16"> {/* Parent Container (relative) */}
  {/* Logo Chip */}
  <Image
    src={"/logo/chip.png"}
    alt="Chip"
    width={48}
    height={48}
    className="absolute top-6 left-2" // Posisi absolute untuk Chip
  />

  {/* Logo BRI */}
  <Image
    src={"/logo/bri.png"}
    alt="BRI Logo"
    width={80}
    height={80}
    className="absolute -top-6 -right-2" // Posisi absolute untuk Logo BRI
  />
</div>


      {/* Nomor Rekening */}
      <div className="mb-2 pt-4 ml-2">
        {/* <p className="text-sm font-semibold text-darkprimary">Nomor Rekening:</p> */}
        <p className="text-lg font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent font-mono text-left tracking-wider leading-relaxed">{rekening}</p>
      </div>

      {/* Tombol Salin Nomor Rekening */}
      <div className="relative w-full h-16">
        <button
          onClick={handleCopy}
          className="absolute bottom-4 -right-2 px-2 py-2 bg-primary rounded-lg bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent hover:scale-105 shadow-md shadow-darkprimary font-semibold text-sm leading-relaxed"
        >
          {isCopied ? "Berhasil Disalin" : "Salin No. Rekening"}
        </button>
      </div>
    </div>
  );
};

export default BriCard;
