import { ThemeConfig } from '@/types/theme';

export const romanticTheme: ThemeConfig = {
  id: 'romantic',
  name: 'Romantic Rose',
  description: 'Tema romantis dengan nuansa pink dan rose gold',
  colors: {
    primary: '#FDF2F8',
    primarylight: '#FEF7F0',
    darkprimary: '#BE185D',
    textprimary: '#374151',
    gold: '#E5A663',
    lightblue: '#FDF2F8',
    secondary: '#F9A8D4',
    accent: '#EC4899',
  },
  images: {
    hero: '/images/romantic-hero.jpg',
    background: '/images/romantic-bg.jpg',
    gallery: [
      '/images/Wedding1.jpeg',
      '/images/Wedding2.jpg',
      '/images/Wedding3.jpg',
      '/images/Wedding4.jpeg',
      '/images/Wedding5.jpg',
      '/images/Wedding6.jpg',
      '/images/Wedding7.jpg',
      '/images/Wedding8.jpg',
      '/images/Wedding9.jpeg',
      '/images/Wedding10.jpg',
    ],
    couple: {
      bride: '/images/bride-romantic.jpg',
      groom: '/images/groom-romantic.jpg',
    },
  },
  typography: {
    primaryFont: 'Inter, sans-serif',
    secondaryFont: 'Playfair Display, serif',
    headingFont: 'Great Vibes, cursive',
    scriptFont: 'Sacramento, cursive',
  },
  customStyles: {
    borderRadius: '1.5rem',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    gradient: 'linear-gradient(135deg, #FDF2F8 0%, #FEF7F0 50%, #F9A8D4 100%)',
  },
};