// components/Footer.tsx
import React from "react";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-primary text-darkprimary py-4 text-center overflow-hidden">
        <div className=''>
      <Image
        src={"/images/PojokKananBunga.png"}
        alt="Chip"
        width={170}
        height={170}
        className="absolute -top-16 -right-12 z-0 animate-tiltRight" 
      />

      <Image
        src={"/images/PojokKiriBunga.png"}
        alt="Chip"
        width={170}
        height={170}
        className="absolute -top-16 -left-12 z-0 animate-tiltLeft" 
        />
      </div>
        <div className="mx-auto px-12 pt-8">
        <h1 className="text-5xl font-fleur mb-6">Thank You</h1>
        <h1 className="text-sm font-merienda">Menjadi Sebuah Kebahagiaan Bagi Kami Apabila Bapak/Ibu/Saudara/i Berkenan Hadir Dalam Hari Bahagia Kami. Terima Kasih Atas Segala Ucapan, Doa, dan Perhatian yang Diberikan.</h1>
        <h1 className="text-sm font-merienda">Sampai Jumpa di Hari Bahagia Kami.</h1>
        <h1 className="text-sm font-mono pt-4">Kami yang berbahagia:</h1>
        <h1 className="text-5xl font-lavishly ">Angga</h1>
        <h1 className="text-5xl font-lavishly ">&</h1>
        <h1 className="text-5xl font-lavishly ">Mita</h1>
        <h1 className="text-sm font-poppins">Beserta Keluarga</h1>

        </div>
      <p className="text-sm mt-12">
        Dibuat dengan <span className="text-red-500">❤️</span>
      </p>
    </footer>
  );
};

export default Footer;
