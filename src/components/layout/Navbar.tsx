'use client';
import { MouseEvent } from 'react';
import Image from 'next/image';

interface ComponentSettings {
  showFullScreenImage: boolean;
  showKutipanAyat: boolean;
  showWelcome: boolean;
  showLoveStory: boolean;
  showTimeline: boolean;
  showWeddingEvent: boolean;
  showAkadInfo: boolean;
  showResepsiInfo: boolean;
  showWeddingGift: boolean;
  showBankCards: boolean;
  showGiftAddress: boolean;
  showGallery: boolean;
  showRSVP: boolean;
  showGuestBook: boolean;
  showFooter: boolean;
  showNavbar: boolean;
  showMusic: boolean;
}

interface NavbarProps {
  componentSettings?: ComponentSettings;
}

const Navbar: React.FC<NavbarProps> = ({ componentSettings }) => {
  const allSections = [
    {
      name: 'Home',
      id: 'fullscreen-image',
      imgSrc: '/icons/home.png',
      imgAlt: 'Home Icon',
      settingKey: 'showFullScreenImage',
    },
    {
      name: 'About',
      id: 'about',
      imgSrc: '/icons/gender.png',
      imgAlt: 'About Icon',
      settingKey: 'showWelcome',
    },
    {
      name: 'Love Story',
      id: 'love-story',
      imgSrc: '/icons/love-letter.png',
      imgAlt: 'Love Story Icon',
      settingKey: 'showLoveStory',
    },
    {
      name: 'Wedding Event',
      id: 'wedding-event',
      imgSrc: '/icons/calendar.png',
      imgAlt: 'Event Icon',
      settingKey: 'showWeddingEvent',
    },
    {
      name: 'Gift',
      id: 'wedding-gift',
      imgSrc: '/icons/gift.png',
      imgAlt: 'Gift Icon',
      settingKey: 'showWeddingGift',
    },
    {
      name: 'Gallery',
      id: 'gallery',
      imgSrc: '/icons/gallery.png',
      imgAlt: 'Gallery Icon',
      settingKey: 'showGallery',
    },
    {
      name: 'RSVP',
      id: 'rsvp',
      imgSrc: '/icons/message.png',
      imgAlt: 'RSVP Icon',
      settingKey: 'showRSVP',
    },
  ];

  // Filter sections berdasarkan settings yang aktif
  const sections = componentSettings
    ? allSections.filter(section => componentSettings[section.settingKey as keyof ComponentSettings])
    : allSections;

  const handleScroll = (event: MouseEvent, id: string) => {
    event.preventDefault();
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // PERUBAHAN UTAMA DI SINI:
    // 1. Menggunakan 'absolute' agar posisinya relatif terhadap parent (.mobile-container)
    // 2. 'left-1/2 -translate-x-1/2' memastikan elemen tepat di tengah parent secara horizontal
    // 3. 'bottom-4' memberikan jarak dari bawah parent
    <nav className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-50 w-max">
      
      {/* Latar belakang transparan dengan opacity */}
      <div className="absolute inset-0 bg-darkprimary opacity-40 rounded-3xl pointer-events-none"></div>

      {/* Konten navbar */}
      <div className="relative flex items-center p-2 rounded-3xl bg-transparent">
        <ul className="flex space-x-1">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={(e) => handleScroll(e, section.id)}
                className="rounded-full bg-primarylight p-2 transition hover:bg-darkprimary"
                aria-label={section.name}
              >
                <Image
                  src={section.imgSrc}
                  alt={section.imgAlt}
                  width={16}
                  height={16}
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;