import React from "react";
import Image from "next/image";
import ScrollReveal from "../ui/ScrollReveal";

interface BrideCardProps {
  brideName?: string;
  brideFullName?: string;
  brideChildOrder?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  brideImage?: string;
}

const BrideCard: React.FC<BrideCardProps> = ({ 
  brideName = "Mita",
  brideFullName = "Mita Anggraini Safitri", 
  brideChildOrder = "2",
  brideFatherName = "Ali",
  brideMotherName = "Siti",
  brideImage = "/images/WeddingGirl.jpg"
}) => {
  
  // Convert number to Indonesian ordinal words
  const getOrdinalWord = (num: string): string => {
    const ordinals: { [key: string]: string } = {
      '1': 'pertama', '2': 'kedua', '3': 'ketiga', '4': 'keempat', '5': 'kelima',
      '6': 'keenam', '7': 'ketujuh', '8': 'kedelapan', '9': 'kesembilan', '10': 'kesepuluh'
    };
    return ordinals[num] || `ke-${num}`;
  };

  // Generate parent text automatically (Putri)
  const brideParent = `Putri ${getOrdinalWord(brideChildOrder)} dari Bapak ${brideFatherName} & Ibu ${brideMotherName}`;
  
  return (
    <div className="flex flex-col items-center w-full">
      
      {/* --- 1. FOTO PROFILE --- */}
      <div className="relative mt-4 mb-8">
        {/* PERBAIKAN DISINI:
            1. -inset-5: Membuat lingkaran lebih besar/jauh dari foto
            2. border-2: Membuat titik-titik lebih tebal
            3. border-gold: Membuat warna emas solid (bukan transparan)
        */}
        <div className="absolute -inset-2 rounded-full border-2 border-dashed border-gold animate-[spin_15s_linear_infinite] shadow-sm shadow-gold"></div>
        
        <div className="relative w-40 h-40 lg:w-52 lg:h-52 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-2xl">
          <Image
            src={brideImage}
            alt="Bride"
            layout="fill"
            objectFit="cover"
            objectPosition="top"
            className="hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        </div>
      </div>

      <ScrollReveal>
        <div className="relative text-center w-full flex flex-col items-center justify-center gap-5">
          
          {/* --- 2. NAMA LENGKAP (White Text on Premium Gold Brush) --- */}
          <div className="relative px-12 py-6 group">
            
            {/* SVG Brush Background */}
            <div className="absolute inset-0 w-full h-full -z-10 transform scale-110 group-hover:scale-115 transition-transform duration-700">
               <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full h-full drop-shadow-lg">
                 <defs>
                   {/* 1. Gradient Emas Pekat */}
                   <linearGradient id="richGoldBrushBride" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="#C6A664" /> {/* Darker Gold */}
                     <stop offset="50%" stopColor="#E5C578" /> {/* Lighter Gold */}
                     <stop offset="100%" stopColor="#C6A664" />
                   </linearGradient>

                   {/* 2. Tekstur Alami */}
                   <filter id="naturalBrushStrokeBride">
                     <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise" />
                     <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
                   </filter>
                 </defs>
                 
                 {/* 3. Bentuk Sapuan Kaligrafi */}
                 <path 
                   d="M30,65 C80,25 200,15 320,35 C370,45 400,65 380,90 C340,115 180,105 80,95 C40,90 10,85 30,65 Z" 
                   fill="url(#richGoldBrushBride)"
                   filter="url(#naturalBrushStrokeBride)" 
                   opacity="0.95"
                 />
               </svg>
            </div>

            {/* Nama dengan warna PUTIH (text-white) agar kontras dengan brush emas */}
            <h1 className="text-2xl md:text-5xl font-allura text-white font-bold leading-relaxed drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)] tracking-wide transform -rotate-1">
              {brideFullName}
            </h1>
          </div>

          {/* --- 3. INFO ORANG TUA --- */}
          <div className="relative">
            <div className="bg-white/50 backdrop-blur-sm border border-darkprimary px-6 py-2 shadow-md shadow-darkprimary relative">
               
               {/* Ornamen titik emas */}
               <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gold rounded-full"></div>
               <div className="absolute right-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-gold rounded-full"></div>

               <p className="font-poppins text-xs font-thin text-darkprimary md:max-w-md mx-auto leading-tight uppercase tracking-wider">
                 {brideParent}
               </p>
            </div>
          </div>

        </div>
      </ScrollReveal>
    </div>
  );
};

export default BrideCard;