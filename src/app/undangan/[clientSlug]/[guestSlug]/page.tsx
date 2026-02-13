"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MusicProvider } from "@/contexts/MusicContext";
import "@/styles/theme-backgrounds.css";
import { sampleCoupleInfo } from "@/data/sampleCouple";
import { useClientContent } from "@/hooks/useClientContent";
import { useComponentSettings } from "@/hooks/useComponentSettings";
import { useUnifiedTheme } from "@/hooks/useUnifiedTheme";

// Komponen
import FullScreenImage from "@/components/media/FullScreenImage";
import KutipanAyat from "@/components/wedding/KutipanAyat";
import Welcome from "@/components/wedding/Welcome";
import Timeline from "@/components/wedding/Timeline";
import WeddingEvent from "@/components/wedding/WeddingEvent";
import WeddingGift from "@/components/wedding/WeddingGift";
import OurGallery from "@/components/media/OurGallery";
import RSVPForm from "@/components/forms/RSVPForm";
import GuestBookList from "@/components/interactive/GuestBookList";
import ThankYouMessage from "@/components/wedding/ThankYouMessage";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import MusicCircle from "@/components/media/MusicCircle";
import EnhancedLoading from "@/components/ui/EnhancedLoading";

const Page: React.FC = () => {
  // Ambil slug dari URL
  const params = useParams();
  const clientSlug = params?.clientSlug as string;

  // --- STATE BARU: Kontrol Pembukaan Undangan ---
  const [isInvitationOpened, setIsInvitationOpened] = useState(false);

  // Theme state - UNIFIED SYSTEM
  const [unifiedThemeId, setUnifiedThemeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Use unified theme hook
  const { theme: unifiedTheme, loading: themeLoading } = useUnifiedTheme(unifiedThemeId);

  // Client content
  const { content, galleryPhotos, loading: contentLoading } = useClientContent(clientSlug);

  // Component settings
  const { settings: componentSettings, loading: settingsLoading } = useComponentSettings(clientSlug);

  // Fetch client data to get unified_theme_id
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientResponse = await fetch(`/api/clients?slug=${clientSlug}`);
        if (clientResponse.ok) {
          const clientData = await clientResponse.json();
          const themeId = clientData.unified_theme_id || 'original';
          setUnifiedThemeId(themeId);
        } else {
          setUnifiedThemeId('original');
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        setUnifiedThemeId('original');
      } finally {
        setLoading(false);
      }
    };

    if (clientSlug) {
      fetchClientData();
    }
  }, [clientSlug]);

  // Auto-scroll ke fullscreen saat refresh
  useEffect(() => {
    if (isInvitationOpened) {
        const fullScreenImage = document.getElementById("fullscreen-image");
        if (fullScreenImage) {
            fullScreenImage.scrollIntoView({ behavior: "smooth" });
        }
    }
  }, [isInvitationOpened]);

  if (loading || themeLoading || contentLoading || settingsLoading) {
    return (
      <EnhancedLoading
        message="Memuat undangan pernikahan..."
        type="wedding"
        size="lg"
      />
    );
  }

  const getOrdinalWord = (num: string): string => {
    const ordinals: { [key: string]: string } = {
      "1": "pertama", "2": "kedua", "3": "ketiga", "4": "keempat", "5": "kelima",
      "6": "keenam", "7": "ketujuh", "8": "kedelapan", "9": "kesembilan", "10": "kesepuluh",
    };
    return ordinals[num] || `ke-${num}`;
  };

  const coupleInfo = {
    ...sampleCoupleInfo,
    bride: {
      ...sampleCoupleInfo.bride,
      name: content.couple_info?.brideName || sampleCoupleInfo.bride.name,
      fullName: content.couple_info?.brideFullName || sampleCoupleInfo.bride.fullName,
      parent: content.couple_info?.brideChildOrder && content.couple_info?.brideFatherName && content.couple_info?.brideMotherName
          ? `Putri ${getOrdinalWord(content.couple_info.brideChildOrder)} dari Bapak ${content.couple_info.brideFatherName} & Ibu ${content.couple_info.brideMotherName}`
          : sampleCoupleInfo.bride.parent,
    },
    groom: {
      ...sampleCoupleInfo.groom,
      name: content.couple_info?.groomName || sampleCoupleInfo.groom.name,
      fullName: content.couple_info?.groomFullName || sampleCoupleInfo.groom.fullName,
      parent: content.couple_info?.groomChildOrder && content.couple_info?.groomFatherName && content.couple_info?.groomMotherName
          ? `Putra ${getOrdinalWord(content.couple_info.groomChildOrder)} dari Bapak ${content.couple_info.groomFatherName} & Ibu ${content.couple_info.groomMotherName}`
          : sampleCoupleInfo.groom.parent,
    },
  };

  const desktopPhotoUrl = content.couple_info?.weddingImage || '/images/groom_and_bride.png';

  const legacyTheme = unifiedTheme ? {
    id: unifiedTheme.theme_id,
    name: unifiedTheme.theme_name,
    description: unifiedTheme.description || '',
    colors: unifiedTheme.colors,
    images: {
      hero: unifiedTheme.backgrounds?.fullscreen || '/images/Wedding1.png',
      background: unifiedTheme.backgrounds?.welcome || '/images/Wedding2.png',
      gallery: [],
      couple: {
        bride: '/images/groom_and_bride.png',
        groom: '/images/groom_and_bride.png'
      }
    },
    typography: {
      primaryFont: 'Merienda, cursive',
      secondaryFont: 'Poppins, sans-serif',
      headingFont: 'Lavishly Yours, cursive',
      scriptFont: 'Great Vibes, cursive'
    },
    customStyles: unifiedTheme.custom_styles,
  } : null;

  return (
    <MusicProvider>
      <ThemeProvider theme={legacyTheme} coupleInfo={coupleInfo}>
        <div className={`theme-${unifiedTheme?.theme_id?.split('-')[0] || 'original'}`}>
          
          <div className="lg:flex lg:min-h-screen">
            
            {/* Left Panel */}
            <div className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:w-2/3 lg:h-screen lg:overflow-hidden">
              <Image
                src={desktopPhotoUrl}
                alt="Wedding Photo"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Right Panel */}
            <div className="w-full lg:w-1/3 lg:ml-[66.666667%] min-h-screen relative z-10">
              
              <div className="hidden md:block lg:hidden theme-desktop-bg" />

              {/* Container Undangan */}
              <div className="w-full min-h-screen bg-white md:max-w-[480px] md:mx-auto md:shadow-[0_0_50px_rgba(0,0,0,0.1)] lg:max-w-none lg:mx-0 lg:shadow-none">
                
                {componentSettings.showFullScreenImage && (
                  <div id="fullscreen-image" className="flex items-center justify-center min-h-screen bg-gray-100 overflow-hidden">
                    <FullScreenImage
                      src={legacyTheme?.images.hero || '/images/Wedding1.png'}
                      alt="Example Full Screen Image"
                      clientSlug={clientSlug}
                      themeId={unifiedThemeId || undefined}
                      weddingImage={content.couple_info?.weddingImage}
                      onOpen={() => setIsInvitationOpened(true)} 
                    />
                  </div>
                )}

                {componentSettings.showKutipanAyat && (
                  <div id="kutipan-ayat" className="overflow-hidden">
                    <KutipanAyat
                      quote={content.kutipan_ayat?.ayat}
                      source={content.kutipan_ayat?.sumber}
                      themeId={unifiedThemeId || undefined}
                    />
                  </div>
                )}

                {componentSettings.showWelcome && (
                  <div id="about" className="overflow-hidden">
                    <Welcome
                      coupleInfo={content.couple_info}
                      clientSlug={clientSlug}
                      themeId={unifiedThemeId || undefined}
                    />
                  </div>
                )}

                {componentSettings.showLoveStory && (
                  <div id="love-story" className="relative h-max bg-primary overflow-hidden">
                    <div className="absolute inset-0">
                      <Image
                        src={unifiedTheme?.backgrounds?.timeline || legacyTheme?.images.background || '/images/Wedding2.png'}
                        alt="Love Story Background"
                        fill
                        className="object-cover"
                      />
                    </div>
                    {componentSettings.showTimeline && (
                      <Timeline
                        clientSlug={clientSlug}
                        themeId={unifiedThemeId || undefined}
                        loveStoryData={content.love_story}
                      />
                    )}
                  </div>
                )}

                {componentSettings.showWeddingEvent && (
                  <div id="wedding-event" className="overflow-hidden">
                    <WeddingEvent
                      clientSlug={clientSlug}
                      themeId={unifiedThemeId || undefined}
                      akadInfo={content.akad_info}
                      resepsiInfo={content.resepsi_info}
                    />
                  </div>
                )}

                {componentSettings.showWeddingGift && (
                  <WeddingGift
                    clientSlug={clientSlug}
                    themeId={unifiedThemeId || undefined}
                  />
                )}

                {componentSettings.showGallery && (
                  <OurGallery
                    clientSlug={clientSlug}
                    themeId={unifiedThemeId || undefined}
                    galleryPhotos={galleryPhotos}
                    youtubeUrl={content.gallery_video?.youtubeUrl}
                  />
                )}

                {componentSettings.showRSVP && (
                  <div id="rsvp" className="overflow-hidden">
                    <RSVPForm
                      clientSlug={clientSlug}
                      themeId={unifiedThemeId || undefined}
                    />
                  </div>
                )}

                {componentSettings.showGuestBook && (
                  <GuestBookList
                    clientSlug={clientSlug}
                    themeId={unifiedThemeId || undefined}
                  />
                )}

                {componentSettings.showFooter && (
                  <ThankYouMessage
                    clientSlug={clientSlug}
                    themeId={unifiedThemeId || undefined}
                  />
                )}

                {componentSettings.showFooter && (
                  <Footer
                    clientSlug={clientSlug}
                    themeId={unifiedThemeId || undefined}
                  />
                )}

              </div>
              
              {/* --- FLOATING ELEMENTS WRAPPER (Navbar & Music) --- */}
              {/* Kita buat satu wrapper fixed untuk menampung elemen-elemen mengambang */}
              {/* Logic: 
                  - Mobile: fixed bottom-0 left-0 w-full 
                  - Desktop: fixed bottom-0 lg:left-[66.666667%] lg:w-[33.333333%] (Menempel di panel kanan)
              */}
              {isInvitationOpened && (
                  <div className="fixed bottom-0 left-0 w-full lg:left-[66.666667%] lg:w-[33.333333%] z-[100] pointer-events-none flex flex-col items-center">
                      
                      {/* 1. MUSIC CIRCLE */}
                      {componentSettings.showMusic && (
                          // absolute relative terhadap wrapper fixed ini
                          // bottom-20 agar di atas navbar, right-4 agar di kanan
                          <div className="absolute bottom-12 md:bottom-8 right-0 md:right-4 pointer-events-auto">
                              <MusicCircle
                                  clientSlug={clientSlug}
                                  weddingImage={content.couple_info?.weddingImage}
                              />
                          </div>
                      )}

                      {/* 2. NAVBAR */}
                      {componentSettings.showNavbar && (
                          <div className="pointer-events-auto relative z-50">
                              <Navbar componentSettings={componentSettings} />
                          </div>
                      )}
                  </div>
              )}

            </div>
          </div>
        </div>
      </ThemeProvider>
    </MusicProvider>
  );
};

export default Page;