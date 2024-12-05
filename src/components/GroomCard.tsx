import React from "react";
import Image from "next/image"; // Impor Image dari Next.js

const GroomCard: React.FC = () => {
  return (
    <div className="justify-items-end">
      <div className="relative w-60 h-96 bg-primary rounded-t-3xl mt-8 overflow-hidden">
        {/* Gambar dengan padding top untuk menggeser gambar ke bawah */}
        <div className="w-full h-full">
          <Image
            src={"/images/WeddingBoy.jpg"} // Menggunakan gambar dari folder images
            alt="Deskripsi gambar"
            layout="fill" // Mengisi area kontainer
            objectFit="cover" // Menjaga aspect ratio gambar
            className="" // Menggeser gambar ke bawah dengan padding-top
          />
        </div>
      </div>

      <div className="w-60 bg-darkprimary text-right pr-2 py-2">
        <h3 className="text-2xl font-semibold font-merienda text-primarylight">THE GROOM</h3>
      </div>
      <div className="text-right mt-2 text-darkprimary">
        <h1 className="font-merienda text-2xl pb-2">Angga Pradita Mulia</h1>
        <h1 className="font-merienda ml-20">
          Putra Pertama dari Bapak Ibnu Jailani dan Ibu Siti Nurhaliza
        </h1>
      </div>
    </div>
  );
};

export default GroomCard;
