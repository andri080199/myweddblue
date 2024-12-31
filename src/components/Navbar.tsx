'use client';
import { MouseEvent } from 'react';
import Image from 'next/image';

const Navbar: React.FC = () => {
  const sections = [
    {
      name: 'Home',
      id: 'home',
      imgSrc: '/icons/home.png', // Path gambar Home
      imgAlt: 'Home Icon',
    },
    {
      name: 'About',
      id: 'about',
      imgSrc: '/icons/gender.png', // Path gambar About
      imgAlt: 'About Icon',
    },
    {
      name: 'Services',
      id: 'lovestory',
      imgSrc: '/icons/love-letter.png', // Path gambar Services
      imgAlt: 'Services Icon',
    },
    {
      name: 'Contact',
      id: 'event',
      imgSrc: '/icons/calendar.png', // Path gambar Contact
      imgAlt: 'Contact Icon',
    },
    {
      name: 'Contact',
      id: 'gift',
      imgSrc: '/icons/gift.png', // Path gambar Contact
      imgAlt: 'Contact Icon',
    },
    {
      name: 'Contact',
      id: 'gallery',
      imgSrc: '/icons/gallery.png', // Path gambar Contact
      imgAlt: 'Contact Icon',
    },
    {
      name: 'Contact',
      id: 'rsvp',
      imgSrc: '/icons/message.png', // Path gambar Contact
      imgAlt: 'Contact Icon',
    },
  ];

  const handleScroll = (event: MouseEvent, id: string) => {
    event.preventDefault(); // Prevent default link behavior
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' }); // Smooth scrolling to target
    }
  };

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-max z-40">
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
