"use client";

import React, { useState } from "react";
import Image from "next/image";

interface GiftProps {
  giftData?: {
    address?: string;
  };
}

const Gift: React.FC<GiftProps> = ({ giftData }) => {
  const [isCopied, setIsCopied] = useState(false);
  
  // Default alamat jika data tidak ada
  const defaultAddress = 'Jl. DR. Sumarno No 1 (Sentra Primer), Penggilingan, Cakung, Jakarta Timur.';
  const currentAddress = giftData?.address || defaultAddress;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentAddress);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    } catch (error) {
      console.error("Gagal menyalin teks ke clipboard:", error);
    }
  };

  return (
    <div
      className="relative w-72 h-52 pt-4 px-6 my-6 bg-white rounded-xl shadow-lg text-white items-center mx-auto"
      style={{
        backgroundImage: "url('/images/bgcard.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {/* Content */}
      <div className="mx-auto flex flex-col items-center rounded-3xl">
        {/* Icon */}
        <div className="relative w-10 h-10 mb-4">
          <Image
            src="/images/gift5.png"
            alt="Gift Box"
            fill
            className="object-contain"
          />
        </div>

        {/* Address */}
        <p className="text-sm font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent font-mono text-center leading-relaxed">
          {currentAddress}
        </p>
      </div>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="absolute bottom-4 right-4 px-3 py-2 bg-primary rounded-lg bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent hover:scale-105 shadow-md shadow-darkprimary font-semibold text-xs leading-relaxed"
      >
        {isCopied ? "Berhasil Disalin" : "Salin Alamat Rumah"}
      </button>
    </div>
  );
};

export default Gift;
