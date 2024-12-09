'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";

const FullScreenImage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isSlidingUp, setIsSlidingUp] = useState(false);

  // Disable scroll when the component is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = ""; // Reset scroll on unmount
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsSlidingUp(true); // Memulai animasi geser ke atas
    setTimeout(() => setIsVisible(false), 1000); // Hapus komponen setelah animasi selesai
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Wrapper untuk Transisi */}
      <div
        className={`absolute inset-0 transition-transform duration-1000 ${
          isSlidingUp ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Background Image */}
        <div className="absolute inset-0 grayscale">
          <Image
            src="/images/WeddingBG.jpg" // Ganti dengan path gambar Anda
            alt="Background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            priority
          />
        </div>

        {/* Center Button */}
        <div className="relative flex justify-center items-center rounded-xl w-max mx-auto text-center top-1/2 bg-transparent">
  {/* Background dengan opacity */}
  <div className="absolute inset-0 bg-primarylight opacity-90 rounded-xl shadow-lg shadow-darkprimary"></div>
  
  {/* Konten yang tidak terpengaruh opacity */}
  <div className="relative z-10 p-4 px-8 text-darkprimary">
    <h1 className="text-sm uppercase font-merienda">The Wedding Of</h1>
    <h1 className="text-xl font-merienda uppercase">Mita & Angga</h1>
    <h1 className="text-sm font-merienda">Kepada Yth.</h1>
    <h1 className="text-md font-merienda">Nama Tamu</h1>
    <button
      onClick={handleClose}
      className="flex justify-center items-center gap-2 px-4 py-2 text-sm bg-darkprimary text-primarylight rounded-lg shadow-lg mt-2 hover:bg-primarylight hover:text-darkprimary"
    >
      <Image
        src="/svg/enveloped.svg"
        alt="Envelope Icon"
        width={20}
        height={20}
      />
      Buka Undangan
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default FullScreenImage;
