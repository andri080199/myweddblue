import React from "react";
import BriCard from "./BriCard";
import DanaCard from "@/app/E-Wallet/DanaCard";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import Gift from "./Gift";

const WeddingGift: React.FC = () => {
  return (
    <div id="gift" className="relative px-8 bg-primarylight z-10 overflow-hidden pb-12">
      <ScrollReveal>  
      <h1 className=" font-fleur text-5xl py-8 text-center text-gold font-bold">
        Wedding Gift
      </h1>
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
      {/* <Image
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
        /> */}
        <ScrollReveal>
      <h1 className="text-center font-mono text-textprimary text-sm">
        Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika
        memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.
      </h1>
        </ScrollReveal>
        <ScrollReveal>
      <BriCard/>
      </ScrollReveal>
      <ScrollReveal>
      <DanaCard/>
      </ScrollReveal>
      <ScrollReveal>

      <Gift/>
      </ScrollReveal>
    </div>
  );
};

export default WeddingGift;
