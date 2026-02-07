import React from 'react';
import ScrollReveal from '../ui/ScrollReveal';
import Image from 'next/image';
import OpenGoogleMapsButton from '../interactive/OpenGoogleMapsButton';
import { createCalendarEvent, addToGoogleCalendar } from '../../utils/calendarUtils';

interface ResepsiProps {
  clientSlug?: string;
  resepsiInfo?: {
    weddingDate?: string;
    resepsiTime?: string;
    venue?: string;
    address?: string;
    mapsLink?: string;
  };
}

const Resepsi: React.FC<ResepsiProps> = ({ clientSlug, resepsiInfo }) => {
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Minggu, 28 April 2024";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return "Minggu, 28 April 2024";
    }
  };

  // Handle add to calendar
  const handleAddToCalendar = () => {
    const event = createCalendarEvent(
      'resepsi',
      resepsiInfo?.weddingDate || '2024-04-28',
      resepsiInfo?.resepsiTime || '11.00',
      resepsiInfo?.venue || 'Gedung Balai Kartini',
      resepsiInfo?.address || 'Jl. Gatot Subroto No. 37, Jakarta Selatan, DKI Jakarta 12930',
      clientSlug
    );
    addToGoogleCalendar(event);
  };
  return (
    <div className="relative mx-8 min-h-[200px]">
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
        <div className="relative z-10 text-textprimary mb-8 flex-1 min-h-[150px]">
        <div className="w-full p-4 py-6 text-right h-full flex flex-col justify-center">
          <ScrollReveal>
            <h1 className="text-md font-merienda">{formatDate(resepsiInfo?.weddingDate)}</h1>
            </ScrollReveal>
            <ScrollReveal>
          <p className="font-mono text-sm">Pukul {resepsiInfo?.resepsiTime || "11.00"} s.d 13.00 WIB</p>
            </ScrollReveal>
          <hr className="border-t-2 border-darkprimary my-3" />
          <ScrollReveal>
          <h1 className="text-md font-merienda font-bold">Lokasi</h1>
          </ScrollReveal>
          <ScrollReveal>
          <p className='text-sm font-mono'>
            {resepsiInfo?.venue || "Gedung Balai Kartini"}
            <br />
            {resepsiInfo?.address || "Jl. Gatot Subroto No. 37, Jakarta Selatan, DKI Jakarta 12930"}
          </p>
          </ScrollReveal>
          <ScrollReveal>
          <button
            onClick={handleAddToCalendar}
            className="mt-3 bg-darkprimary text-white px-4 py-2 rounded-lg text-xs font-mono hover:bg-opacity-80 transition-all duration-300 flex items-center gap-2 ml-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Tambah ke Kalender
          </button>
          </ScrollReveal>
         
        </div>
       
        </div>

        {/* Sisi Kanan - Label Resepsi */}
        <div className="w-12 bg-darkprimary flex items-center justify-center rounded-br-3xl z-20">
          <p className="text-white text-xl font-merienda rotate-90 text-nowrap">Resepsi</p>
        </div>
      </div>
      <div className='absolute -bottom-2 justify-center items-center z-40'>

      <OpenGoogleMapsButton 
        mapsLink={resepsiInfo?.mapsLink}
        address={resepsiInfo?.address}
      />
      </div>
    </div>
  );
};

export default Resepsi;
