// File: components/FullScreenImage.tsx
import React from "react";
import Image from "next/image";
import BoxTime from "./BoxTime";

interface FullScreenImageProps {
  src: string;
  alt?: string;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({ src, alt = "Full Screen Image" }) => {
  return (
    <div className="relative w-full h-screen z-10">
      <Image 
        src={src} 
        alt={alt} 
        layout="fill" // Mengisi kontainer
        objectFit="cover" // Mengisi layar dengan mempertahankan aspek rasio gambar
        quality={100} // Opsional, atur kualitas gambar
        className="brightness-50"
      />
      <div className="absolute bottom-0 left-0 w-full flex justify-center z-10 p-2 pb-8">
        <BoxTime />
      </div>
    </div>
  );
};

export default FullScreenImage;


