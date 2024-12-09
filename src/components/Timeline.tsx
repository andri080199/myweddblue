"use client";

import React, { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

interface TimelineItem {
  title: string;
  description: string;
}

const Timeline: React.FC = () => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progressHeight, setProgressHeight] = useState<number>(0);

  const timelineData: TimelineItem[] = [
    { title: "Pertemuan", description: "Kisah ini berawal dari pertemuan kita di Seblak Nampol" },
    { title: "Tunangan", description: "Setelah menjalani hubungan selama 3,5 tahun, kita berkomitmen untuk masa depan hubungan kita." },
    { title: "Lamaran", description: "Andri memberanikan diri membawa keluarganya bersilaturahmi ke rumah ku, dan meminta ku untuk menikah dengannya." },
    { title: "Menikah", description: "Pernikahan kami" },
  ];

  useEffect(() => {
    const calculateProgress = () => {
        if (!timelineRef.current) return;
      
        const timelineElement = timelineRef.current;
        const { top, height } = timelineElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
      
        const threshold = height * 0.3; // Mulai dari 30% tinggi elemen
      
        if (top < windowHeight && top + height > 0) {
          const visibleHeight = Math.min(height, windowHeight - top);
      
          if (visibleHeight + top > threshold) {
            const progress = ((visibleHeight - threshold) / (height - threshold)) * 100;
            setProgressHeight(Math.max(Math.min(progress, 100), 0)); // Progress dalam rentang 0-100%
          } else {
            setProgressHeight(0); // Progress tetap 0 sebelum mencapai threshold
          }
        } else {
          setProgressHeight(0); // Jika elemen di luar layar, progress = 0
        }
      };
      

    window.addEventListener("scroll", calculateProgress);
    calculateProgress(); // Hitung progress saat load pertama
    return () => window.removeEventListener("scroll", calculateProgress);
  }, []);

  return (
    <div
      ref={timelineRef}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* Garis vertikal utama */}
      <div className="absolute left-6 top-0 h-full w-1 bg-primarylight z-0 overflow-hidden">
        {/* Progress bar biru */}
        <div
          className="absolute left-0 top-0 w-full bg-darkprimary z-10 transition-all duration-300"
          style={{ height: `${progressHeight}%` }}
        />
      </div>
      

      {timelineData.map((item, index) => (
        <div
          key={index}
          className="relative flex items-center mb-8 last:mb-0"
        >
          {/* Lingkaran penanda */}
          <div className="absolute left-2.5 top-0 z-20 text-white text-sm font-bold">
          <span className="text-2xl animate-pulse text-red-500">❤️</span>
          </div>

          {/* Konten teks */}
          <ScrollReveal>
          <div className="ml-12 bg-primarylight p-2 rounded-xl mx-auto w-3/4 border-2 border-darkprimary shadow-lg shadow-darkprimary">
            <h3 className="text-xl font-bold text-darkprimary">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          </ScrollReveal>
          
        </div>
      ))}
    </div>
  );
};

export default Timeline;
