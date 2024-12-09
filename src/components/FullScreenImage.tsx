// File: components/FullScreenImage.tsx
import React from "react";
import Image from "next/image";
import BoxTime from "./BoxTime";
import FullScreenImageFront from "./FullScreenImageFront";


interface FullScreenImageProps {
  src: string;
  alt?: string;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({ src, alt = "Full Screen Image" }) => {
  return (
    <>
    {/* <FullScreenImageFront/> */}
    <FullScreenImageFront/>
    <div className="relative w-full h-screen z-10">
      <Image 
        src={src} 
        alt={alt} 
        layout="fill" // Mengisi kontainer
        objectFit="cover" // Mengisi layar dengan mempertahankan aspek rasio gambar
        quality={100} // Opsional, atur kualitas gambar
        className=""
      />
      {/* <div className="absolute bottom-0 left-0 right-0 bg-primarylight opacity-50 h-1/3"></div> */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center z-10 p-2 pb-8">
        <BoxTime />
      </div>
    </div>
    </>
  );
};

export default FullScreenImage;


