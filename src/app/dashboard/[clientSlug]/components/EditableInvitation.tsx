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
import { useSectionBackgrounds } from '@/hooks/useSectionBackgrounds';

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
  const [loading, setLoading] = useState(true);

  // Use theme config (always set after fetch completes)
  const theme = themeConfig;

  // Client content
  const { content, galleryPhotos, loading: contentLoading, isRefetching, refetch } = useClientContent(clientSlug);

  // Component settings
  const { settings: componentSettings, loading: settingsLoading } = useComponentSettings(clientSlug);

  // Custom section backgrounds (from theme settings)
  const { getBackground } = useSectionBackgrounds(clientSlug);

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

          // Use new composed theme system (supports all combinations: built-in + built-in, custom + built-in, built-in + custom, custom + custom)
          const colorThemeId = data.colorTheme || 'original';
          const backgroundThemeId = data.backgroundTheme || 'original';

          const composed = await composeThemeAsync(colorThemeId, backgroundThemeId);
          setThemeConfig(composed);
        }
      } catch (error) {
        console.error('Error fetching client theme:', error);
        // Fallback to original theme on error
        const fallback = await composeThemeAsync('original', 'original');
        setThemeConfig(fallback);
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
          <div className={`theme-${themeConfig?.id?.split('-')[0] || 'original'}`}>
            {/* Desktop Background with blur effect */}
            <div className="theme-desktop-bg"></div>

            {/* Mobile Container with backdrop blur */}
            <div className="mobile-container relative">
              {/* Hero / Intro Section */}
              {componentSettings.showFullScreenImage && (
                <EditableSection
                  sectionId="fullscreen-image"
                  sectionName="Gambar Pembuka"
                  onEdit={handleEditFullScreen}
                >
                  <div
                    id="fullscreen-image"
                    className="flex items-center justify-center min-h-screen bg-gray-100"
                  >
                    <FullScreenImage
                      src={theme.images.hero}
                      alt="Example Full Screen Image"
                      clientSlug={clientSlug}
                      weddingImage={content.couple_info?.weddingImage}
                      customBackground={getBackground('fullscreen')}
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
                  <KutipanAyat
                    quote={content.kutipan_ayat?.ayat}
                    source={content.kutipan_ayat?.sumber}
                    customBackground={getBackground('kutipan')}
                  />
                </EditableSection>
              )}

              {/* Welcome Message */}
              {componentSettings.showWelcome && (
                <EditableSection
                  sectionId="welcome"
                  sectionName="Info Mempelai"
                  onEdit={handleEditWelcome}
                >
                  <div id="about">
                    <Welcome
                      coupleInfo={content.couple_info}
                      clientSlug={clientSlug}
                      customBackground={getBackground('welcome')}
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
                      <Timeline loveStoryData={content.love_story} />
                    )}
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
                  <div id="event">
                    <WeddingEvent
                      clientSlug={clientSlug}
                      akadInfo={content.akad_info}
                      resepsiInfo={content.resepsi_info}
                      customBackground={getBackground('event')}
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
                  <div id="gift">
                    <WeddingGift
                      key={`wedding-gift-${refreshKey}`}
                      clientSlug={clientSlug}
                      customBackground={getBackground('gift')}
                    />
                  </div>
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
                  <div id="gallery">
                    <OurGallery
                      galleryPhotos={galleryPhotos}
                      youtubeUrl={content.gallery_video?.youtubeUrl}
                      customBackground={getBackground('gallery')}
                    />
                  </div>
                </EditableSection>
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

              {/* RSVP Form - Read only */}
              {componentSettings.showRSVP && (
                <div id="rsvp" className="relative opacity-75 pointer-events-none">
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-50 z-10 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold bg-white px-4 py-2 rounded-lg shadow">
                      Read Only
                    </span>
                  </div>
                  <RSVPForm
                    clientSlug={clientSlug}
                    customBackground={getBackground('rsvp')}
                  />
                </div>
              )}

              {/* Buku Tamu - Read only */}
              {componentSettings.showGuestBook && (
                <div className="relative opacity-75 pointer-events-none">
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-50 z-10 flex items-center justify-center">
                    <span className="text-gray-600 font-semibold bg-white px-4 py-2 rounded-lg shadow">
                      Read Only
                    </span>
                  </div>
                  <GuestBookList
                    clientSlug={clientSlug}
                    customBackground={getBackground('guestbook')}
                  />
                </div>
              )}

              {/* Thank You Message */}
              {componentSettings.showFooter && (
                <ThankYouMessage
                  clientSlug={clientSlug}
                  customBackground={getBackground('thankyou')}
                />
              )}

              {/* Footer */}
              {componentSettings.showFooter && (
                <Footer
                  clientSlug={clientSlug}
                  customBackground={getBackground('footer')}
                />
              )}

              {/* Navigasi */}
              {componentSettings.showNavbar && <Navbar componentSettings={componentSettings} />}

              {/* Musik */}
              {componentSettings.showMusic && (
                <div className="relative mx-auto bg-gray-300">
                  <MusicCircle
                    clientSlug={clientSlug}
                    weddingImage={content.couple_info?.weddingImage}
                  />
                </div>
              )}
            </div>
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

        </ThemeProvider>
      </MusicProvider>
    </EditingProvider>
  );
};

export default EditableInvitation;
