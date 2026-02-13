"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MusicProvider } from "@/contexts/MusicContext";
import "@/styles/theme-backgrounds.css";
// Kita tidak import inline-editor.css di sini untuk menghindari konflik layout
import { sampleCoupleInfo } from "@/data/sampleCouple";
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
import EnhancedLoading from "@/components/ui/EnhancedLoading";

const PreviewPage: React.FC = () => {
  const params = useParams();
  const themeId = params?.themeId as string;

  const { theme: unifiedTheme, loading: themeLoading, getSampleGallery } = useUnifiedTheme(themeId);

  // --- 1. HANDLING LOADING & ERROR ---
  if (themeLoading) {
    return (
      <EnhancedLoading
        message="Memuat preview undangan..."
        type="wedding"
        size="lg"
      />
    );
  }

  if (!unifiedTheme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Theme Not Found</h1>
          <p className="text-gray-600">Theme ID: {themeId}</p>
        </div>
      </div>
    );
  }

  // --- 2. SAMPLE DATA SETUP ---
  const sampleContent = {
    couple_info: {
      brideName: "Sarah",
      brideFullName: "Sarah Wijaya",
      brideFatherName: "Budi Wijaya",
      brideMotherName: "Siti Wijaya",
      brideChildOrder: "2",
      groomName: "David",
      groomFullName: "David Chen",
      groomFatherName: "Michael Chen",
      groomMotherName: "Linda Chen",
      groomChildOrder: "1",
      weddingImage: "/images/groom_and_bride.png",
    },
    kutipan_ayat: {
      ayat: "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya.",
      sumber: "QS. Ar-Rum: 21",
    },
    love_story: {
      story1: "Kami pertama kali bertemu di acara teman yang tak terlupakan...",
      story1Visible: true,
      story2: "Setelah 2 tahun berkenalan, kami mulai menjalin hubungan yang lebih serius...",
      story2Visible: true,
      story3: "Akhirnya hari yang ditunggu tiba, saat dia melamarku dengan penuh cinta...",
      story3Visible: true,
      story4: "",
      story4Visible: false,
    },
    akad_info: {
      date: "2025-06-15",
      startTime: "08:00",
      endTime: "10:00",
      location: "Masjid Al-Ikhlas",
      address: "Jl. Raya No. 123, Jakarta",
      mapsUrl: "",
    },
    resepsi_info: {
      date: "2025-06-15",
      startTime: "11:00",
      endTime: "14:00",
      location: "Gedung Pernikahan Megah",
      address: "Jl. Sudirman No. 456, Jakarta",
      mapsUrl: "",
    },
    gallery_video: {
      youtubeUrl: "",
    },
  };

  const sampleGalleryPhotos = getSampleGallery();

  const sampleComponentSettings = {
    showFullScreenImage: true,
    showKutipanAyat: true,
    showWelcome: true,
    showLoveStory: true,
    showTimeline: true,
    showWeddingEvent: true,
    showAkadInfo: true,
    showResepsiInfo: true,
    showWeddingGift: true,
    showBankCards: true,
    showGiftAddress: true,
    showGallery: true,
    showRSVP: true,
    showGuestBook: true,
    showFooter: true,
    showNavbar: true,
    showMusic: false,
  };

  const getOrdinalWord = (num: string): string => {
    const ordinals: { [key: string]: string } = {
      "1": "pertama", "2": "kedua", "3": "ketiga", "4": "keempat", "5": "kelima",
    };
    return ordinals[num] || `ke-${num}`;
  };

  const coupleInfo = {
    ...sampleCoupleInfo,
    bride: {
      ...sampleCoupleInfo.bride,
      name: sampleContent.couple_info.brideName,
      fullName: sampleContent.couple_info.brideFullName,
      parent: `Putri ${getOrdinalWord(sampleContent.couple_info.brideChildOrder)} dari Bapak ${sampleContent.couple_info.brideFatherName} & Ibu ${sampleContent.couple_info.brideMotherName}`,
    },
    groom: {
      ...sampleCoupleInfo.groom,
      name: sampleContent.couple_info.groomName,
      fullName: sampleContent.couple_info.groomFullName,
      parent: `Putra ${getOrdinalWord(sampleContent.couple_info.groomChildOrder)} dari Bapak ${sampleContent.couple_info.groomFatherName} & Ibu ${sampleContent.couple_info.groomMotherName}`,
    },
  };

  const desktopPhotoUrl = sampleContent.couple_info.weddingImage;

  const legacyTheme = {
    id: unifiedTheme.theme_id,
    name: unifiedTheme.theme_name,
    description: unifiedTheme.description || '',
    colors: unifiedTheme.colors,
    images: {
      hero: unifiedTheme.backgrounds.fullscreen || "/images/Wedding1.png",
      background: unifiedTheme.backgrounds.welcome || "/images/Wedding2.png",
      gallery: [],
      couple: {
        bride: '/images/bride.jpg',
        groom: '/images/groom.jpg',
      },
    },
    typography: {
      primaryFont: 'Inter, sans-serif',
      secondaryFont: 'Playfair Display, serif',
      headingFont: 'Playfair Display, serif',
      scriptFont: 'Dancing Script, cursive',
    },
    customStyles: unifiedTheme.custom_styles,
  };

  return (
    <MusicProvider>
      <ThemeProvider theme={legacyTheme} coupleInfo={coupleInfo}>
        {/* Tambahkan h-full w-full agar ThemeProvider tidak collapse */}
        <div className={`theme-${unifiedTheme.theme_id.split("-")[0] || "original"} h-full w-full`}>
          
          {/* Preview Banner (Fixed Height: 40px) */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-black text-center py-2 font-semibold shadow-md h-[40px] flex items-center justify-center">
            🎨 PREVIEW MODE - Theme: {unifiedTheme.theme_name}
          </div>

          {/* Wrapper Utama (Full Screen tanpa scroll di body) */}
          <div className="h-screen w-full overflow-hidden pt-[40px] bg-gray-50 lg:flex">
            
            {/* Left Panel - Photo (Desktop only) */}
            <div className="hidden lg:block lg:w-2/3 relative h-full">
              <Image
                src={desktopPhotoUrl}
                alt="Wedding Photo"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Right Panel - Invitation Frame */}
            {/* Kita kunci tingginya dengan calc(100vh - 40px) */}
            <div className="w-full lg:w-1/3 h-[calc(100vh-40px)] relative z-10 bg-white">
              
              {/* Background Desktop (Tablet view) */}
              <div className="hidden md:block lg:hidden theme-desktop-bg" />

              {/* --- PHONE FRAME MANUAL (Tanpa Class Konflik) --- */}
              {/* relative: Agar Navbar absolute nempel ke sini.
                  h-full: Mengisi penuh panel kanan.
                  overflow-hidden: Mencegah scroll di frame ini (scroll harus di child).
              */}
              <div className="relative w-full h-full md:max-w-[480px] lg:max-w-none mx-auto bg-white shadow-2xl lg:shadow-none overflow-hidden flex flex-col">
                
                {/* --- CONTENT SCROLL AREA --- */}
                {/* flex-1: Mengisi sisa ruang.
                    overflow-y-auto: Scroll terjadi DI SINI.
                    no-scrollbar: Opsional (bisa pakai class Tailwind custom kalau ada).
                */}
                <div className="flex-1 w-full relative overflow-y-auto scroll-smooth">
                  
                  {/* Isi Konten Undangan */}
                  {sampleComponentSettings.showFullScreenImage && (
                    <div id="fullscreen-image" className="flex items-center justify-center min-h-screen bg-gray-100">
                      <FullScreenImage
                        src={legacyTheme.images.hero}
                        alt="Preview Full Screen Image"
                        clientSlug="preview"
                        weddingImage={sampleContent.couple_info.weddingImage}
                        themeId={themeId}
                      />
                    </div>
                  )}

                  {sampleComponentSettings.showKutipanAyat && (
                    <KutipanAyat
                      quote={sampleContent.kutipan_ayat.ayat}
                      source={sampleContent.kutipan_ayat.sumber}
                      themeId={themeId}
                    />
                  )}

                  {sampleComponentSettings.showWelcome && (
                    <div id="about">
                      <Welcome
                        coupleInfo={sampleContent.couple_info}
                        clientSlug="preview"
                        themeId={themeId}
                      />
                    </div>
                  )}

                  {sampleComponentSettings.showLoveStory && (
                    <div id="lovestory" className="relative h-max bg-primary">
                      <div>
                        <Image
                          src={unifiedTheme.backgrounds.timeline || legacyTheme.images.background}
                          alt="Love Story Background"
                          fill
                          className="relative h-full z-0 object-cover"
                        />
                      </div>
                      {sampleComponentSettings.showTimeline && (
                        <Timeline
                          clientSlug="preview"
                          loveStoryData={sampleContent.love_story}
                          themeId={themeId}
                        />
                      )}
                    </div>
                  )}

                  {sampleComponentSettings.showWeddingEvent && (
                    <div id="event">
                      <WeddingEvent
                        clientSlug="preview"
                        akadInfo={sampleContent.akad_info}
                        resepsiInfo={sampleContent.resepsi_info}
                        themeId={themeId}
                      />
                    </div>
                  )}

                  {sampleComponentSettings.showWeddingGift && (
                    <div id="gift">
                      <WeddingGift clientSlug="preview" themeId={themeId} />
                    </div>
                  )}

                  {sampleComponentSettings.showGallery && (
                    <div id="gallery">
                      <OurGallery
                        clientSlug="preview"
                        galleryPhotos={sampleGalleryPhotos}
                        youtubeUrl={sampleContent.gallery_video.youtubeUrl}
                        themeId={themeId}
                      />
                    </div>
                  )}

                  {sampleComponentSettings.showRSVP && (
                    <div id="rsvp">
                      <RSVPForm clientSlug="preview" themeId={themeId} />
                    </div>
                  )}

                  {sampleComponentSettings.showGuestBook && (
                    <GuestBookList clientSlug="preview" themeId={themeId} />
                  )}

                  {sampleComponentSettings.showFooter && (
                    <ThankYouMessage clientSlug="preview" themeId={themeId} />
                  )}

                  {sampleComponentSettings.showFooter && (
                    <Footer clientSlug="preview" themeId={themeId} />
                  )}


                </div>
                {/* --- END CONTENT SCROLL AREA --- */}


                {/* --- NAVBAR (FLOATING) --- */}
                {/* Ditaruh DI LUAR div scroll, tapi DI DALAM frame relative.
                    Ini menjamin dia mengambang (fixed) terhadap frame HP.
                */}
                {sampleComponentSettings.showNavbar && (
                   // Wrapper div untuk memastikan positioning absolute bekerja sempurna
                   <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none flex justify-center pb-4">
                      <div className="pointer-events-auto">
                        <Navbar componentSettings={sampleComponentSettings} />
                      </div>
                   </div>
                )}

              </div>
              {/* --- END PHONE FRAME --- */}

            </div>
          </div>
        </div>
      </ThemeProvider>
    </MusicProvider>
  );
};

export default PreviewPage;