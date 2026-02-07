import React from "react";
import Image from "next/image";
import ScrollReveal from "../ui/ScrollReveal";
import { Heart, Sparkles } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useTemplateOrnaments } from "@/hooks/useTemplateOrnaments";
import OrnamentLayer from "./OrnamentLayer";

interface ThankYouMessageProps {
  clientSlug: string;
  customBackground?: string;
  templateId?: number | null;
}

const ThankYouMessage: React.FC<ThankYouMessageProps> = ({ clientSlug, customBackground, templateId }) => {
  const { theme } = useThemeContext();
  const { getOrnaments } = useTemplateOrnaments(templateId);
  
  const messageData = {
    title: "Thank You",
    description: [
      "Kehadiran dan doa restu dari Bapak/Ibu/Saudara/i merupakan karunia terindah bagi kami dalam merajut kisah cinta yang baru.",
      "Setiap ucapan, doa, dan kasih sayang yang telah diberikan akan selalu terukir indah dalam hati kami.",
      "Dengan penuh cinta dan harapan, kami menantikan kehadiran Anda di hari paling membahagiakan dalam hidup kami.",
    ]
  };

  return (
    <section className="relative text-gray-800 overflow-hidden min-h-screen flex items-center justify-center">
      {/* Beautiful Elegant Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={customBackground || theme.images.background}
          alt="Wedding Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          className=""
        />
        {/* Elegant Glass Morphism Overlay */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/70 backdrop-blur-[1px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-primarylight/30"></div>
        <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-primary/10 to-darkprimary/20"></div> */}
      </div>

      {/* Elegant Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float-slow">
          <Sparkles 
            className="w-6 h-6 drop-shadow-lg animate-pulse" 
            style={{
              background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: 0.4
            }}
          />
        </div>
        <div className="absolute top-40 right-16 animate-float-delayed">
          <Heart className="w-8 h-8 text-primary/30 drop-shadow-lg" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float">
          <Sparkles 
            className="w-4 h-4 drop-shadow-lg animate-pulse" 
            style={{
              background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: 0.5
            }}
          />
        </div>
        <div className="absolute bottom-60 right-12 animate-float-slow">
          <Heart className="w-5 h-5 text-primary/40 drop-shadow-lg" />
        </div>
        <div className="absolute top-1/3 left-1/4 animate-float-delayed">
          <Sparkles className="w-3 h-3 text-darkprimary/30 drop-shadow-lg" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 animate-float">
          <Heart className="w-4 h-4 text-primary/20 drop-shadow-lg" />
        </div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-16 text-center">
        {/* Thank You Section */}
        <ScrollReveal>
          <div className="text-center mx-4 mb-12">
            
            <div className="relative">
              <div className="relative py-12 px-8" style={{
                background: `url("data:image/svg+xml,${encodeURIComponent(`
                  <svg viewBox="0 0 320 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id="brushGradientThankYou" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="white" stop-opacity="0.95" />
                        <stop offset="50%" stop-color="white" stop-opacity="0.85" />
                        <stop offset="100%" stop-color="white" stop-opacity="0.75" />
                      </linearGradient>
                      <filter id="roughPaperThankYou">
                        <feTurbulence baseFrequency="0.04" numOctaves="3" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                      </filter>
                    </defs>
                    <path 
                      d="M15,20 Q25,8 45,15 Q75,5 105,18 Q135,8 165,20 Q195,12 225,25 Q255,18 285,30 Q305,25 315,35 L312,95 Q285,105 255,100 Q225,110 195,95 Q165,105 135,100 Q105,107 75,95 Q45,103 25,95 Q10,102 5,85 Z" 
                      fill="url(#brushGradientThankYou)"
                      filter="url(#roughPaperThankYou)"
                    />
                  </svg>
                `)}")`,
                backgroundSize: '100% 100%',
                backgroundRepeat: 'no-repeat',
                filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))'
              }}>
                <h1 
                  className="text-4xl md:text-6xl lg:text-7xl font-fleur mb-4 font-bold drop-shadow-lg"
                  style={{ 
                    lineHeight: '1.4', 
                    paddingBottom: '0.25rem',
                    background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {messageData.title}
                </h1>
                <div 
                  className="w-32 h-1 rounded-full mx-auto"
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.gold}80, ${theme.colors.gold}, ${theme.colors.accent}80)`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Description Cards */}
        <div className="space-y-8 md:space-y-10 mb-12">
          {messageData.description.map((text, index) => (
            <ScrollReveal key={index}>
              <div className="group relative">
                {/* Card Container */}
                <div className="relative bg-primarylight opacity-90 backdrop-blur-xl rounded-3xl border-2 border-darkprimary shadow-md shadow-darkprimary p-6 md:p-8 lg:p-10 transform hover:scale-102 transition-all duration-500 hover:shadow-3xl overflow-hidden">
                  {/* Background Gradient on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                  
                  {/* Decorative Corner Elements */}
                  <div className="absolute top-4 left-4 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                    <Heart className="w-6 h-6 text-darkprimary" />
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-30 group-hover:opacity-60 transition-opacity duration-300">
                    <Sparkles className="w-6 h-6 text-darkprimary" />
                  </div>
                  
                  {/* Number Badge */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-darkprimary to-textprimary rounded-full flex items-center justify-center text-primarylight font-bold text-sm md:text-base shadow-xl border-2 border-primarylight">
                    {index + 1}
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    {/* Quote Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary/30 to-darkprimary/20 rounded-full flex items-center justify-center border border-darkprimary/20">
                        <span className="text-2xl text-darkprimary font-bold">"</span>
                      </div>
                    </div>
                    
                    {/* Text Content */}
                    <p className="text-sm md:text-base lg:text-lg font-merienda leading-relaxed text-darkprimary transition-colors duration-300 text-center italic drop-shadow-md">
                      {text}
                    </p>
                    
                    {/* Bottom Quote */}
                    <div className="flex justify-center mt-4">
                      <span className="text-2xl text-darkprimary font-bold rotate-180">"</span>
                    </div>
                  </div>
                  
                  {/* Floating Sparkles */}
                  <div className="absolute top-6 right-8 opacity-40 group-hover:opacity-70 transition-opacity duration-300 animate-pulse">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div className="absolute bottom-8 left-8 opacity-40 group-hover:opacity-70 transition-opacity duration-300 animate-pulse delay-300">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                </div>
                
                {/* Card Shadow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-darkprimary/15 to-primary/10 rounded-3xl -z-10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3.5s ease-in-out infinite 1s;
        }
      `}</style>

      {/* Ornament Layer - Decorative elements */}
      <OrnamentLayer ornaments={getOrnaments('thankyou')} />
    </section>
  );
};

export default ThankYouMessage;