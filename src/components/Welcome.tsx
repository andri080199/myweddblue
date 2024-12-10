import React from "react";
import ScrollReveal from "./ScrollReveal"; // Impor komponen ScrollReveal
import BrideCard from "./BrideCard";
import GroomCard from "./GroomCard";
import Image from "next/image";

const Welcome: React.FC = () => {
  const textContent = [
    {
      id: 1,
      type: "h2",
      content: "Assalamualaikum Wr.Wb.",
      className: "text-3xl font-lavishly mb-4 text-textprimary",
    },
    {
      id: 2,
      type: "p",
      content:
        "Dengan memohon Rahmat dan Ridho Allah SWT, Kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami",
      className: "text-sm font-merienda text-textprimary",
    },
  ];

  return (
    <div className="relative w-full px-8 py-6 bg-primarylight shadow-md text-center z-10">
      <div>
     <Image
        src={"/images/PohonPutih.jpg"}
        alt="Chip"
        layout="fill" // Mengisi kontainer
        objectFit="cover"
        quality={100}
        className="relative-full z-0"
      />
      <div className="absolute inset-0 bg-primarylight opacity-60"></div>
     </div>
     
      {/* Mapping array textContent dan membungkus elemen dengan ScrollReveal */}
      {textContent.map((item) => (
        <ScrollReveal key={item.id}>
          {item.type === "h2" ? (
            <h2 className={item.className}>{item.content}</h2>
          ) : (
            <p className={item.className}>{item.content}</p>
          )}
        </ScrollReveal>
      ))}

      <ScrollReveal>
      <BrideCard />
      </ScrollReveal>
      <ScrollReveal>
      <GroomCard />
      </ScrollReveal>
    </div>
  );
};

export default Welcome;
