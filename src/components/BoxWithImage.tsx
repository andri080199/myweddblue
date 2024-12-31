import React from 'react';
import Image from 'next/image';
import ScrollReveal from './ScrollReveal';

const Card: React.FC = () => {
  const imageSrc = '/images/WeddingBG.jpg'; // Path
  const imageAlt = 'Deskripsi Gambar';
  const title = 'The Wedding Of';
  const description = 'Chika & Nando';
  const timewedding = '22 Desember 2025';

  return (
    <div className="relative rounded-b-full rounded-t-full overflow-hidden shadow-lg h-3/4 w-60 md:w-3/4 z-20 mx-auto shadow-darkprimary">
  {/* Background layer */}
  <div className="absolute inset-0 bg-primarylight opacity-80 pointer-events-none rounded-b-full rounded-t-full"></div>

  {/* Content layer */}
  <div className="relative h-1/2 w-full flex flex-row">
    <Image
      src={imageSrc}
      alt={imageAlt}
      layout="fill" // Mengisi kontainer
      objectFit="cover"
      objectPosition="center"
      quality={100}
      className="p-2 rounded-t-full"
    />
  </div>
  <div className="relative flex flex-col justify-center items-center px-6 py-4 gap-2">
    <ScrollReveal>
    <h1 className="font-bold uppercase font-merienda text-xl mb-2 text-darkprimary text-center">{title}</h1>
    </ScrollReveal>
    <ScrollReveal>
    <p className="text-gold font-lavishly text-4xl lg:text-5xl text-center font-bold">{description}</p>
    </ScrollReveal>
    <ScrollReveal>
    <p className="text-darkprimary font-merienda text-md font-bold lg:text-xl lg:pt-4">{timewedding}</p>
    </ScrollReveal>
  </div>
</div>

  );
};

export default Card;
