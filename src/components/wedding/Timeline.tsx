"use client";

import React, { useEffect, useRef, useState } from "react";
import ScrollReveal from "../ui/ScrollReveal";
import { Heart, Calendar, Star, Sparkles, Users, Gift } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useTemplateOrnaments } from "@/hooks/useTemplateOrnaments";
import OrnamentLayer from "./OrnamentLayer";

interface TimelineItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

interface TimelineProps {
  loveStoryData?: {
    story1?: string;
    story1Visible?: boolean;
    story2?: string;
    story2Visible?: boolean;
    story3?: string;
    story3Visible?: boolean;
    story4?: string;
    story4Visible?: boolean;
  };
  customBackground?: string;
  clientSlug: string;
  templateId?: number | null;
}

const Timeline: React.FC<TimelineProps> = ({ loveStoryData, clientSlug, templateId }) => {
  const { theme } = useThemeContext();
  const { getOrnaments } = useTemplateOrnaments(templateId);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [progressHeight, setProgressHeight] = useState<number>(0);

  // Data default
  const defaultTimelineData: TimelineItem[] = [
    { 
      title: "Pertemuan", 
      description: "Kisah ini berawal dari pertemuan tak terduga yang membawa warna baru dalam hidup kami.",
      icon: <Star className="w-5 h-5" />,
      color: "from-darkprimary to-primary",
      gradient: "from-darkprimary/10 to-primary/10"
    },
    { 
      title: "Tunangan", 
      description: "Setelah menjalani hubungan, kami berkomitmen untuk melangkah ke jenjang yang lebih serius.",
      icon: <Heart className="w-5 h-5" />,
      color: "from-darkprimary to-primary",
      gradient: "from-darkprimary/10 to-primary/10"
    },
    { 
      title: "Lamaran", 
      description: "Momen sakral dimana keseriusan diuji dan niat baik disampaikan kepada keluarga.",
      icon: <Gift className="w-5 h-5" />,
      color: "from-darkprimary to-primary",
      gradient: "from-darkprimary/10 to-primary/10"
    },
    { 
      title: "Menikah", 
      description: "Hari yang dinanti telah tiba, mengikat janji suci sehidup semati.",
      icon: <Users className="w-5 h-5" />,
      color: "from-darkprimary to-primary",
      gradient: "from-darkprimary/10 to-primary/10"
    },
  ];

  const buildTimelineData = (): TimelineItem[] => {
    const items: TimelineItem[] = [];
    if (loveStoryData?.story1Visible !== false) items.push({ ...defaultTimelineData[0], description: loveStoryData?.story1 || defaultTimelineData[0].description });
    if (loveStoryData?.story2Visible !== false) items.push({ ...defaultTimelineData[1], description: loveStoryData?.story2 || defaultTimelineData[1].description });
    if (loveStoryData?.story3Visible !== false) items.push({ ...defaultTimelineData[2], description: loveStoryData?.story3 || defaultTimelineData[2].description });
    if (loveStoryData?.story4Visible !== false) items.push({ ...defaultTimelineData[3], description: loveStoryData?.story4 || defaultTimelineData[3].description });
    return items.length > 0 ? items : defaultTimelineData;
  };

  const timelineData = buildTimelineData();

  useEffect(() => {
    const calculateProgress = () => {
        if (!timelineRef.current) return;
        const timelineElement = timelineRef.current;
        const { top, height } = timelineElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const threshold = height * 0.1;
      
        if (top < windowHeight && top + height > 0) {
          const visibleHeight = Math.min(height, windowHeight - top);
          if (visibleHeight + top > threshold) {
            const progress = ((visibleHeight - threshold) / (height - threshold)) * 100;
            setProgressHeight(Math.max(Math.min(progress, 100), 0)); 
          } else {
            setProgressHeight(0); 
          }
        } else {
          setProgressHeight(0); 
        }
      };

    window.addEventListener("scroll", calculateProgress);
    calculateProgress(); 
    return () => window.removeEventListener("scroll", calculateProgress);
  }, []);

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12 px-4 overflow-hidden">
      
      {/* HEADER SECTION */}
      <ScrollReveal>
        <div className="text-center mb-16 mx-4">
          
          <div className="relative inline-block py-6 px-10">
             
             {/* 1. SVG BRUSH HEADER (Dengan Gradient Gold Baru) */}
             <div className="absolute inset-0 w-full h-full -z-10 transform scale-110">
               <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-sm">
                 <defs>
                   {/* Gradient Rich Gold Header */}
                   <linearGradient id="richGoldBrushHeader" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C6A664" /> 
                      <stop offset="50%" stopColor="#E5C578" /> 
                      <stop offset="100%" stopColor="#C6A664" />
                   </linearGradient>

                   <filter id="headerBrushFilter">
                     <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                     <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
                   </filter>
                 </defs>
                 <path 
                   d="M10,50 Q60,10 150,20 T290,50 Q280,80 150,90 T10,50" 
                   fill="white" 
                   fillOpacity="0.9" 
                   filter="url(#headerBrushFilter)"
                 />
               </svg>
             </div>
             
             {/* JUDUL UTAMA */}
             <h2 className="text-5xl md:text-6xl font-bold font-lavishly text-gold drop-shadow-sm transform -rotate-1">
                Our Love Story
             </h2>
          </div>
        </div>
      </ScrollReveal>

      {/* --- TIMELINE CONTAINER --- */}
      <div ref={timelineRef} className="relative">
        
        {/* 1. GARIS VERTIKAL UTAMA */}
        <div className="absolute left-6 md:left-8 top-0 bottom-0 w-1 bg-gold/20 rounded-full z-0 overflow-hidden">
          <div
            className="absolute left-0 top-0 w-full bg-gradient-to-b from-gold via-yellow-300 to-gold z-10 transition-all duration-300 ease-linear"
            style={{ height: `${progressHeight}%` }}
          />
        </div>

        {timelineData.map((item, index) => (
          <div key={index} className="relative mb-12 last:mb-0">
            
            {/* 2. NODE / LINGKARAN */}
            <div className="absolute left-6 md:left-8 -translate-x-1/2 z-20 top-0">
              <div className={`w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br ${item.color} rounded-full shadow-lg flex items-center justify-center border-4 border-white ring-2 ring-gold/20 relative`}>
                <div className="w-4 h-4 md:w-6 md:h-6 text-white flex items-center justify-center relative z-10">
                  {item.icon}
                </div>
              </div>
            </div>

            {/* 3. GARIS PENYAMBUNG HORIZONTAL */}
            <div className="absolute top-5 md:top-7 left-6 md:left-8 w-10 md:w-16 h-1 bg-gold z-0"></div>

            {/* 4. CARD CONTENT */}
            <ScrollReveal>
              <div className="ml-16 md:ml-24 pr-2 relative">
                
                {/* THE CARD */}
                <div className="relative bg-white/60 backdrop-blur-md border-2 border-white/80 rounded-[1.5rem] p-6 shadow-sm shadow-white hover:shadow-2xl hover:shadow-gold/20 transition-all duration-500 hover:-translate-y-1 group overflow-hidden">
                  
                  {/* Dekorasi Background */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-all duration-500"></div>
                  
                  <div className="relative z-10">
                    
                    {/* Judul Card dengan Background Kuas (Gradient Baru) */}
                    <div className="relative inline-block mb-3 pt-1">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[180%] -z-10 group-hover:scale-105 transition-transform duration-300">
                        <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-full">
                           <path 
                             d="M10,30 Q50,10 100,10 T190,30 Q180,50 100,50 T10,30" 
                             fill={`white`}
                           />
                        </svg>
                      </div>

                      <h3 className="text-xl font-bold text-gold font-lavishly relative z-10  px-2">
                          {item.title}
                      </h3>
                    </div>
                    
                    <p className="text-sm md:text-base text-darkprimary leading-relaxed font-merienda">
                        {item.description}
                    </p>
                  </div>

                  {/* Watermark Icon */}
                  <div className="absolute -bottom-2 -right-2 opacity-5 transform rotate-12 group-hover:scale-110 group-hover:opacity-10 transition-all duration-700 text-darkprimary pointer-events-none">
                    {React.cloneElement(item.icon as React.ReactElement, { className: "w-20 h-20" })}
                  </div>

                </div>
              </div>
            </ScrollReveal>

          </div>
        ))}
      </div>

      {/* Ornament Layer - Decorative elements */}
      <OrnamentLayer ornaments={getOrnaments('timeline')} />
    </div>
  );
};

export default Timeline;