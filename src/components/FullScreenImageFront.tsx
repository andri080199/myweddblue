"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface FullScreenImageProps {
  guestName: string;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({ guestName }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isSlidingUp, setIsSlidingUp] = useState(false);

  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsSlidingUp(true);
    setTimeout(() => setIsVisible(false), 1000);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className={`absolute inset-0 transition-transform duration-1000 ${
          isSlidingUp ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="absolute inset-0 grayscale">
          <Image
            src="/images/WeddingBG.jpg"
            alt="Background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            priority
          />
        </div>

        <div className="relative flex justify-center items-center rounded-xl w-max mx-auto text-center top-1/2 bg-transparent">
          <div className="absolute inset-0 bg-primarylight opacity-90 rounded-xl shadow-lg shadow-darkprimary"></div>

          <div className="relative z-10 p-4 px-8 text-darkprimary">
            <h1 className="text-sm uppercase font-merienda">The Wedding Of</h1>
            <h1 className="text-xl font-merienda uppercase">Mita & Angga</h1>
            <h1 className="text-sm font-merienda">Kepada Yth.</h1>
            <h1 className="text-lg font-mono text-gold">{guestName || "Tamu Undangan"}</h1>
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
