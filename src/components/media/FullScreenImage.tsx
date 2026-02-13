// File: components/media/FullScreenImage.tsx

import React, { useState, useEffect } from "react";
import Image from "next/image";
// Import komponen cover depan (yang ada tombol Buka Undangan)
import FullScreenImageFront from "./FullScreenImageFront"; 
import BoxWithImage from "../ui/BoxWithImage";
import WeddingCountdown from "../ui/WeddingCountdown";
import SnowAnimation from "../ui/SnowAnimation";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useUnifiedTheme } from "@/hooks/useUnifiedTheme";
import OrnamentLayer from "../wedding/OrnamentLayer";

// Default image for BoxWithImage when no wedding image is uploaded
const DEFAULT_WEDDING_IMAGE = '/images/groom_and_bride.png';

interface FullScreenImageProps {
  src?: string;
  alt?: string;
  clientSlug?: string;
  weddingImage?: string;
  themeId?: string | null;
  hideOverlay?: boolean;
  onOpen?: () => void; // <--- Prop penting: Callback untuk memunculkan Navbar
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({
  alt = "Full Screen Image",
  clientSlug,
  weddingImage,
  themeId,
  hideOverlay = false,
  onOpen // <--- Terima fungsi dari Page.tsx
}) => {
  const { theme } = useThemeContext();
  const { getOrnaments, getBackground } = useUnifiedTheme(themeId);
  const backgroundImage = getBackground('fullscreen') || theme.images.background;
  
  const [coupleImage, setCoupleImage] = useState(weddingImage || DEFAULT_WEDDING_IMAGE);
  const [loading, setLoading] = useState(true);

  // Load wedding image from database
  useEffect(() => {
    const loadWeddingImage = async () => {
      if (!clientSlug) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/client-content?clientSlug=${clientSlug}&contentType=couple_info`);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0 && data[0].content_data?.weddingImage) {
            setCoupleImage(data[0].content_data.weddingImage);
          } else {
            setCoupleImage(DEFAULT_WEDDING_IMAGE);
          }
        }
      } catch (error) {
        console.error('Error loading wedding image:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWeddingImage();
  }, [clientSlug, weddingImage]);

  return (
    <>
      {/* LAYER 1: COVER UNDANGAN (FullScreenImageFront)
        Kita teruskan onOpen ke sini. Saat tombol "Buka" diklik di component Front,
        dia akan memanggil onOpen() -> Page.tsx akan tahu -> Navbar Muncul.
      */}
      {!hideOverlay && (
        <FullScreenImageFront 
          guestSlug={clientSlug} 
          onOpen={onOpen} 
        />
      )}

      {/* LAYER 2: HERO SECTION (Isi Utama Halaman Home)
        Ini yang akan terlihat setelah Cover terbuka (slide up/hilang).
      */}
      <div id="home" className="relative w-full h-screen z-10 pt-20">
        
        {/* Background Image */}
        {loading ? (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        ) : (
          <Image
            src={backgroundImage}
            alt={alt}
            fill
            className="object-cover transition-opacity duration-500"
            quality={100}
            priority
            unoptimized={backgroundImage?.startsWith('data:')}
          />
        )}

        {/* Snow Animation di Hero */}
        <SnowAnimation 
          count={80} 
          symbols={["❄"]} 
          className="z-5" 
        />

        {/* Layout Tengah: Box Image Pasangan */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[70%] md:-translate-y-[65%] lg:-translate-y-[70%] mt-4">
          <BoxWithImage clientSlug={clientSlug} weddingImage={coupleImage} />
        </div>
        
        {/* Layout Bawah: Countdown */}
        <div className="absolute bottom-16 md:bottom-16 lg:bottom-28 left-1/2 transform -translate-x-1/2 z-10 w-64 md:w-72 lg:w-80">
          <WeddingCountdown clientSlug={clientSlug} />
        </div>

        {/* Ornamen Hiasan */}
        <OrnamentLayer ornaments={getOrnaments('fullscreen-image')} />
      </div>
    </>
  );
};

export default FullScreenImage;