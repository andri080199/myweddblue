import React from 'react';
import Gallery from './Gallery';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

const OurGallery: React.FC = () => {
    return (
        <div id='gallery' className='relative'>
          <ScrollReveal>
            <h1 className='text-center font-fleur text-5xl py-8 text-gold font-bold'>Our Gallery</h1>
          </ScrollReveal>
          <div>
     <Image
        src={"/images/PohonPutih.jpg"}
        alt="Chip"
        layout="fill" // Mengisi kontainer
        objectFit="cover"
        quality={100}
        className="relative-full -z-20 saturate-0"
      />
      <div className="absolute inset-0 bg-primarylight opacity-60 -z-20"></div>
     </div>
            <Gallery/>
        </div>
    );
};

export default OurGallery;