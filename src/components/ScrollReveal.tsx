"use client";  // Menandakan bahwa komponen ini harus dijalankan di sisi klien

import React, { useState, useEffect, useRef } from "react";

// Interface untuk menerima props dari komponen yang menggunakan ScrollReveal
interface ScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;  // Mengatur seberapa banyak elemen yang terlihat untuk memicu animasi
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, threshold = 0.1 }) => {
  const [isVisible, setIsVisible] = useState(false);
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

    const element = elementRef.current; // Simpan referensi elemen

    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold]);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-1000 ease-in-out ${
        isVisible ? "scale-100" : "scale-0"
      }`}
    >
      {children}
    </div>
  );
};

export default React.memo(ScrollReveal);
