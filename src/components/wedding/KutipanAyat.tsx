import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import ScrollReveal from "../ui/ScrollReveal";
import { parseCoupleFromSlug } from "@/utils/slugUtils";
import { Heart, Sparkles, BookOpen } from "lucide-react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useTemplateOrnaments } from "@/hooks/useTemplateOrnaments";
import OrnamentLayer from "./OrnamentLayer";

interface KutipanAyatProps {
  title?: string; // Props opsional untuk mengganti judul
  quote?: string; // Props opsional untuk mengganti kutipan ayat
  source?: string; // Props opsional untuk mengganti sumber kutipan
  customBackground?: string; // Custom background image
  templateId?: number | null;
}

const KutipanAyat: React.FC<KutipanAyatProps> = ({
  quote = `"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
          istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa
          tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan
          sayang. Sesungguhnya pada yang demikian itu benar-benar terdapat
          tanda-tanda bagi kaum yang berfikir."`,
  source = "(Q.S. Ar-Rum : 21)",
  customBackground,
  templateId,
}) => {
  const { theme } = useThemeContext();
  const backgroundImage = customBackground || theme.images.background;
  const params = useParams();
  const clientSlug = params?.clientSlug as string;
  const coupleNames = parseCoupleFromSlug(clientSlug);
  const { getOrnaments } = useTemplateOrnaments(templateId);
  
  return (
    <div id="kutipan-ayat" className="relative min-h-screen flex items-center justify-center py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8 overflow-hidden">
      {/* Background Image - Same as Love Story */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Kutipan Ayat Background"
          fill
          style={{ objectFit: 'cover' }}
          quality={100}
          className="z-0"
          unoptimized={customBackground?.startsWith('data:')}
        />
      </div>

      <ScrollReveal>
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto relative z-10">
          {/* Modern Card Container - Same structure as RSVP */}
          <div className="bg-primarylight opacity-90 rounded-3xl border-2 border-darkprimary shadow-lg shadow-darkprimary p-6 md:p-8 lg:p-10 overflow-hidden relative">
            {/* Decorative Background Elements - Same as RSVP */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
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
              <div className="absolute top-1/2 right-2 animate-bounce" style={{animationDelay: '1s'}}>
                <span className="text-xl text-darkprimary">✧</span>
              </div>
            </div>

            {/* Header Section */}
            <div className="text-center mb-6 md:mb-8 relative z-10">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-gold to-accent/80 rounded-full flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h2 
                  className="text-2xl md:text-3xl lg:text-4xl font-lavishly font-bold bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent drop-shadow-lg"
                  style={{ lineHeight: '1.4', paddingBottom: '0.125rem' }}
                >
                  Kutipan Ayat
                </h2>
                <div className="w-8 h-8 bg-gradient-to-r from-gold/80 to-accent rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-gold/50 via-gold to-accent/50 rounded-full mx-auto mb-4"></div>
              
              {/* Couple Initials Title */}
              <div className="flex items-center justify-center space-x-4 mb-4 px-4">
                <div 
                  className="text-3xl md:text-4xl font-lavishly font-bold flex-shrink-0"
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: '1.6',
                    paddingBottom: '0.25rem',
                    paddingTop: '0.125rem',
                    minWidth: '50px',
                    textAlign: 'center'
                  }}
                >
                  {coupleNames?.bride?.charAt(0) || 'B'}
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-darkprimary to-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-primarylight animate-pulse" />
                </div>
                <div 
                  className="text-3xl md:text-4xl font-lavishly font-bold flex-shrink-0"
                  style={{
                    background: `linear-gradient(to right, ${theme.colors.gold}, ${theme.colors.accent})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: '1.6',
                    paddingBottom: '0.25rem',
                    paddingTop: '0.125rem',
                    minWidth: '50px',
                    textAlign: 'center'
                  }}
                >
                  {coupleNames?.groom?.charAt(0) || 'C'}
                </div>
              </div>
            </div>

            {/* Quote Content Section */}
            <div className="relative z-10">
              <div className="text-center bg-primary/20 backdrop-blur-sm rounded-2xl border border-darkprimary p-6 md:p-8">
                {/* Quote Mark Top */}
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 flex items-center justify-center">
                    <span className="text-2xl text-darkprimary font-bold">"</span>
                  </div>
                </div>

                {/* Quote Text */}
                <p className="text-sm md:text-base font-merienda text-darkprimary leading-relaxed italic text-center mb-6">
                  {quote}
                </p>

                {/* Source */}
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-6 h-6 bg-gradient-to-r from-darkprimary to-primary rounded-full flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-primarylight" />
                  </div>
                  <p className="text-xs md:text-sm text-darkprimary font-semibold font-merienda">
                    {source}
                  </p>
                  <div className="w-6 h-6 bg-gradient-to-r from-primary to-darkprimary rounded-full flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-primarylight" />
                  </div>
                </div>

                {/* Quote Mark Bottom */}
                <div className="flex justify-center">
                  <span className="text-2xl text-darkprimary font-bold rotate-180">"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Ornament Layer - Decorative elements */}
      <OrnamentLayer ornaments={getOrnaments('kutipan')} />
    </div>
  );
};

export default KutipanAyat;
