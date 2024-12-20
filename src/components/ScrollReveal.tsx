"use client";  // Menandakan bahwa komponen ini harus dijalankan di sisi klien

import React, { useState, useEffect, useRef } from "react";

// Interface untuk menerima props dari komponen yang menggunakan ScrollReveal
interface ScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;  // Mengatur seberapa banyak elemen yang terlihat untuk memicu animasi
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Mengubah tipe ref menjadi HTMLDivElement
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const options = {
      root: null,  // viewport
      rootMargin: "0px",
      threshold,  // Menentukan threshold berapa persen elemen yang harus terlihat
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      options
    );

    if (elementRef.current) observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, [threshold]);

  return (
    // <div
    //   ref={elementRef}  // Menambahkan ref yang benar
    //   className={`transition-all duration-1000 ease-in-out ${
    //     isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
    //   }`}
    // >
    //   {children}
    // </div>
    <div
    ref={elementRef}  // Menambahkan ref yang benar
    className={`transition-all duration-1000 ease-in-out ${
      isVisible ? "sclale-100" : "scale-0"
    }`}
  >
    {children}
  </div>
  );
};

export default ScrollReveal;
