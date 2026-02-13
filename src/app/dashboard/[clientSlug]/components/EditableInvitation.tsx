'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { MusicProvider } from '@/contexts/MusicContext';
import { EditingProvider } from '@/contexts/EditingContext';
import '@/styles/theme-backgrounds.css';
import '@/styles/inline-editor.css';
import { composeThemeAsync } from '@/themes/themeComposer';
import { sampleCoupleInfo } from '@/data/sampleCouple';
import { useClientContent } from '@/hooks/useClientContent';
import { useComponentSettings } from '@/hooks/useComponentSettings';

// Components
import FullScreenImage from '@/components/media/FullScreenImage';
import KutipanAyat from '@/components/wedding/KutipanAyat';
import Welcome from '@/components/wedding/Welcome';
import Timeline from '@/components/wedding/Timeline';
import WeddingEvent from '@/components/wedding/WeddingEvent';
import WeddingGift from '@/components/wedding/WeddingGift';
import OurGallery from '@/components/media/OurGallery';
import RSVPForm from '@/components/forms/RSVPForm';
import GuestBookList from '@/components/interactive/GuestBookList';
import ThankYouMessage from '@/components/wedding/ThankYouMessage';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import MusicCircle from '@/components/media/MusicCircle';
import EnhancedLoading from '@/components/ui/EnhancedLoading';
import EditableSection from './EditableSection';
import KutipanAyatEditModal from './modals/KutipanAyatEditModal';
import WelcomeEditModal from './modals/WelcomeEditModal';
import FullScreenImageEditModal from './modals/FullScreenImageEditModal';
import WeddingEventEditModal from './modals/WeddingEventEditModal';
import GalleryEditModal from './modals/GalleryEditModal';
import TimelineEditModal from './modals/TimelineEditModal';
import WeddingGiftEditModal from './modals/WeddingGiftEditModal';

interface EditableInvitationProps {
  clientSlug: string;
}

