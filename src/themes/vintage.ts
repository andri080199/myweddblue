import { ThemeConfig } from '@/types/theme';

export const vintageTheme: ThemeConfig = {
  id: 'vintage',
  name: 'Vintage Garden',
  description: 'Tema vintage dengan nuansa taman klasik dan warna earth tone',
  colors: {
    primary: '#F7F3E9',
    primarylight: '#FAF7F1',
    darkprimary: '#8B4513',
    textprimary: '#5D4037',
    gold: '#B8860B',
    lightblue: '#F0F4F8',
    secondary: '#DDD6C7',
    accent: '#A0753C',
  },
  images: {
    hero: '/images/vintage-hero.jpg',
    background: '/images/vintage-bg.jpg',
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
      bride: '/images/bride-vintage.jpg',
      groom: '/images/groom-vintage.jpg',
    },
  },
  typography: {
    primaryFont: 'Crimson Text, serif',
    secondaryFont: 'Libre Baskerville, serif',
    headingFont: 'Pinyon Script, cursive',
    scriptFont: 'Alex Brush, cursive',
  },
  customStyles: {
    borderRadius: '0.75rem',
    boxShadow: '0 4px 6px -1px rgba(139, 69, 19, 0.2)',
    gradient: 'linear-gradient(135deg, #F7F3E9 0%, #FAF7F1 50%, #DDD6C7 100%)',
  },
};