// File: components/FullScreenImage.tsx
import React from "react";
import Image from "next/image";
import FullScreenImageFront from "./FullScreenImageFront";
import BoxWithImage from "./BoxWithImage";


interface FullScreenImageProps {
  src: string;
  alt?: string;
  guestName: string; // Tambahkan guestName sebagai props
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({ src, alt = "Full Screen Image", guestName }) => {
  return (
    <>
    {/* <FullScreenImageFront/> */}
    <FullScreenImageFront guestName={guestName}/>
    <div id="home" className="relative w-full h-screen z-10 pt-20">
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
        
        {/* <BoxTime /> */}
      </div>
      <BoxWithImage />
    </div>
    
    </>
  );
};

export default FullScreenImage;


