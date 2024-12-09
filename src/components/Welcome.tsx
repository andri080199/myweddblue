import React from "react";
import ScrollReveal from "./ScrollReveal"; // Impor komponen ScrollReveal
import BrideCard from "./BrideCard";
import GroomCard from "./GroomCard";

const Welcome: React.FC = () => {
  const textContent = [
    {
      id: 1,
      type: "h2",
      content: "Assalamualaikum Wr.Wb.",
      className: "text-4xl font-lavishly mb-4 text-darkprimary",
    },
    {
      id: 2,
      type: "p",
      content:
        "Dengan memohon Rahmat dan Ridho Allah SWT, Kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami",
      className: "text-md font-merienda text-darkprimary",
    },
  ];

  return (
    <div className="w-full px-8 py-6 bg-primarylight shadow-md text-center z-10">
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
