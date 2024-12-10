import React from "react";
import Image from "next/image"; // Impor Image dari Next.js
import ScrollReveal from "./ScrollReveal";

const BrideCard: React.FC = () => {
  return (
    <div>
      {/* Card dengan background dan gambar */}
      <div className="relative w-52 h-52 bg-primary rounded-full mx-auto mt-4">
  {/* Gambar */}
  <div className="relative w-full h-full">
    <Image
      src={"/images/WeddingGirl.jpg"} // Menggunakan gambar dari folder images
      alt="Bride Image"
      layout="fill" // Menyesuaikan ukuran gambar dengan kontainer
      objectFit="cover" // Menjaga agar gambar tetap terjaga aspect ratio
      objectPosition="top"
      className="rounded-full"
    />
    
  </div>
  <ScrollReveal>
  <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 text-white z-10 whitespace-nowrap">
    <h1 className="text-3xl font-allura text-gold font-bold">Mita Anggraini Safitri</h1>
  </div>
  </ScrollReveal>
</div>


      {/* Bagian nama dan informasi */}
      
      <ScrollReveal>
      <div className="text-center mt-6 text-textprimary justify-center items-center mx-8">
        <h1 className="font-merienda text-sm font-bold">Putri Pertama dari Bapak Yusuf Ali dan Ibu Nurbaya</h1>
      </div>
      </ScrollReveal>
    </div>
  );
};

export default BrideCard;
