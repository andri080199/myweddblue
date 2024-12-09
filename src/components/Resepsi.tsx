import React from 'react';
import ScrollReveal from './ScrollReveal';

const Resepsi: React.FC = () => {
  return (
    <div className="mx-8">
      <div className="flex h-full mt-4">
        {/* Sisi Kiri - Informasi Resepsi */}
        <div className="w-full bg-blue-50 flex-row p-4 py-6 text-darkprimary text-right">
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

        {/* Sisi Kanan - Label Resepsi */}
        <div className="w-12 bg-darkprimary flex items-center justify-center rounded-br-3xl">
          <p className="text-white text-xl font-merienda rotate-90 text-nowrap">Resepsi</p>
        </div>
      </div>
    </div>
  );
};

export default Resepsi;
