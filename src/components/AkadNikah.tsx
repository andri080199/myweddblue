import React from 'react';
import ScrollReveal from './ScrollReveal';
import Image from 'next/image';

const AkadNikah: React.FC = () => {
  return (
    <div className="relative mx-8" >
      <div className="absolute inset-0 z-10">
            <Image
              src="/images/MerpatiBangku.jpg" // Ganti dengan path gambar Anda
              alt="Background"
              layout="fill"
              objectFit="cover"
              priority // Agar gambar ini dimuat lebih awal
              className='rounded-tl-3xl'
            />
            {/* Overlay untuk memastikan teks terbaca */}
           <div className="absolute inset-0 bg-primarylight opacity-80 rounded-tl-3xl"></div>
          </div>
           
      <div className="flex h-full" >
        {/* Sisi Kiri */}
        <div className="w-12 bg-darkprimary flex items-center justify-center rounded-tl-3xl z-20">
          <p className="text-primarylight text-xl font-merienda -rotate-90 text-nowrap">Akad Nikah</p>
        </div>

        {/* Sisi Kanan */}
        <div className="w-full flex-row p-4 py-6 text-darkprimary overflow-hidden">
          {/* Background Image */}
          

           {/* Konten */}
          <div className="relative z-10 text-textprimary">
          <ScrollReveal>
          <h1 className="text-lg font-merienda">Minggu, 28 April 2024</h1>
          </ScrollReveal>
          <ScrollReveal>
          <p className="text-sm font-mono">Pukul 08.00 s.d 10.00 WIB</p>
          </ScrollReveal>
          <hr className="border-t-2 border-darkprimary my-3" />
          <ScrollReveal>
          <h1 className="text-lg font-merienda font-bold">Lokasi</h1>
          </ScrollReveal>
          <ScrollReveal>   
          <p className='text-sm font-mono'>Golden Tulip Essential Tangerang
            Jl. Jend. Sudirman Kav. 9 Cikokol
            Sukasari, Tangerang, Banten
          </p>
          </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AkadNikah;
