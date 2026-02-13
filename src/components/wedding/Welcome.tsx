import React, { useState, useEffect } from "react";
import ScrollReveal from "../ui/ScrollReveal";
import BrideCard from "../cards/BrideCard";
import GroomCard from "../cards/GroomCard";
import Image from "next/image";
import { extractNamesFromSlug } from "@/utils/extractNamesFromSlug";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useUnifiedTheme } from "@/hooks/useUnifiedTheme";
import OrnamentLayer from "./OrnamentLayer";

interface WelcomeProps {
  coupleInfo?: {
    brideFullName?: string;
    brideChildOrder?: string;
    brideFatherName?: string;
    brideMotherName?: string;
    brideImage?: string;
    groomFullName?: string;
    groomChildOrder?: string;
    groomFatherName?: string;
    groomMotherName?: string;
    groomImage?: string;
    weddingImage?: string;
  };
  clientSlug: string;
  themeId?: string;
}

const Welcome: React.FC<WelcomeProps> = ({ coupleInfo, clientSlug, themeId }) => {
  const { theme } = useThemeContext();
  const { getOrnaments, getBackground } = useUnifiedTheme(themeId);
  const backgroundImage = getBackground('welcome') || theme.images.hero;
  const { groomName, brideName } = extractNamesFromSlug(clientSlug);
  
  // Typewriter effect state
  const [displayedText, setDisplayedText] = useState("");
  const fullText = "Assalamualaikum Wr.Wb.";
  
  useEffect(() => {
    let currentIndex = 0;
    let isDeleting = false;
    
    const typewriterEffect = () => {
      if (!isDeleting && currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else if (!isDeleting && currentIndex > fullText.length) {
        setTimeout(() => {
          isDeleting = true;
        }, 2000);
      } else if (isDeleting && currentIndex > 0) {
        currentIndex--;
        setDisplayedText(fullText.slice(0, currentIndex));
      } else if (isDeleting && currentIndex === 0) {
        isDeleting = false;
        currentIndex = 0;
      }
    };
    
    const timer = setInterval(typewriterEffect, isDeleting ? 50 : 100);
    return () => clearInterval(timer);
  }, [fullText]);

  const textContent = [
    {
      id: 1,
      type: "h2",
      content: "Assalamualaikum Wr.Wb.",
      className: "relative text-2xl font-lavishly mb-4 text-gold leading-relaxed drop-shadow-sm font-bold",
    },
    {
      id: 2,
      type: "p",
      content:
        "Dengan memohon Rahmat dan Ridho Allah SWT, Kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir dalam pernikahan kami",
      className: "relative text-sm font-merienda text-textprimary leading-relaxed",
    },
  ];

  return (
    // Added overflow-hidden to prevent scrollbars from SVG
    <div id="about" className="relative w-full px-12 sm:px-6 md:px-8 py-6 bg-primarylight shadow-md text-center z-10 pb-16 overflow-hidden">
      
      {/* ORIGINAL BACKGROUND IMAGE */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Chip"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          className="relative-full z-0"
          unoptimized={backgroundImage?.startsWith('data:')}
        />
        {/* Optional overlay if needed */}
        {/* <div className="absolute inset-0 bg-darkprimary opacity-10"></div> */}
      </div>
      
      {/* TITLE SECTION WITH NEW ELEGANT BRUSH */}
      <div className="relative max-w-3xl mx-auto mb-12 mt-8">
        
        {/* SVG BRUSH STROKE */}
        {/* Bentuk baru: Lebih pipih, memanjang, dan elegan (tidak seperti awan/blob) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[140%] z-0 pointer-events-none">
          <svg 
            viewBox="0 0 600 200" 
            preserveAspectRatio="none" 
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.1))' }}
          >
            <defs>
              <filter id="paintStripe">
                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
              </filter>
            </defs>
            {/* Path: Sapuan Horizontal Simpel */}
            <path 
              d="M30,80 Q150,30 300,30 T570,80 Q590,110 560,150 T300,170 T40,150 Q10,120 30,80 Z" 
              fill="rgba(255, 255, 255, 0.90)" 
              filter="url(#paintStripe)"
            />
          </svg>
        </div>

        {/* TEXT CONTENT */}
        <div className="relative z-10 py-8 px-6">
            {textContent.map((item) => (
              <ScrollReveal key={item.id}>
                {item.type === "h2" ? (
                  <h2 className={item.className}>
                    {displayedText}
                    <span className="animate-pulse">|</span>
                  </h2>
                ) : (
                  <p className={item.className}>{item.content}</p>
                )}
              </ScrollReveal>
            ))}
        </div>
      </div>

      {/* ORIGINAL CARDS SECTION (Restored exactly as requested) */}
      <ScrollReveal>
        <div className="relative bg-white bg-opacity-40 backdrop-blur-md rounded-3xl py-8 px-2 mx-2 sm:mx-6 md:mx-10 mb-8 border-2 border-primary shadow-md shadow-darkprimary hover:-translate-y-2 transition-all duration-300">
          <BrideCard 
            brideName={brideName}
            brideFullName={coupleInfo?.brideFullName}
            brideChildOrder={coupleInfo?.brideChildOrder}
            brideFatherName={coupleInfo?.brideFatherName}
            brideMotherName={coupleInfo?.brideMotherName}
            brideImage={coupleInfo?.brideImage}
          />
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="relative bg-white bg-opacity-40 backdrop-blur-md rounded-3xl py-8 px-2 mx-2 sm:mx-6 md:mx-10 mb-8 border-2 border-primary shadow-md shadow-darkprimary hover:-translate-y-2 transition-all duration-300">
          <GroomCard
            groomName={groomName}
            groomFullName={coupleInfo?.groomFullName}
            groomChildOrder={coupleInfo?.groomChildOrder}
            groomFatherName={coupleInfo?.groomFatherName}
            groomMotherName={coupleInfo?.groomMotherName}
            groomImage={coupleInfo?.groomImage}
          />
        </div>
      </ScrollReveal>

      {/* Ornament Layer - Decorative elements */}
      <OrnamentLayer ornaments={getOrnaments('welcome')} />
    </div>
  );
};

export default Welcome;