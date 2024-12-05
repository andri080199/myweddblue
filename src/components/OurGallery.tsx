import React from 'react';
import Gallery from './Gallery';
import Image from 'next/image';

const OurGallery: React.FC = () => {
    return (
        <div className='relative'>
            <h1 className='text-center font-fleur text-5xl py-8 text-darkprimary bg-primary'>Our Gallery</h1>
            <div className='absolute inset-0 overflow-hidden'>
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

      {/* <Image
        src={"/images/bungaBottom.png"}
        alt="Chip"
        width={600}
        height={350}
        className="absolute -bottom-6 z-0 animate-bounceUp" // Membalik secara horizontal
        /> */}
      </div>
            <Gallery/>
        </div>
    );
};

export default OurGallery;