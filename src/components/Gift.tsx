"use client";

import React, { useState } from "react";
import Image from "next/image";

const Gift: React.FC = () => {
  const alamat = "Jl. DR. Sumarno No 1 (Sentra Primer), Penggilingan, Cakung, Jakarta Timur.";
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(alamat); // Menyalin teks ke clipboard
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000); // Reset pesan setelah 1 detik
    } catch (error) {
      console.error("Gagal menyalin teks ke clipboard:", error);
    }
  };

  return (
    <div
  className="w-72 h-52 pt-4 px-6 my-6 bg-white rounded-xl shadow-lg text-white items-center mx-auto"
  style={{
    backgroundImage: "url('/images/bgcard.jpg')", // Gambar latar tetap transparan
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  }}
>
      {/* Nomor Rekening */}
      <div className="mx-auto flex flex-col items-center rounded-3xl">
      {/* Gambar */}
      <div className="relative w-10 h-10 mb-4">
        <Image
          src="/images/gift5.png" // Ganti dengan path gambar yang sesuai
          alt="Gift Box"
          layout="fill" // Membuat gambar memenuhi kontainer
          objectFit="contain" // Agar gambar tetap proporsional
        />
      </div>

      {/* Teks */}
      <p className="text-sm font-bold text-gold font-mono text-center">{alamat}</p>
    </div>

      {/* Tombol Salin Nomor Rekening */}
      <div className="relative w-full h-16">
        <button
          onClick={handleCopy}
          className="absolute inset-4 inset-x-10 px-2 py-2 bg-primary shadow-md shadow-darkprimary hover:scale-105 rounded-lg text-gold font-semibold text-sm"
        >
          {isCopied ? "Berhasil Disalin" : "Salin Alamat Rumah"}
        </button>
      </div>
    </div>
  );
};

export default Gift;
