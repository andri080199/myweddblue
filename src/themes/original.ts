import { ThemeConfig } from '@/types/theme';

export const originalTheme: ThemeConfig = {
  id: 'original',
  name: 'Original Blue',
  description: 'Tema original dengan nuansa biru laut yang elegant',
  colors: {
    primary: '#9fd1ea',
    primarylight: '#e5f1f9',
    darkprimary: '#3295c5',
    textprimary: '#1d6087',
    gold: '#705a23',
    lightblue: '#e5f1f9',
    secondary: '#9fd1ea',
    accent: '#705a23',
  },
  images: {
    hero: '/images/originaltheme/PohonPutih.jpg',
    background: '/images/originaltheme/BangkuSalju.jpg',
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
      bride: '/images/bride-original.jpg',
      groom: '/images/groom-original.jpg',
    },
  },
  typography: {
    primaryFont: 'Poppins, sans-serif',
    secondaryFont: 'Merienda, cursive',
    headingFont: 'Lavishly Yours, cursive',
    scriptFont: 'Dancing Script, cursive',
  },
  customStyles: {
    borderRadius: '1rem',
    boxShadow: '0 4px 6px -1px rgba(61, 149, 197, 0.1)',
    gradient: 'linear-gradient(135deg, #9fd1ea 0%, #e5f1f9 100%)',
  },
};