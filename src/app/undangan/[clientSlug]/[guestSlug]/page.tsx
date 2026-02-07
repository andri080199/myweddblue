"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { MusicProvider } from "@/contexts/MusicContext";
import "@/styles/theme-backgrounds.css";
import { composeThemeAsync } from "@/themes/themeComposer";
import { sampleCoupleInfo } from "@/data/sampleCouple";
import { useClientContent } from "@/hooks/useClientContent";
import { useComponentSettings } from "@/hooks/useComponentSettings";
import { useSectionBackgrounds } from "@/hooks/useSectionBackgrounds";

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

  // Theme state
  const [themeConfig, setThemeConfig] = useState<any>(null);
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Use theme config (always set after fetch completes)
  const theme = themeConfig;

  // Client content
  const { content, galleryPhotos, loading: contentLoading } =
    useClientContent(clientSlug);

  // Component settings
  const { settings: componentSettings, loading: settingsLoading } =
    useComponentSettings(clientSlug);

  // Custom section backgrounds
  const { getBackground } = useSectionBackgrounds(clientSlug);

  // Fetch client data and theme from database
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // Fetch client info to get catalog_template_id
        const clientResponse = await fetch(`/api/clients?slug=${clientSlug}`);
        if (clientResponse.ok) {
          const clientData = await clientResponse.json();
          setTemplateId(clientData.catalog_template_id || null);

          console.log('📋 Client data loaded:', {
            slug: clientSlug,
            templateId: clientData.catalog_template_id
          });
        }

        // Fetch theme config
        const themeResponse = await fetch(
          `/api/client-theme?clientSlug=${clientSlug}`
        );
        if (themeResponse.ok) {
          const data = await themeResponse.json();

          // Use new composed theme system
          const colorThemeId = data.colorTheme || 'original';
          const backgroundThemeId = data.backgroundTheme || 'original';

          const composed = await composeThemeAsync(colorThemeId, backgroundThemeId);
          setThemeConfig(composed);
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        // Fallback to original theme on error
        const fallback = await composeThemeAsync('original', 'original');
        setThemeConfig(fallback);
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
    const fullScreenImage = document.getElementById("fullscreen-image");
    if (fullScreenImage) {
      fullScreenImage.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  if (loading || contentLoading || settingsLoading) {
    return (
      <EnhancedLoading
        message="Memuat undangan pernikahan..."
        type="wedding"
        size="lg"
      />
    );
  }

  // Convert number to Indonesian ordinal words
  const getOrdinalWord = (num: string): string => {
    const ordinals: { [key: string]: string } = {
      "1": "pertama",
      "2": "kedua",
      "3": "ketiga",
      "4": "keempat",
      "5": "kelima",
      "6": "keenam",
      "7": "ketujuh",
      "8": "kedelapan",
      "9": "kesembilan",
      "10": "kesepuluh",
    };
    return ordinals[num] || `ke-${num}`;
  };

  // Merge content with sample data as fallback
  const coupleInfo = {
    ...sampleCoupleInfo,
    bride: {
      ...sampleCoupleInfo.bride,
      name: content.couple_info?.brideName || sampleCoupleInfo.bride.name,
      fullName:
        content.couple_info?.brideFullName || sampleCoupleInfo.bride.fullName,
      parent:
        content.couple_info?.brideChildOrder &&
        content.couple_info?.brideFatherName &&
        content.couple_info?.brideMotherName
          ? `Putri ${getOrdinalWord(content.couple_info.brideChildOrder)} dari Bapak ${content.couple_info.brideFatherName} & Ibu ${content.couple_info.brideMotherName}`
          : sampleCoupleInfo.bride.parent,
    },
    groom: {
      ...sampleCoupleInfo.groom,
      name: content.couple_info?.groomName || sampleCoupleInfo.groom.name,
      fullName:
        content.couple_info?.groomFullName || sampleCoupleInfo.groom.fullName,
      parent:
        content.couple_info?.groomChildOrder &&
        content.couple_info?.groomFatherName &&
        content.couple_info?.groomMotherName
          ? `Putra ${getOrdinalWord(content.couple_info.groomChildOrder)} dari Bapak ${content.couple_info.groomFatherName} & Ibu ${content.couple_info.groomMotherName}`
          : sampleCoupleInfo.groom.parent,
    },
  };

  // Get wedding image for desktop photo panel
  const desktopPhotoUrl =
    content.couple_info?.weddingImage || '/images/groom_and_bride.png';

  return (
    <MusicProvider>
      <ThemeProvider theme={theme} coupleInfo={coupleInfo}>
        <div
          className={`theme-${themeConfig?.id?.split('-')[0] || 'original'}`}
        >
          {/* Desktop Layout: Split View */}
          <div className="lg:flex lg:min-h-screen">
            {/* Left Panel - Photo (Desktop only, 2/3 width) */}
            <div className="hidden lg:block lg:fixed lg:left-0 lg:top-0 lg:w-2/3 lg:h-screen lg:overflow-hidden">
              <Image
                src={desktopPhotoUrl}
                alt="Wedding Photo"
                fill
                priority
                className="object-cover"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/30 pointer-events-none" />
            </div>

            {/* Right Panel - Invitation (1/3 width on desktop, full on mobile/tablet) */}
            <div className="w-full lg:w-1/3 lg:ml-[66.666667%] min-h-screen relative z-10">
              {/* Tablet Background (hidden on desktop & mobile) */}
              <div className="hidden md:block lg:hidden theme-desktop-bg" />

              {/* Invitation Container */}
              <div className="w-full min-h-screen bg-white md:max-w-[480px] md:mx-auto md:shadow-[0_0_50px_rgba(0,0,0,0.1)] lg:max-w-none lg:mx-0 lg:shadow-none">
                {/* Hero / Intro Section */}
                {componentSettings.showFullScreenImage && (
                  <div
                    id="fullscreen-image"
                    className="flex items-center justify-center min-h-screen bg-gray-100"
                  >
                    <FullScreenImage
                      src={theme.images.hero}
                      alt="Example Full Screen Image"
                      clientSlug={clientSlug}
                      templateId={templateId}
                      weddingImage={content.couple_info?.weddingImage}
                      customBackground={getBackground('fullscreen')}
                    />
                  </div>
                )}

                {/* Ayat */}
                {componentSettings.showKutipanAyat && (
                  <KutipanAyat
                    quote={content.kutipan_ayat?.ayat}
                    source={content.kutipan_ayat?.sumber}
                    templateId={templateId}
                    customBackground={getBackground('kutipan')}
                  />
                )}

                {/* Welcome Message */}
                {componentSettings.showWelcome && (
                  <div id="about">
                    <Welcome
                      coupleInfo={content.couple_info}
                      clientSlug={clientSlug}
                      templateId={templateId}
                      customBackground={getBackground('welcome')}
                    />
                  </div>
                )}

                {/* Love Story */}
                {componentSettings.showLoveStory && (
                  <div id="lovestory" className="relative h-max bg-primary">
                    <div>
                      <Image
                        src={getBackground('timeline') || theme.images.background}
                        alt="Love Story Background"
                        fill
                        className="relative h-full z-0 object-cover"
                      />
                    </div>

                    {componentSettings.showTimeline && (
                      <Timeline
                        clientSlug={clientSlug}
                        templateId={templateId}
                        loveStoryData={content.love_story}
                      />
                    )}
                  </div>
                )}

                {/* Detail Acara */}
                {componentSettings.showWeddingEvent && (
                  <div id="event">
                    <WeddingEvent
                      clientSlug={clientSlug}
                      templateId={templateId}
                      akadInfo={content.akad_info}
                      resepsiInfo={content.resepsi_info}
                      customBackground={getBackground('event')}
                    />
                  </div>
                )}

                {/* Hadiah Pernikahan */}
                {componentSettings.showWeddingGift && (
                  <div id="gift">
                    <WeddingGift
                      clientSlug={clientSlug}
                      templateId={templateId}
                      customBackground={getBackground('gift')}
                    />
                  </div>
                )}

                {/* Galeri */}
                {componentSettings.showGallery && (
                  <div id="gallery">
                    <OurGallery
                      clientSlug={clientSlug}
                      templateId={templateId}
                      galleryPhotos={galleryPhotos}
                      youtubeUrl={content.gallery_video?.youtubeUrl}
                      customBackground={getBackground('gallery')}
                    />
                  </div>
                )}

                {/* RSVP Form */}
                {componentSettings.showRSVP && (
                  <div id="rsvp">
                    <RSVPForm
                      clientSlug={clientSlug}
                      templateId={templateId}
                      customBackground={getBackground('rsvp')}
                    />
                  </div>
                )}

                {/* Buku Tamu */}
                {componentSettings.showGuestBook && (
                  <GuestBookList
                    clientSlug={clientSlug}
                    templateId={templateId}
                    customBackground={getBackground('guestbook')}
                  />
                )}

                {/* Thank You Message */}
                {componentSettings.showFooter && (
                  <ThankYouMessage
                    clientSlug={clientSlug}
                    templateId={templateId}
                    customBackground={getBackground('thankyou')}
                  />
                )}

                {/* Footer */}
                {componentSettings.showFooter && (
                  <Footer
                    clientSlug={clientSlug}
                    templateId={templateId}
                    customBackground={getBackground('footer')}
                  />
                )}

                {/* Navigasi */}
                {componentSettings.showNavbar && (
                  <Navbar componentSettings={componentSettings} />
                )}

                {/* Musik */}
                {componentSettings.showMusic && (
                  <MusicCircle
                    clientSlug={clientSlug}
                    weddingImage={content.couple_info?.weddingImage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </MusicProvider>
  );
};

export default Page;
