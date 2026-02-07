"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Import Portal
import ScrollReveal from "../ui/ScrollReveal";

const widthClasses = ["w-32", "w-36", "w-40", "w-44", "w-48", "w-56", "w-64"];
const heightClasses = ["h-40", "h-44", "h-48", "h-52", "h-60", "h-72"];

const getRandomClass = (classes: string[]) => {
  const index = Math.floor(Math.random() * classes.length);
  return classes[index];
};

const defaultImageUrls = [
  "/images/Wedding1.png",
  "/images/Wedding2.png",
  "/images/Wedding3.png",
  "/images/Wedding4.png",
  "/images/Wedding5.png",
  "/images/Wedding6.png",
  "/images/Wedding7.png",
  "/images/Wedding8.png",
  "/images/Wedding9.png",
  "/images/Wedding10.png",
];

interface GalleryProps {
  galleryPhotos?: any[];
}

const Gallery: React.FC<GalleryProps> = ({ galleryPhotos = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomSizes, setRandomSizes] = useState<{ width: string; height: string }[]>([]);
  const [mounted, setMounted] = useState(false); // State untuk handle hydration

  // State untuk Swipe Mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50; 

  const imageUrls = galleryPhotos.length > 0 
    ? galleryPhotos.map(photo => photo.image_url) 
    : defaultImageUrls;

  useEffect(() => {
    setMounted(true); // Pastikan ini jalan di client-side
    const sizes = imageUrls.map(() => ({
      width: getRandomClass(widthClasses),
      height: getRandomClass(heightClasses),
    }));
    setRandomSizes(sizes);
  }, [imageUrls.length]);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  const showPrev = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const showNext = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  // --- LOGIC SWIPE MOBILE ---
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      showNext();
    }
    if (isRightSwipe) {
      showPrev();
    }
  };

  if (randomSizes.length !== imageUrls.length) return null;

  // Render content modal sebagai variabel agar kode lebih rapi
  const modalContent = (
    <div 
        className="fixed inset-0 z-[99999] bg-darkprimary/95 backdrop-blur-xl flex flex-col items-center justify-center transition-opacity duration-300"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
    >
      {/* Close Button Absolute */}
      <button
        aria-label="Close"
        className="absolute top-4 right-4 md:top-8 md:right-8 text-textprimary  p-2 transition-transform hover:rotate-90 duration-300 z-[110]"
        onClick={closeModal}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Container Image & Navigation */}
      <div className="relative w-full flex-1 flex items-center justify-center p-4 md:p-10 max-h-[60vh] md:max-h-[85vh]">
        
        {/* Desktop Prev Button */}
        <button
            className="hidden md:flex absolute left-4 lg:left-10 text-textprimary hover:bg-white/10 rounded-full p-3 transition-all z-50"
            onClick={showPrev}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 bg-white rounded-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        {/* MAIN IMAGE */}
        <div 
            className="relative max-w-5xl w-auto h-auto flex flex-col items-center justify-center mt-4"
            onClick={(e) => e.stopPropagation()}
        >
            <img
                src={imageUrls[currentIndex]}
                alt={`View ${currentIndex}`}
                className="max-h-[55vh] md:max-h-[80vh] w-auto max-w-full rounded-lg border-2 border-white shadow-sm shadow-white animate-in fade-in zoom-in duration-300 select-none"
                draggable={false}
            />
        </div>

        {/* Desktop Next Button */}
        <button
            className="hidden md:flex absolute right-4 lg:right-10 text-textprimary hover:bg-white/10 rounded-full p-3 transition-all z-50"
            onClick={showNext}
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 bg-white rounded-full " fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </button>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="w-full max-w-4xl px-4 pb-24 md:pb-6 flex flex-col items-center gap-4 z-[110]">
        
        <div className="text-textprimary font-merienda text-sm tracking-widest bg-white/70 px-4 rounded-full">
            {currentIndex + 1} / {imageUrls.length}
        </div>

        <div 
            className="flex gap-2 overflow-x-auto w-full justify-center py-2 no-scrollbar"
            onClick={(e) => e.stopPropagation()}
        >
          {imageUrls.map((url, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 transition-all duration-300 rounded-md overflow-hidden ${
                index === currentIndex 
                  ? 'w-12 h-12 md:w-16 md:h-16 ring-2 ring-white shadow-md shadow-white opacity-100 scale-110' 
                  : 'w-10 h-10 md:w-14 md:h-14 opacity-40 hover:opacity-100 grayscale hover:grayscale-0'
              }`}
            >
              <img src={url} className="w-full h-full object-cover" alt="thumb" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-16 px-4">
      {/* GRID MASONRY */}
      <div className="flex flex-wrap justify-center gap-4 p-4 max-w-7xl mx-auto">
        {imageUrls.map((url, index) => {
          const { width, height } = randomSizes[index];

          return (
            <ScrollReveal key={`gallery-${index}`} threshold={0.1}>
              <div
                className={`group/card relative overflow-hidden rounded-2xl cursor-pointer ${width} ${height} 
                  bg-white
                  border-2 border-white shadow-sm shadow-white 
                  hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)]
                  transform-gpu transition-all duration-500 ease-out hover:scale-[1.02]
                  z-0 hover:z-10
                  `}
                onClick={() => openModal(index)}
                style={{ 
                   WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                   maskImage: "radial-gradient(white, black)"
                }}
              >
                <img
                  src={url}
                  alt={`Gallery Image ${index}`}
                  className="object-cover w-full h-full transform transition-transform duration-[800ms] ease-in-out group-hover/card:scale-110 will-change-transform"
                  loading="lazy"
                />
                
                <div className="absolute inset-0 bg-darkprimary/40 backdrop-blur-[3px] opacity-0 group-hover/card:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <div className="transform scale-75 opacity-0 group-hover/card:scale-100 group-hover/card:opacity-100 transition-all duration-500 delay-100 bg-white/10 p-4 rounded-full border border-white/30 shadow-lg backdrop-blur-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/90 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* --- MENGGUNAKAN PORTAL AGAR MODAL 100% DI DEPAN --- */}
      {/* Ini akan me-render modalContent langsung ke dalam <body> */}
      {mounted && isOpen && createPortal(modalContent, document.body)}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default Gallery;