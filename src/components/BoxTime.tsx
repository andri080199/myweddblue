// BoxTime.tsx
import React from "react";
import CountdownTimer from "./CountdownTimer";
import ScrollReveal from "./ScrollReveal";

type BoxTimeProps = object

const BoxTime: React.FC<BoxTimeProps> = () => {
  // Tentukan target waktu
  const targetDate = new Date("2024-12-31T00:00:00").getTime();

  return (
    <div className="w-full mx-6 px-4 mb-12 py-4 relative rounded-tr-3xl text-darkprimary">
  {/* Elemen latar belakang dengan efek opacity */}
  <div className="absolute inset-0 rounded-3xl"></div>
  
  {/* Konten teks di atas latar belakang */}
  <ScrollReveal>
  <h1 className="text-lg uppercase font-merienda relative z-10">The Wedding Of</h1>
  </ScrollReveal>
  <ScrollReveal>
  <h1 className="text-4xl font-merienda uppercase relative z-10">Mita & Angga</h1>
  </ScrollReveal>
  
  {/* Render CountdownTimer dengan targetDate */}
  <CountdownTimer targetDate={targetDate} />
</div>

  );
};

export default BoxTime;
