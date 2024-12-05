import React from "react";
import BriCard from "./BriCard";
import DanaCard from "@/app/E-Wallet/DanaCard";
import Image from "next/image";

const WeddingGift: React.FC = () => {
  return (
    <div className="relative px-8 bg-primarylight z-10 overflow-hidden pb-12">
      <h1 className="font-fleur text-5xl py-8 text-center text-darkprimary">
        Wedding Gift
      </h1>
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
      <h1 className="text-center font-mono text-darkprimary">
        Doa Restu Anda merupakan karunia yang sangat berarti bagi kami. Dan jika
        memberi adalah ungkapan tanda kasih, Anda dapat memberi kado secara cashless.
      </h1>
      <BriCard/>
      <DanaCard/>
    </div>
  );
};

export default WeddingGift;
