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
    <div className="w-full h-screen px-8 py-24 bg-gradient-to-b from-primary to-blue-50 shadow-md text-center relative overflow-hidden">
      {/* Efek cahaya */}
      {/* <div className="absolute inset-0 rounded-lg bg-gradient-radial from-white/50 to-transparent opacity-60"></div> */}
      <div className="absolute inset-0 z-0">
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
      </div>

      <h2 className="text-5xl font-semibold font-lavishly mb-8 mt-6 text-darkprimary relative z-10 flex items-center justify-center space-x-1">
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
      <ScrollReveal>
      <p className="text-lg font-merienda text-darkprimary mb-4 relative z-10">
        {quote}
      </p>
      <p className="text-sm text-darkprimary font-medium relative z-10">
        {source}
      </p>
      </ScrollReveal>
    </div>
  );
};

export default KutipanAyat;
