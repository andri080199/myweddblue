import React from 'react';
import AkadNikah from './AkadNikah';
import Resepsi from './Resepsi';
import Image from 'next/image';

// Komponen WeddingEvent dengan TypeScript
const WeddingEvent: React.FC = () => {
  return (
    <div className="relative w-full h-full pt-36 pb-12 bg-gradient-to-tr from-primary to-primarylight">
      <div className='absolute inset-0 top-10'>
        <h1 className='text-center font-fleur text-darkprimary text-5xl'>Wedding</h1>
        <h1 className='absolute left-1/2 text-center font-fleur text-darkprimary text-5xl'>Event</h1>
      </div>
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
      <AkadNikah />
      <Resepsi />
    </div>
  );
};

export default WeddingEvent;
