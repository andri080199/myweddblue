"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, usePathname } from "next/navigation";
import { parseCoupleFromSlug } from "@/utils/slugUtils";
import { useMusicContext } from "@/contexts/MusicContext";
import SnowAnimation from "../ui/SnowAnimation";

const FullScreenImage: React.FC<{ guestSlug?: string }> = ({ guestSlug }) => {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard');

  // Skip opening screen in dashboard/edit mode
  const [isVisible, setIsVisible] = useState(!isDashboard);
  const [isSlidingUp, setIsSlidingUp] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  const params = useParams();
  const clientSlug = params?.clientSlug as string;
  const coupleNames = parseCoupleFromSlug(clientSlug);
  const { triggerAutoPlay } = useMusicContext();
  
  const rawSlug = guestSlug ?? (params?.guestSlug as string | undefined);
  const decodedName = rawSlug
    ? decodeURIComponent(rawSlug.replace(/-/g, " "))
    : "Tamu Undangan";

  // Load wedding image from database
  useEffect(() => {
    const loadWeddingImage = async () => {
      try {
        const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=couple_info`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0 && data[0].content_data?.weddingImage) {
            setBackgroundImage(data[0].content_data.weddingImage);
          } else {
            // Fallback ke gambar default jika tidak ada di database
            setBackgroundImage("/images/groom_and_bride.png");
          }
        } else {
          setBackgroundImage("/images/groom_and_bride.png");
        }
      } catch (error) {
        console.error('Error loading wedding image:', error);
        setBackgroundImage("/images/groom_and_bride.png");
      } finally {
        setImageLoading(false);
      }
    };

    if (clientSlug) {
      loadWeddingImage();
    } else {
      setBackgroundImage("/images/groom_and_bride.png");
      setImageLoading(false);
    }
  }, [clientSlug]);


  useEffect(() => {
    document.body.style.overflow = isVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  // Auto-trigger music in dashboard mode
  useEffect(() => {
    if (isDashboard) {
      triggerAutoPlay();
    }
  }, [isDashboard, triggerAutoPlay]);

  const handleClose = () => {
    // Trigger music auto-play when opening invitation
    triggerAutoPlay();
    
    setIsSlidingUp(true);
    setTimeout(() => setIsVisible(false), 1000);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* CSS for snow animation */}
      <style jsx>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 15px rgba(255, 255, 255, 0.2); }
          50% { box-shadow: 0 0 25px rgba(255, 255, 255, 0.4), 0 0 35px rgba(255, 255, 255, 0.3); }
        }
      `}</style>

      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Snow Animation */}
        <SnowAnimation 
          count={60} 
          symbols={["❄", "✨", "⭐", "💫"]} 
          className="z-20" 
        />

        <div
          className={`absolute inset-0 transition-transform duration-1000 flex justify-center items-center ${
            isSlidingUp ? "-translate-y-full" : "translate-y-0"
          }`}
        >
          {/* Background Gambar */}
          <div className="absolute inset-0">
            <div className="relative w-full h-full">
              {imageLoading ? (
                // Loading state
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
              ) : backgroundImage ? (
                <Image
                  src={backgroundImage}
                  alt="Wedding Background"
                  fill
                  className="object-cover object-center filter brightness-75 saturate-110 transition-opacity duration-500"
                  priority
                  onLoad={() => console.log('Image loaded successfully')}
                  onError={() => {
                    console.error('Failed to load image:', backgroundImage);
                    setBackgroundImage("/images/groom_and_bride.png");
                  }}
                />
              ) : (
                // Fallback jika tidak ada gambar
                <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-blue-700 to-indigo-900" />
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-purple-900/10" />
            </div>
          </div>

          {/* Konten Undangan */}
          <div className="relative w-3/5 sm:w-1/2 md:w-2/5 lg:w-1/4 text-center mt-32 z-40">
            <div 
              className="absolute inset-0 bg-primarylight backdrop-blur-md rounded-xl shadow-2xl border border-white/20"
              style={{ animation: 'glow 3s ease-in-out infinite' }}
            />
            <div 
              className="relative z-10 p-3 px-5 text-darkprimary"
              style={{ animation: 'float 6s ease-in-out infinite' }}
            >
              {/* Header dengan ornamen */}
              <div className="mb-2">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-1"></div>
                <h1 className="text-xs uppercase font-poppins tracking-wider text-darkprimary/80 mb-1">
                  The Wedding Of
                </h1>
                <h1 className="text-lg font-merienda font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent leading-relaxed">
                  {coupleNames.fullNames}
                </h1>
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-1 mb-2"></div>
              </div>

              {/* Guest info */}
              <div className="mb-3">
                <h2 className="text-xs font-merienda text-darkprimary/80 mb-1">Kepada Yth.</h2>
                <h3 className="text-sm font-poppins font-semibold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent leading-relaxed">
                  {decodedName}
                </h3>
              </div>

              {/* Action button */}
              <button
                onClick={handleClose}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold bg-gradient-to-r from-darkprimary to-gray-800 text-white rounded-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon */}
                <div className="relative z-10 transform group-hover:rotate-12 transition-transform duration-300">
                  <Image
                    src="/svg/enveloped.svg"
                    alt="Envelope Icon"
                    width={16}
                    height={16}
                  />
                </div>
                
                {/* Text */}
                <span className="relative z-10">Buka Undangan</span>
                
                {/* Sparkle effect */}
                <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              </button>

              {/* Decorative elements */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-gold/30 rounded-tl-lg"></div>
              <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-gold/30 rounded-tr-lg"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-gold/30 rounded-bl-lg"></div>
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-gold/30 rounded-br-lg"></div>
            </div>
          </div>

          {/* Additional floating elements */}
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>
    </>
  );
};

export default FullScreenImage;