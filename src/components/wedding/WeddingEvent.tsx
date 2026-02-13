import React from 'react';
import AkadNikah from './AkadNikah';
import Resepsi from './Resepsi';
import Image from 'next/image';
import ScrollReveal from '../ui/ScrollReveal';
import { Heart, Sparkles, Calendar } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useUnifiedTheme } from '@/hooks/useUnifiedTheme';
import OrnamentLayer from './OrnamentLayer';

interface WeddingEventProps {
  clientSlug?: string;
  akadInfo?: {
    weddingDate?: string;
    akadTime?: string;
    venue?: string;
    address?: string;
    mapsLink?: string;
  };
  resepsiInfo?: {
    weddingDate?: string;
    resepsiTime?: string;
    venue?: string;
    address?: string;
    mapsLink?: string;
  };
  themeId?: string;
}

// Komponen WeddingEvent dengan TypeScript
const WeddingEvent: React.FC<WeddingEventProps> = ({ clientSlug, akadInfo, resepsiInfo, themeId }) => {
  const { theme } = useThemeContext();
  const { getOrnaments, getBackground } = useUnifiedTheme(themeId);
  const backgroundImage = getBackground('event') || theme.images.hero;
  return (
    <div id='event' className="relative w-full h-full pt-8 pb-12 bg-gradient-to-tr from-primary to-primarylight">
      {/* Header Section - Fixed positioning */}
      <div className='relative z-20 mb-4'>
        <ScrollReveal>
          <div className="text-center mx-4">
            {/* <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-gold animate-pulse mr-4" />
              <Calendar className="w-10 h-10 text-gold mr-4" />
              <Sparkles className="w-8 h-8 text-gold animate-pulse" />
            </div> */}
            
            <div className="relative">
              <div className="relative py-12 px-8" style={{
                background: `url("data:image/svg+xml,${encodeURIComponent(`
                  <svg viewBox="0 0 320 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="brushGradientEvent" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="white" stop-opacity="0.95" />
                        <stop offset="50%" stop-color="white" stop-opacity="0.85" />
                        <stop offset="100%" stop-color="white" stop-opacity="0.75" />
                      </linearGradient>
                      <filter id="roughPaperEvent">
                        <feTurbulence baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                      </filter>
                    </defs>
                    <path 
                      d="M15,20 Q25,8 45,15 Q75,5 105,18 Q135,8 165,20 Q195,12 225,25 Q255,18 285,30 Q305,25 315,35 L312,95 Q285,105 255,100 Q225,110 195,95 Q165,105 135,100 Q105,107 75,95 Q45,103 25,95 Q10,102 5,85 Z" 
                      fill="url(#brushGradientEvent)"
                      filter="url(#roughPaperEvent)"
                    />
                  </svg>
                `)}")`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))'
              }}>
                <h1 className='font-fleur bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent text-5xl font-bold relative z-30 overflow-visible leading-relaxed mb-4'>Wedding Event</h1>
                <div className="w-24 h-1 bg-gradient-to-r from-gold to-accent mx-auto rounded-full mb-4"></div>
                <div className="flex items-center justify-center">
                  <Heart className="w-6 h-6 text-gold animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          unoptimized={backgroundImage?.startsWith('data:')}
        />
        {/* <div className="absolute inset-0 bg-primarylight opacity-60"></div> */}
      </div>
      {/* <div className='absolute inset-0 overflow-hidden'>
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

      <Image
        src={"/images/bungaBottom.png"}
        alt="Chip"
        width={600}
        height={350}
        className="absolute -bottom-6 z-0 animate-bounceUp" // Membalik secara horizontal
        />
      </div> */}
      {/* Content Section */}
      <div className="relative z-10">
        <AkadNikah akadInfo={akadInfo} clientSlug={clientSlug} />
        <Resepsi resepsiInfo={resepsiInfo} clientSlug={clientSlug} />
      </div>

      {/* Ornament Layer - Decorative elements */}
      <OrnamentLayer ornaments={getOrnaments('wedding-event')} />
    </div>
  );
};

export default WeddingEvent;