const EditableInvitation: React.FC<EditableInvitationProps> = ({ clientSlug }) => {
  // Theme state
  const [themeConfig, setThemeConfig] = useState<any>(null);
  const [themeId, setThemeId] = useState<string | null>(null); // Store themeId for unified theme
  const [unifiedThemeData, setUnifiedThemeData] = useState<any>(null); // Store full unified theme data
  const [loading, setLoading] = useState(true);

  // Use theme config (always set after fetch completes)
  const theme = themeConfig;

  // Client content
  const { content, galleryPhotos, loading: contentLoading, isRefetching, refetch } = useClientContent(clientSlug);

  // Component settings
  const { settings: componentSettings, loading: settingsLoading } = useComponentSettings(clientSlug);

  // Modal and editor states
  const [showKutipanAyatModal, setShowKutipanAyatModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showFullScreenImageModal, setShowFullScreenImageModal] = useState(false);
  const [showWeddingEventModal, setShowWeddingEventModal] = useState(false);
  const [showTimelineEditor, setShowTimelineEditor] = useState(false);
  const [showWeddingGiftEditor, setShowWeddingGiftEditor] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  // Refresh key for forcing component re-mount after saves
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch theme from database
  useEffect(() => {
    const fetchClientTheme = async () => {
      try {
        const response = await fetch(`/api/client-theme?clientSlug=${clientSlug}`);
        if (response.ok) {
          const data = await response.json();

          // Check if client uses unified theme (NEW SYSTEM)
          if (data.themeData) {
            const unifiedTheme = data.themeData;

            // Store themeId and full unified theme data
            setThemeId(unifiedTheme.theme_id);
            setUnifiedThemeData(unifiedTheme);

            // Convert unified theme to legacy format for ThemeProvider
            const legacyTheme = {
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
              customStyles: unifiedTheme.custom_styles || {},
            };

            setThemeConfig(legacyTheme);
          } else {
            // OLD SYSTEM: Fallback to composed theme (colorTheme + backgroundTheme)
            const colorThemeId = data.colorTheme || 'original';
            const backgroundThemeId = data.backgroundTheme || 'original';
            const composed = await composeThemeAsync(colorThemeId, backgroundThemeId);
            setThemeConfig(composed);
            setThemeId(null); // No unified theme
          }
        }
      } catch (error) {
        console.error('Error fetching client theme:', error);
        // Fallback to original theme on error
        const fallback = await composeThemeAsync('original', 'original');
        setThemeConfig(fallback);
        setThemeId(null);
      } finally {
        setLoading(false);
      }
    };

    if (clientSlug) {
      fetchClientTheme();
    }
  }, [clientSlug]);

  if (loading || contentLoading || settingsLoading) {
    return (
      <EnhancedLoading
        message="Memuat editor undangan..."
        type="wedding"
        size="lg"
      />
    );
  }

  // Convert number to Indonesian ordinal words
  const getOrdinalWord = (num: string): string => {
    const ordinals: { [key: string]: string } = {
      '1': 'pertama',
      '2': 'kedua',
      '3': 'ketiga',
      '4': 'keempat',
      '5': 'kelima',
      '6': 'keenam',
      '7': 'ketujuh',
      '8': 'kedelapan',
      '9': 'kesembilan',
      '10': 'kesepuluh',
    };
    return ordinals[num] || `ke-${num}`;
  };

  // Merge content with sample data as fallback
  const coupleInfo = {
    ...sampleCoupleInfo,
    bride: {
      ...sampleCoupleInfo.bride,
      name: content.couple_info?.brideName || sampleCoupleInfo.bride.name,
      fullName: content.couple_info?.brideFullName || sampleCoupleInfo.bride.fullName,
      parent:
        content.couple_info?.brideChildOrder &&
        content.couple_info?.brideFatherName &&
        content.couple_info?.brideMotherName
          ? `Putri ${getOrdinalWord(content.couple_info.brideChildOrder)} dari Bapak ${
              content.couple_info.brideFatherName
            } & Ibu ${content.couple_info.brideMotherName}`
          : sampleCoupleInfo.bride.parent,
    },
    groom: {
      ...sampleCoupleInfo.groom,
      name: content.couple_info?.groomName || sampleCoupleInfo.groom.name,
      fullName: content.couple_info?.groomFullName || sampleCoupleInfo.groom.fullName,
      parent:
        content.couple_info?.groomChildOrder &&
        content.couple_info?.groomFatherName &&
        content.couple_info?.groomMotherName
          ? `Putra ${getOrdinalWord(content.couple_info.groomChildOrder)} dari Bapak ${
              content.couple_info.groomFatherName
            } & Ibu ${content.couple_info.groomMotherName}`
          : sampleCoupleInfo.groom.parent,
    },
  };

  // Refetch content after save
  const handleSaveSuccess = () => {
    refetch();
    setRefreshKey(prev => prev + 1); // Force components to re-mount and refetch data
  };

  // Edit handlers
  const handleEditFullScreen = () => {
    setShowFullScreenImageModal(true);
  };

  const handleEditKutipanAyat = () => {
    setShowKutipanAyatModal(true);
  };

  const handleEditWelcome = () => {
    setShowWelcomeModal(true);
  };

  const handleEditTimeline = () => {
    setShowTimelineEditor(true);
  };

  const handleEditWeddingEvent = () => {
    setShowWeddingEventModal(true);
  };

  const handleEditWeddingGift = () => {
    setShowWeddingGiftEditor(true);
  };

  const handleEditGallery = () => {
    setShowGalleryModal(true);
  };

  return (
    <EditingProvider>
      <MusicProvider>
        <ThemeProvider theme={theme} coupleInfo={coupleInfo}>
          
          {/* PERUBAHAN PENTING: Tambahkan h-full w-full di sini */}
          <div className={`theme-${themeConfig?.id?.split('-')[0] || 'original'} h-full w-full`}>
            
            {/* Desktop Background with blur effect */}
            <div className="theme-desktop-bg"></div>

            {/* --- 1. Container HP (Fixed Height via CSS) --- */}
            <div className="mobile-container">
              
              {/* --- 2. Scroll Area (Content moves here) --- */}
              <div className="mobile-scroll-content">
                
                {/* Hero / Intro Section */}
                {componentSettings.showFullScreenImage && (
                  <EditableSection
                    sectionId="fullscreen-image"
                    sectionName="Gambar Pembuka"
                    onEdit={handleEditFullScreen}
                  >
                    <div
                      id="fullscreen-image"
                      className="relative overflow-hidden flex items-center justify-center min-h-screen bg-gray-100"
                    >
                      <FullScreenImage
                        src={theme.images.hero}
                        alt="Example Full Screen Image"
                        clientSlug={clientSlug}
                        weddingImage={content.couple_info?.weddingImage}
                        themeId={themeId || undefined}
                      />
                    </div>
                  </EditableSection>
                )}

                {/* Ayat */}
                {componentSettings.showKutipanAyat && (
                  <EditableSection
                    sectionId="kutipan-ayat"
                    sectionName="Kutipan Ayat"
                    onEdit={handleEditKutipanAyat}
                  >
                    <div id="kutipan-ayat" className="relative overflow-hidden">
                      <KutipanAyat
                        quote={content.kutipan_ayat?.ayat}
                        source={content.kutipan_ayat?.sumber}
                        themeId={themeId || undefined}
                      />
                    </div>
                  </EditableSection>
                )}

                {/* Welcome Message */}
                {componentSettings.showWelcome && (
                  <EditableSection
                    sectionId="welcome"
                    sectionName="Info Mempelai"
                    onEdit={handleEditWelcome}
                  >
                    <div id="about" className="relative overflow-hidden">
                      <Welcome
                        coupleInfo={content.couple_info}
                        clientSlug={clientSlug}
                        themeId={themeId || undefined}
                      />
                    </div>
                  </EditableSection>
                )}

                {/* Love Story */}
                {componentSettings.showLoveStory && (
                  <EditableSection
                    sectionId="love-story"
                    sectionName="Cerita Cinta"
                    onEdit={handleEditTimeline}
                  >
                    <div id="love-story" className="relative h-max bg-primary overflow-hidden">
                      {/* Background Image for Timeline */}
                      {unifiedThemeData?.backgrounds?.timeline && (
                        <div className="absolute inset-0 z-0">
                          <Image
                            src={unifiedThemeData.backgrounds.timeline}
                            alt="Timeline Background"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="relative z-10">
                        {componentSettings.showTimeline && (
                          <Timeline
                            loveStoryData={content.love_story}
                            clientSlug={clientSlug}
                            themeId={themeId || undefined}
                          />
                        )}
                      </div>
                    </div>
                  </EditableSection>
                )}

                {/* Detail Acara */}
                {componentSettings.showWeddingEvent && (
                  <EditableSection
                    sectionId="wedding-event"
                    sectionName="Detail Acara"
                    onEdit={handleEditWeddingEvent}
                  >
                    <div id="wedding-event" className="relative overflow-hidden">
                      <WeddingEvent
                        clientSlug={clientSlug}
                        akadInfo={content.akad_info}
                        resepsiInfo={content.resepsi_info}
                        themeId={themeId || undefined}
                      />
                    </div>
                  </EditableSection>
                )}

                {/* Hadiah Pernikahan */}
                {componentSettings.showWeddingGift && (
                  <EditableSection
                    sectionId="wedding-gift"
                    sectionName="Hadiah Pernikahan"
                    onEdit={handleEditWeddingGift}
                  >
                    <WeddingGift
                      key={`wedding-gift-${refreshKey}`}
                      clientSlug={clientSlug}
                      themeId={themeId || undefined}
                    />
                  </EditableSection>
                )}

                {/* Galeri */}
                {componentSettings.showGallery && (
                  <EditableSection
                    sectionId="gallery"
                    sectionName="Galeri Foto"
                    onEdit={handleEditGallery}
                    onClose={() => setShowGalleryModal(false)}
                  >
                    <OurGallery
                      galleryPhotos={galleryPhotos}
                      youtubeUrl={content.gallery_video?.youtubeUrl}
                      clientSlug={clientSlug}
                      themeId={themeId || undefined}
                    />
                  </EditableSection>
                )}

                {/* RSVP Form - Read only */}
                {componentSettings.showRSVP && (
                  <div id="rsvp" className="relative overflow-hidden opacity-75 pointer-events-none">
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-50 z-10 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold bg-white px-4 py-2 rounded-lg shadow">
                        Read Only
                      </span>
                    </div>
                    <RSVPForm
                      clientSlug={clientSlug}
                      themeId={themeId || undefined}
                    />
                  </div>
                )}

                {/* Buku Tamu - Read only */}
                {componentSettings.showGuestBook && (
                  <div id="guestbook" className="relative overflow-hidden opacity-75 pointer-events-none">
                    <div className="absolute inset-0 bg-gray-100 bg-opacity-50 z-10 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold bg-white px-4 py-2 rounded-lg shadow">
                        Read Only
                      </span>
                    </div>
                    <GuestBookList
                      clientSlug={clientSlug}
                      themeId={themeId || undefined}
                    />
                  </div>
                )}

                {/* Thank You Message */}
                {componentSettings.showFooter && (
                  <ThankYouMessage
                    clientSlug={clientSlug}
                    themeId={themeId || undefined}
                  />
                )}

                {/* Footer */}
                {componentSettings.showFooter && (
                  <Footer
                    clientSlug={clientSlug}
                    themeId={themeId || undefined}
                  />
                )}
                

              </div> 
              {/* --- End Scroll Area --- */}


              {/* --- 3. Floating Elements (Outside Scroll Area) --- */}
              
              {/* Navigasi - Floating */}
              {componentSettings.showNavbar && (
                <Navbar componentSettings={componentSettings} />
              )}

              {/* Musik - Floating */}
              {componentSettings.showMusic && (
                <MusicCircle
                  clientSlug={clientSlug}
                  weddingImage={content.couple_info?.weddingImage}
                />
              )}

            </div>
            {/* --- End Mobile Container --- */}
          </div>

          {/* Modals */}
          {showFullScreenImageModal && (
            <FullScreenImageEditModal
              clientSlug={clientSlug}
              sectionId="fullscreen-image"
              currentImage={content.couple_info?.weddingImage}
              onClose={() => setShowFullScreenImageModal(false)}
              onSaveSuccess={handleSaveSuccess}
            />
          )}

          {showKutipanAyatModal && (
            <KutipanAyatEditModal
              clientSlug={clientSlug}
              sectionId="kutipan-ayat"
              initialAyat={content.kutipan_ayat?.ayat}
              initialSumber={content.kutipan_ayat?.sumber}
              onClose={() => setShowKutipanAyatModal(false)}
              onSaveSuccess={handleSaveSuccess}
            />
          )}

          {showWelcomeModal && (
            <WelcomeEditModal
              clientSlug={clientSlug}
              sectionId="welcome"
              initialData={content.couple_info}
              onClose={() => setShowWelcomeModal(false)}
              onSaveSuccess={handleSaveSuccess}
            />
          )}

          {showWeddingEventModal && (
            <WeddingEventEditModal
              clientSlug={clientSlug}
              sectionId="wedding-event"
              initialAkadData={content.akad_info}
              initialResepsiData={content.resepsi_info}
              onClose={() => setShowWeddingEventModal(false)}
              onSaveSuccess={handleSaveSuccess}
            />
          )}

          {showTimelineEditor && (
            <TimelineEditModal
              clientSlug={clientSlug}
              sectionId="love-story"
              story1={content.love_story?.story1 || ''}
              story1Visible={content.love_story?.story1Visible ?? true}
              story2={content.love_story?.story2 || ''}
              story2Visible={content.love_story?.story2Visible ?? true}
              story3={content.love_story?.story3 || ''}
              story3Visible={content.love_story?.story3Visible ?? true}
              story4={content.love_story?.story4 || 'Pernikahan kami'}
              story4Visible={content.love_story?.story4Visible ?? true}
              onClose={() => setShowTimelineEditor(false)}
              onSaveSuccess={handleSaveSuccess}
            />
          )}

          {showWeddingGiftEditor && (
            <WeddingGiftEditModal
              clientSlug={clientSlug}
              sectionId="wedding-gift"
              initialData={content.wedding_gift}
              initialAddressData={content.gift_address}
              onClose={() => setShowWeddingGiftEditor(false)}
              onSaveSuccess={handleSaveSuccess}
            />
          )}

          {/* Gallery Edit Modal */}
          {showGalleryModal && (
            <GalleryEditModal
              clientSlug={clientSlug}
              sectionId="gallery"
              galleryPhotos={galleryPhotos}
              youtubeUrl={content.gallery_video?.youtubeUrl}
              onClose={() => setShowGalleryModal(false)}
              onSaveSuccess={handleSaveSuccess}
            />
          )}

        </ThemeProvider>
      </MusicProvider>
    </EditingProvider>
  );
};

export default EditableInvitation;