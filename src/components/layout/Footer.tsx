import React from "react";
import Image from "next/image";
import ScrollReveal from "../ui/ScrollReveal";
import { extractNamesFromSlug } from "@/utils/extractNamesFromSlug";
import { Heart, Sparkles, Users } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useUnifiedTheme } from '@/hooks/useUnifiedTheme';
import OrnamentLayer from '../wedding/OrnamentLayer';

interface FooterProps {
  clientSlug: string;
  themeId?: string;
}

const Footer: React.FC<FooterProps> = ({ clientSlug, themeId }) => {
  const { theme } = useThemeContext();
  const { getOrnaments, getBackground } = useUnifiedTheme(themeId);
  const backgroundImage = getBackground('footer') || theme.images.hero;
  // Extract names from clientSlug
  const { groomName, brideName } = extractNamesFromSlug(clientSlug);
  
  // Data Props dengan nama dari slug
  const footerProps = {
    greeting: "Kami yang berbahagia:",
    names: {
      groom: groomName,
      bride: brideName,
    },
    family: "Beserta Keluarga",
  };

  return (
    <footer id="footer" className="relative text-gray-800 overflow-hidden min-h-screen flex items-center justify-center">
      {/* Beautiful Elegant Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Wedding Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          className=""
          unoptimized={backgroundImage?.startsWith('data:')}
        />
        {/* Overlay agar teks lebih terbaca */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
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
        {/* ... elemen dekorasi lainnya biarkan saja ... */}
        <div className="absolute top-40 right-16 animate-float-delayed">
          <Heart className="w-8 h-8 text-primary/30 drop-shadow-lg" />
        </div>
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-16 text-center">
        
        {/* Greeting Section */}
        <div className="mb-8">
          <ScrollReveal>
            <div className="relative bg-white/60 backdrop-blur-md rounded-full py-3 px-8 mx-auto inline-block border-2 border-gold shadow-md">
              <div className="flex items-center justify-center space-x-3">
                <Users className="w-4 h-4 text-gold" />
                <p className="text-sm md:text-base font-merienda text-gold font-semibold drop-shadow-sm">
                  {footerProps.greeting}
                </p>
                <Users className="w-4 h-4 text-gold" />
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Names Section */}
        <div className="relative bg-white/40 backdrop-blur-md rounded-[3rem] py-12 px-4 mb-8 border-2 border-gold shadow-md shadow-gold hover:-translate-y-1 transition-all duration-300">
          
          {/* Background Pattern (Hearts) */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <Heart className="w-16 h-16 text-gold absolute top-4 left-4 rotate-[-15deg]" />
            <Heart className="w-12 h-12 text-gold absolute bottom-4 right-4 rotate-[15deg]" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            
            {/* --- GROOM NAME WITH GOLD BRUSH --- */}
            <ScrollReveal>
              <div className="mb-2 relative px-10 py-5 group inline-block">
                
                {/* SVG Brush Background */}
                <div className="absolute inset-0 w-full h-full -z-10 transform scale-110 group-hover:scale-115 transition-transform duration-700">
                   <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full h-full drop-shadow-lg">
                     <defs>
                       <linearGradient id="footerGroomGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                         <stop offset="0%" stopColor="#C6A664" />
                         <stop offset="50%" stopColor="#E5C578" />
                         <stop offset="100%" stopColor="#C6A664" />
                       </linearGradient>
                       <filter id="footerGroomFilter">
                         <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise" />
                         <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
                       </filter>
                     </defs>
                     <path 
                       d="M30,65 C80,25 200,15 320,35 C370,45 400,65 380,90 C340,115 180,105 80,95 C40,90 10,85 30,65 Z" 
                       fill="url(#footerGroomGrad)"
                       filter="url(#footerGroomFilter)" 
                       opacity="0.95"
                     />
                   </svg>
                </div>

                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-lavishly font-bold text-white mb-2 transform -rotate-1 drop-shadow-md" 
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >
                  {footerProps.names.groom}
                </h2>
              </div>
            </ScrollReveal>
            
            {/* Heart Divider */}
            <ScrollReveal>
              <div className="flex items-center justify-center my-4">
                <div className="w-12 h-[2px] bg-darkprimary/30 rounded-full"></div>
                <div className="mx-4 w-10 h-10 bg-white border-2 border-gold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  <Heart className="w-5 h-5 text-gold fill-gold" />
                </div>
                <div className="w-12 h-[2px] bg-darkprimary/30 rounded-full"></div>
              </div>
            </ScrollReveal>
            
            {/* --- BRIDE NAME WITH GOLD BRUSH --- */}
            <ScrollReveal>
              <div className="mb-6 relative px-10 py-5 group inline-block">
                
                {/* SVG Brush Background (Slightly varied path for uniqueness) */}
                <div className="absolute inset-0 w-full h-full -z-10 transform scale-110 group-hover:scale-115 transition-transform duration-700">
                   <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full h-full drop-shadow-lg">
                     <defs>
                       <linearGradient id="footerBrideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                         <stop offset="0%" stopColor="#C6A664" />
                         <stop offset="50%" stopColor="#E5C578" />
                         <stop offset="100%" stopColor="#C6A664" />
                       </linearGradient>
                       <filter id="footerBrideFilter">
                         <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="noise" />
                         <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
                       </filter>
                     </defs>
                     {/* Path sedikit dibalik/diubah agar tidak terlihat copy-paste persis */}
                     <path 
                       d="M380,65 C330,25 210,15 90,35 C40,45 10,65 30,90 C70,115 230,105 330,95 C370,90 400,85 380,65 Z" 
                       fill="url(#footerBrideGrad)"
                       filter="url(#footerBrideFilter)" 
                       opacity="0.95"
                     />
                   </svg>
                </div>

                <h2 
                  className="text-4xl md:text-5xl lg:text-6xl font-lavishly font-bold text-white mb-2 transform rotate-1 drop-shadow-md" 
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                >
                  {footerProps.names.bride}
                </h2>
              </div>
            </ScrollReveal>
            
            {/* Family Section */}
            <ScrollReveal>
              <div className="relative mt-2">
                <div className="bg-white/50 backdrop-blur-sm rounded-full border-2 border-gold py-3 px-8 shadow-sm shadow-gold">
                   <p className="text-lg md:text-xl font-bold font-merienda text-gold text-center">
                    {footerProps.family}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Made with Love */}
        <ScrollReveal>
          <div className="bg-white px-6 py-2 rounded-full shadow-lg border border-gold/50 inline-flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600">Made with</span>
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500 animate-bounce" />
            <span className="text-xs font-semibold text-gray-600">by</span>
            <span className="text-sm font-bold font-merienda bg-clip-text text-transparent bg-gradient-to-r from-gold to-darkprimary">
              adainwedding.id
            </span>
          </div>
        </ScrollReveal>
      </div>

      {/* Ornament Layer */}
      <OrnamentLayer ornaments={getOrnaments('footer')} />

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
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 4s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;