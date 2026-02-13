import React from 'react';
import Gallery from './Gallery';
import Image from 'next/image';
import ScrollReveal from '../ui/ScrollReveal';
import { Camera, Sparkles, Play } from 'lucide-react';
import { useThemeContext } from '@/contexts/ThemeContext';
import { useUnifiedTheme } from '@/hooks/useUnifiedTheme';
import OrnamentLayer from '../wedding/OrnamentLayer';

interface OurGalleryProps {
  galleryPhotos?: any[];
  youtubeUrl?: string;
  clientSlug: string;
  themeId?: string;
}

const OurGallery: React.FC<OurGalleryProps> = ({ galleryPhotos = [], youtubeUrl, clientSlug, themeId }) => {
  const { theme } = useThemeContext();
  const { getOrnaments, getBackground } = useUnifiedTheme(themeId);
  const backgroundImage = getBackground('gallery') || theme.images.background;
  // Function to extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(youtubeUrl || '');
    return (
        <div id='gallery' className='relative overflow-hidden'>
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={backgroundImage}
              alt="Gallery Background"
              fill
              style={{ objectFit: 'cover' }}
              quality={100}
              unoptimized={backgroundImage?.startsWith('data:')}
            />
          </div>
          <ScrollReveal>
            <div className="text-center mx-4 relative z-10">
              {/* <div className="flex items-center justify-center mb-8 pt-8">
                <Sparkles className="w-8 h-8 bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent animate-pulse mr-4" />
                <Camera className="w-10 h-10 bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent mr-4" />
                <Sparkles className="w-8 h-8 bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent animate-pulse" />
              </div> */}
              
              <div className="relative mb-8">
                <div className="relative py-12 px-8" style={{
                  background: `url("data:image/svg+xml,${encodeURIComponent(`
                    <svg viewBox="0 0 320 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="brushGradientGallery" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stop-color="white" stop-opacity="0.95" />
                          <stop offset="50%" stop-color="white" stop-opacity="0.85" />
                          <stop offset="100%" stop-color="white" stop-opacity="0.75" />
                        </linearGradient>
                        <filter id="roughPaperGallery">
                          <feTurbulence baseFrequency="0.04" numOctaves="3" result="noise" />
                          <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                        </filter>
                      </defs>
                      <path 
                        d="M15,20 Q25,8 45,15 Q75,5 105,18 Q135,8 165,20 Q195,12 225,25 Q255,18 285,30 Q305,25 315,35 L312,95 Q285,105 255,100 Q225,110 195,95 Q165,105 135,100 Q105,107 75,95 Q45,103 25,95 Q10,102 5,85 Z" 
                        fill="url(#brushGradientGallery)"
                        filter="url(#roughPaperGallery)"
                      />
                    </svg>
                  `)}")`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))'
                }}>
                  <h1 className='font-fleur text-5xl bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent font-bold mb-4 relative z-30 overflow-visible leading-relaxed'>Our Gallery</h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-gold to-accent mx-auto rounded-full"></div>
                </div>
              </div>
            </div>
          </ScrollReveal>
          
          {/* YouTube Video Section */}
          {videoId && (
            <ScrollReveal>
              <div className="mb-12 px-4 relative z-10">
                <div className="max-w-4xl mx-auto">
                  {/* Elegant Video Container with Theme Colors */}
                  <div className="relative bg-primarylight/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-darkprimary/20 overflow-hidden">
                    {/* Decorative Background Elements */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <div className="absolute top-4 right-4 animate-bounce delay-1000">
                        <span className="text-4xl text-darkprimary">♥</span>
                      </div>
                      <div className="absolute top-8 left-6 animate-pulse">
                        <span className="text-3xl text-darkprimary">★</span>
                      </div>
                      <div className="absolute bottom-6 right-8 animate-bounce" style={{animationDelay: '0.5s'}}>
                        <span className="text-2xl text-darkprimary">✦</span>
                      </div>
                      <div className="absolute bottom-4 left-4 animate-pulse" style={{animationDelay: '0.8s'}}>
                        <span className="text-3xl text-darkprimary">♡</span>
                      </div>
                    </div>

                    {/* Header Section */}
                    <div className="relative z-10 flex items-center justify-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-gold to-accent rounded-2xl flex items-center justify-center shadow-lg mr-4">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <h3 
                        className="text-xl md:text-2xl font-lavishly font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent"
                        style={{ lineHeight: '1.6', paddingBottom: '0.25rem' }}
                      >
                        Our Wedding Video
                      </h3>
                    </div>
                    
                    {/* Video Container - Full Width */}
                    <div className="relative z-10">
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&fs=1&hd=1`}
                          title="Wedding Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full rounded-2xl"
                        ></iframe>
                      </div>
                    </div>
                    
                    {/* Caption */}
                    <div className="relative z-10 mt-6 text-center">
                      <div className="inline-flex items-center justify-center space-x-2 bg-primary/30 backdrop-blur-sm rounded-2xl px-6 py-3 border border-darkprimary/20">
                        <span className="text-2xl animate-pulse">💕</span>
                        <p className="text-sm md:text-base font-merienda text-darkprimary font-medium">
                          Saksikan momen bahagia pernikahan kami
                        </p>
                        <span className="text-2xl animate-pulse">💕</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          )}
          
          {/* Gallery Content */}
          <div className="relative z-10">
            <Gallery galleryPhotos={galleryPhotos} />
          </div>

          {/* Ornament Layer - Decorative elements */}
          <OrnamentLayer ornaments={getOrnaments('gallery')} />
        </div>
    );
};

export default OurGallery;