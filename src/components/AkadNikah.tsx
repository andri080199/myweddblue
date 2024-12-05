import React from 'react';

const AkadNikah: React.FC = () => {
  return (
    <div className="mx-8" >
      <div className="flex h-full pt-4" >
        {/* Sisi Kiri */}
        <div className="w-12 bg-darkprimary flex items-center justify-center rounded-tl-3xl">
          <p className="text-white text-xl font-merienda -rotate-90 text-nowrap">Akad Nikah</p>
        </div>

        {/* Sisi Kanan */}
        <div className="w-full bg-blue-50 flex-row p-4 py-6 text-darkprimary">
          <h1 className="text-lg font-merienda">Minggu, 28 April 2024</h1>
          <p className="text-sm font-mono">Pukul 08.00 s.d 10.00 WIB</p>
          <hr className="border-t-2 border-darkprimary my-3" />
          <h1 className="text-lg font-merienda font-bold">Lokasi</h1>
          <p className='text-sm font-mono'>Golden Tulip Essential Tangerang
            Jl. Jend. Sudirman Kav. 9 Cikokol
            Sukasari, Tangerang, Banten
          </p>
        </div>
      </div>
    </div>
  );
};

export default AkadNikah;
