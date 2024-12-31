import React from 'react';
import ScrollReveal from './ScrollReveal';
import Image from 'next/image';
import OpenGoogleMapsButton from './OpenGoogleMapsButton';

const Resepsi: React.FC = () => {
  return (
    <div className="relative mx-8">
      <div className="absolute inset-0 z-10">
            <Image
              src="/images/MerpatiBangku.jpg" // Ganti dengan path gambar Anda
              alt="Background"
              layout="fill"
              objectFit="cover"
              priority // Agar gambar ini dimuat lebih awal
              className='rounded-br-3xl'
            />
            {/* Overlay untuk memastikan teks terbaca */}
           <div className="absolute inset-0 bg-primarylight opacity-80 rounded-br-3xl"></div>
          </div>
      <div className="flex h-full mt-4">
        {/* Sisi Kiri - Informasi Resepsi */}
        <div className="relative z-10 text-textprimary mb-8">
        <div className="w-full flex-row p-4 py-6 text-right">
          <ScrollReveal>
            <h1 className="text-md font-merienda">Minggu, 28 April 2024</h1>
            </ScrollReveal>
            <ScrollReveal>
          <p className="font-mono text-sm">Pukul 11.00 s.d 13.00 WIB</p>
            </ScrollReveal>
          <hr className="border-t-2 border-darkprimary my-3" />
          <ScrollReveal>
          <h1 className="text-md font-merienda font-bold">Lokasi</h1>
          </ScrollReveal>
          <ScrollReveal>
          <p className='text-sm font-mono'>
            Golden Tulip Essential Tangerang
            Jl. Jend. Sudirman Kav. 9 Cikokol
            Sukasari, Tangerang, Banten
          </p>
          
          </ScrollReveal>
         
        </div>
       
        </div>

        {/* Sisi Kanan - Label Resepsi */}
        <div className="w-12 bg-darkprimary flex items-center justify-center rounded-br-3xl z-20">
          <p className="text-white text-xl font-merienda rotate-90 text-nowrap">Resepsi</p>
        </div>
      </div>
      <div className='absolute -bottom-2 justify-center items-center z-50'>

      <OpenGoogleMapsButton/>
      </div>
    </div>
  );
};

export default Resepsi;
