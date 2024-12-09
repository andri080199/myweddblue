import React from "react";
import Image from "next/image"; // Impor Image dari Next.js
import ScrollReveal from "./ScrollReveal";

const BrideCard: React.FC = () => {
  return (
    <div>
      {/* Card dengan background dan gambar */}
      <div className="relative w-60 h-96 bg-primary rounded-t-3xl mt-8 overflow-hidden">
        {/* Sisi kiri dengan teks "The Bride" secara vertikal dari bawah ke atas */}
        <div className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-center text-white z-10">
          {/* Teks vertikal bisa ditambahkan jika diperlukan */}
        </div>

        {/* Gambar dengan tulisan "Mita" */}
        <div className="relative w-full h-full">
          <Image
            src={"/images/WeddingGirl.jpg"} // Menggunakan gambar dari folder images
            alt="Bride Image"
            layout="fill" // Menyesuaikan ukuran gambar dengan kontainer
            objectFit="cover" // Menjaga agar gambar tetap terjaga aspect ratio
            className=""
          />
        </div>
      </div>

      {/* Bagian nama dan informasi */}
      <div className="w-60 bg-darkprimary text-left py-2 pl-2">
        <h3 className="text-2xl text-primarylight font-semibold font-merienda">THE BRIDE</h3>
      </div>
      <ScrollReveal>
      <div className="text-left mt-2 text-darkprimary">
        <h1 className="font-merienda text-2xl">Mita Anggraini Safitri</h1>
        <h1 className="font-merienda mr-20">Putri Pertama dari Bapak Yusuf Ali dan Ibu Nurbaya</h1>
      </div>
      </ScrollReveal>
    </div>
  );
};

export default BrideCard;
