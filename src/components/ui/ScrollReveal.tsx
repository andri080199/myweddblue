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
    const element = elementRef.current;
    if (!element) return;

    const options = {
      root: null,  // viewport
      rootMargin: "0px",
      threshold,  // Menentukan threshold berapa persen elemen yang harus terlihat
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only update if the state actually changes to avoid unnecessary re-renders
        setIsVisible(prev => {
          const newVisible = entry.isIntersecting;
          return prev !== newVisible ? newVisible : prev;
        });
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
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
