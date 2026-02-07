// File: components/FullScreenImage.tsx
import React, { useState, useEffect } from "react";
import Image from "next/image";
import FullScreenImageFront from "./FullScreenImageFront";
import BoxWithImage from "../ui/BoxWithImage";
import WeddingCountdown from "../ui/WeddingCountdown";
import SnowAnimation from "../ui/SnowAnimation";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useTemplateOrnaments } from "@/hooks/useTemplateOrnaments";
import OrnamentLayer from "../wedding/OrnamentLayer";

// Default image for BoxWithImage when no wedding image is uploaded
const DEFAULT_WEDDING_IMAGE = '/images/groom_and_bride.png';

interface FullScreenImageProps {
  src: string;
  alt?: string;
  clientSlug?: string;
  weddingImage?: string;
  customBackground?: string;
  templateId?: number | null;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({
  alt = "Full Screen Image",
  clientSlug,
  weddingImage,
  customBackground,
  templateId
}) => {
  const { theme } = useThemeContext();
  const { getOrnaments } = useTemplateOrnaments(templateId);
  const backgroundImage = customBackground || theme.images.background;
  // Use weddingImage prop if provided, otherwise use default
  const [coupleImage, setCoupleImage] = useState(weddingImage || DEFAULT_WEDDING_IMAGE);
  const [loading, setLoading] = useState(true);

  // Load wedding image from database for BoxWithImage
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
            // No wedding image in database, use default
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
      <FullScreenImageFront />

      <div id="home" className="relative w-full h-screen z-10 pt-20">
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
            unoptimized={customBackground?.startsWith('data:')}
          />
        )}

        {/* Snow Animation */}
        <SnowAnimation 
          count={80} 
          symbols={["❄"]} 
          className="z-5" 
        />

        <div className="absolute bottom-0 left-0 w-full flex justify-center z-10 p-2 pb-8">
          {/* <BoxTime /> */}
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[70%] md:-translate-y-[65%] lg:-translate-y-[70%]">
          <BoxWithImage clientSlug={clientSlug} weddingImage={coupleImage} />
        </div>
        
        {/* Wedding Countdown below the card */}
        <div className="absolute bottom-24 md:bottom-16 lg:bottom-28 left-1/2 transform -translate-x-1/2 z-10 w-64 md:w-72 lg:w-80">
          <WeddingCountdown clientSlug={clientSlug} />
        </div>

        {/* Ornament Layer - Decorative elements */}
        <OrnamentLayer ornaments={getOrnaments('fullscreen')} />
      </div>
    </>
  );
};

export default FullScreenImage;
