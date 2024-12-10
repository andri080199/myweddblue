import React from "react";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

interface KutipanAyatProps {
  title?: string; // Props opsional untuk mengganti judul
  quote?: string; // Props opsional untuk mengganti kutipan ayat
  source?: string; // Props opsional untuk mengganti sumber kutipan
}

const KutipanAyat: React.FC<KutipanAyatProps> = ({
  // title = "M & A", // Default value
  quote = `“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
          istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa
          tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan
          sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat
          tanda-tanda bagi kaum yang berfikir.”`,
  source = "(Q.S. Ar-Rum : 21)",
}) => {
  return (
    <>
    <div className="w-full h-max px-8 py-12 shadow-md text-center relative overflow-hidden">
     <div>
     <Image
        src={"/images/BangkuSalju.jpg"}
        alt="Chip"
        layout="fill" // Mengisi kontainer
        objectFit="cover"
        quality={100}
        className="absolute top-0 left-0 h-h-screen z-0 saturate-50"
      />
     </div>
       {/* Lapisan Warna */}
    <div className="absolute inset-0 bg-darkprimary opacity-80 z-10"></div>
      {/* Efek cahaya */}
      {/* <div className="absolute inset-0 rounded-lg bg-gradient-radial from-white/50 to-transparent opacity-60"></div> */}
      {/* <div className="absolute inset-0 z-0">
      <Image
        src={"/images/bungaTop.png"}
        alt="Chip"
        width={500}
        height={400}
        className="absolute -top-6 left-0 z-0 animate-bounceDown" // Posisi absolute untuk Chip
      />

      <Image
        src={"/images/BottomBunga.png"}
        alt="Chip"
        width={500}
        height={400}
        className="absolute -bottom-8 left-0 z-0 animate-bounceUp" // Posisi absolute untuk Chip
      />
      </div> */}

      <h2 className="text-5xl font-semibold font-lavishly mb-8 mt-6 text-gold relative z-10 flex items-center justify-center space-x-1">
        <ScrollReveal>
          <span className="relative -top-4">M</span>
        </ScrollReveal>
        <ScrollReveal>
          <span className="text-center">&</span>
        </ScrollReveal>
        <ScrollReveal>
          <span className="relative top-4">A</span>
        </ScrollReveal>
      </h2>
      <div className="relative z-20">
      <ScrollReveal>
      <p className="text-sm font-merienda text-primarylight mb-4">
        {quote}
      </p>
      <p className="text-sm text-primarylight font-medium">
        {source}
      </p>
      </ScrollReveal>
      </div>
    </div>
    </>
  );
};

export default KutipanAyat;
