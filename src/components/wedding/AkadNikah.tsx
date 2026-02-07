import React from 'react';
import ScrollReveal from '../ui/ScrollReveal';
import Image from 'next/image';
import OpenGoogleMapsButton from '../interactive/OpenGoogleMapsButton';
import { createCalendarEvent, addToGoogleCalendar } from '../../utils/calendarUtils';

interface AkadNikahProps {
  clientSlug?: string;
  akadInfo?: {
    weddingDate?: string;
    akadTime?: string;
    venue?: string;
    address?: string;
    mapsLink?: string;
  };
}

const AkadNikah: React.FC<AkadNikahProps> = ({ clientSlug, akadInfo }) => {
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
      'akad',
      akadInfo?.weddingDate || '2024-04-28',
      akadInfo?.akadTime || '11.00',
      akadInfo?.venue || 'Masjid Al-Ikhlas',
      akadInfo?.address || 'Jl. Raya Kemang No. 15, Jakarta Selatan, DKI Jakarta 12560',
      clientSlug
    );
    addToGoogleCalendar(event);
  };
  return (
    <div className="relative mx-8 mb-12 min-h-[200px]" >
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
          <div className="flex h-full mt-4">
             {/* Sisi Kanan - Label Resepsi */}
        <div className="w-12 bg-darkprimary flex items-center justify-center rounded-tl-3xl z-20">
          <p className="text-white text-xl font-merienda -rotate-90 text-nowrap">Akad Nikah</p>
        </div>
        {/* Sisi Kiri - Informasi Akad */}
        <div className="relative z-10 text-textprimary mb-8 flex-1 min-h-[150px]">
        <div className="w-full p-4 py-6 text-left h-full flex flex-col justify-center">
          <ScrollReveal>
            <h1 className="text-md font-merienda">{formatDate(akadInfo?.weddingDate)}</h1>
            </ScrollReveal>
            <ScrollReveal>
          <p className="font-mono text-sm">Pukul {akadInfo?.akadTime || "11.00"} s.d 13.00 WIB</p>
            </ScrollReveal>
          <hr className="border-t-2 border-darkprimary my-3" />
          <ScrollReveal>
          <h1 className="text-md font-merienda font-bold">Lokasi</h1>
          </ScrollReveal>
          <ScrollReveal>
          <p className='text-sm font-mono'>
            {akadInfo?.venue || "Masjid Al-Ikhlas"}
            <br />
            {akadInfo?.address || "Jl. Raya Kemang No. 15, Jakarta Selatan, DKI Jakarta 12560"}
          </p>
          </ScrollReveal>
          <ScrollReveal>
          <button
            onClick={handleAddToCalendar}
            className="mt-3 bg-darkprimary text-white px-4 py-2 rounded-lg text-xs font-mono hover:bg-opacity-80 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Tambah ke Kalender
          </button>
          </ScrollReveal>
        </div>
        </div>

       
      </div>
      <div className='absolute -bottom-2 right-0 justify-center items-center z-40'>

      <OpenGoogleMapsButton 
        mapsLink={akadInfo?.mapsLink}
        address={akadInfo?.address}
      />
      </div>
    </div>
  );
};

export default AkadNikah;
