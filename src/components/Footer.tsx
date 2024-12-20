import React from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const Footer: React.FC = () => {
  // Data Props Langsung di Komponen
  const footerProps = {
    title: "Thank You",
    description: [
      "Menjadi Sebuah Kebahagiaan Bagi Kami Apabila Bapak/Ibu/Saudara/i Berkenan Hadir Dalam Hari Bahagia Kami.",
      "Terima Kasih Atas Segala Ucapan, Doa, dan Perhatian yang Diberikan.",
      "Sampai Jumpa di Hari Bahagia Kami.",
    ],
    greeting: "Kami yang berbahagia:",
    names: {
      groom: "Angga",
      bride: "Mita",
    },
    family: "Beserta Keluarga",
  };

  return (
    <footer className="relative bg-primarylight text-textprimary py-4 text-center overflow-hidden h-screen">
      <div>
     <Image
        src={"/images/BangkuSalju.jpg"}
        alt="Chip"
        layout="fill" // Mengisi kontainer
        objectFit="cover"
        quality={100}
        className="relative-full z-0 saturate-0"
      />
      <div className="absolute inset-0 bg-primary opacity-80"></div>
     </div>
      
      <div className="relative mx-auto px-12 pt-8">
      <ScrollReveal>
      <h1 className="text-5xl font-fleur mb-6 text-gold font-bold">{footerProps.title}</h1>
        </ScrollReveal>
        <ScrollReveal>
        {footerProps.description.map((text, index) => (
          <h1 key={index} className="text-sm font-merienda pt-4">
            {text}
          </h1>
        ))}
        </ScrollReveal>
        <ScrollReveal>
        <h1 className="text-sm font-mono pt-4 pb-4">{footerProps.greeting}</h1>
        </ScrollReveal>
        <ScrollReveal>
        <h1 className="text-5xl font-lavishly font-bold text-gold">{footerProps.names.groom}</h1>
        <h1 className="text-5xl font-lavishly font-bold text-gold">&</h1>
        <h1 className="text-5xl font-lavishly font-bold text-gold">{footerProps.names.bride}</h1>
        <h1 className="text-sm font-poppins">{footerProps.family}</h1>
        </ScrollReveal>
        
      </div>
      <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm">
        Dibuat dengan <span className="text-red-500">❤️</span>
      </p>
    </footer>
  );
};

export default Footer;
