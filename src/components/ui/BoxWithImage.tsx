import React from 'react';
import Image from 'next/image';
import ScrollReveal from '../ui/ScrollReveal';
import { extractNamesFromSlug } from '@/utils/extractNamesFromSlug';

interface BoxWithImageProps {
  clientSlug?: string;
  weddingImage?: string;
}

const Card: React.FC<BoxWithImageProps> = ({ clientSlug, weddingImage }) => {

  // Use provided clientSlug or fallback to default
  const coupleNames = clientSlug ? extractNamesFromSlug(clientSlug) : { groomName: 'Pengantin Pria', brideName: 'Pengantin Wanita' };
  
  const imageSrc = weddingImage || '/images/groom_and_bride.png';
  const imageAlt = 'Deskripsi Gambar';
  const title = 'The Wedding Of';
  const description = `${coupleNames.groomName} & ${coupleNames.brideName}`;


  return (
    <div className="relative rounded-b-full rounded-t-full overflow-hidden shadow-lg w-60 md:w-80 z-20 mx-auto shadow-darkprimary h-[420px] md:h-[440px] flex flex-col">
      {/* Background layer */}
      <div className="absolute inset-0 bg-primarylight opacity-80 pointer-events-none rounded-b-xl rounded-t-full"></div>

      {/* Image layer - Reduced height to make room for text */}
      <div className="relative h-[260px] md:h-[280px] w-full flex-shrink-0 overflow-hidden rounded-t-full ">
        <div className="absolute inset-2 rounded-t-full overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            quality={100}
            priority
            onError={() => console.error('Image failed to load:', imageSrc)}
            onLoad={() => console.log('Image loaded successfully:', imageSrc)}
          />
        </div>
      </div>
      
      {/* Content layer - More space and higher positioning */}
      <div className="relative flex-1 flex flex-col justify-start items-center px-3 gap-2 pt-3 pb-4">
        <ScrollReveal>
          <h1 className="font-bold font-lavishly text-2xl mb-2 text-darkprimary text-center">{title}</h1>
        </ScrollReveal>
        <ScrollReveal>
          <p 
            className="text-gold font-merienda text-2xl lg:text-2xl text-center font-bold break-words hyphens-auto px-1 max-w-full whitespace-normal"
            style={{ 
              lineHeight: '1.4', 
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              paddingBottom: '0.25rem'
            }}
          >
            {description}
          </p>
        </ScrollReveal>
      </div>
    </div>

  );
};

export default Card;