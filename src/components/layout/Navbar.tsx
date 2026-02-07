'use client';
import { MouseEvent } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  const isDashboard = pathname?.includes('/dashboard');
  const isUndangan = pathname?.includes('/undangan');

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
      id: 'lovestory',
      imgSrc: '/icons/love-letter.png',
      imgAlt: 'Love Story Icon',
      settingKey: 'showLoveStory',
    },
    {
      name: 'Wedding Event',
      id: 'event',
      imgSrc: '/icons/calendar.png',
      imgAlt: 'Event Icon',
      settingKey: 'showWeddingEvent',
    },
    {
      name: 'Gift',
      id: 'gift',
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

  // Filter sections based on component settings
  const sections = componentSettings 
    ? allSections.filter(section => componentSettings[section.settingKey as keyof ComponentSettings])
    : allSections;

  const handleScroll = (event: MouseEvent, id: string) => {
    event.preventDefault(); // Prevent default link behavior
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' }); // Smooth scrolling to target
    }
  };

  // Tailwind classes for different modes
  const getNavbarPositionClass = () => {
    if (isDashboard) {
      return 'dashboard-navbar';
    }
    if (isUndangan) {
      // Desktop: center within right 1/3 panel (83.33% from left = 66.67% + 16.67%)
      // Tablet/Mobile: center of screen
      return 'left-1/2 -translate-x-1/2 lg:left-[83.333333%] lg:-translate-x-1/2';
    }
    return 'left-1/2 -translate-x-1/2';
  };

  return (
    <nav className={`fixed bottom-4 w-max z-40 ${getNavbarPositionClass()}`}>
      {/* Latar belakang transparan */}
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
                  width={16} // Ganti ukuran sesuai kebutuhan
                  height={16} // Ganti ukuran sesuai kebutuhan
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
