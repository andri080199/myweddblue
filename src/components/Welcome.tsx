import React from "react";
import BrideCard from "./BrideCard";
import GroomCard from "./GroomCard";

const Welcome: React.FC = () => {
  return (
    <div className="w-full px-8 py-6 bg-primarylight shadow-md text-center z-10">
      <h2 className="text-4xl font-lavishly mb-4 text-darkprimary">AssalamualaikumWr.Wb.</h2>
      <p className="text-md font-merienda text-darkprimary">
        Dengan memohon Rahmat dan Ridho Allah SWT, Kami bermaksud mengundang
        Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami
      </p>
      <BrideCard/>
      <GroomCard/>
    </div>
  );
};

export default Welcome;
