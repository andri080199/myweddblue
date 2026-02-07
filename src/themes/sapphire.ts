import { ThemeConfig } from '@/types/theme';

export const sapphireTheme: ThemeConfig = {
  id: 'sapphire',
  name: 'Sapphire Nights',
  description: 'Tema sapphire dengan nuansa biru tua yang mewah dan sophisticated',
  colors: {
    primary: '#DBEAFE',
    primarylight: '#F8FAFC',
    darkprimary: '#1E40AF',
    textprimary: '#1E3A8A',
    gold: '#F59E0B',
    lightblue: '#EFF6FF',
    secondary: '#BFDBFE',
    accent: '#3B82F6',
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
      bride: '/images/bride-sapphire.jpg',
      groom: '/images/groom-sapphire.jpg',
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
    boxShadow: '0 4px 6px -1px rgba(30, 64, 175, 0.1)',
    gradient: 'linear-gradient(135deg, #DBEAFE 0%, #F8FAFC 100%)',
  },
};