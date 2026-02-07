import { ThemeConfig } from '@/types/theme';

export const sunsetTheme: ThemeConfig = {
  id: 'sunset',
  name: 'Sunset Bliss',
  description: 'Tema sunset dengan gradasi orange dan merah yang hangat dan romantis',
  colors: {
    primary: '#FED7AA',
    primarylight: '#FFF7ED',
    darkprimary: '#EA580C',
    textprimary: '#C2410C',
    gold: '#F59E0B',
    lightblue: '#FEF3C7',
    secondary: '#FDBA74',
    accent: '#F97316',
  },
  images: {
    hero: '/images/PohonPutih.jpg',
    background: '/images/BangkuSalju.jpg',
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
      bride: '/images/bride-sunset.jpg',
      groom: '/images/groom-sunset.jpg',
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
    boxShadow: '0 4px 6px -1px rgba(234, 88, 12, 0.1)',
    gradient: 'linear-gradient(135deg, #FED7AA 0%, #FFF7ED 100%)',
  },
};